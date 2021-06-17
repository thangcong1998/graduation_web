<?php

use Illuminate\Database\Seeder;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = Area::create([
            'name' => 'Tất cả các khu cực thi đấu và luyện tập',
            'icon_url' => 'areas/Vocuc.png',
        ]);
        $user = Area::create([
            'name' => 'Khách san, trụ sở của OCA - DABGOC',
            'icon_url' => 'areas/HH.png',
        ]);
        $user = Area::create([
            'name' => 'Khách sạn của vận động viên',
            'icon_url' => 'areas/AH.png',
        ]);
        $user = Area::create([
            'name' => 'Trung tâm truyền thông chính',
            'icon_url' => 'areas/MMC.png',
        ]);
        $user = Area::create([
            'name' => 'Trung tâm báo chí chính',
            'icon_url' => 'areas/MPC.png',
        ]);
        $user = Area::create([
            'name' => 'Trung tâm quảng bá quốc tế',
            'icon_url' => 'areas/IBC.png',
        ]);
        $user = Area::create([
            'name' => 'Trung tâm hoạt động và trụ sở chính của DABGOC',
            'icon_url' => 'areas/DOC.png',
        ]);

        File::copyDirectory("public/assets/images/areas","storage/app/public/areas");
    }
}
