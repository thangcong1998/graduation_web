<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DisplaySettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        File::copyDirectory("public/assets/images/setting", "storage/app/public/setting");
        DB::table('display_setting')->truncate();
        DB::table('display_setting')->insert([
            'image_url' => 'setting/mascot.png',
            'logo_url' => 'setting/graduation31.png'
        ]);
        DB::table('files')->insert([
            [
                'ref_type' => 'App\Models\DisplaySetting',
                'ref_id' => 1,
                'path' => 'setting/slide1.jpg',
                'name' => 'slide1.jpg'
            ],
            [
                'ref_type' => 'App\Models\DisplaySetting',
                'ref_id' => 1,
                'path' => 'setting/slide2.jpg',
                'name' => 'slide2.jpg'
            ],
            [
                'ref_type' => 'App\Models\DisplaySetting',
                'ref_id' => 1,
                'path' => 'setting/slide3.jpg',
                'name' => 'slide3.jpg'
            ]
        ]);
    }
}
