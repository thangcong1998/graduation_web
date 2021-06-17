<?php

namespace App\Http\Controllers\Admin;

use App\CompetitorIndividualEventRelations;
use App\Exports\DataExport;
use App\Http\Controllers\ApiResourceController;
use App\Models\Referee;
use App\Models\SportDiscipline;
use App\Models\SportDisciplineEvent;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Helpers\SyncDataSeagameGms;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\RefereeStoreRequest;
use App\Http\Requests\RefereeUpdateRequest;

class RefereeController extends ApiResourceController
{
    //
    public function setModel()
    {
        $this->model = new Referee();
    }

    public function index(Request $request)
    {
        return parent::index($request); // TODO: Change the autogenerated stub
    }

    public function show(Request $request, $id)
    {
        return parent::show($request, $id); // TODO: Change the autogenerated stub
    }

    public function addFilter($request)
    {
        $this->query->with(['countryOfBirth', 'nationality', 'sport', 'sportDiscipline', 'sportDisciplineEvents.sportDiscipline.sport']);
        if ($request->sport_id) {
            $this->query->whereHas('sport', function ($q) use ($request) {
                $q->where('id', $request->sport_id);
            });
        }
        if ($request->Sport_id) {
            $discipline_id = [];
            $array_disciplines = SportDiscipline::query()->where('sport_id', $request->Sport_id)->get();
            foreach ($array_disciplines as $array_discipline) {
                array_push($discipline_id, $array_discipline['id']);
            }
            $event_id = [];
            $array_events = SportDisciplineEvent::query()->whereIn('sport_discipline_id', $discipline_id)->get();
            foreach ($array_events as $array_event) {
                array_push($event_id, $array_event['id']);
            }
            $this->query->whereHas('sportDisciplineEvents', function ($query) use ($event_id) {
                return $query->whereIn('event_id', $event_id);
            });
        }
        if ($request->event_id) {
            $this->query->whereHas('sportDisciplineEvents', function ($q) use ($request) {
                $q->where('event_id', $request->event_id);
            });
        }
        if ($request->name) {
            $name = $request->name;
            $this->query->where(DB::raw('concat(family_name," ",given_name)'), 'like', '%' . $name . '%');
        }
        if ($request->id) {
            $id = json_decode($request->id, true);
            $this->query->whereNotIn('id', $id);
        }
    }

    public function addAppend()
    {
        $this->query->with(['countryOfBirth', 'nationality', 'sport', 'sportDiscipline', 'sportDisciplineEvents.sportDiscipline.sport']);
    }

    public function store(RefereeStoreRequest $request)
    {
        $data = $request->only($this->model->getFillable());
        DB::beginTransaction();
        try {
            if ($request->hasFile('profile_url')) {
                $data['profile_url'] = Storage::disk('public')->put('referee/profile', $request->file('profile_url'));
            }
            if ($request->hasFile('personal_id_card')) {
                $data['personal_id_card_url'] = Storage::disk('public')->put('referee/personal_id_card', $request->file('personal_id_card'));
            }
            $result = $this->query->create($data);
            $ad_no = '4'
                . str_pad("0", 3, '0', STR_PAD_LEFT)
                . str_pad($result->id, 6, '0', STR_PAD_LEFT);
            // $result->update(['accreditation_number' => $ad_no]);s
            $events = json_decode($request->events, true);
            $result->sportDisciplineEvents()->attach($events);
            DB::commit();
            return $this->sendResponse($result);
        } catch (Exception $e) {
            throw $e;
            return $this->errorResponseSystem();
        }
    }

    public function update(RefereeUpdateRequest $request, $id)
    {
        $item = $this->query->find($id);
        $data = $request->only($this->model->getFillable());
        DB::beginTransaction();
        try {
            if ($request->hasFile('profile_url')) {
                $data['profile_url'] = Storage::disk('public')->put('referee/profile', $request->file('profile_url'));
            }
            if ($request->hasFile('personal_id_card')) {
                $data['personal_id_card_url'] = Storage::disk('public')->put('referee/personal_id_card', $request->file('personal_id_card'));
            }
            $item->fill($data);
            $result = $item->update();
            $events = json_decode($request->events, true);
            $item->sportDisciplineEvents()->sync($events);
            DB::commit();

            return $this->resultResponse($result);
        } catch (Exception $e) {
            throw $e;
            return $this->errorResponseSystem();
        }
    }

    public function destroy(Request $request, $id)
    {
        $referee = Referee::query()->where('id', $id)->first();
        $referee->delete();
        return $this->deleteResultResponse($referee);
    }

    protected function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = json_decode($request->ids, true);
            foreach ($ids as $id) {
                $referee = Referee::query()->where('id', $id)->first();
                $referee->delete();
            }
            DB::commit();
            return $this->deleteResultResponse($referee);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
        }
    }

    public function exportData(Request $request)
    {
        $id = json_decode($request->ids);
        $header = [];
        $fields = [];
        $columns = json_decode($request->columns, true);
        foreach ($columns as $column) {
            $fields[] = $column['field'];
            $header[] = $column['title'];
        }
        $data = [];


        $referee = $this->query->whereIn('id', $id)->with(['sport', 'sportDiscipline', 'nationality'])->get();
        foreach ($referee as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
                if ($field == 'is_active') {
                    $data[$key]['is_active'] = $value['card']['is_active'];
                }
                if ($field == 'user_id') {
                    $data[$key]['user_id'] = $value['card']['user_id'];
                }
                if ($field == 'accreditation_number') {
                    $data[$key]['accreditation_number'] = $value['accreditation_number'];
                }
                if ($field == 'sport') {
                    if (App::getLocale() == "vi") {
                        $data[$key]['sport'] = $value['sport']['name'];
                    } else {
                        $data[$key]['sport'] = $value['sport']['english_name'];
                    }
                }
                if ($field == "nationality") {
                    $data[$key]['nationality'] = $value['nationality']['name'];
                }
            }
            if (isset($data[$key]['sex']) && $data[$key]['sex'] == 1) {
                $sex = Lang::get('constants.sex.female');
            }
            if (isset($data[$key]['sex']) && $data[$key]['sex'] == 2) {
                $sex = Lang::get('constants.sex.male');
            }
            isset($data[$key]['sex']) && $data[$key]['sex'] = $sex;
            isset($data[$key]['user_id']) && $data[$key]['user_id'] = $value['card']['user']['name'];
        }
        return Excel::download(new DataExport($id, $header, $data), 'Referee.xlsx');
    }
}