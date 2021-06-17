<?php

use Illuminate\Database\Seeder;
use App\Models\Stage;

class StageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Stage::create([
            'event_id' => 3,
            'stage_type' => 1,
            'name' => 'Vòng loại',
            'english_name' => 'Test 1',
            'match_attendant_type' => 1,
            'match_score_type' => 1,
            'match_turn_num' => 3
        ]);
        Stage::create([
            'event_id' => 4,
            'stage_type' => 1,
            'name' => 'Vòng loại',
            'english_name' => 'Test 2',
            'match_attendant_type' => 1,
            'match_score_type' => 1,
            'match_turn_num' => 5
        ]);
    }
}
