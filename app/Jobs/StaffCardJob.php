<?php

namespace App\Jobs;

use App\Models\Area;
use App\Models\CardTemplate;
use App\Models\DisplayCard;
use App\Models\Functions;
use App\Models\PersonalInfo;
use App\Models\Staff;
use App\Models\Subcommittee;
use App\Models\Vehicle;
use App\Models\Zone;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StaffCardJob implements ShouldQueue
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
        $staff = Staff::query()->find($id);

        $card_display = DisplayCard::query()->first();
        $function = Functions::query()->with(['area_relation', 'zone_relation', 'vehicle_relation', 'Organization'])->find($staff->function_id);
        $card_template = CardTemplate::query()->find($function->card_template_id);
        $subcommittee = Subcommittee::query()->find($staff->subcommittee_id);
        $all_areas = Area::query()->get();
        $all_vehicle = Vehicle::query()->get();
        $all_zones = Zone::query()->get();
        $gender = '';
        if ($staff->sex == PersonalInfo::gender['female']) {
            $gender = "Female";
        }
        if ($staff->sex == PersonalInfo::gender['male']) {
            $gender = "Male";
        }
        $data = [
            "card_display" => $card_display,
            "card_info" => $staff,
            "gender" => $gender,
            "card_template" => $card_template,
            "card_organization" => $function->Organization(),
            "card_function" => $function,
            "profile_url" => $staff->profile_url,
            "barcode" => $staff->card_no,
            "areas" => $function['area_relation'],
            "zones" => $function['zone_relation'],
            'vehicles' => $function['vehicle_relation'],
            'all_areas' => $all_areas,
            'all_vehicle' => $all_vehicle,
            'all_zones' => $all_zones,
            'subcommittee' => $subcommittee
        ];
        $pdf = PDF::loadView('card.staffCard', $data);
        $output = $pdf->output();
        $path = 'staff/card/' . $staff->card_no . '.pdf';
        Storage::disk('public')->put($path, $output);
        $staff->update(['member_card' => $path]);
        $staff = Staff::query()->find($id);
        chown(storage_path('app/public/' . $staff->member_card), "www-data");
        chgrp(storage_path('app/public/' . $staff->member_card), "www-data");
    }

    public function handle()
    {
        $staffs = json_decode($this->id);
        if (is_array($staffs)) {
            foreach ($this->id as $staff) {
                $this->convertToPDF($staff['id']);
            }
        } else {
            $this->convertToPDF($this->id);
        }
    }
}
