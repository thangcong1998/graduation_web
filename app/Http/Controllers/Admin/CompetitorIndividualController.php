<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\ApiResourceController;
use App\Models\CompetitorIndividualEventRelations;
use App\Models\CompetitorVenueEventRelation;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class CompetitorIndividualController extends ApiResourceController
{
    //
    public function setModel()
    {
        $this->model = new CompetitorIndividualEventRelations();
    }

    public function addFilter($request)
    {
        $this->query->with('participant', 'event.sportDiscipline.sport');

        if ($request->sport_id) {
            $this->query->whereHas('event.sportDiscipline.sport', function ($query) use ($request) {
                $query->where('id', $request->sport_id);
            });
        }
        if ($request->sport_discipline_id) {
            $this->query->whereHas('event.sportDiscipline', function ($query) use ($request) {
                $query->where('id', $request->sport_discipline_id);
            });
        }
        if ($request->event_id) {
            $this->query->whereHas('event', function ($query) use ($request) {
                $query->where('id', $request->event_id);
            });
        }
        if ($request->ad_no) {
            $this->query->whereHas('participant', function ($query) use ($request) {
                $query->where('accreditation_number', $request->ad_no);
            });
        }
        if ($request->team_id) {
            $this->query->whereHas('participant.team', function ($query) use ($request) {
                $query->where('id', $request->team_id);
            });
        }
        // $event_teams_data = EventTeam::query()->with('EventTeamCompetitor')->get();
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $members = json_decode($request->team, true);
            foreach ($members as $mb) {
                $result = CompetitorIndividualEventRelations::updateOrCreate([
                    "participant_id" => $mb,
                    "team_id" => $request->team_id,
                    "event_id" => $request->event_id
                ], [
                    "participant_id" => $mb,
                    "team_id" => $request->team_id,
                    "event_id" => $request->event_id
                ]);
            }
            DB::commit();
            return $this->createResultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
        }
    }

    public function bulkDelete(Request $request)
    {
        $ids = json_decode($request->ids);
        $listAthletes = '';
        foreach ($ids as $id) {
            $listAthletes = CompetitorIndividualEventRelations::query()->where('id', $id)->first();
            $listAthletes->forceDelete();
        }
        return $this->deleteResultResponse($listAthletes);
    }

    public function exportData(Request $request)
    {
        $id = json_decode($request->ids);
        $header = [];
        $fields = [];
        $columns = json_decode($request->columns, true);
        foreach ($columns as $column) {
            if ($column['field'] == 'flag') {
            } else {
                $fields[] = $column['field'];
                $header[] = $column['title'];
            }
        }
        $data = [];
        $country = $this->query->with('participant', 'event.sportDiscipline')->whereIn('id', $id)->get();
        foreach ($country as $key => $value) {
            // $data[$key]['No']=$key+1;
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
                if ($field == "name") {
                    if (App::getLocale() == "vi") {
                        $data[$key]['name'] = $value['participant']['team']['name'];
                    } else {
                        $data[$key]['name'] = $value['participant']['team']['english_name'];
                    }
                }
                if ($field == "ad.no") {
                    $data[$key]['ad.no'] = $value['participant']['accreditation_number'];
                }
                if ($field == "full_name") {
                    $data[$key]['full_name'] = $value['participant']['family_name'] . $value['participant']['given_name'];
                }
                if ($field == "sport_discipline") {
                    if (App::getLocale() == "vi") {
                        $data[$key]['sport_discipline'] = $value['event']['sportDiscipline']['name'];
                    } else {
                        $data[$key]['sport_discipline'] = $value['event']['sportDiscipline']['english_name'];
                    }
                }
                if ($field == "event") {
                    if (App::getLocale() == "vi") {
                        $data[$key]['event'] = $value['event']['name'];
                    } else {
                        $data[$key]['event'] = $value['event']['english_name'];
                    }
                }
            }
        }
        return Excel::download(new DataExport($id, $header, $data), 'List Athletes.xlsx');
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->model->getFillable());
            $item = $this->query->where('id', $id)->first();
            $item->fill($data);
            if ($request->team) {
                $members = json_decode($request->team, true);
                $item->event_team_competitor()->sync($members);
            }
            $result = $item->update();
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
        }
    }
}
