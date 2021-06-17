<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\Controller;
use App\Models\MatchEventTeam;
use App\Models\MatchIndividualCompetitor;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiResourceController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;

class MatchEventTeamController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new MatchEventTeam();
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
//        $this->query->with('event', 'event.sportDiscipline', 'event.sportDiscipline.sport');
    }
    public function addAppend()
    {
//        $this->query->with('event', 'event.sportDiscipline', 'event.sportDiscipline.sport');
    }
}