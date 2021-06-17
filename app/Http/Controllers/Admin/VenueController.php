<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DataExport;
use App\Http\Controllers\Controller;
use App\Models\CompetitorVenue;
use App\Models\Files;
use Barryvdh\DomPDF\Facade as PDF;
use Dompdf\Options;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiResourceController;
use App\Models\Venue;
use App\Http\Requests\VenueStoreRequest;
use App\Http\Requests\VenueUpdateRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;


class VenueController extends ApiResourceController
{
    public function setModel()
    {
        $this->model = new CompetitorVenue();
    }

    public function index(Request $request)
    {
        return parent::index($request); // TODO: Change the autogenerated stub
    }

    public function show(Request $request, $id)
    {
        return parent::show($request, $id); // TODO: Change the autogenerated stub
    }

    public function store(Request $request)
    {
        $data = $request->only($this->model->getFillable());
        DB::beginTransaction();
        try {
            $result = $this->query->create($data);
            if ($request->hasFile('files')) {
                $files = $request->file();
                $this->upload($files,$result,"venue");
            }
            $training_place = json_decode($request->training_place, true);
            $competition_place = json_decode($request->competition_place, true);
            if($training_place) {
                $result->venue_training_place()->attach($training_place);
            }
            if($competition_place) {
                $result->venue_competition_place()->attach($competition_place);
            }
            DB::commit();
            return $this->createResultResponse($result);
        }catch (\Exception $e) {
            DB::rollBack();
            throw $e;
            return $this->errorResponse();
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->only($this->model->getFillable());
        $item = $this->query->where('id', $id)->first();
        if (!$item) {
            return response()->json(['error' => 'Not found'], 404);
        }

        if ($request->has('oldFiles')) {
            $oldFiles = json_decode($request->oldFiles, true);
            $this->syncFiles($oldFiles, $item);
        }
        if ($request->has('files')) {
            $files = $request->file();
            $this->upload($files,$item,"accommodation");
        }
        DB::beginTransaction();
        try {
            $item->fill($data);
            $training_place = json_decode($request->training_place, true);
            $competition_place = json_decode($request->competition_place, true);
            $item->venue_training_place()->sync($training_place);
            $item->venue_competition_place()->sync($competition_place);
            $result = $item->update();
            DB::commit();
            return $this->resultResponse($result);

        }catch (\Exception $e){
            DB::rollBack();
            return $this->errorResponseSystem($e);
        }
    }
    public function destroy(Request $request, $id)
    {
        return parent::destroy($request, $id); // TODO: Change the autogenerated stub
    }


    public function addFilter($request)
    {
        $this->query->with( 'files', 'venue_training_place.sportDisciplineEvents', 'venue_competition_place.sportDisciplineEvents', 'region');
    }

    public function addAppend()
    {
        $this->query->with( 'files', 'venue_training_place.sportDisciplineEvents', 'venue_competition_place.sportDisciplineEvents', 'region');
    }

    public function deleteList (Request $request)
    {
        try{
            DB::beginTransaction();
            if($request->action == 'force')
            {
                $id = json_decode($request->ids);

                $delete = CompetitorVenue::whereIn('id',$id)->forceDelete();
                DB::commit();
                return $this->deleteResultResponse($delete);
            }
            else
            {
                $id = json_decode($request->ids);
                $delete = CompetitorVenue::whereIn('id',$id)->delete();
                DB::commit();
                return $this->deleteResultResponse($delete);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem($e);
        }
    }

    public function exportData(Request $request)
    {
        $id = json_decode($request->ids);
        $header= [];
        $fields=[];
        $columns = json_decode($request->columns,true);
        foreach($columns as $column){
            if( $column['field'] == 'flag'){

            } else{
                $fields[]=$column['field'];
                $header[] = $column['title'];
            }
        }
        $data=[];
        $venue = $this->query->whereIn('id',$id)->get();
        foreach ($venue as $key => $value) {
            // $data[$key]['No']=$key+1;
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
            }
        }
        return Excel::download(new DataExport($id,$header,$data), 'venue.xlsx');
    }

    protected function UploadFile(Request $request) {
        if ($request->hasFile('upload')) {
            $file = $request->file('upload');
            $img = Storage::disk('public')->put('upload', $file);
            $url = Storage::url($img);
            return response()->json(array('location' => $url));
        }
        else {
            $file = $request->file('files');
            return response()->json('khong luu duoc anh');
        }
    }

    protected function upload($files, $model, $url)
    {
        foreach ($files['files'] as $file) {
            $path = Storage::disk('public')->put('venue/', $file);
            $originName = $file->getClientOriginalName();
            $attachment = Files::create([
                'name' => $originName,
                'path' => $path,
            ]);
            $model->files()->save($attachment);
        }
    }
    public function syncFiles($attachment_relations, $document)
    {
        $oldIds = $document->files()->pluck('id')->all();
        $newIds = [];
        foreach ($attachment_relations as $index => $file) {
            array_push($newIds, $file['id']);
        }
        $deleteIds = [];
        foreach ($oldIds as $oldId) {
            if (!in_array($oldId, $newIds)) {
                $deleteIds[] = $oldId;
            }
        }
        $paths = [];
        foreach ($deleteIds as $id) {
            $attachment = Files::where('id', $id)->first();
            if ($attachment != null) {
                array_push($paths, $attachment->path);
                $attachment->delete();
            }
        }
        foreach ($paths as $path) {
            Storage::disk('public')->delete($path);
        }
    }


}
