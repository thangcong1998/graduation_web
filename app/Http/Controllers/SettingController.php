<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SettingController extends Controller
{
    protected function changeLang(Request $request)
    {
        if ($request->lang === 'en') {
            \Session::put('lang', 'en');
        }
        if ($request->lang === 'vi') {
            \Session::put('lang', 'vi');
            //            App::setLocale('vi');
        }
        return App::getLocale();
    }
}
