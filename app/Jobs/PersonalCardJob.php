<?php

namespace App\Jobs;

use App\Models\Area;
use App\Models\CardTemplate;
use App\Models\DisplayCard;
use App\Models\Functions;
use App\Models\Participant;
use App\Models\Vehicle;
use App\Models\Zone;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PersonalCardJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    private $id;
    public $tries = 10;
    public $timeout = 20000;
    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */

    public function convertToPDF($id)
    {
        $person = Participant::query()->with(['organization', 'function', 'team', 'nationality'])->find($id);
        $card_display = DisplayCard::query()->first();
        $card_template = CardTemplate::query()->find($person->card_template_id);
        $function = Functions::query()->with(['area_relation', 'zone_relation', 'vehicle_relation'])->find($person->function_id);
        $all_areas = Area::query()->get();
        $all_vehicle = Vehicle::query()->get();
        $all_zones = Zone::query()->get();
        $gender = '';
        if ($person->sex == Participant::gender['female']) {
            $gender = "Female";
        }
        if ($person->sex == Participant::gender['male']) {
            $gender = "Male";
        }
        try {
            $data = [
                "card_display" => $card_display,
                "card_info" => $person,
                "gender" => $gender,
                "card_template" => $card_template,
                "card_organization" => $person->organization(),
                "card_function" => $person['function'],
                "nationality" => $person['nationality'],
                "profile_url" => $person->profile_url,
                "barcode" => $person->card_no,
                "areas" => $function['area_relation'],
                "zones" => $function['zone_relation'],
                'vehicles' => $function['vehicle_relation'],
                'team' => $person['team'],
                'all_areas' => $all_areas,
                'all_vehicle' => $all_vehicle,
                'all_zones' => $all_zones
            ];
            $pdf = PDF::loadView('card.card', $data);
            $output = $pdf->output();
            $path = 'personal_info/card/' . $person->card_no . '.pdf';
            Storage::disk('public')->put($path, $output);

            $person->update(['personal_card' => $path]);
            $person = Participant::query()->find($id);
            chown(storage_path('app/public/' . $person->personal_card), "www-data");
            chgrp(storage_path('app/public/' . $person->personal_card), "www-data");
        } catch (\Exception $e) {
            throw $e;
        }
    }
    public function handle()
    {
        $members = json_decode($this->id);
        if (is_array($members)) {
            foreach ($this->id as $member) {
                $this->convertToPDF($member['id']);
            }
        } else {
            $this->convertToPDF($this->id);
        }
    }
}
