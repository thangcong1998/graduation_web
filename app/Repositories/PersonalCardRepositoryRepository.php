<?php

namespace App\Repositories;

use App\Models\Area;
use App\Models\CardTemplate;
use App\Models\DisplayCard;
use App\Models\Functions;
use App\Models\Vehicle;
use App\Models\Zone;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Contracts\RepositoryInterface;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Traits\CacheableRepository;

/**
 * Interface PersonalCardRepositoryRepository.
 *
 * @package namespace App\Repositories;
 */
class PersonalCardRepositoryRepository extends  BaseRepository  implements CacheableInterface
{

    protected $cacheMinutes = 90;

    use CacheableRepository;
    /**
     * Specify Model class name
     *
     * @return string
     */
    function model()
    {
        return "App\\Models\\Participant";
    }

    public function convertToPDF($id)
    {
        $person = $this->model->query()->with(['organization','function','team','nationality'])->find($id);
        $card_display = DisplayCard::query()->first();
        $card_template = CardTemplate::query()->find($person->card_template_id);
        $function = Functions::query()->with(['area_relation','zone_relation','vehicle_relation'])->find($person->function_id);
        $all_areas = Area::query()->get();
        $all_vehicle = Vehicle::query()->get();
        $all_zones = Zone::query()->get();
        try {
            $data = [
                "card_display" => $card_display,
                "card_info" => $person,
                "card_template" => $card_template,
                "card_organization" => $person->organization(),
                "card_function" => $person['function'],
                "nationality" => $person['nationality'],
                "profile_url" => 'storage/'.$person->profile_url,
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
            $path = 'personal_info/card/'.$person->card_no.'.pdf';
            Storage::disk('public')->put($path, $output);
            if (!$person->personal_card) {
                $person->update(['personal_card' => $path]);
            }
        } catch (\Exception $e){
            throw $e;
        }
    }
}
