<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\Controller;
use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use App\Models\Module;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class RoleController extends ApiResourceController
{

    protected function setModel()
    {
        $this->model = new Role();
    }

    public function show(Request $request, $id)
    {

        $role = $this->query->where('id', $id)->first();
        $permissions = $role->getAllPermissions();
        return $role
            ? response()->json([
                'role' => $role,
                'permissions' => $permissions
            ])
            : response()->json(['error' => 'not_found!'], 404);
    }
    public function store(Request $request)
    {
        $data = [
            'display_name' => $request->display_name,
            'name' => Str::slug($request->display_name),
        ];

        $permissions = $request->permissions;
        try {
            DB::beginTransaction();
            $role = $this->query->create($data);
            $role->syncPermissions($permissions);
            DB::commit();
            return $this->createResultResponse($role);
        } catch (\Exception $exception) {
            DB::rollBack();
            throw  $exception;
            return $this->errorResponseSystem();
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->only($this->model->getFillable());
        $permissions = $request->permissions;

        $role = $this->query->where('id', $id)->first();

        try {
            DB::beginTransaction();
            $role->fill($data);
            $role->syncPermissions($permissions);
            $role->update();
            DB::commit();
            return $this->resultResponse($role);
        } catch (\Exception $exception) {
            DB::rollBack();
            throw  $exception;
            return $this->errorResponseSystem($exception);
        }

        return response()->json(['success' => 'true']);
    }

    public function destroy(Request $request, $id)
    {
        if ($id == 1 || $id == 2) {
            return response()->json(['message' => Lang::get('response.response_message.delete_is_not_allowed')], 403);
        } else {
            return parent::destroy($request, $id);
        }
    }

    public function getAllPermissions(Request $request)
    {
        $query = Module::query();
        if ($request->group) {
            $query->where('group', $request->group);
        }
        $data = $query->with('permissions')->get();
        return response()->json($data);
    }

    public function addFilter($request)
    {
        //        $this->query->where('id', '!=', 2);
    }
    protected function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = json_decode($request->ids);
            if (in_array(1, $ids)) {
                return response()->json(['message' => Lang::get('response.response_message.delete_is_not_allowed')], 403);
            } else if (in_array(2, $ids)) {
                return response()->json(['message' => Lang::get('response.response_message.delete_is_not_allowed')], 403);
            } else {
                $result = Role::query()->whereIn('id', $ids)->forceDelete();
            }

            DB::commit();
            return $this->deleteResultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
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
        $roles = $this->query->whereIn('id', $id)->get();
        foreach ($roles as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
            }
        }
        return Excel::download(new DataExport($id, $header, $data), 'role.xlsx');
    }
    public function GetNameRoleGroup()
    {
        $data = DB::table('group_role_name')->get();
        return $data;
    }
}
