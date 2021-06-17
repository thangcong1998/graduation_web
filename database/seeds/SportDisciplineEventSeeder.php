<?php

use Illuminate\Database\Seeder;
use App\Models\SportDisciplineEvent;

class SportDisciplineEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path_sports = '/database/seeds/script/mysql_sport_discipline_event.sql';
        DB::unprepared(file_get_contents(base_path($path_sports)));
    }
}
