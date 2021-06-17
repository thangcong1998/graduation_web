<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PHPUnit\Exception;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotPassword;
use App\Exports\DataExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\App;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;

class UserController extends ApiResourceController
{

    protected function setModel()
    {
        $this->model = new User();
    }

    public function authenticate(AuthRequest $request)
    {
        $credentials = $request->only('user_name', 'password');
        $user = $this->checkAuth($credentials);
        if (!$user) {
            return response()->json(['errors' => [
                'password' => lang::get('response.response_message.errors_login'),
                'user_name' => lang::get('response.response_message.errors_login')
            ]], 422);
        }
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;
        $token->save();

        return  $this->successResponse(['user' => $user, 'token' => $tokenResult->accessToken]);
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();
        try {
            DB::beginTransaction();
            $user = $this->query->where('id', $user->id)->first();
            if (Hash::check($request->old_password, $user->password)) {
                $update = $this->query->where('id', $user->id)->update(['password' => Hash::make($request->new_password)]);
            } else {
                return response()->json(['errors' => ['old_password' => lang::get('response.response_message.old_password_incorrect')]], 422);
            }
            DB::commit();
            return $this->resultResponse($update);
        } catch (\Exception $e) {
            return $this->errorResponseSystem($e);
        }
    }
    public function store(UserStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->model->getFillable());
            $data['password'] = Hash::make($request->password);
            $role = Role::find($request->role_id);
            $result = $this->query->create($data);
            if ($role) {
                $result->assignRole($role->name);
            }
            DB::commit();
            return $this->createResultResponse($result);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
        }
    }

    public function update(UserUpdateRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $item = $this->query->where('id', $id)->first();
            $role = Role::find($request->role_id);
            if (!$item) {
                return $this->errorResponseNotFound();
            }
            $user = $this->query->where('id', $id)->first();
            if (!$user) return response()->json(['error' => 'user not found'], 404);
            //            if($request->user_type ==2){
            //                $team = Team::query()->where('user_id',$id)->first();
            //                $team->update(['name'=>$request->name]);
            //            }
            $data = $request->only($this->model->getFillable());
            if ($request->role_id != 2) {
                $data['user_type'] = 1;
            } else {
                $data['user_type'] = 2;
            }
            if ($request->password) {
                $data['password'] = Hash::make($request->password);
            }
            $user->update($data);
            if ($role) {
                Log::info($role);
                DB::table('model_has_roles')->where('model_id', $id)->delete();
                $user->assignRole($role->name);
            }
            DB::commit();
            return $this->resultResponse($user);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
        }
    }

    public function getInfo(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            if ($user->user_type == 2) {
                $row = $this->query->with(['team', 'role'])->find($user['id']);
            } else {
                $row = $this->query->with('role')->find($user['id']);
            }
            return $this->successResponse($row);
        }
        return $this->errorResponseNotFound();
    }

    public function checkAuth($credentials)
    {
        $user = User::query()->with('role')->where('user_name', $credentials['user_name'])->first();
        if (!$user) {
            return null;
        }
        if ($user->user_type == 2) {
            $user = User::query()->with(['team'])->where('user_name', $credentials['user_name'])->first();
        }
        if (!Hash::check($credentials['password'], $user->password)) {
            return null;
        }
        return $user;
    }

    public function getPermissions(Request $request)
    {
        $permission = $request->user()->getPermissionsViaRoles();
        return response()->json($permission);
    }
    public function destroy(Request $request, $id)
    {
        $action = $request->get('action', 'delete');
        if ($action !== 'delete') {
            $this->query->withTrashed();
        }
        $data = $this->query->find($id);
        $role = $data->role;
        if ($data->user_type == 2) {
            return response()->json(['message' => Lang::get('response.response_message.delete_is_not_allowed')], 403);
        }
        if ($role->name == "admin") {
            return response()->json(['message' => Lang::get('response.response_message.delete_is_not_allowed')], 403);
        }

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
    public function addFilter($request)
    {
        $this->query->with('role');
        if ($request->role) {
            $this->query->whereHas('role', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->role . '%');
            });
        }
    }
    public function addAppend()
    {
        $this->query->with('role');
    }
    public static function ForgotPassword1($name, $password, $email, $user_name)
    {
        $data = [
            'name' => $name,
            'password' => $password,
            'user_name' => $user_name,
            'email' => $email,
        ];

        Mail::to($email)->send(new ForgotPassword($data));
    }
    public function forgotPassword(Request $request)
    {
        $user = \App\Models\User::query()->where('user_name', $request->user_name)->first();

        $password = substr(md5(mt_rand()), 0, 8);
        if ($user) {
            $this->ForgotPassword1($user->name, $password, $user->email, $request->user_name);
            $user->update([
                'password' => Hash::make($password)
            ]);
            return $this->successResponse(['message' => lang::get('response.response_message.new_password')], 403);
        } else {
            return response()->json(['message' => lang::get('response.response_message.account_does_not_exist')], 403);
        }
    }
    public function setBackPassword(Request $request)
    {
        $user = User::query()->where('user_name', $request->username)->first();
        if ($user != null) {
            $user->password = Hash::make($request->password);
            $user->save();
            return $this->successResponse(['message' => lang::get('passwords.reset')]);
        }
        return $this->errorResponseSystem(['message' => lang::get('passwords.cannot_reset_pass')]);
    }

    public static function downloadForm(Request $request, $name)
    {
        return Storage::download("public/TemplatePDF/" . $name . '.pdf');
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
        $team = $this->query->whereIn('id', $id)->with('role')->get();
        foreach ($team as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
            }
            isset($data[$key]['role_id']) && $data[$key]['role_id'] = $value['role']['display_name'];
            if ($field == 'role_id') {
                if (App::getLocale() == "vi") {
                    $data[$key]['role_id'] = $value['role']['display_name'];
                } else {
                    $data[$key]['role_id'] = $value['role']['name'];
                }
            }
        }

        return Excel::download(new DataExport($id, $header, $data), 'user.xlsx');
    }
}
