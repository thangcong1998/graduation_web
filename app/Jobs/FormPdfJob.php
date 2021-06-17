<?php

namespace App\Jobs;

use Barryvdh\DomPDF\Facade as PDF;
use Dompdf\Options;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FormPdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    private $id;
    public $tries = 5;
    public $timeout = 100;
    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */

    public function CreateFormPDF ($id)
    {
        $cardTemplate = DB::table('m_card_templates')->where('id', $id)->first();
        $function = DB::table('m_functions')
            ->join('m_organizations', 'm_organizations.id', '=', 'm_functions.organization_id')
            ->where('card_template_id', $cardTemplate->id)
            ->select('m_organizations.abbreviation', 'm_functions.english_name')
            ->get();
        $organization = '';
        $template = '';
        foreach ($function as $key => $mo) {
            $template = '<p class="function">
                    <span class="block" ></span>
                    <span>'.$mo->abbreviation.' - '.$mo->english_name.' </span>
                </p>';
            $organization = $organization.$template;
            $test = $template.$template;
        }
        $img = DB::table('display_setting')->first();
        $data = [
            'card_name' => $cardTemplate->text,
            'back_color_card' => $cardTemplate->background_color,
            'text_color' => $cardTemplate->text_color,
            'organization' => $organization,
            'img' => $img
        ];
        $pdf = new PDF();
        $options = new Options();
        $options->setIsHtml5ParserEnabled(true);
        $pdf = new PDF($options);
        $formpdf = $pdf::loadView('pdf_form.register_offline', $data);
        $output = $formpdf->output();

        Storage::put('public/TemplatePDF/'.$cardTemplate->name.'.pdf',$output) ;
    }

    public function handle()
    {
        $this->CreateFormPDF($this->id);
    }
}
