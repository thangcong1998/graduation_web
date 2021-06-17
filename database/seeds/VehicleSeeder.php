<?php

use Illuminate\Database\Seeder;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = Vehicle::create([
            'name' => 'Specialized Vehicle',
            'icon_url' => 'vehicles/t1.png',
        ]);
        $user = Vehicle::create([
            'name' => 'Commom Vehicle',
            'icon_url' => 'vehicles/t2.png',
        ]);
        $user = Vehicle::create([
            'name' => 'Reservation Vehicle',
            'icon_url' => 'vehicles/t3.png',
        ]);
        $user = Vehicle::create([
            'name' => 'Games Shuttle System',
            'icon_url' => 'vehicles/t4.png',
        ]);

        File::copyDirectory("public/assets/images/vehicles","storage/app/public/vehicles");
    }
}
