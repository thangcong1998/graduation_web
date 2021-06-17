<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiResourceController;
use App\Models\Regions;
use App\Exports\DataExport;
use Illuminate\Support\Facades\Lang;
use Maatwebsite\Excel\Facades\Excel;


class RegionController extends ApiResourceController
{
    public function setModel()
    {
        //
        $this->model = new Regions();
    }

    public function index(Request $request)
    {

        return parent::index($request);
    }

    public function show(Request $request, $id)
    {
        return parent::show($request, $id); // TODO: Change the autogenerated stub
    }

    public function store(Request $request)
    {
        $data = $request->only($this->model->getFillable());
        $result = $this->query->create($data);
        return $this->createResultResponse($result);
    }

    public function destroy(Request $request, $id)
    {
        return parent::destroy($request, $id); // TODO: Change the autogenerated stub
    }

    public function update(Request $request, $id)
    {
        return $this->_update($request, $id);
    }
    public function exportData(Request $request)
    {
        $id = json_decode($request->ids);
        $header = [];
        $fields = [];
        $columns = json_decode($request->columns, true);
        foreach ($columns as $column) {
            if ($column['field'] == 'flag') {
            } else {
                $fields[] = $column['field'];
                $header[] = $column['title'];
            }
        }
        $data = [];
        $regions = $this->query->whereIn('id', $id)->orderBy('level', 'ASC')->get();
        foreach ($regions as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
            }
            if ($data[$key]['level'] == Regions::level['province']) {
                $level = Lang::get('constants.province');
            }
            if ($data[$key]['level'] == Regions::level['districts']) {
                $level = Lang::get('constants.districts');
            }
            if ($data[$key]['level'] == Regions::level['wards']) {
                $level = Lang::get('constants.wards');
            }
            $data[$key]['level'] = $level;
        }
        return Excel::download(new DataExport($id, $header, $data), 'regions.xlsx');
    }
    public function addFilter(Request $request)
    {
        $this->query->with('parent.parent');
        $this->query->orderBy('level', 'ASC');
        if ($request->level) {
            $this->query->where('level', $request->level);
        }
        if ($request->parent_id) {
            $this->query->where('parent_id', $request->parent_id);
        }
    }
    public function deleteList(Request $request)
    {
        if ($request->action == 'force') {
            $id = json_decode($request->ids);
            $delete = Regions::whereIn('id', $id)->forceDelete();
            return $this->deleteResultResponse($delete);
        } else {
            $id = json_decode($request->ids);
            $delete = Regions::whereIn('id', $id)->delete();
            return $this->deleteResultResponse($delete);
        }
    }
}
