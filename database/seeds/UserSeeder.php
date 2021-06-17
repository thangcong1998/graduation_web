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
            'email' => 'hieund@solashi.com',
            'user_name' => 'admin_seagame',
            'password'  =>  Hash::make('Admin@123'),
            'role_id' => 1,
            'phone' => '0328190075',
        ]);
        $user = User::create([
            'name' => 'TranHuong',
            'email' => 'huongtt@solashi.com',
            'user_name' => 'canhcanh',
            'password'  =>  Hash::make('12345678'),
            'role_id' => 1,
            'phone' => '0356323111',
        ]);
    }
}
