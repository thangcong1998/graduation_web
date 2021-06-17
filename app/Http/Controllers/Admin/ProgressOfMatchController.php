<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Models\ProgressOfMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use phpDocumentor\Reflection\DocBlock\Tags\Throws;

use function Symfony\Component\VarDumper\Dumper\esc;

class ProgressOfMatchController extends ApiResourceController
{
    //
    public function setModel()
    {
        $this->model = new ProgressOfMatch();
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $prm = $request->ProgressOfTheMatch;
            if (isset($prm['player']['competitor'])) {
                $result = ProgressOfMatch::create(
                    [
                        'match_id' => $request->match_id,
                        'foul_id' => $prm['foul']['id'],
                        'player_id' => $prm['player']['competitor']['id'],
                        'player_id_out' => $prm['player_out']['competitor']['id'],
                        'time' => $prm['time'],
                        'type' => $prm['type'],
                        'tns' => $prm['tns'],
                    ]
                );
            } else {
                $result = ProgressOfMatch::create(
                    [
                        'match_id' => $request->match_id,
                        'foul_id' => $prm['foul']['id'],
                        'player_id' => $prm['player']['id'],
                        'player_id_out' => $prm['player_out']['id'],
                        'time' => $prm['time'],
                        'type' => $prm['type'],
                        'tns' => $prm['tns'],
                        'event_team_id' => $prm['team']['id'],
                        "own_goal" => $prm['ownGoal']
                    ]
                );
            }
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
            return $this->errorResponse();
        }
    }

    public function update(Request $request)
    {
        try {
            DB::beginTransaction();
            foreach ($request->ProgressOfTheMatch as $prm) {
                if (isset($prm['player']['competitor'])) {
                    $result = ProgressOfMatch::query()->where('id', $prm['id'])->update([
                        "player_id" => $prm['player']['competitor']['id'],
                        "tns" => $prm['tns'],
                        "player_id_out" => $prm['player_out']['competitor']['id'],
                        "foul_id" => $prm['foul_id'],
                    ]);
                } else {
                    $result = ProgressOfMatch::query()->where('id', $prm['id'])->update([
                        "player_id" => $prm['player']['id'],
                        "tns" => $prm['tns'],
                        "player_id_out" => $prm['player_out']['id'],
                        "foul_id" => $prm['foul_id'],
                        "own_goal" => $prm['ownGoal']
                    ]);
                }
            }
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
            return $this->errorResponse();
        }
    }

    public function index(Request $request)
    {
        return parent::index($request); // TODO: Change the autogenerated stub
    }
    public function addFilter($request)
    {
        $this->query->with(['match', 'foul', 'player', 'player_out', 'event_team.event_team_competitor']);
    }

    public function deleteBulk(Request $request)
    {
        try {
            DB::beginTransaction();
            $result = DB::table('progress_of_match')->where('match_id', $request->match_id)
                ->whereNotIn("id", $request->id)->delete();
            DB::commit();
            return $this->deleteResultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse();
        }
    }
}
