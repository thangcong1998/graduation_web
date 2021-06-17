<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Subcommittee;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

class RenderTimeKeepingExcelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */

    function updateExcelTimeKeeping(){
        try {

            $objPHPExcel = IOFactory::load('public/assets/documents/TimeKeepingForm.xlsx');

            $sheet = $objPHPExcel->getSheet(1);
            $objPHPExcel->removeNamedRange('Subcommittee',$sheet);
            $sheet->getColumnDimension('c')->setAutoSize(true);
            $sheet->getColumnDimension('d')->setAutoSize(true);
            $sheet->getColumnDimension('e')->setAutoSize(true);
            $sheet->getColumnDimension('f')->setAutoSize(true);

            $subcommittees = Subcommittee::query()->get();
            $rowSubcommittee = 1;
            $countSubcommittee = count($subcommittees);
            foreach ($subcommittees as $subcommittee){
                $sheet->setCellValue('A'.$rowSubcommittee,$subcommittee['english_name']);
                $rowSubcommittee ++;
                $subSubcommitteeCount = $rowSubcommittee - $countSubcommittee;
                $maxSubcommittee = $rowSubcommittee -1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Subcommittee',
                        $sheet,
                        "\$A\${$subSubcommitteeCount}:\$A\${$maxSubcommittee}"
                    )
                );
            }

            

            $objWriter = IOFactory::createWriter($objPHPExcel,'Xlsx');
            $objWriter->save('public/assets/documents/TimeKeepingForm.xlsx');
            return 'ok';
        } catch(Exception $e) {
            throw $e;

        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
            throw $e;
        } catch (\PhpOffice\PhpSpreadsheet\Exception $e) {
        }
    }



    public function handle()
    {
        //
         //
         try {
            $this->updateExcelTimeKeeping();
        } catch (Exception $e) {
        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
        }
    }
}
