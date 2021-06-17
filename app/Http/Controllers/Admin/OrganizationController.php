<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiResourceController;
use App\Models\Organization;
use App\Http\Requests\OrganizationCreateRequest;
use App\Http\Requests\OrganizationUpdateRequest;
use Maatwebsite\Excel\Facades\Excel;
use App\Helpers\SyncDataSeagameGms;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\DB;

class OrganizationController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new Organization();
    }

    public function index(Request $request)
    {
        $this->_filter($request);
        return parent::index($request); // TODO: Change the autogenerated stub
    }

    public function show(Request $request, $id)
    {
        return parent::show($request, $id); // TODO: Change the autogenerated stub
    }

    public function store(OrganizationCreateRequest $request)
    {
        return parent::_store($request); // TODO: Change the autogenerated stub
    }

    public function update(OrganizationUpdateRequest $request, $id)
    {
        return parent::_update($request, $id); // TODO: Change the autogenerated stub
    }

    public function destroy(Request $request, $id)
    {
        return parent::destroy($request, $id); // TODO: Change the autogenerated stub
    }
    public function deleteList(Request $request)
    {
        if ($request->action == 'force') {
            $id = json_decode($request->ids);
            $delete = Organization::whereIn('id', $id)->forceDelete();
            return $this->deleteResultResponse($delete);
        } else {
            $id = json_decode($request->ids);
            $delete = Organization::whereIn('id', $id)->delete();
            return $this->deleteResultResponse($delete);
        }
    }
    public function exportData(Request $request)
    {
        $id = json_decode($request->ids);
        $header = [];
        $fields = [];
        $columns = json_decode($request->columns, true);
        foreach ($columns as $column) {
            $fields[] = $column['field'];
            $header[] = $column['title'];
        }
        $data = [];
        $team = $this->query->whereIn('id', $id)->with(['functions'])->get();
        foreach ($team as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
            }
        }
        return Excel::download(new DataExport($id, $header, $data), 'organization.xlsx');
    }

    private function _filter(Request $request)
    {
        if ($request->name) {
            $this->query->where('name', 'like', '%' . $request->name . '%');
        }
        if ($request->get('sort')) {
            $sort = explode('|', $request->get('sort'));
            $this->query->orderBy($sort[0], $sort[1]);
        }

        if ($request->trashed) {
            $this->query->onlyTrashed();
        }
    }
    public function syncData(Request $request)
    {
        $syncData = new SyncDataSeagameGms();
        $method = "GET";
        $endpoint = "organization";
        $params = null;
        $data =   $syncData->syncdata($method, $endpoint, $params);
        $organization = $data->data;
        // return $organization;
        Organization::query()->forceDelete();
        DB::beginTransaction();
        try {
            foreach ($organization as $dt) {
                // return response()->json($dt);
                Organization::insert([
                    'id' => $dt->id,
                    'name' => $dt->name,
                    'english_name' => $dt->english_name,
                    'abbreviation' => $dt->abbreviation,
                    'is_holder' => $dt->is_holder,
                ]);
            }
            DB::commit();
            return response()->json(['message' => Lang::get('response.response_message.result_sync_reponse')], 200);
        } catch (\Exception $e) {
            throw  $e;
            $this->errorResponseSystem();
        }
    }
}