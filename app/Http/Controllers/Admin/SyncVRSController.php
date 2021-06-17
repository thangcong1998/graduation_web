<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CardTemplate;
use App\Models\CompetitorIndividualEventRelations;
use App\Models\CompetitorVenue;
use App\Models\CompetitorVenueEventField;
use App\Models\CompetitorVenueEventRelation;
use App\Models\Country;
use App\Models\EventDistinguishPlayerMethod;
use App\Models\EventGroup;
use App\Models\EventGroupMember;
use App\Models\EventRounds;
use App\Models\EventSet;
use App\Models\EventStatistic;
use App\Models\EventTeam;
use App\Models\Foul;
use App\Models\Functions;
use App\Models\FunctionsReferee;
use App\Models\Organization;
use App\Models\Participant;
use App\Models\Sport;
use App\Models\SportDiscipline;
use App\Models\SportDisciplineEvent;
use App\Models\Stage;
use App\Models\SubCriteria;
use App\Models\Team;
use App\StageEventSetRelations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Match;
use App\Models\Referee;
use App\Models\RefereeEventRelations;
use App\Models\Regions;
use App\Models\StageSubCriteriasRelation;

class SyncVRSController extends Controller
{
    public function syncToVrs(Request $request)
    {
        $code = $request->code;
        $venue = CompetitorVenue::query()->where('code', $code)->first();
        if (!$venue) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $organizations = Organization::query()->get();
        $cardTemplates = CardTemplate::query()->get();
        $functions = Functions::query()->get();
        $regions = Regions::query()->get();
        $countries = Country::query()->get();
        $teams = Team::query()->get();
        $competitor_venue_event_relations = CompetitorVenueEventRelation::query()->with('event_field.position_field')->where('competitor_venue_id', $venue->id)->get();
        //sport
        $event_ids = [];
        foreach ($competitor_venue_event_relations as $cver) {
            if (!in_array($cver->event_id, $event_ids)) {
                $event_ids[] = $cver->event_id;
            }
        }
        $events = SportDisciplineEvent::query()->with('referee')->whereIn('id', $event_ids)->get();
        $discipline_ids = [];
        $referee_ids = [];
        foreach ($events as $ev) {
            if (!in_array($ev->sport_discipline_id, $discipline_ids)) {
                $discipline_ids[] = $ev->sport_discipline_id;
            }
            foreach($ev->referee as $re) {
                if (!in_array($re->id, $referee_ids)) {
                    $referee_ids[] = $re->id;
                }
            }
        }
        //referee
        $referees = Referee::query()->whereIn('id', $referee_ids)->get();
        $referee_event_relations = RefereeEventRelations::query()->whereIn('referee_id', $referee_ids)->get();
        $sport_disciplines = SportDiscipline::query()->whereIn('id', $discipline_ids)->get();
        $sport_ids = [];
        foreach ($sport_disciplines as $sd) {
            if (!in_array($sd->sport_id, $sport_ids)) {
                $sport_ids[] = $sd->sport_id;
            }
        }
        $sports = Sport::query()->whereIn('id', $sport_ids)->get();
        $event_distinguish_player_methods = EventDistinguishPlayerMethod::query()->whereIn('event_id', $event_ids)->get();
        $fouls = Foul::query()->whereIn('event_id', $event_ids)->get();
        $function_referee = FunctionsReferee::query()->whereIn('event_id', $event_ids)->get();
        $event_statistics = EventStatistic::query()->whereIn('event_id', $event_ids)->get();
        $event_rounds = EventRounds::query()->whereIn('event_id', $event_ids)->get();
        $event_sets = EventSet::query()->whereIn('event_id', $event_ids)->get();
        //
        $sub_criterias = SubCriteria::query()->where('event_id', $event_ids)->get();
        //
        $participant_ids = [];
        $competitor_individual_event_relations = CompetitorIndividualEventRelations::query()->whereIn('event_id', $event_ids)->get();
        foreach($competitor_individual_event_relations as $cier) {
            if (!in_array($cier->participant_id, $participant_ids)) {
                $participant_ids[] = $cier->participant_id;
            }
        } 
        $event_teams = EventTeam::query()->with('EventTeamCompetitor')->whereIn('event_id', $event_ids)->get();
        foreach($event_teams as $ev) {
            foreach($ev->EventTeamCompetitor as $etc) {
                if (!in_array($etc->competitor_id, $participant_ids)) {
                    $participant_ids[] = $etc->competitor_id;
                }
            }
        } 
        $participants = Participant::query()->whereIn('id', $participant_ids)->get();

        // stage
        $stages = Stage::query()->with(['event_groups.group_members'])->whereIn('event_id', $event_ids)->get();
        $stage_ids = [];
        foreach($stages as $stage) {
            $stage_ids[] = $stage->id;
        }
        $stage_event_set_relations = DB::table('stage_event_set_relations')->whereIn('event_id', $event_ids)->get();
        $stage_event_round_relations = DB::table('stage_event_round_relations')->whereIn('event_id', $event_ids)->get();
        $stage_qualification_settings = DB::table('stage_qualification_settings')->whereIn('stage_id',$stage_ids)->get();
        $stage_qualification_competitors = DB::table('stage_qualification_competitors')->whereIn('stage_id',$stage_ids)->get();
        $stage_match_points = DB::table('stage_match_points')->whereIn('stage_id',$stage_ids)->get();
        $round_points = DB::table('round_points')->whereIn('stage_id',$stage_ids)->get();
        $event_groups = EventGroup::query()->whereIn('stage_id', $stage_ids)->get();
        $event_group_ids = [];
        foreach($event_groups as $eg) {
            $event_group_ids[] = $eg->id;
        }
        $event_group_members = EventGroupMember::query()->whereIn('event_group_id', $event_group_ids)->get();

        return response()->json([
            'regions' => $regions,
            'venue' => $venue,
            'countries' =>  $countries,
            'teams' => $teams,
            'organizations' => $organizations,
            'functions' => $functions,
            'cardTemplates' => $cardTemplates,
            'sports' => $sports,
            'participants' => $participants,
            'sport_disciplines' => $sport_disciplines,
            'events' => $events,
            'event_distinguish_player_methods' => $event_distinguish_player_methods,
            'competitor_venue_event_relations' => $competitor_venue_event_relations,
            'fouls' => $fouls,
            'function_referee' => $function_referee,
            'event_statistics' => $event_statistics,
            'event_rounds' => $event_rounds,
            'event_sets' => $event_sets,
            'sub_criterias' => $sub_criterias,
            'competitor_individual_event_relations' => $competitor_individual_event_relations,
            'event_teams' => $event_teams,
            'stages' => $stages,
            'stage_event_round_relations' => $stage_event_round_relations,
            'stage_qualification_settings' => $stage_qualification_settings,
            'stage_qualification_competitors' => $stage_qualification_competitors,
            'stage_match_points' => $stage_match_points,
            'round_points' => $round_points,
            'event_groups' => $event_groups,
            'event_group_members' => $event_group_members,
            'referees' => $referees,
            'referee_event_relations' => $referee_event_relations
        ]);
    }

