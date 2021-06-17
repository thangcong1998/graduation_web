<?php

use Illuminate\Database\Seeder;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Model_has_permissions;
use Spatie\Permission\Models\Model_has_roles;
use Illuminate\Support\Facades\Config;
use App\Models\User;
use App\Models\Module;

use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        DB::statement("SET foreign_key_checks = 0");

        $tables = ['modules', 'roles', 'permissions', 'model_has_roles', 'model_has_permissions', 'role_has_permissions', 'role_has_modules'];
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        $modules = Config::get('default_permissions.modules');
        $roles = Config::get('default_permissions.roles');

        //seed modules and module permissions
        foreach ($modules as $key => $module) {
            $newModule = Module::create([
                'name' => $key,
                'display_name' => $module['display_name'],
                'english_name' => $module['english_name'],
                'group' => $module['group']
            ]);

            foreach ($module['permissions'] as $permission => $display_name) {
                $newModule->permissions()->create([
                    'name' => $permission,
                    'display_name' => $display_name['name'],
                    'english_name' => $display_name['english_name'],
                    'guard_name' => 'api'
                ]);
            }
        }
        //seed roles then attach modules & permissions to roles
        foreach ($roles as $roleName => $role) {
            $newRole = Role::create([
                'name' => $roleName,
                'display_name' => $role['display_name'],
                'guard_name' => 'api'
            ]);
            foreach ($role['modules'] as $module => $permissions) {
                $getModule = Module::where('name', $module)->first();
                $newRole->modules()->attach($getModule->id);
                $newRole->givePermissionTo($permissions);
            }
        }

        //assign roles to users
        $users = User::query()->where('role_id', 1)->get();
        foreach ($users as $user) {
            $user->assignRole('admin');
        }
        $members = User::query()->where('role_id', 2)->get();
        foreach ($members as $member) {
            $member->assignRole('member');
        }

        DB::statement("SET foreign_key_checks = 1");
    }
}
