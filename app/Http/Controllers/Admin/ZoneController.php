<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\ApiResourceController;
use App\Models\ZoneFunctionRelation;
use Illuminate\Http\Request;
use App\Models\Zone;
use App\Http\Requests\ZoneCreateRequest;
use App\Http\Requests\ZoneUpdateRequest;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Lang;
use App\Helpers\SyncDataSeagameGms;

class ZoneController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new Zone();
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

    public function store(ZoneCreateRequest $request)
    {
        $data = $request->only($this->model->getFillable());

        if ($request->hasFile('files')) {
            $file = $request->file('files');
            $img = Storage::disk('public')->put('zones', $file);
            $data['icon_url'] = $img;
        }
        $result = $this->query->create($data);
        return $this->createResultResponse($result);
    }

    public function update(ZoneUpdateRequest $request, $id)
    {
        $data = $request->only($this->model->getFillable());
        $item = $this->query->with('function_relations.members', 'function_relations.staffs', 'function_relations.volunteers')->where('id', $id)
            ->first();
        $functions = $item->function_relations;
        if (!$item) {
            return response()->json(['error' => 'Not found'], 404);
        }

        if ($request->hasFile('files')) {
            $exits = Storage::disk('public')->exists($item->icon);
            if ($exits) {
                $delete = Storage::disk('public')->delete($item->icon);
            }
            $file = $request->file('files');
            $img = Storage::disk('public')->put('zones', $file);
            $data['icon_url'] = $img;
        }
        $item->fill($data);

        $result = $item->update();
        //        if (count($functions)) {
        //            foreach ($functions as $function) {
        //                $staffs = $function['staffs'];
        //                if(count($staffs) > 0) {
        //                    StaffCardJob::dispatch($staffs);
        //                }
        //                $members = $function->members;
        //                if(count($members) > 0) {
        //                    PersonalCardJob::dispatch($members);
        //                }
        //                $volunteers = $function->volunteers;
        //                if(count($volunteers) > 0) {
        //                    PersonalCardJob::dispatch($volunteers);
        //                }
        //            }
        //        }
        return $this->resultResponse($result);
    }
    public function destroy(Request $request, $id)
    {
        $action = $request->get('action', 'delete');
        if ($action !== 'delete') {
            $this->query->withTrashed();
        }
        $data = $this->query->with('function_relations.members', 'function_relations.staffs', 'function_relations.volunteers')->find($id);
        $functions = $data->function_relations;
        if (!$data) {
            return $this->errorResponse();
        }
        if ($action === 'restore') {
            $result = $data->restore();
            return $this->restoreResultResponse($result);
        } elseif ($action === 'force') {
            $data->function_relations()->sync([]);
            $result = $data->forceDelete();
        } else {
            $result = $data->delete();
        }
        //        if (count($functions)) {
        //            foreach ($functions as $function) {
        //                $staffs = $function['staffs'];
        //                if(count($staffs) > 0) {
        //                    StaffCardJob::dispatch($staffs);
        //                }
        //                $members = $function->members;
        //                if(count($members) > 0) {
        //                    PersonalCardJob::dispatch($members);
        //                }
        //                $volunteers = $function->volunteers;
        //                if(count($volunteers) > 0) {
        //                    PersonalCardJob::dispatch($volunteers);
        //                }
        //            }
        //        }
        return $this->deleteResultResponse($result);
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
        $team = $this->query->whereIn('id', $id)->get();
        foreach ($team as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
            }
        }
        return Excel::download(new DataExport($id, $header, $data), 'zone.xlsx');
    }

    public function deleteList(Request $request)
    {
        try {
            DB::beginTransaction();
            if ($request->action == 'force') {
                $id = json_decode($request->ids);
                $delete_function_relation = ZoneFunctionRelation::whereIn('access_zone_id', $id)->delete();
                $delete = Zone::whereIn('id', $id)->forceDelete();
                DB::commit();
                return $this->deleteResultResponse($delete);
            } else {
                $id = json_decode($request->ids);
                $delete_function_relation = ZoneFunctionRelation::whereIn('access_zone_id', $id)->delete();
                $delete = Zone::whereIn('id', $id)->delete();
                DB::commit();
                return $this->deleteResultResponse($delete);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem($e);
        }
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
    public function syncData()
    {
        $syncData = new SyncDataSeagameGms();
        $menthod = "GET";
        $endpoint = "zone";
        $params = null;
        $data = $syncData->syncdata($menthod, $endpoint, $params);
        $zone = $data->data;
        // return $zone;
        Zone::query()->forceDelete();
        DB::beginTransaction();
        try {
            foreach ($zone as $dt) {
                // return response()->json($dt);
                Zone::insert([
                    'id' => $dt->id,
                    'name' => $dt->name,
                    'icon_url' => $dt->icon_url,
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