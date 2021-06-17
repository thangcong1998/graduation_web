<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Models\MedalTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedalTableController extends ApiResourceController
{
    //
    public function setModel()
    {
        $this->model = new MedalTable();
    }
    public function index(Request $request)
    {
        $medal = MedalTable::query()->orderBy("rank_no", "ASC")
            ->with(['team'])->get();
        return $medal;
    }
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            foreach ($request->medal_table as $re) {
                $result =  MedalTable::updateOrCreate(
                    [
                        'team_id' => $re['team']['id']
                    ],
                    [
                        'team_id' => $re['team']['id'],
                        'gold_medal' => $re['gold_medal'],
                        'silver_medal' => $re['silver_medal'],
                        'bronze_medal' => $re['bronze_medal'],
                        'rank_no' => $re['rank_no'],
                    ]
                );
            }
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
