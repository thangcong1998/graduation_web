<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\Controller;
use App\Http\Requests\ParticipantCreateRequest;
use App\Http\Requests\ParticipantUpdateRequest;
use App\Jobs\PersonalCardJob;
use App\Models\Area;
use App\Models\Card;
use App\Models\CardTemplate;
use App\Models\DisplayCard;
use App\Models\Functions;
use App\Models\Participant;
use App\Models\Team;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Zone;
use App\Repositories\PersonalCardRepositoryRepository;
use Barryvdh\DomPDF\Facade as PDF;
use Dompdf\Options;
use iio\libmergepdf\Merger;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Exception;
use App\Exports\DataExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\App;
use App\Helpers\SyncDataSeagameGms;


class ParticipantController extends ApiResourceController
{
    //
    private $personalCard;

    public function __construct(PersonalCardRepositoryRepository $personalCard)
    {
        parent::__construct();
        $this->personalCard = $personalCard;
        //
        $this->middleware('auth');
        $this->middleware(function ($request, $next) {
            $user = Auth::user();
            Log::info($user);

            return $next($request);
        });
    }

    protected function setModel()
    {
        $this->model = new Participant();
    }

    public function store(ParticipantCreateRequest $request)
    {
        $data = $request->only($this->model->getFillable());
        $data['approval_status'] = 2;
        DB::beginTransaction();
        try {
            if ($request->hasFile('profile_url')) {
                $data['profile_url'] = Storage::disk('public')->put('personal_info/profile', $request->file('profile_url'));
            }
            if ($request->hasFile('personal_id_card')) {
                $data['personal_id_card_url'] = Storage::disk('public')->put('personal_info/id_card', $request->file('personal_id_card'));
            }
            $active_at = Carbon::now()->toDateString();
            $user = Auth::user();
            Log::info($user);
            $card = Card::create([
                'is_active' => Card::is_active['in_active'],
                'ref_type' => 'App\\Models\\Participants',
                // 'active_at' => $active_at,
                // 'user_id' => $user->id
            ]);
            $card_no = '3'
                . str_pad($data['team_id'], 3, '0', STR_PAD_LEFT)
                . str_pad($card->id, 6, '0', STR_PAD_LEFT);
            $card->update(['card_no' => $card_no]);
            $data['card_no'] = $card_no;
            $data['accreditation_number'] = $card_no;
            $data['height'] = (int)$data['height'];
            $data['weight'] = (int)$data['weight'];
            $result = $this->query->create($data);
            $card->update(['ref_id' => $result->id]);

            // PersonalCardJob::dispatch($result->id);

            DB::commit();
            return $this->sendResponse($result);
        } catch (Exception $e) {
            throw $e;
            return $this->errorResponseSystem();
        }
    }

    public function update(ParticipantUpdateRequest $request, $id)
    {
        $item = $this->query->find($id);
        $data = $request->only($this->model->getFillable());
        $item->approval_status == Participant::status['rejected'] && $data['approval_status'] = 2;
        DB::beginTransaction();
        try {
            if ($request->hasFile('profile_url')) {
                $data['profile_url'] = Storage::disk('public')->put('personal_info/profile', $request->file('profile_url'));
            }
            if ($request->hasFile('personal_id_card')) {
                $data['personal_id_card_url'] = Storage::disk('public')->put('personal_info/id_card', $request->file('personal_id_card'));
            }
            if (
                $item->approval_status != Participant::status['approved'] && $data['approval_status'] ==
                Participant::status['approved']
            ) {
                if ($item->card_no == null) {
                    // $active_at = Carbon::now()->toDateString();
                    // $user = Auth::user();
                    $card = Card::create([
                        'is_active' => Card::is_active['in_active'],
                        'ref_type' => 'App\\Models\\Participants',
                        'ref_id' => $item->id,
                        // 'active_at' => $active_at,
                        // 'user_id' => $user->id
                    ]);
                    $card_no = '3'
                        . str_pad($data['team_id'], 3, '0', STR_PAD_LEFT)
                        . str_pad($card->id, 6, '0', STR_PAD_LEFT);
                    $card->update(['card_no' => $card_no]);
                    $data['card_no'] = $card_no;
                }
                if (!$item->accreditation_number) {
                    if ($item->card_no) {
                        $data['accreditation_number'] = $item->card_no;
                    } else {
                        $data['accreditation_number'] = $card_no;
                    }
                }
            }
            $data['height'] = (int)$data['height'];
            $data['weight'] = (int)$data['weight'];
            $item->fill($data);
            $result = $item->update();
            DB::commit();
            // if ($request->render) {
            //     PersonalCardJob::dispatchNow($id);
            // } else {
            //     if ($data['approval_status'] == 2) {
            //         PersonalCardJob::dispatch($id);
            //     }
            // }
            return $this->resultResponse($result);
        } catch (Exception $e) {
            throw $e;
            return $this->errorResponseSystem();
        }
    }

