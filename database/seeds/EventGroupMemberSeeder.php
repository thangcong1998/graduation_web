<?php

use Illuminate\Database\Seeder;
use App\Models\EventGroupMember;

class EventGroupMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        EventGroupMember::create([
            'event_group_id' => 1,
            'individual_competitor_id' => 291,
            'event_team_id' => null
        ]);
        EventGroupMember::create([
            'event_group_id' => 1,
            'individual_competitor_id' => 292,
            'event_team_id' => null
        ]);
        EventGroupMember::create([
            'event_group_id' => 1,
            'individual_competitor_id' => 303,
            'event_team_id' => null
        ]);
        EventGroupMember::create([
            'event_group_id' => 1,
            'individual_competitor_id' => 296,
            'event_team_id' => null
        ]);

        EventGroupMember::create([
            'event_group_id' => 2,
            'individual_competitor_id' => null,
            'event_team_id' => 1
        ]);
        EventGroupMember::create([
            'event_group_id' => 2,
            'individual_competitor_id' => null,
            'event_team_id' => 2
        ]);
        EventGroupMember::create([
            'event_group_id' => 3,
            'individual_competitor_id' => null,
            'event_team_id' => 1
        ]);
    }
}
