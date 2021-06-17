<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\Controller;
use App\Models\DisplaySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use PHPUnit\Exception;


class DisplaySettingController extends ApiResourceController
{
    //
    protected function setModel()
    {
        // TODO: Implement setModel() method.
        $this->model = new DisplaySetting();
    }
    public function index(Request $request)
    {
        $data = $this->query->with(['files'])->first();

        return $data;
    }

    public function addAppend()
    {
        $this->query->with('files');
    }

    public function store(Request $request)
    {
        $data = $request->only($this->model->getFillable());

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $img = Storage::disk('public')->put('setting', $file);
            $data['image_url'] = $img;
        }
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $logo = Storage::disk('public')->put('setting', $file);
            $data['logo_url'] = $logo;
        }
        $result = $this->query->create($data);
        return $this->createResultResponse($result);
    }

    public function update(Request $request, $id)
    {
        if ($id == 'undefined') {
            $this->store($request);
        } else {
            $data = $request->only($this->model->getFillable());
            $item = $this->query->where('id', $id)->first();
            if (!$item) {
                return response()->json(['error' => 'Not found'], 404);
            }
            if ($request->hasFile('logo')) {
                if ($item->logo_url) {
                    $delete = Storage::disk('public')->delete($item->logo_url);
                }
                $file = $request->file('logo');
                $logo = Storage::disk('public')->put('setting', $file);
                $data['logo_url'] = $logo;
            }
            DB::beginTransaction();
            try {
                $item->fill($data);
                $item->update();
                if ($request->has('oldFiles')) {
                    $oldFiles = json_decode($request->oldFiles, true);
                    // $this->syncFiles($oldFiles, $item);
                }
                if ($request->has('files')) {
                    $files = $request->file();
                    $this->upload($files, $item, "setting");
                }
                DB::commit();
                return $this->resultResponse($item);
            } catch (Exception $e) {
                DB::rollBack();
                return response()->json(['data' => 'err']);
            }

            return $this->resultResponse($item);
        }
    }
}
