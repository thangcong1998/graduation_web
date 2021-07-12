<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class SportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('sports')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        $path_sports = '/database/seeds/script/mysql_new_sports.sql';
        DB::unprepared(file_get_contents(base_path($path_sports)));
    }
}
