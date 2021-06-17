<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;


class DataExport implements FromArray, WithHeadings,ShouldAutoSize,WithEvents
{
    /**
    * @return \Illuminate\Support\Collection
    */
    protected $id;
    protected $header;
    protected $data;

    function __construct($id,$header,$data)
    {
        $this->id=$id;
        $this->header=$header;
        $this->data=$data;
    }
    public function headings() :array {
        return $this->header;
    }
    public function array():array
    {
        return $this->data;
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class    => function(AfterSheet $event) {
                $cellRange = 'A1:W1'; // All headers
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont(14)->setSize(14);

            },
        ];
    }

}
