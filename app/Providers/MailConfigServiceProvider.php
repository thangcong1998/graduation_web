<?php

namespace App\Providers;

use App\Models\Country;
use App\Models\Functions;
use App\Models\Organization;
use App\Models\Sport;
use App\Models\SportDiscipline;
use App\Models\Team;
use App\Observers\CountryObserver;
use App\Observers\FunctionsObserver;
use App\Observers\OrganizationObserver;
use App\Observers\SportDisciplinesObserver;
use App\Observers\SportObserver;
use App\Observers\TeamObserve;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class MailConfigServiceProvider extends ServiceProvider
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

        if (Schema::hasTable('m_settings')) {
            $mail = DB::table('m_settings')->first();
            if ($mail) //checking if table is not empty
            {
                $config = array(
                    'driver'     => 'smtp',
                    'host'       => $mail->host,
                    'port'       => $mail->port,
                    'from'       => array('address' => $mail->email, 'name' => 'Seagame'),
                    'username'   => $mail->email,
                    'password'   => $mail->password,
                    'encryption' => 'tls',
                    'sendmail'   => '/usr/sbin/sendmail -bs',
                    'pretend'    => false,
                );
                Config::set('mail', $config);
            }
        }
    }
}
