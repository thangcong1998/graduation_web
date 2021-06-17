<?php

namespace App\Mail;

use App\Models\ConfigInfo;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class ForgotPassword extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->email_data = $data;
        return $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $info = Setting::query()->first();

        return $this->from('vuduysm97@gmail.com', 'Seagame')->subject('Lấy lại mật khẩu')->view('mail.ForgotPasswordEmail', ['email_data' => $this->email_data]);
    }
}
