<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiResourceController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;
use App\Models\MatchIndividualCompetitor;
use Illuminate\Support\Facades\Log;

class MatchIndividualCompetitorController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new MatchIndividualCompetitor();
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
        $this->query->with(['line', 'competitor']);
    }
    public function addAppend()
    {
    }
}