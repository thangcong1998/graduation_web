<?php

use Illuminate\Database\Seeder;
use App\Models\EventGroup;

class EventGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        EventGroup::create([
            'stage_id' => 1,
            'name' => 'Bảng A',
            'count' => 5
        ]);
        EventGroup::create([
            'stage_id' => 2,
            'name' => 'Bảng A',
            'count' => 2
        ]);
        EventGroup::create([
            'stage_id' => 2,
            'name' => 'Bảng B',
            'count' => 2
        ]);
    }
}
