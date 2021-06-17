<?php

use Illuminate\Database\Seeder;
use App\Models\Zone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = Zone::create([
            'name' => 'Sân thi đấu, khu vực chuẩn bị của Vận động viên, khu vực hoạt động (phía sau khu nhà), khu vực Tổng truyền tin (phía trước ngôi nhà)',
            'icon_url' => 'zones/blue.png',
        ]);
        $user = Zone::create([
            'name' => 'Khu vực hoạt động (phía sau khu nhà), khu vực Tổng truyền tin (phía trước ngôi nhà).',
            'icon_url' => 'zones/red.png',
        ]);
        $user = Zone::create([
            'name' => 'Khu vực Tổng truyền tin (phía trước ngôi nhà)',
            'icon_url' => 'zones/white.png',
        ]);
        $user = Zone::create([
            'name' => 'Khu vực của đài truyền hình và báo chí',
            'icon_url' => 'zones/4.png',
        ]);
        $user = Zone::create([
            'name' => 'Khu vực lễ tân đón khách',
            'icon_url' => 'zones/5.png',
        ]);
        $user = Zone::create([
            'name' => 'Khu nhà ở',
            'icon_url' => 'zones/r.png',
        ]);

        File::copyDirectory("public/assets/images/zones","storage/app/public/zones");
    }
}
