<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DisplayCard;
use Illuminate\Support\Facades\Storage;

class DisplayCardController extends ApiResourceController
{
    protected function setModel()
    {
        $this->model = new DisplayCard();
    }

    public function index(Request $request)
    {
        $this->_filter($request);
        return parent::index($request); // TODO: Change the autogenerated stub
    }

    public function show(Request $request, $id)
    {
        return parent::show($request, $id); // TODO: Change the autogenerated stub
    }

    public function store(Request $request)
    {
        $data = $request->only($this->model->getFillable());

        if ($request->hasFile('background_url')) {
            $file = $request->file('background_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['background_url'] = $img;
        }
        if ($request->hasFile('front_icon_url')) {
            $file = $request->file('front_icon_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['front_icon_url'] = $img;
        }
        if ($request->hasFile('end_icon_url')) {
            $file = $request->file('end_icon_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['end_icon_url'] = $img;
        }
        $result = $this->query->create($data);
        return $this->createResultResponse($result);
    }

    public function update(Request $request, $id)
    {
        $data = $request->only($this->model->getFillable());
        $item = $this->query->where('id', $id)->first();
        if (!$item) {
            return response()->json(['error' => 'Not found'], 404);
        }
        if ($request->hasFile('background_url')) {
            if ($item->background_url) {
                $delete = Storage::disk('public')->delete($item->flag_url);
            }
            $file = $request->file('background_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['background_url'] = $img;
        }
        if ($request->hasFile('front_icon_url')) {
            if ($item->front_icon_url) {
                $delete = Storage::disk('public')->delete($item->flag_url);
            }
            $file = $request->file('front_icon_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['front_icon_url'] = $img;
        }
        if ($request->hasFile('back_icon_url')) {
            if ($item->back_icon_url) {
                $delete = Storage::disk('public')->delete($item->flag_url);
            }
            $file = $request->file('back_icon_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['back_icon_url'] = $img;
        }
        if ($request->hasFile('sign_icon_url')) {
            if ($item->back_icon_url) {
                $delete = Storage::disk('public')->delete($item->flag_url);
            }
            $file = $request->file('sign_icon_url');
            $img = Storage::disk('public')->put('display_card', $file);
            $data['sign_icon_url'] = $img;
        }
        $item->fill($data);

        $result = $item->update();

        return $this->resultResponse($result);
    }

    public function destroy(Request $request, $id)
    {
        return parent::destroy($request, $id); // TODO: Change the autogenerated stub
    }

    private function _filter(Request $request)
    {

    }
}