    protected function countPersonalInfo(Request $request)
    {
        $wait = Participant::query()->where('approval_status', Participant::status['processing'])->count();
        $approved = Participant::query()->where('approval_status', Participant::status['approved'])->count();
        $rejected = Participant::query()->where('approval_status', Participant::status['rejected'])->count();

        return response()->json([
            'processing' => $wait,
            'approved' => $approved,
            'rejected' => $rejected
        ], 200);
    }

    public function downdLoadFileScan(Request $request, $id)
    {
        try {
            $personalInfo = $this->query->find($id);
            $file_pdf = Storage::disk('public')->get($personalInfo['file_scan']);
            if ($file_pdf) {
                return response($file_pdf)->header('Content-type', 'application/pdf');
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }
    public function downloadApplication(Request $request, $id)
    {
        try {
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
                    <span>' . $mo->abbreviation . ' - ' . $mo->english_name . ' </span>
                </p>';
                $organization = $organization . $template;
                $test = $template . $template;
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

            Storage::put('public/TemplatePDF/' . $cardTemplate->name . '.pdf', $output);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function downloadCard(Request $request, $id)
    {
        try {
            $personalInfo = $this->query->find($id);
            $pdf = Storage::disk('public')->get($personalInfo['personal_card']);
            return response($pdf)->header('Content-type', 'application/pdf');
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function MergerPersonalCard(Request $request)
    {
        try {
            $ids = $request->ids;
            $personalInfos = $this->query->whereIn('id', $ids)->get();
            $merger = new Merger;
            foreach ($personalInfos as $pi) {
                if ($pi->approval_status == Participant::status['approved']) {
                    $merger->addFile(base_path('storage/app/public/' . $pi['personal_card']));
                }
            }
            $createdPdf = $merger->merge();
            return response($createdPdf)->header('Content-type', 'application/pdf');
        } catch (\Exception $e) {
            throw $e;
        }
    }

    protected function bulkDecided(Request $request)
    {
        $data = $request->only($this->model->getFillable());
        DB::beginTransaction();
        try {
            $ids = $request->ids;

            foreach ($ids as $id) {
                $item = Participant::query()->where('id', $id)->first();
                $card_no = $item->card_no;
                if ($item->approval_status != Participant::status['approved']) {
                    if (
                        $item->card_no == null   && $request->approval_status ==
                        Participant::status['approved']
                    ) {
                        //                        $active_at = Carbon::now()->toDateString();
                        //                        $user = Auth::user();
                        $card = Card::create([
                            'is_active' => Card::is_active['in_active'],
                            'ref_type' => 'App\\Models\\Participants',
                            'ref_id' => $item->id,
                            // 'active_at' => $active_at,
                            // 'user_id' => $user->id
                        ]);
                        $card_no = '3'
                            . str_pad($item->team['team_id'], 3, '0', STR_PAD_LEFT)
                            . str_pad($card->id, 6, '0', STR_PAD_LEFT);
                        $card->update(['card_no' => $card_no]);
                        $data['card_no'] = $card_no;
                    }
                }
                $item->update([
                    'approval_status' => $request->approval_status,
                    'card_no' => $card_no,
                    'accreditation_number' => $card_no
                ]);
                if ($request->approval_status == Participant::status['approved']) {
                    PersonalCardJob::dispatch($id);
                }
            }
            DB::commit();
            return $this->resultResponse($item);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errorResponseSystem();
        }
    }

    protected function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = json_decode($request->ids, true);
            foreach ($ids as $id) {
                $personal = Participant::query()->where('id', $id)->first();
                $card = Card::query()->where('card_no', $personal['card_no'])->first();
                if ($card) {
                    $card->update([
                        'is_active' => Card::is_active['in_active']
                    ]);
                }
                $personal->forceDelete();
            }
            DB::commit();
            return $this->deleteResultResponse($personal);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponseSystem();
        }
    }

    public function addFilter($request)
    {
        if ($request->event_id) {
            $this->query->whereDoesntHave('sportDisciplineEvents', function ($q) use ($request) {
                $q->where('event_id', $request->event_id);
            });
        }
        $this->query->with(['cardTemplate', 'organization', 'function', 'sport', 'team', 'sportDisciplineEvents']);
    }

    public function addAppend()
    {
        $this->query->with([
            'cardTemplate', 'organization', 'function.area_relation', 'function.zone_relation',
            'function.vehicle_relation', 'team', 'countryOfBirth', 'nationality', 'sport', 'sport.sportDisciplines',
            'sportDiscipline'
        ]);
    }

    public function report()
    {
        $total = Participant::query()->where('approval_status', '=', Participant::status["approved"])->get();
        $notReceive = Participant::query()->where('received_status', '=', Participant::received_status["not_received"])->get();
        $notPrint = Participant::query()->where('printed_status', '=', Participant::printed_status["not_printed_yet"])->get();
        $received = Participant::query()->where('received_status', '=', Participant::received_status["received"])->get();
        $printed = Participant::query()->where('printed_status', '=', Participant::printed_status["printed"])->get();
        return response()->json(
            [
                'total' => count($total),
                'notReceive' => count($notReceive),
                'notPrint' => count($notPrint),
                'received' => count($received),
                'printed' => count($printed)
            ]
        );
    }

    public function exportData(Request $request)
    {
        $id = json_decode($request->ids);
        $header = [];
        $fields = [];
        $columns = json_decode($request->columns, true);
        foreach ($columns as $column) {
            $fields[] = $column['field'];
            $header[] = $column['title'];
        }
        $data = [];

        if ($request->doping) {
            $member = $this->query->where('doping_url', '=', null)->whereIn('id', $id)->with(['cardTemplate', 'organization', 'function', 'card'])->get();
        } else {
            $member = $this->query->whereIn('id', $id)->with(['cardTemplate', 'organization', 'function'])->get();
        }
        foreach ($member as $key => $value) {
            foreach ($fields as $field) {
                $data[$key][$field] = $value[$field];
                if ($field == 'is_active') {
                    $data[$key]['is_active'] = $value['card']['is_active'];
                }
                if ($field === 'active_at') {
                    if ($value['card']['active_at']) {
                        $data[$key]['active_at'] = Carbon::parse($value['card']['active_at'])->format("d-m-yy");
                    }
                }
                if ($field == 'user_id') {
                    $data[$key]['user_id'] = $value['card']['user_id'];
                }
                if ($field == 'doping_registered') {
                    $data[$key]['doping_registered'] = $value['doping_url'] ?
                        Lang::get('constants.doping.registered') : Lang::get('constants.doping.no');
                }
                if ($field == 'card_template') {
                    $data[$key]['card_template'] = $value['cardTemplate']['name'];
                }
            }
            if (isset($data[$key]['sex']) && $data[$key]['sex'] == 1) {
                $sex = Lang::get('constants.sex.female');
            }
            if (isset($data[$key]['sex']) && $data[$key]['sex'] == 2) {
                $sex = Lang::get('constants.sex.male');
            }
            if (isset($data[$key]['approval_status']) && $data[$key]['approval_status'] == Participant::status['processing']) {
                $approval_status = Lang::get('constants.approval_status.processing');
            }
            if (isset($data[$key]['approval_status']) && $data[$key]['approval_status'] == Participant::status['approved']) {
                $approval_status = Lang::get('constants.approval_status.approved');
            }
            if (isset($data[$key]['approval_status']) && $data[$key]['approval_status'] == Participant::status['rejected']) {
                $approval_status = Lang::get('constants.approval_status.rejected');
            }
            if (
                isset($data[$key]['printed_status']) &&
                $data[$key]['printed_status'] == Participant::printed_status['not_printed_yet']
            ) {
                $printed_status = Lang::get('constants.printed_status.not_printed_yet');
            }
            if (
                isset($data[$key]['printed_status']) &&
                $data[$key]['printed_status'] == Participant::printed_status['printed']
            ) {
                $printed_status = Lang::get('constants.printed_status.printed');
            }
            if (
                isset($data[$key]['received_status']) &&
                $data[$key]['received_status'] == Participant::received_status['not_received']
            ) {
                $received_status = Lang::get('constants.received_status.not_received');
            }
            if (
                isset($data[$key]['received_status']) &&
                $data[$key]['received_status'] == Participant::received_status['received']
            ) {
                $received_status = Lang::get('constants.received_status.received');
            }
            if (
                isset($data[$key]['is_active']) &&
                $data[$key]['is_active'] == Card::is_active['in_active']
            ) {
                $is_active = Lang::get('constants.is_active.in_active');
            }
            if (
                isset($data[$key]['is_active']) &&
                $data[$key]['is_active'] == Card::is_active['active']
            ) {
                $is_active = Lang::get('constants.is_active.active');
            }
            isset($data[$key]['sex']) && $data[$key]['sex'] = $sex;

            if (App::getLocale() == "vi") {
                $data[$key]['function'] = $value['function']['name'];
                isset($data[$key]['organization']) && $data[$key]['organization'] = $value['organization']['name'];
                isset($data[$key]['team']) && $data[$key]['team'] = $value['team']['name'];
            }
            if (App::getLocale() == "en") {
                $data[$key]['function'] = $value['function']['english_name'];
                isset($data[$key]['organization']) && $data[$key]['organization'] = $value['organization']['english_name'];
                isset($data[$key]['team']) && $data[$key]['team'] = $value['team']['english_name'];
            }
            isset($data[$key]['approval_status']) && $data[$key]['approval_status'] = $approval_status;
            isset($data[$key]['printed_status']) && $data[$key]['printed_status'] = $printed_status;
            isset($data[$key]['received_status']) && $data[$key]['received_status'] = $received_status;
            isset($data[$key]['is_active']) && $data[$key]['is_active'] = $is_active;
            isset($data[$key]['user_id']) && $data[$key]['user_id'] = $value['card']['user']['name'];
        }
        return Excel::download(new DataExport($id, $header, $data), 'Member.xlsx');
    }

    protected function bulkPrinted(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->ids;
            foreach ($ids as $id) {
                $result = Participant::query()->where('id', $id)->first();
                $result->update([
                    'printed_status' => $request->printed_status
                ]);
            }
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errorResponseSystem();
        }
    }

    protected function bulkReceived(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->ids;
            foreach ($ids as $id) {
                $result = Participant::query()->where('id', $id)->first();
                $result->update([
                    'printed_status' => Participant::printed_status['printed'],
                    'received_status' => $request->received_status
                ]);
            }
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errorResponseSystem();
        }
    }

    protected function bulkInActive(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->ids;
            foreach ($ids as $id) {
                $result = Participant::query()->where('id', $id)->first();
                $card = Card::query()->where('card_no', $result['card_no'])->first();
                $card->update([
                    'is_active' => Card::is_active['in_active']
                ]);
            }
            DB::commit();
            return $this->resultResponse($result);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errorResponseSystem();
        }
    }

    protected function reIssue(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->ids;
            foreach ($ids as $id) {
                //get old personal info
                $personalInfo = Participant::query()->where('id', $id)->first();
                $oldCardNo = $personalInfo['card_no'];
                // update card to in active
                $card = Card::query()->where('card_no', $oldCardNo)->first();
                if ($card) {
                    $card->update([
                        'is_active' => Card::is_active['in_active']
                    ]);
                }

                $active_at = Carbon::now()->toDateString();
                $user = Auth::user();
                $cardData = Card::create([
                    'is_active' => Card::is_active['active'],
                    'ref_type' => 'App\\Models\\Participants',
                    'ref_id' => $personalInfo->id,
                    'active_at' => $active_at,
                    'user_id' => $user->id
                ]);
                $card_no = '3'
                    . str_pad($personalInfo['team_id'], 3, '0', STR_PAD_LEFT)
                    . str_pad($cardData->id, 6, '0', STR_PAD_LEFT);
                $cardData->update(['card_no' => $card_no]);
                if ($request->reprint) {
                    $personalInfo->update([
                        'card_no' => $card_no,
                        'reprint' => 0,
                    ]);
                } else {
                    $personalInfo->update(['card_no' => $card_no]);
                }
                PersonalCardJob::dispatch($id);
            }
            DB::commit();
            return $this->resultResponse($personalInfo);
        } catch (\Exception $e) {
            DB::rollBack();
            throw  $e;
            $this->errorResponseSystem();
        }
    }

