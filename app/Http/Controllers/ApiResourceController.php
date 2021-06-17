<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;

abstract class ApiResourceController extends BaseController
{
    /** @var $model Model */
    protected $model;

    /** @var Builder $query */
    protected $query;

    /** @var Request $request */
    protected $request;

    public function __construct()
    {
        $this->request = request();
        $this->setModel();
        $this->setQuery();
    }

    abstract protected function setModel();

    protected function setQuery()
    {
        $this->query = $this->model->query();
    }

    protected function requestResult($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.request_result')]) :
            $this->errorResponse();
    }

    protected function createResultResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.create_result_response')]) :
            $this->errorResponse();
    }

    protected function resultResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.result_response')])
            : $this->errorResponse();
    }

    protected function deleteResultResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.delete_result_response')]) : $this->errorResponse();
    }

    protected function restoreResultResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.restore_result_response')]) : $this->errorResponse();
    }

    protected function successResponse($responseData = null)
    {
        return response()->json($responseData);
    }

    protected function errorResponseSystem($errorData = null)
    {
        return response()->json($errorData, 500);
    }

    protected function errorResponseNotFound($errorData = null)
    {
        return response()->json($errorData, 404);
    }
    protected function errorResponse($errorData = null)
    {
        return response()->json($errorData, 403);
    }
    protected function sendResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.send_response')]) : $this->errorResponse();
    }
    protected function downloadResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.download_card')]) :
            $this->errorResponse();
    }

    protected function renderResponse($data)
    {
        return $data ? $this->successResponse(['message' => Lang::get('response.response_message.generate_card')]) : $this->errorResponse();
    }

    protected function addDefaultFilter()
    {
        $data = $this->request->all();
        $table = $this->model->getTable();
        $fields = ['*'];

        foreach ($data as $key => $value) {
            if ($value || $value === '0') {
                try {
                    if (strpos($key, ':') !== false) {
                        $field = str_replace(':', '.', $key);
                        $query = $this->query;
                        if (preg_match('/(.*)_like$/', $field, $matches)) {
                            $relations = explode('.', $matches[1]);
                            $query->whereHas($relations[0], function ($query) use ($relations, $value) {
                                $query->where($relations[1], 'like', "%$value%");
                            });
                        }

                        if (preg_match('/(.*)_equal$/', $field, $matches)) {
                            $relations = explode('.', $matches[1]);
                            $query->whereHas($relations[0], function ($query) use ($relations, $value) {
                                $query->where($relations[1], '=', $value);
                            });
                        }

                        if (preg_match('/(.*)_notEqual$/', $field, $matches)) {
                            $relations = explode('.', $matches[1]);
                            $query->whereHas($relations[0], function ($query) use ($relations, $value) {
                                $query->where($relations[1], '!=', $value);
                            });
                        }
                    } else {
                        if (preg_match('/(.*)_like$/', $key, $matches)) {
                            if (config('database.default') === 'sqlsrv') {
                                //								$value = $this->convert_vi_to_en($value);
                                $this->query->where($table . '.' . $matches[1], 'like', "%$value%");
                            } else {
                                $this->query->where($table . '.' . $matches[1], 'like', '%' . $value . '%');
                            }
                        }
                        if (preg_match('/(.*)_equal$/', $key, $matches)) {
                            $value = explode(',', $value);
                            if (sizeof($value) === 1) {
                                $this->query->where($table . '.' . $matches[1], $value);
                            } else {
                                $this->query->whereIn($table . '.' . $matches[1], $value);
                            }
                        }

                        if (preg_match('/(.*)_notEqual$/', $key, $matches)) {
                            $value = explode(',', $value);
                            if (sizeof($value) === 1) {
                                $this->query->where($table . '.' . $matches[1], "!=", $value);
                            } else {
                                $this->query->whereNotIn($table . '.' . $matches[1], $value);
                            }
                        }

                        if (preg_match('/(.*)_between$/', $key, $matches)) {
                            $this->query->whereBetween($table . '.' . $matches[1], $value);
                        }
                        if (preg_match('/(.*)_isnull$/', $key, $matches)) {
                            if ($value == 1) {
                                $this->query->whereNull($table . '.' . $matches[1]);
                            }
                            if ($value == 0) {
                                $this->query->whereNotNull($table . '.' . $matches[1]);
                            }
                        }
                    }
                    if (preg_match('/^has_(.*)/', $key, $matches)) {
                        if ($value) {
                            $this->query->whereHas($matches[1]);
                        } else {
                            $this->query->whereDoesntHave($matches[1]);
                        }
                    }
                    if ($key == 'only_trashed' && $value) {
                        $this->query->onlyTrashed();
                    }
                    if ($key == 'with_trashed' && $value) {
                        $this->query->withTrashed();
                    }

                    if ($key == 'select' && $value) {
                        $this->query->select($value);
                    }

                    if ($key == 'sort' && $value) {
                        $sorts = explode(',', $value);
                        $this->query->getQuery()->orders = null;
                        foreach ($sorts as $sort) {
                            $sortParams = explode('|', $sort);
                            if (strpos($sortParams[0], '.') !== false) {
                                $this->query->orderByJoin($sortParams[0], isset($sortParams[1]) ? $sortParams[1] : 'asc');
                            } else {
                                $this->query->orderBy($table . '.' . $sortParams[0], isset($sortParams[1]) ? $sortParams[1] : 'asc');
                            }
                        }
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }
        }

        return $this->query->paginate($this->request->per_page ?? 50, $fields);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (method_exists($this, 'addFilter')) {
            $this->addFilter($request);
        }
        $data = $this->addDefaultFilter();
        return response()->json($data);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function _store(Request $request)
    {
        $data = $request->only($this->model->getFillable());
        if (method_exists($this->model, 'adminCreate')) {
            $this->model->fill($data);
            $result = $this->model->adminCreate();
        } else {
            $result = $this->query->create($data);
        }
        return $this->createResultResponse($result);
    }


    /**
     * Display the specified resource.
     * @param Request $request
     * @param $id
     * @return Builder|mixed
     */
    public function show(Request $request, $id)
    {
        if (method_exists($this, 'addAppend')) {
            $this->addAppend();
        }
        $requestData = $request->only($this->model->getFillable());
        $data = $this->query->where($this->model->getTable() . '.' . 'id', $id)->where($requestData)->first();
        if (method_exists($this, 'afterFind')) {
            $this->afterFind($data);
        }
        return $data ?? response()->json([
            'message' => 'Not found',
        ], 404);
    }


    /**
     *      * Update the specified resource in storage.
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function _update(Request $request, $id)
    {
        $data = $request->all();
        if (isset($data['id'])) {
            unset($data['id']);
        }
        $item = $this->query->where('id', $id)->first();
        if (!$item) {
            return response()->json(null, 404);
        }
        $item->fill($data);
        if (method_exists($item, 'adminUpdate')) {
            $result = $item->adminUpdate();
        } else {
            $result = $item->update();
        }
        return $this->resultResponse($result);
    }


    /**
     * Remove the specified resource from storage.
     * @param Request $request
     * @param $id
     * @return bool|\Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function destroy(Request $request, $id)
    {
        $action = $request->get('action', 'delete');
        if ($action !== 'delete') {
            $this->query->withTrashed();
        }
        $data = $this->query->find($id);
        if (!$data) {
            return $this->errorResponse();
        }
        if ($action === 'restore') {
            $result = $data->restore();
            return $this->restoreResultResponse($result);
        } elseif ($action === 'force') {
            $result = $data->forceDelete();
        } else {
            $result = $data->delete();
        }
        return $this->deleteResultResponse($result);
    }
}
