<?php

use App\Models\StageType;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
        /**
         * Seed the application's database.
         *
         * @return void
         */
        public function run()
        {
                // $this->call(UserSeeder::class);
                $this->call(RoleSeeder::class);
                $this->call(UserSeeder::class);
                $this->call(PermissionSeeder::class);
                $this->call(CountrySeeder::class);
                $this->call(OrganizationSeeder::class);
                $this->call(CardTemplateSeeder::class);
                $this->call(AreaSeeder::class);
                $this->call(VehicleSeeder::class);
                $this->call(ZoneSeeder::class);
                $this->call(FunctionSeeder::class);
                $this->call(SportSeeder::class);
                $this->call(SportDisciplineSeeder::class);
                $this->call(DisplaySettingSeeder::class);
                $this->call(CardDisplaySeeder::class);
                $this->call(TeamSeeder::class);
                $this->call(RegionsSeeder::class);
                $this->call(VenueSeeder::class);
                $this->call(ImageVenueSeeder::class);
                $this->call(SettingSeeder::class);
                $this->call(SyncDataSeeder::class);
                $this->call(GroupRoleNameSeeder::class);
                $this->call(AuditSyncDataSettingSeeder::class);
                $this->call(MatchTypeSeeder::class);
                $this->call(SportDisciplineEventSeeder::class);
        }
}
