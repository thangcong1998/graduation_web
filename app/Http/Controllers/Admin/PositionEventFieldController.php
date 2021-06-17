<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ApiResourceController;
use App\Models\MatchEventTeamStartlist;
use App\Models\MatchIndividualCompetitor;
use App\Models\MatchRefereeRelation;
use App\Models\PositionEventField;
use App\Models\Match;
use App\Models\EventDistinguishPlayerMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Participant;
use Illuminate\Support\Facades\Lang;
class PositionEventFieldController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new PositionEventField();
    }

    public function index(Request $request)
    {
        return parent::index($request); // TODO: Change the autogenerated stub
    }

    public function show(Request $request, $id)
    {
        return parent::show($request, $id); // TODO: Change the autogenerated stub
    }

    public function store(Request $request)
    {
        return parent::_store($request); // TODO: Change the autogenerated stub
    }

    public function update(Request $request, $id)
    {
        return parent::_update($request, $id); // TODO: Change the autogenerated stub
    }

    public function destroy(Request $request, $id)
    {
        return parent::destroy($request, $id); // TODO: Change the autogenerated stub
    }
    public function addFilter($request)
    {
        if ($request->id) {
            $id = json_decode($request->id, true);
            $this->query->whereNotIn('id', $id);
        }
    }
    public function addAppend()
    {
    }
    public function storeLine(Request $request)
    {
        DB::beginTransaction();
        try {
            $errors = [];
            $competitor_venue_event_field_id = $request->competitor_venue_event_field_id;
            $match_id = $request->match_id;
            $method_id = $request->method_id;
            
            Match::where("id", $match_id)->update([
                'venue_event_field_id' => $competitor_venue_event_field_id
            ]);
            $competitors = $request->competitors;
            $referees = $request->referFunc;
            $start_lists = $request->start_lists;
            $arrays = $request->arrays;
            $individuals = $request->individuals;

            foreach ($competitors as $competitor) {
                $registration_number = $competitor['competitor']['registration_number'];
                
                // Log::info($method_id);
                if($method_id == EventDistinguishPlayerMethod::method_id['peep'] && $registration_number == null){
                    $errors['registration_number_is_require'][] = $competitor['competitor_id'];
                    
                }else{
                    Participant::where('id', $competitor['competitor_id'])
                    ->update(['registration_number' => $competitor['competitor']['registration_number']]);
                }
                
                $result = MatchIndividualCompetitor::updateOrCreate([
                    'match_id' => $request->match_id,
                    'competitor_id' => $competitor['competitor_id']
                ], [
                    'line_id' => $competitor['line_id']
                ]);
            }
            foreach ($referees as $referee) {
                $data = MatchRefereeRelation::updateOrCreate([
                    'match_id' => $request->match_id,
                    'referee_role_id' => $referee['id']
                ], ['referee_id' => $referee['referee']['id']]);
            }
            
            foreach ($start_lists as $list) {
                DB::table('match_event_team_startlist')
                ->where('match_event_team_id', $list['match_event_team_id'])->where('event_team_id' , $list['event_team_id'])
                ->delete();
                if($method_id == EventDistinguishPlayerMethod::method_id['uniform']  && $list['event_uniform_color_id'] == null){
                    $errors['event_uniform_color_is_require'][] = $list['event_team_id'];  
                }
                foreach ($list['start_list'] as $index => $competitor) {
                 if($competitor == null){
                    return response()->json(['message' => Lang::get('response.response_message.member_is_require')], 422);
                 }else{
                     $registration_number = $competitor['registration_number'];
                     if($method_id == EventDistinguishPlayerMethod::method_id['peep'] && $registration_number == null){
                         $errors['registration_number_is_require'][] = $competitor['id'];
                     }else{
                         Participant::where('id', $competitor['id'])->update(['registration_number' => $competitor['registration_number']]);
                     }
                    MatchEventTeamStartlist::updateOrCreate([
                        'match_event_team_id' => $list['match_event_team_id'],
                        'event_team_id' => $list['event_team_id'],
                        'competitor_id' => $competitor['id'],
                        'event_uniform_color_id' => $list['event_uniform_color_id'] ? $list['event_uniform_color_id'] : null,
                        ]);
                 }
                }
            }
            foreach ($arrays as $array) {
             
                DB::table('match_event_team_startlist')->where('match_event_team_id', $array['match_event_team_id'])
                ->where('event_team_id' , $array['event_team_id'])
                ->delete();
                if($method_id == EventDistinguishPlayerMethod::method_id['uniform'] && $array['event_uniform_color_id'] == null){
                    $errors['event_uniform_color_is_require'][] = $array['event_team_id'];  
                }
               
                foreach ($array['official'] as $competitor) {
                    if($competitor == null){
                        return response()->json(['message' => Lang::get('response.response_message.member_is_require')], 422);
                    }else{
                        $regis_number = $competitor['registration_number'];
                        if($method_id == EventDistinguishPlayerMethod::method_id['peep'] && $regis_number == null){
                            $errors['registration_number_is_require'][] = $competitor['id'];
                            
                        }else{
                            Participant::where('id', $competitor['id'])
                            ->update(['registration_number' => $competitor['registration_number']]);
                        }
                            MatchEventTeamStartlist::updateOrCreate([
                                'match_event_team_id' => $array['match_event_team_id'],
                                'event_team_id' => $array['event_team_id'],
                                'event_uniform_color_id' => $array['event_uniform_color_id'] ? $array['event_uniform_color_id'] : null,
                                'line_id' => $array['line_id'] ? $array['line_id'] : null,
                                'competitor_id' => $competitor['id']
                                ]);
                    }
                }
            }
            foreach($individuals as $individual){
                if($method_id = EventDistinguishPlayerMethod::method_id['custom'] && $individual['rule'] == null){
                    return response()->json(['message' => Lang::get('response.response_message.rule_is_require')], 422);
                }else{
                    $dt = MatchIndividualCompetitor::updateOrCreate([
                        'match_id' => $request->match_id,
                        'competitor_id' => $individual['competitor_id']
                    ], [
                        'rule' => $individual['rule']
                    ]);
                }
            }
            if(count($errors) > 0){
                return response()->json(['errors' => $errors], 422);
            }else{
                DB::commit();
                return $this->resultResponse(1);
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
            return $this->errorResponse();
        }
    }
}