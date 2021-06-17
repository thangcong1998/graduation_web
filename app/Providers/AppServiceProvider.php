<?php

namespace App\Providers;

use App\Models\StageQualificationCompetitor;
use Illuminate\Support\ServiceProvider;
use App\Observers\StageQualificationCompetitorsObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
