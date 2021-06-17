<?php namespace App\Repositories;

use App\Models\Country;
use App\Models\Functions;
use App\Models\Organization;
use App\Models\Sport;
use App\Models\Team;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Reader\Exception;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class StaffRepository extends  BaseRepository  implements CacheableInterface
{
    // Setting the lifetime of the cache to a repository specifically
    protected $cacheMinutes = 90;

    use CacheableRepository;
    /**
     * Specify Model class name
     *
     * @return string
     */
    function model()
    {
        return "App\\Models\\Staff";
    }

    function updateExcelStaff(){
        try {

            $objPHPExcel = IOFactory::load('storage/documents/StaffForm.xlsx');

            $sheet = $objPHPExcel->getSheet(1);
            $objPHPExcel->removeNamedRange('OCA_Function',$sheet);
            $sheet->getColumnDimension('c')->setAutoSize(true);
            $sheet->getColumnDimension('d')->setAutoSize(true);
            $sheet->getColumnDimension('e')->setAutoSize(true);
            $sheet->getColumnDimension('f')->setAutoSize(true);

            $ors = Organization::query()->where('is_holder','=',2)->with(['functions' => function($query) {
                $query->where('is_staff','=',2);
            }])->get();
            $rowFunction = 2;
            $column = 'A';
            $lastFunctionRow = $sheet->getHighestRow();
            $functionName = [];
            $functions = Functions::query()->where('is_staff','=',2)->whereHas('Organization',function (Builder $query){
                $query->where('is_holder','=',2);
            })->get();
            foreach ($functions as $function) {
                $functionName[] = $function['english_name'];
            }
            for ($row = 2; $row <= $lastFunctionRow; $row++) {
                $cell = $sheet->getCell($column.$row);
                if (!in_array($cell,$functionName)){
                    $sheet->setCellValue('A'.$row,"");
                }
            }
            foreach ($ors as $key => $or){
//                $sheet->setCellValue('B'.$rowOr,$or['abbreviation']);
                $countFunction = count($or['functions']);
                foreach ($or['functions'] as $function) {
                    $sheet->setCellValue('A'.$rowFunction,$function['english_name']);
                    $rowFunction ++;
                }

                // -- add name range for functions
                $sub = $rowFunction - $countFunction;
                $subFunction = $rowFunction - 1;
                $objPHPExcel->addNamedRange(
                    new NamedRange(
                        'Function',
                        $sheet,
                        "\$A\${$sub}:\$A\${$subFunction}"
                    )
                );

            }


            $objWriter = IOFactory::createWriter($objPHPExcel,'Xlsx');
            $objWriter->save('storage/documents/StaffForm.xlsx');
            return 'ok';
        } catch(Exception $e) {
            throw $e;

        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
            throw $e;
        } catch (\PhpOffice\PhpSpreadsheet\Exception $e) {
        }
    }

}
