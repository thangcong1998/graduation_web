<?php

use Illuminate\Database\Seeder;
use App\Models\MatchType;

class MatchTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $matchType = MatchType::create([
            'name' => 'Tính thành tích',
            'english_name' => 'Achievement'
        ]);
        $matchType = MatchType::create([
            'name' => 'Tính điểm',
            'english_name' => 'Score'
        ]);
        $matchType = MatchType::create([
            'name' => 'Loại trực tiếp 1vs 1',
            'english_name' => 'K.O'
        ]);
    }
}
