<?php

namespace App\Jobs;

use App\Models\Country;
use App\Models\Functions;
use App\Models\Organization;
use App\Models\Sport;
use App\Models\Team;
use App\Repositories\PersonalInfoRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

class RenderStaffExcelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct()
    {
    }

    function updateExcelStaff()
    {
        try {

            $objPHPExcel = IOFactory::load('public/storage/documents/StaffForm.xlsx');

            $sheet = $objPHPExcel->getSheet(1);
            $objPHPExcel->removeNamedRange('OCA_Function', $sheet);
            $sheet->getColumnDimension('c')->setAutoSize(true);
            $sheet->getColumnDimension('d')->setAutoSize(true);
            $sheet->getColumnDimension('e')->setAutoSize(true);
            $sheet->getColumnDimension('f')->setAutoSize(true);

            $ors = Organization::query()->where('is_holder', '=', 2)->with(['functions' => function ($query) {
                $query->where('is_staff', '=', 2);
            }])->get();
            $rowOr = 2;
            $rowFunction = 2;
            $countOr = count($ors);
            $column = 'C';
            $lastCountryRow = $sheet->getHighestRow();
            $orName = [];
            foreach ($ors as $or) {
                $orName[] = $or['abbreviation'];
            }
            for ($row = 2; $row <= $lastCountryRow; $row++) {
                $cell = $sheet->getCell($column . $row);
                if (!in_array($cell, $orName)) {
                    $sheet->setCellValue('C' . $row, "");
                }
            }
            foreach ($ors as $key => $or) {
                $sheet->setCellValue('C' . $rowOr, $or['abbreviation']);
                $rowOr++;
                $countFunction = count($or['functions']);
                foreach ($or['functions'] as $function) {
                    $sheet->setCellValue('A' . $rowFunction, $function['english_name']);
                    $rowFunction++;
                }
                // -- add name range for Organization
                $subOr = $rowOr - $countOr;
                $maxOr = $rowOr - 1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Organization',
                        $sheet,
                        "\$C\${$subOr}:\$C\${$maxOr}"
                    )
                );
                // -- add name range for functions
                $sub = $rowFunction - $countFunction;
                $subFunction = $rowFunction - 1;
                if (count($or['functions']) > 0) {
                    $objPHPExcel->addNamedRange(
                        new NamedRange(
                            $or['abbreviation'] . '_Function',
                            $sheet,
                            "\$A\${$sub}:\$A\${$subFunction}"
                        )
                    );
                }
            }
            // foreach ($ors as $key => $or) {
            //     //                $sheet->setCellValue('B'.$rowOr,$or['abbreviation']);
            //     $countFunction = count($or['functions']);
            //     foreach ($or['functions'] as $function) {
            //         $sheet->setCellValue('A' . $rowFunction, $function['english_name']);
            //         $rowFunction++;
            //     }

            //     // -- add name range for functions
            //     $sub = $rowFunction - $countFunction;
            //     $subFunction = $rowFunction - 1;
            //     if (count($or['functions']) > 0) {
            //         $objPHPExcel->addNamedRange(
            //             new NamedRange(
            //                 'Function',
            //                 $sheet,
            //                 "\$A\${$sub}:\$A\${$subFunction}"
            //             )
            //         );
            //     }
            // }
            $genders = ['male', 'female'];
            $rowGender = 2;
            $countGender = count($genders);

            foreach ($genders as $item) {
                $sheet->setCellValue('B' . $rowGender, $item);
                $rowGender++;
                $subGender = $rowGender - $countGender;
                $maxGender = $rowGender - 1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Gender',
                        $sheet,
                        "\$B\${$subGender}:\$B\${$maxGender}"
                    )
                );
            }
            $objWriter = IOFactory::createWriter($objPHPExcel, 'Xlsx');
            $objWriter->save('public/storage/documents/StaffForm.xlsx');
            return 'ok';
        } catch (Exception $e) {
            throw $e;
        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
            throw $e;
        } catch (\PhpOffice\PhpSpreadsheet\Exception $e) {
        }
    }

    public function handle()
    {
        //
        try {
            $this->updateExcelStaff();
        } catch (Exception $e) {
        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
        }
    }
}
