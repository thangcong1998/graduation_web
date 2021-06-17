<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Models\EventQualificationCompetitor;
use App\Models\MedalTable;
use Illuminate\Http\Request;
use App\Models\StageQualificationCompetitor;
use App\Models\Team;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StageQualificationCompetitorController extends ApiResourceController
{
    //
    public function setModel()
    {
        $this->model = new StageQualificationCompetitor();
    }

    public function medalRankings(Request  $request)
    {
        $data = $this->query->where("stage_id", $request->stage_id)
            ->with("stage")->get();
        foreach ($data as $st) {
            if ($st->qualification_type > 1 && $st->qualification <= 4) {
                EventQualificationCompetitor::updateOrCreate([
                    "event_id" => $st->stage->event_id,
                    "participant_id" => $st->participant_id,
                    "event_team_id" => $st->event_team_id,
                    "team_id" => $st->team_id,
                ], [
                    "qualification_type" => $st->qualification_type,
                ]);
            } else {
                EventQualificationCompetitor::query()->where("event_id", $st->stage->event_id)
                    ->where("event_team_id", $st->event_team_id)->where("participant_id", $st->participant_id)->delete();
            }
        }
        StageQualificationCompetitor::query()->where("qualification_type", "=", "0")->delete();
        $gold = EventQualificationCompetitor::qualification_type['hcv'];
        $silver = EventQualificationCompetitor::qualification_type['hcb'];
        $bronze = EventQualificationCompetitor::qualification_type['hcd'];
        $medals =  EventQualificationCompetitor::query()
            ->rightJoin('team', 'team.id', '=', 'event_qualification_competitors.team_id')
            ->selectRaw(
                "team.id as new_team_id,
                sum(case when qualification_type = $gold then 1 else 0 end) as gold_medal,
                sum(case when qualification_type = $silver then 1 else 0 end) as silver_medal,
                sum(case when qualification_type = $bronze then 1 else 0 end) as bronze_medal"
            )
            ->groupBy('new_team_id')->orderByRaw("gold_medal DESC")
            ->orderBy("silver_medal", "DESC")->orderBy("bronze_medal", "DESC")
            ->with(['team'])
            ->get();
        $rank_no = 1;
        try {
            DB::beginTransaction();

            foreach ($medals as $key => $me) {
                if ($key == 0) {
                    MedalTable::updateOrCreate(
                        [
                            'team_id' => $me['new_team_id']
                        ],
                        [
                            'team_id' => $me['new_team_id'],
                            'gold_medal' => $me['gold_medal'],
                            'silver_medal' => $me['silver_medal'],
                            'bronze_medal' => $me['bronze_medal'],
                            'rank_no' => $rank_no,
                        ]
                    );
                }
                if ($key >= 1) {
                    if ($medals[$key - 1]->gold_medal == $me['gold_medal']) {
                        if ($medals[$key - 1]->silver_medal == $me['silver_medal']) {
                            if ($medals[$key - 1]->bronze_medal == $me['bronze_medal']) {
                                MedalTable::updateOrCreate(
                                    [
                                        'team_id' => $me['new_team_id']
                                    ],
                                    [
                                        'team_id' => $me['new_team_id'],
                                        'gold_medal' => $me['gold_medal'] == 0 ? 0 : $me['gold_medal'],
                                        'silver_medal' => $me['silver_medal'] == 0 ? 0 : $me['silver_medal'],
                                        'bronze_medal' => $me['bronze_medal'] == 0 ? 0 : $me['bronze_medal'],
                                        'rank_no' => $rank_no,
                                    ]
                                );
                            } else {
                                MedalTable::updateOrCreate(
                                    [
                                        'team_id' => $me['new_team_id']
                                    ],
                                    [
                                        'team_id' => $me['new_team_id'],
                                        'gold_medal' => $me['gold_medal'] == 0 ? 0 : $me['gold_medal'],
                                        'silver_medal' => $me['silver_medal'] == 0 ? 0 : $me['silver_medal'],
                                        'bronze_medal' => $me['bronze_medal'] == 0 ? 0 : $me['bronze_medal'],
                                        'rank_no' => ++$rank_no,
                                    ]
                                );
                            }
                        } else {
                            MedalTable::updateOrCreate(
                                [
                                    'team_id' => $me['new_team_id']
                                ],
                                [
                                    'team_id' => $me['new_team_id'],
                                    'gold_medal' => $me['gold_medal'] == 0 ? 0 : $me['gold_medal'],
                                    'silver_medal' => $me['silver_medal'] == 0 ? 0 : $me['silver_medal'],
                                    'bronze_medal' => $me['bronze_medal'] == 0 ? 0 : $me['bronze_medal'],
                                    'rank_no' => ++$rank_no,
                                ]
                            );
                        }
                    } else {
                        MedalTable::updateOrCreate(
                            [
                                'team_id' => $me['new_team_id']
                            ],
                            [
                                'team_id' => $me['new_team_id'],
                                'gold_medal' => $me['gold_medal'],
                                'silver_medal' => $me['silver_medal'],
                                'bronze_medal' => $me['bronze_medal'],
                                'rank_no' => ++$rank_no,
                            ]
                        );
                    }
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
