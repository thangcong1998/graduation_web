<?php

namespace App\Jobs;

use App\Models\Country;
use App\Models\Organization;
use App\Models\Sport;
use App\Models\Team;
use App\Repositories\PersonalInfoRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

class RenderExcelJob implements ShouldQueue
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

    function updateExcelPersonalInfo(){
        try {

            $objPHPExcel = IOFactory::load('public/storage/documents/RegisterForm.xlsx');

            $sheet = $objPHPExcel->getSheet(1);
            $objPHPExcel->removeNamedRange('OCA_Function',$sheet);
            $sheet->getColumnDimension('c')->setAutoSize(true);
            $sheet->getColumnDimension('d')->setAutoSize(true);
            $sheet->getColumnDimension('e')->setAutoSize(true);
            $sheet->getColumnDimension('f')->setAutoSize(true);
            $teams = Team::query()->get();
            $rowTeam = 2;
            $countTeam = count($teams);
            $column = 'A';
            $lastTeamRow = $sheet->getHighestRow();
            $teamName = [];
            foreach ($teams as $team) {
                $teamName[] = $team['english_name'];
            }
            for ($row = 2; $row <= $lastTeamRow; $row++) {
                $cell = $sheet->getCell($column.$row);
                if (!in_array($cell,$teamName)){
                    $sheet->setCellValue('A'.$row,"");
                }
            }
            foreach ($teams as $team) {

                $sheet->setCellValue('A'.$rowTeam,$team['english_name']);
                $rowTeam ++;
                $subTeam = $rowTeam - $countTeam;
                $maxTeam = $rowTeam -1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'NOC',
                        $sheet,
                        "\$A\${$subTeam}:\$A\${$maxTeam}"
                    )
                );
            }

            $ors = Organization::query()->with('functions')->get();
            $rowOr = 2;
            $rowFunction = 2;
            $countOr = count($ors);
            $column = 'B';
            $lastCountryRow = $sheet->getHighestRow();
            $orName = [];
            foreach ($ors as $or) {
                $orName[] = $or['abbreviation'];
            }
            for ($row = 2; $row <= $lastCountryRow; $row++) {
                $cell = $sheet->getCell($column.$row);
                if (!in_array($cell,$orName)){
                    $sheet->setCellValue('B'.$row,"");
                }
            }
            foreach ($ors as $key => $or){
                Log::info($key);
                $sheet->setCellValue('B'.$rowOr,$or['abbreviation']);
                $rowOr ++;
                $countFunction = count($or['functions']);
                foreach ($or['functions'] as $function) {
                    $sheet->setCellValue('C'.$rowFunction,$function['english_name']);
                    $rowFunction ++;
                }
                // -- add name range for Organization
                $subOr = $rowOr - $countOr;
                $maxOr = $rowOr -1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Organization',
                        $sheet,
                        "\$B\${$subOr}:\$B\${$maxOr}"
                    )
                );
                // -- add name range for functions
                $sub = $rowFunction - $countFunction;
                $subFunction = $rowFunction - 1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        $or['abbreviation'].'_Function',
                        $sheet,
                        "\$C\${$sub}:\$C\${$subFunction}"
                    )
                );

            }
            $sports = Sport::query()->get();
            $rowSport = 2;
            $countSport = count($sports);
            $column = 'D';
            $lastSportRow = $sheet->getHighestRow();
            $sportName = [];
            foreach ($sports as $sport) {
                $sportName[] = $sport['english_name'];
            }
            for ($row = 2; $row <= $lastSportRow; $row++) {
                $cell = $sheet->getCell($column.$row);
                if (!in_array($cell,$sportName)){
                    $sheet->setCellValue('D'.$row,"");
                }
            }
            foreach ($sports as $sport) {

                $sheet->setCellValue('D'.$rowSport,$sport['english_name']);
                $rowSport ++;
                $subSport = $rowSport - $countSport;
                $maxSport = $rowSport -1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Sport',
                        $sheet,
                        "\$D\${$subSport}:\$D\${$maxSport}"
                    )
                );
            }
            $countries = Country::query()->get();
            $rowCountry = 2;
            $countCountry= count($countries);
            $column = 'E';
            $lastCountryRow = $sheet->getHighestRow();
            $countryNameArr = [];
            foreach ($countries as $country) {
                $countryNameArr[] = $country['name'];
            }
            for ($row = 2; $row <= $lastCountryRow; $row++) {
                $cell = $sheet->getCell($column.$row);
                if (!in_array($cell,$countryNameArr)){
                    $sheet->setCellValue('E'.$row,"");
                }
            }
            foreach ($countries as $country) {

                $sheet->setCellValue('E'.$rowCountry,$country['name']);
//                $sheet->setCellValue('F'.$rowCountry,$country['name']);
                $rowCountry ++;
                $subCountry = $rowCountry - $countCountry;
                $maxCountry = $rowCountry -1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Category',
                        $sheet,
                        "\$E\${$subCountry}:\$E\${$maxCountry}"
                    )
                );

            }
            $nationals = Country::query()->get();
            $rowNational = 2;
            $countNational= count($nationals);
            $column = 'F';
            $lastNationalRow = $sheet->getHighestRow();
            $nameArr = [];
            foreach ($nationals as $national) {
                $nameArr[] = $national['name'];
            }
            for ($row = 2; $row <= $lastNationalRow; $row++) {
                $cell = $sheet->getCell($column.$row);
                if (!in_array($cell,$nameArr)){
                    $sheet->setCellValue('F'.$row,"");
                }
            }
            foreach ($nationals as $national) {

                $sheet->setCellValue('F'.$rowNational,$national['name']);
                $rowNational ++;

                $subNational = $rowNational - $countNational;
                $maxNational = $rowNational -1;
                Log::info($maxNational);
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Nationality',
                        $sheet,
                        "\$F\${$subNational}:\$F\${$maxNational}"
                    )
                );
            }
            $genders = ['male','female'];
            $rowGender = 2;
            $countGender= count($genders);

            foreach ($genders as $item) {
                $sheet->setCellValue('G'.$rowGender,$item);
                $rowGender ++;
                $subGender = $rowGender - $countGender;
                $maxGender = $rowGender -1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Gender',
                        $sheet,
                        "\$G\${$subGender}:\$G\${$maxGender}"
                    )
                );
            }

            $objWriter = IOFactory::createWriter($objPHPExcel,'Xlsx');
            $objWriter->save('public/storage/documents/RegisterForm.xlsx');
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
        try {
            $this->updateExcelPersonalInfo();
        } catch (Exception $e) {
        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
        }
    }
}
