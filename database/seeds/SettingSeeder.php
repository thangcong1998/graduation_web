<?php

use Illuminate\Database\Seeder;
use App\Models\Area;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('m_settings')->truncate();
        DB::table('m_settings')->insert([
            'email' => 'vuduysm97@gmail.com',
            'password' => 'ogzaatbngojlypwr',
            'host' => 'smtp.gmail.com',
            'port' => 587
        ]);
    }
}
