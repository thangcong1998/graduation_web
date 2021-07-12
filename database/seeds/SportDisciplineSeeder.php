<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SportDisciplineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('sport_disciplines')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        $path_sports = '/database/seeds/script/mysql_new_disciplines.sql';
        DB::unprepared(file_get_contents(base_path($path_sports)));
    }
}
