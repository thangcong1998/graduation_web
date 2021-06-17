<?php

use Illuminate\Database\Seeder;
use App\Models\SyncDataSetting;

class SyncDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $syncData = SyncDataSetting::create([
            'name' => 'Sport',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'Country',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'Teams',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'Regions',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'Functions',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'Venue',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'CardSetting',
            'api_url' => '',
        ]);
        $syncData = SyncDataSetting::create([
            'name' => 'Participant',
            'api_url' => '',
        ]);
    }
}
