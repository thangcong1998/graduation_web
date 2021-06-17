<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path_countries = '/database/seeds/script/mysql_sea_countries.sql';
        DB::unprepared(file_get_contents(base_path($path_countries)));

        File::copyDirectory("public/assets/images/flags","storage/app/public/flags");
    }
}