    public function syncMatchToVrs(Request $request)
    {
        $code = $request->code;
        $venue = CompetitorVenue::query()->where('code', $code)->first();
        if (!$venue) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $competitor_venue_event_relations = CompetitorVenueEventRelation::query()->where('competitor_venue_id', $venue->id)->get();
        //sport
        $event_ids = [];
        foreach ($competitor_venue_event_relations as $cver) {
            if (!in_array($cver->event_id, $event_ids)) {
                $event_ids[] = $cver->event_id;
            }
        }
        $matches = Match::query()->with([
            'match_referee_relations',
            'round.result.match_round_result_referee_relation',
            'match_individual_competitors',
            'match_individual_competitors.result.match_round_result_referee_relation',
            'match_event_teams.member',
            'match_event_teams.match_sub_criterias_relations',
            'match_event_teams.result.match_round_result_referee_relation',
            'match_set.match_set_game_result',
            'event_statistics_match',
            'match_sub_criterias_relations'
        ])->where('venue_id', $venue->id)->withTrashed()->get();
        $stage_sub_criterias_relations = StageSubCriteriasRelation::query()->whereIn('event_id', $event_ids)->get();
        return response()->json([
            'matches' => $matches,
            'stage_sub_criterias_relations' => $stage_sub_criterias_relations
        ]);
    }
}