    public function destroy(Request $request, $id)
    {
        $personalInfo = Participant::query()->where('id', $id)->first();
        $card = Card::query()->where('card_no', $personalInfo['card_no'])->first();
        if ($card) {
            $card->update([
                'is_active' => Card::is_active['in_active'],
            ]);
        }
        $personalInfo->forceDelete();
        return $this->deleteResultResponse($personalInfo);
    }

    public function generateCard(Request $request, $id)
    {
        $person = Participant::query()->with(['organization', 'function', 'team', 'nationality'])->find($id);
        $card_display = DisplayCard::query()->first();
        $card_template = CardTemplate::query()->find($person->card_template_id);
        $function = Functions::query()->with(['area_relation', 'zone_relation', 'vehicle_relation'])->find($person->function_id);
        $all_areas = Area::query()->get();
        $all_vehicle = Vehicle::query()->get();
        $all_zones = Zone::query()->get();
        $gender = '';
        if ($person->sex == Participant::gender['female']) {
            $gender = "Female";
        }
        if ($person->sex == Participant::gender['male']) {
            $gender = "Male";
        }
        try {
            $data = [
                "card_display" => $card_display,
                "card_info" => $person,
                "gender" => $gender,
                "card_template" => $card_template,
                "card_organization" => $person->organization(),
                "card_function" => $person['function'],
                "nationality" => $person['nationality'],
                "profile_url" => $person->profile_url,
                "barcode" => $person->card_no,
                "areas" => $function['area_relation'],
                "zones" => $function['zone_relation'],
                'vehicles' => $function['vehicle_relation'],
                'team' => $person['team'],
                'all_areas' => $all_areas,
                'all_vehicle' => $all_vehicle,
                'all_zones' => $all_zones
            ];
            $pdf = PDF::loadView('card.card', $data);
            $output = $pdf->output();
            $path = 'personal_info/card/' . $person->card_no . '.pdf';
            Storage::disk('public')->put($path, $output);
            if (!$person->personal_card) {
                $person->update(['personal_card' => $path]);
            }
            return $this->renderResponse(1);
        } catch (\Exception $e) {
            throw $e;
        }
    }
    public function downloadDoping(Request $request, $id)
    {
        try {
            $personalInfo = $this->query->find($id);
            $file_pdf = Storage::disk('public')->get($personalInfo['doping_url']);
            if ($file_pdf) {
                return response($file_pdf)->header('Content-type', 'application/pdf');
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function approvePersonal(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $item = Participant::query()->where("id", $id)->first();
            if ($request->approval_status == Participant::status['approved']) {
                $data['approval_status'] = Participant::status['approved'];
                if (
                    $item->approval_status != Participant::status['approved'] && $data['approval_status'] ==
                    Participant::status['approved']
                ) {
                    if ($item->card_no == null) {
                        // $active_at = Carbon::now()->toDateString();
                        // $user = Auth::user();
                        $card = Card::create([
                            'is_active' => Card::is_active['in_active'],
                            'ref_type' => 'App\\Models\\Participants',
                            'ref_id' => $item->id,
                            // 'active_at' => $active_at,
                            // 'user_id' => $user->id
                        ]);
                        $card_no = '3'
                            . str_pad($item->team_id, 3, '0', STR_PAD_LEFT)
                            . str_pad($card->id, 6, '0', STR_PAD_LEFT);
                        $card->update(['card_no' => $card_no]);
                        $data['card_no'] = $card_no;
                    }
                    if (!$item->accreditation_number) {
                        if ($item->card_no) {
                            $data['accreditation_number'] = $item->card_no;
                        } else {
                            $data['accreditation_number'] = $card_no;
                        }
                    }
                }
                $item->update($data);
            } else {
                $item->update([
                    "approval_status" => $request->approval_status,
                ]);
            }
            DB::commit();
            PersonalCardJob::dispatch($id);
            return $this->resultResponse($item);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function exportFamilyList(Request $request)
    {
        try {
            $this->query->with('nationality');
            $list = $this->query->where('team_id', $request->team_id)->where(
                'card_template_id',
                $request->card_template_id
            )->get();
            $card_display = DisplayCard::query()->first();
            $card_template = CardTemplate::query()->where('id', $request->card_template_id)->first();
            $data = [
                'list' => $list,
                'card_display' => $card_display,
                'card_template' => $card_template
            ];
            $pdf = PDF::loadView('pdf_form.family_list', $data)->setPaper('a4', 'landscape');
            $output = $pdf->output();
            //            Storage::disk('public')->put('family_list/123.pdf', $output);
            return $output;
        } catch (\Exception $e) {
            throw $e;
        }
    }
    public static function downloadForm(Request $request, $name)
    {
        return Storage::download("public/TemplatePDF/" . $name . '.pdf');
    }
}
