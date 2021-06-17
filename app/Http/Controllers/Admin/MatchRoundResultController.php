<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\Controller;
use App\Models\MatchRoundResult;
use Illuminate\Http\Request;

class MatchRoundResultController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new MatchRoundResult();
    }
}
