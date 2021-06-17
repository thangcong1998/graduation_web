<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path_regions = '/database/seeds/script/mysql_m_regions.sql';
        DB::unprepared(file_get_contents(base_path($path_regions)));
    }
}
