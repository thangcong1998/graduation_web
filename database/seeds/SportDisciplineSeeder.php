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
        $path_sports = '/database/seeds/script/mysql_sport_discipline.sql';
        DB::unprepared(file_get_contents(base_path($path_sports)));
    }
}
