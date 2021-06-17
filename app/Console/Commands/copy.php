<?php

namespace App\Console\Commands;

use App\Models\EventQualificationCompetitor;
use App\Models\StageQualificationCompetitor;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class copy extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'copy:EventQualification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $stage_qualification_competitors = StageQualificationCompetitor::query()
            ->where("qualification_type", ">", "1")->where("qualification_type", "<=", "4")
            ->with("stage")->get();
        foreach ($stage_qualification_competitors as $st) {
            EventQualificationCompetitor::insert([
                "event_id" => $st->stage->event_id,
                "participant_id" => $st->participant_id,
                "event_team_id" => $st->event_team_id,
                "team_id" => $st->team_id,
                "qualification_type" => $st->qualification_type
            ]);
        }
    }
}
