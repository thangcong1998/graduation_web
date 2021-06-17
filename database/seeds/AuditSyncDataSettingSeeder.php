<?php

use App\Models\AuditSyncDataSetting;
use Illuminate\Database\Seeder;

class AuditSyncDataSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $syncData = AuditSyncDataSetting::create([
            'name' => 'Sport',
            'status' => 'Sync Data',
        ]);
        $syncData = AuditSyncDataSetting::create([
            'name' => 'MasterData',
            'status' => 'Sync Data',
        ]);
        $syncData = AuditSyncDataSetting::create([
            'name' => 'Venue',
            'status' => 'Sync Data',
        ]);
        $syncData = AuditSyncDataSetting::create([
            'name' => 'CardSetting',
            'status' => 'Sync Data',
        ]);
        $syncData = AuditSyncDataSetting::create([
            'name' => 'Participant',
            'status' => 'Sync Data',
        ]);
    }
}
