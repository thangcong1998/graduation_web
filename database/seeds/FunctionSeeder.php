<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class FunctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path_function = '/database/seeds/script/mysql_m_functions.sql';
        DB::unprepared(file_get_contents(base_path($path_function)));
    }
}
