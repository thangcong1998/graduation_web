<?php

use Illuminate\Database\Seeder;
use App\Models\SportDisciplineEvent;
use Illuminate\Support\Facades\DB;

class SportDisciplineEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('sport_discipline_events')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        $path_sports = '/database/seeds/script/mysql_new_events.sql';
        DB::unprepared(file_get_contents(base_path($path_sports)));
    }
}
