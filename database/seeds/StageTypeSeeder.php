<?php

use Illuminate\Database\Seeder;
use App\Models\StageType;

class StageTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $stageType = StageType::create([
            'name' => 'Loại trực tiếp 1 với 1',
            'english_name' => 'K.O',
        ]);
        $stageType = StageType::create([
            'name' => 'Vòng tròn tính điểm tất cả',
            'english_name' => 'Score circle',
        ]);
        $stageType = StageType::create([
            'name' => 'Chia bảng đấu vòng tròn tính điểm',
            'english_name' => 'Divide board circle',
        ]);
        $stageType = StageType::create([
            'name' => 'Tính thành tích',
            'english_name' => 'Achievement '
        ]);
    }
}
