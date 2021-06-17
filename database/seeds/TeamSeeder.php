<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('team')->insert([
            [
                'name' => 'Đoàn thể thao Việt Nam',
                'english_name' => 'Vietnam Olympic Committee',
                'country_id' => 1,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Brunei',
                'english_name' => 'Brunei Olympic Committee',
                'country_id' => 2,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Cam-pu-chia',
                'english_name' => 'National Olympic Committee of Cambodia',
                'country_id' => 3,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao In-đô-nê-xi-a',
                'english_name' => 'National Olympic Committee of Indonesia',
                'country_id' => 4,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Lào',
                'english_name' => 'National Olympic Committee of Laos',
                'country_id' => 5,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Ma-lai-xi-a',
                'english_name' => 'National Olympic Committee of Malaysia',
                'country_id' => 6,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Mi-an-ma',
                'english_name' => 'National Olympic Committee of Myanmar',
                'country_id' => 7,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Phi-líp-pin',
                'english_name' => 'National Olympic Committee of Philippines',
                'country_id' => 8,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Xinh-ga-po',
                'english_name' => 'National Olympic Committee of Singapore',
                'country_id' => 9,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Thái Lan',
                'english_name' => 'National Olympic Committee of Thailand',
                'country_id' => 10,
                'is_sport_team' => 2,
            ],
            [
                'name' => 'Đoàn thể thao Đông-ti-mo',
                'english_name' => 'National Olympic Committee of Timor-Leste',
                'country_id' => 11,
                'is_sport_team' => 2,
            ],
        ]);
    }
}
