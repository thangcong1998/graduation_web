<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventTeam;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Sport;
use App\Models\SportDiscipline;
use App\Models\SportDisciplineEvent;
use App\Models\Participant;
use App\Models\Team;
use App\Models\Referee;
use App\Models\Stage;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;


class ReportController extends Controller
{
    public function Report (Request $request) {
        $sport = Sport::query()->where('id', $request->sport_id)->first();
        $sport_discipline = [];
        $sport_discipline_event = [];
        $participant = [];
        // array discipline_id
        $array_discipline = SportDiscipline::query()
            ->with('sportDisciplineEvents')
            ->where('sport_id', $request->sport_id)->get();
        foreach ($array_discipline as $discipline) {
            array_push($sport_discipline, $discipline['id']);
        }
        //

        //array event_id
        $array_discipline_event = SportDisciplineEvent::query()
            ->with('eventTeam', 'competitor_event')
            ->whereIn('sport_discipline_id', $sport_discipline)->get();
        foreach ($array_discipline_event as $event) {
            array_push($sport_discipline_event, $event['id']);
        }
        //

        //participant_list
        $array_participant = array();
        $participant_lists = Participant::query()
            ->with(['sportDisciplineEvents', 'team', 'function'])
            ->whereHas('sportDisciplineEvents', function ($query) use ($sport_discipline_event) {
            return $query->whereIn('event_id', $sport_discipline_event);
        })->get();
        $event_team_lists = EventTeam::query()
            ->with(['Team', 'event_team_competitor', 'Event'])
            ->whereHas('Event', function ($query) use ($sport_discipline_event) {
            return $query->whereIn("event_id", $sport_discipline_event);
        })->get();
        foreach ($participant_lists as $participant_list) {
            array_push($participant, $participant_list['id']);
            array_push($array_participant, $participant_list);
        }
        $array_participant_event_team = array();
        foreach ($event_team_lists as $event_team_list) {
            foreach ($event_team_list->event_team_competitor as $event_team_competitor) {
                array_push($participant, $event_team_competitor['id']);
                array_push($array_participant, $event_team_competitor);
            }
        }
        //

        //count entry by NOC for team
        $NOC_entry_list = Team::query()
            ->with('participant_list.sportDisciplineEvents', 'event_team', 'participant_event')
            ->whereHas('participant_list', function ($query) use ($participant) {
            return $query->whereIn('id', $participant);
        })->get();
        $NOC_entry = Team::query()
            ->with('event_team', 'participant_event', 'Country')->get();
        $array_event = SportDisciplineEvent::query()
            ->with('eventTeam', 'competitor_event')
            ->whereIn('sport_discipline_id', $sport_discipline)->get();
        foreach ($NOC_entry as $NOC) {
            $count_team = 0;
            foreach ($array_event as $event) {
                $count = 0;
                if($event->competition_type == SportDisciplineEvent::competition_type['INDIVIDUAL']) {
                    foreach ($event->competitor_event as $competitor_event) {
                        if($competitor_event->team_id == $NOC->id) {
                            $count++;
                        }
                    }
                }
                if($event->competition_type == SportDisciplineEvent::competition_type['TEAM']) {
                    foreach ($event->eventTeam as $event_team) {
                        if($event_team->team_id == $NOC->id) {
                            $count++;
                        }
                    }
                }
                $name_team = $NOC->english_name;
                $event[$name_team] = $count;
                $count_team = $count_team + $count;
            }
            $NOC['count'] = $count_team;
        }
        foreach ($NOC_entry_list as $competitor) {
            $count = count($competitor['participant_list']);
            $competitor['count'] = $count + 1;
        }
        //

        //array referee
        $referee = Referee::query()
            ->with('sportDisciplineEvents', 'nationality')
            ->whereHas('sportDisciplineEvents', function ($query) use ($sport_discipline_event){
            return $query->whereIn('event_id', $sport_discipline_event);
        })->get();
        //

        //array team
        $teams = Team::query()->with(
            'event_team.stage_qualification_competitors',
            'medal',
            'event_team.Event',
            'participant_list.stage_qualification_competitors.stage.event'

        )->get();
        //
        $event_list = SportDisciplineEvent::query()
            ->with('participant.team.Country', 'eventTeam.Team.Country')
            ->whereIn('id', $sport_discipline_event)->has('participant')->get();
        $logo = DB::table('display_setting')->where('id', 1)->first();
        $image = Sport::query()->where('id', 1)->first();
        $logo_url = $logo->logo_url;
        $discipline = SportDiscipline::query()
            ->where('sport_id', 1)
            ->with('sportDisciplineEvents')
            ->withCount('sportDisciplineEvents')->get();
        // daily schedule
        $events = SportDisciplineEvent::query()->with(
            'event_distinguish_player_method',
            'teams.uniform_color',
            'participant',
            'stages.matches.match_individual_competitors.competitor',
            'stages.matches.competitors',
            'stages.matches.match_event_team.member.uniforms',
            'stages.matches.match_event_team.event_team',
            'stages.matches.match_referee_relations'
        )
            ->whereIn('id', $sport_discipline_event)->get();
        $match_individual_lists = [];
        $match_team_lists = [];
        // end daily schedule
        $date = Carbon::now()->format('d/m/Y');
        $data = [
            'logo_url' => $logo_url,
            'image_url' => $image['icon'],
            'name_sport' => $image['english_name'],
            'NOC' => $NOC_entry_list,
            'participant_list' => $array_participant,
            'referee' => $referee,
            'event_list' => $event_list,
            'number_entry' => $NOC_entry,
            'sport_discipline' => $discipline,
            'sport_discipline_event' => $array_event,
            'events' => $events,
            'sport' => $sport,
            'date' => $date
        ];
        //medal standing
        $event_mens = SportDisciplineEvent::query()->where('type', 1)->with('stages.stage_qualification_competitors')->get();
        $event_womens = SportDisciplineEvent::query()->where('type', 2)->with('stages.stage_qualification_competitors')->get();
        $event_mix = SportDisciplineEvent::query()->where('type', 3)->with('stages.stage_qualification_competitors')->get();
        $G_MEN = [];
        $S_MEN = [];
        $B_MEN = [];
        $G_WOMEN = [];
        $S_WOMEN = [];
        $B_WOMEN = [];
        $G_MIX = [];
        $S_MIX = [];
        $B_MIX = [];
        foreach ($event_mens as $event_men) {
            foreach ($event_men['stages'] as $stage) {
                foreach ($stage['stage_qualification_competitors'] as $stage_qualification_competitor) {
                    if ($stage_qualification_competitor['qualification_type'] == 2) {
                        array_push($G_MEN, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['qualification_type'] == 3) {
                        array_push($S_MEN, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['qualification_type'] == 4) {
                        array_push($B_MEN, $stage_qualification_competitor);
                    }
                }
            }
        }
        foreach ($event_womens as $event_men) {
            foreach ($event_men['stages'] as $stage) {
                foreach ($stage['stage_qualification_competitors'] as $stage_qualification_competitor) {
                    if ($stage_qualification_competitor['qualification_type'] == 2) {
                        array_push($G_WOMEN, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['qualification_type'] == 3) {
                        array_push($S_WOMEN, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['qualification_type'] == 4) {
                        array_push($B_WOMEN, $stage_qualification_competitor);
                    }
                }
            }
        }
        foreach ($event_mix as $event_men) {
            foreach ($event_men['stages'] as $stage) {
                foreach ($stage['stage_qualification_competitors'] as $stage_qualification_competitor) {
                    if ($stage_qualification_competitor['qualification_type'] == 2) {
                        array_push($G_MIX, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['qualification_type'] == 3) {
                        array_push($S_MIX, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['qualification_type'] == 4) {
                        array_push($B_MIX, $stage_qualification_competitor);
                    }
                }
            }
        }

        foreach ($teams as $team) {
            $gold_mens = [];
            $silver_mens = [];
            $bronze_mens = [];
            $gold_womens = [];
            $silver_womens = [];
            $bronze_womens = [];
            $gold_men_totals = [];
            $silver_men_totals = [];
            $bronze_men_totals = [];
            $gold_women_totals = [];
            $silver_women_totals = [];
            $bronze_women_totals = [];
            $gold_mix_totals = [];
            $silver_mix_totals = [];
            $bronze_mix_totals = [];
            foreach ($team['participant_list'] as $participant_list) {
                foreach ($participant_list['stage_qualification_competitors'] as $stage_qualification_competitor) {
                    if ($stage_qualification_competitor['stage']['event']['type'] == 1 && $stage_qualification_competitor['qualification_type'] == 2) {
                        array_push($gold_mens, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['stage']['event']['type'] == 1 && $stage_qualification_competitor['qualification_type'] == 3) {
                        array_push($silver_mens, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['stage']['event']['type'] == 1 && $stage_qualification_competitor['qualification_type'] == 4) {
                        array_push($bronze_mens, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['stage']['event']['type'] == 2 && $stage_qualification_competitor['qualification_type'] == 2) {
                        array_push($gold_womens, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['stage']['event']['type'] == 2 && $stage_qualification_competitor['qualification_type'] == 3) {
                        array_push($silver_womens, $stage_qualification_competitor);
                    }
                    if ($stage_qualification_competitor['stage']['event']['type'] == 2 && $stage_qualification_competitor['qualification_type'] == 4) {
                        array_push($bronze_womens, $stage_qualification_competitor);
                    }
                }
            }
            foreach ($team['event_team'] as $event_team) {
                if ($event_team['event']['type'] == 1) {
                    foreach ($event_team['stage_qualification_competitors'] as $stage_qualification_competitor) {
                        if ($stage_qualification_competitor['qualification_type'] == 2) {
                            array_push($gold_men_totals, $stage_qualification_competitor);
                        }
                        if ($stage_qualification_competitor['qualification_type'] == 3) {
                            array_push($silver_men_totals, $stage_qualification_competitor);
                        }
                        if ($stage_qualification_competitor['qualification_type'] == 4) {
                            array_push($bronze_men_totals, $stage_qualification_competitor);
                        }
                    }
                }
                if ($event_team['event']['type'] == 2) {
                    foreach ($event_team['stage_qualification_competitors'] as $stage_qualification_competitor) {
                        if ($stage_qualification_competitor['qualification_type'] == 2) {
                            array_push($gold_women_totals, $stage_qualification_competitor);
                        }
                        if ($stage_qualification_competitor['qualification_type'] == 3) {
                            array_push($silver_women_totals, $stage_qualification_competitor);
                        }
                        if ($stage_qualification_competitor['qualification_type'] == 4) {
                            array_push($bronze_women_totals, $stage_qualification_competitor);
                        }
                    }
                }
                if ($event_team['event']['type'] == 3) {
                    foreach ($event_team['stage_qualification_competitors'] as $stage_qualification_competitor) {
                        if ($stage_qualification_competitor['qualification_type'] == 2) {
                            array_push($gold_mix_totals, $stage_qualification_competitor);
                        }
                        if ($stage_qualification_competitor['qualification_type'] == 3) {
                            array_push($silver_mix_totals, $stage_qualification_competitor);
                        }
                        if ($stage_qualification_competitor['qualification_type'] == 4) {
                            array_push($bronze_mix_totals, $stage_qualification_competitor);
                        }
                    }
                }
            }
            $team['gold_mens'] = count($gold_mens);
            $team['silver_mens'] = count($silver_mens);
            $team['bronze_mens'] = count($bronze_mens);
            $team['gold_womens'] = count($gold_womens);
            $team['silver_womens'] = count($silver_womens);
            $team['bronze_womens'] = count($bronze_womens);
            $team['gold_men_totals'] = count($gold_men_totals);
            $team['silver_men_totals'] = count($silver_men_totals);
            $team['bronze_men_totals'] = count($bronze_men_totals);
            $team['gold_women_totals'] = count($gold_women_totals);
            $team['silver_women_totals'] = count($silver_women_totals);
            $team['bronze_women_totals'] = count($bronze_women_totals);
            $team['gold_mix_totals'] = count($gold_mix_totals);
            $team['silver_mix_totals'] = count($silver_mix_totals);
            $team['bronze_mix_totals'] = count($bronze_mix_totals);
        }
        //
        $data_medal_standing = [
            'logo_url' => $logo_url,
            'image_url' => $image['icon'],
            'sport' => $sport,
            'teams' => $teams,
            'G_MEN' => count($G_MEN),
            'S_MEN' => count($S_MEN),
            'B_MEN' => count($B_MEN),
            'G_WOMEN' => count($G_WOMEN),
            'S_WOMEN' => count($S_WOMEN),
            'B_WOMEN' => count($B_WOMEN),
            'G_MIX' => count($G_MIX),
            'S_MIX' => count($S_MIX),
            'B_MIX' => count($B_MIX),

        ];
        $doc = new PhpWord();
        $section = $doc->addSection();
        $number_of_entry = \view('word_form.NumberOfEntryByNOC', $data)->render();
        $referee_and_judges = \view('word_form.referee_and_judges', $data)->render();
        $entry_list_category = \view('word_form.entry_list_by_weight', $data)->render();
        $entry_list_NOC = \view('word_form.entry_list_by_NOC', $data)->render();
        $entry_data_checklist = \view('word_form.entry_data_checklist', $data)->render();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $number_of_entry);
        $section->addPageBreak();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $entry_list_NOC);
        $section->addPageBreak();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $entry_list_category);
        $section->addPageBreak();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $referee_and_judges);
        $section->addPageBreak();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $entry_data_checklist);
        foreach ($event_list as $event) {
            $data_setup = [
                'logo_url' => $logo_url,
                'image_url' => $image['icon'],
                'event' => $event
            ];
            $competition_officials = \view('word_form.competition_officials', $data_setup)->render();
            $section->addPageBreak();
            \PhpOffice\PhpWord\Shared\Html::addHtml($section, $competition_officials);
        }
        foreach ($events as $event) {
            foreach ($event->stages as $stage) {
                foreach ($stage->matches as $matches) {
                    $matches['name_stage'] = $stage->english_name;
                    if (count($event->teams) > 0 ) {
                        foreach ($matches->match_event_team as $match_event_team) {
//                            $match_event_team['event_team']['uniform'] = $match_event_team->member[0]['uniforms'];
                        }
                        array_push($match_team_lists, $matches);
                        $event['match_team_lists'] = $match_team_lists;
                    }
                    if (count($event->participant) > 0 ) {
                        array_push($match_individual_lists, $matches);
                        $event['match_individual_lists'] = $match_individual_lists;
                    }
                }
            }
            $data_daily = [
                'logo_url' => $logo_url,
                'image_url' => $image['icon'],
                'sport' => $sport,
                'event' => $event,
            ];

            if (count($event->stages) > 0 && count($event->participant) > 0 || count($event->stages) > 0 && count($event->teams) > 0) {
                $medal_lists = \view('word_form.daily_schedule', $data_daily)->render();
                $section->addPageBreak();
                \PhpOffice\PhpWord\Shared\Html::addHtml($section, $medal_lists);
            }
        }
        foreach ($events as $event) {
            $data_daily_with_referee = [
                'logo_url' => $logo_url,
                'image_url' => $image['icon'],
                'sport' => $sport,
                'event' => $event,
            ];

            if (count($event->stages) > 0 && count($event->participant) > 0 || count($event->stages) > 0 && count($event->teams) > 0) {
                $medal_lists = \view('word_form.daily_schedule_with_referee', $data_daily_with_referee)->render();
                $section->addPageBreak();
                \PhpOffice\PhpWord\Shared\Html::addHtml($section, $medal_lists);
            }
        }
        foreach ($events as $event) {
            $data_medal = [
                'logo_url' => $logo_url,
                'image_url' => $image['icon'],
                'sport' => $sport,
                'event' => $event,
            ];
            $medal_lists = \view('word_form.medal_lists', $data_medal)->render();
            $section->addPageBreak();
            \PhpOffice\PhpWord\Shared\Html::addHtml($section, $medal_lists);
        }
        $medal_lists = \view('word_form.medal_list_by_weight_category', $data)->render();
        $section->addPageBreak();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $medal_lists);
        $medal_lists = \view('word_form.medal_standing', $data_medal_standing)->render();
        $section->addPageBreak();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $medal_lists);
        $objWriter = IOFactory::createWriter($doc, 'Word2007');
        $objWriter->save(storage_path('app/public/Report.docx'));

        return response()->download(storage_path('app/public/Report.docx'));
    }
}
