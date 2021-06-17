<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageVenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 1,
            'path' => 'venue//mydinh1.jpg',
            'name' => 'mydinh1',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 1,
            'path' => 'venue//mydinh2.jpg',
            'name' => 'mydinh2',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 1,
            'path' => 'venue//mydinh3.jpg',
            'name' => 'mydinh3',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 1,
            'path' => 'venue//mydinh4.jpg',
            'name' => 'mydinh4',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 1,
            'path' => 'venue//mydinh5.jpg',
            'name' => 'mydinh5',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 2,
            'path' => 'venue//quanngua1.jpg',
            'name' => 'quanngua1',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 2,
            'path' => 'venue//quanngua2.png',
            'name' => 'quanngua2',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 2,
            'path' => 'venue//quanngua3.jpg',
            'name' => 'quanngua3',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 2,
            'path' => 'venue//quanngua4.jpg',
            'name' => 'quanngua4',
        ]);
        DB::table('files')->insert([
            'ref_type' => 'App\Models\CompetitorVenue',
            'ref_id' => 2,
            'path' => 'venue//quanngua5.jpg',
            'name' => 'quanngua5',
        ]);
    }
}
