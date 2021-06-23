<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'congv920@gmail.com',
            'user_name' => 'admin_graduation',
            'password'  =>  Hash::make('Admin@123'),
            'role_id' => 1,
            'phone' => '0328190075',
        ]);
    }
}
