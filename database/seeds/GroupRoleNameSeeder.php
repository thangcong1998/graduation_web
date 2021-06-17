<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupRoleNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement("SET foreign_key_checks = 0");
        DB::table('group_role_name')->truncate();
        DB::table('group_role_name')->insert([
            'name' => "Quản lý người dùng",
            "english_name" => "User management",
            'group' => 1,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Hệ thống",
            "english_name" => "System management",
            'group' => 2,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Thiết lập đại hội",
            "english_name" => "Game Entry",
            'group' => 3,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Thành phần đại hội",
            "english_name" => "Congress Component",
            'group' => 4,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Kỷ lục",
            "english_name" => "Record",
            'group' => 5,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Lịch thi đấu",
            "english_name" => "Match schedule",
            'group' => 6,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Kết quả thi đấu",
            "english_name" => "Match result",
            'group' => 7,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Phân công môn thể thao",
            "english_name" => "Assignment of sports",
            'group' => 8,
        ]);
        DB::table('group_role_name')->insert([
            'name' => "Bảng xếp hạng",
            "english_name" => "Medal table",
            'group' => 9,
        ]);
        DB::statement("SET foreign_key_checks = 1");
    }
}
