<?php

use Illuminate\Database\Seeder;
use App\Models\Match;
use Carbon\Carbon;

class MatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Match::create([
            'stage_id' => 1,
            'event_group_id' => 1,
            'event_date' => Carbon::create('2021', '11', '29'),
            'start_time' => Carbon::create('2021', '11', '15', '10', '16'),
            'end_time' => Carbon::create('2021', '11', '15', '11', '00'),
            'competition_type' => 2,
            'status' => 1
        ]);
        Match::create([
            'stage_id' => 2,
            'event_group_id' => 1,
            'event_date' => Carbon::create('2021', '11', '23'),
            'start_time' => Carbon::create('2021', '11', '15', '10', '16'),
            'end_time' => Carbon::create('2021', '11', '15', '11', '00'),
            'competition_type' => 1,
            'status' => 1
        ]);
        Match::create([
            'stage_id' => 2,
            'event_group_id' => 2,
            'event_date' => Carbon::create('2021', '12', '04'),
            'start_time' => Carbon::create('2021', '11', '15', '10', '16'),
            'end_time' => Carbon::create('2021', '11', '15', '11', '00'),
            'competition_type' => 2,
            'status' => 1
        ]);
    }
}
