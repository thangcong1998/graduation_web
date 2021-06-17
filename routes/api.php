<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'Admin\UserController@authenticate')->name('login')->middleware('language');
Route::post('forgotPassword', 'Admin\UserController@forgotPassword')->middleware('language');
Route::get('changeLang', 'SettingController@changeLang');
Route::middleware(['auth:api', 'language'])->group(function () {
  Route::middleware(['auth:api'])->group(function () {
    Route::namespace('Admin')->group(function () {
      Route::post('changePassword', 'UserController@changePassword');
      Route::get('permissions', 'UserController@getPermissions')->name('getPermissions');
      Route::get('me', 'UserController@getInfo')->name('getInfo');
    });
  });
});

Route::namespace('Admin')->prefix('admin')->group(function () {
  Route::post('imageVenue', 'VenueController@UploadFile');
  Route::apiResources([
    'displaySetting' => 'DisplaySettingController'
  ]);
  Route::middleware(['auth:api', 'language'])->group(function () {
    Route::apiResources([
      'user' => 'UserController',
      'country' => 'CountryController',
      'organization' => 'OrganizationController',
      'cardTemplate' => 'CardTemplateController',
      'area' => 'AreaController',
      'zone' => 'ZoneController',
      'vehicle' => 'VehicleController',
      'function' => 'FunctionController',
      'sport' => 'SportController',
      'sportDiscipline' => 'SportDisciplineController',
      'sportDisciplineEvent' => 'SportDisciplineEventController',
      'display_setting' => 'DisplaySettingController',
      'displayCard' => 'DisplayCardController',
      'team' => 'TeamController',
      'participant' => 'ParticipantController',
      'record' => 'RecordController',
      'teamEvent' => 'EventTeamController',
      'venue' => 'CompetitorVenueController',
      'venueCreate' => 'VenueController',
      'regions' => 'RegionController',
      'referee' => 'RefereeController',
      'functions_referee' => 'FunctionsRefereeController',
      'setting' => 'SettingController',
      'audit' => 'AuditController',
      'foul' => 'FoulController',
      'congressRecord' => 'CongressRecordController',
      'recordParticipant' => 'RecordParticipantController',
      'competition_individual' => 'CompetitorIndividualController',
      'stage' => "StageController",
      'event_group' => "EventGroupController",
      'match' => "MatchController",
      'sync_data_setting' => 'AuditSyncDataSettingController',
      'match_round' => 'MatchRoundController',
      'match_individual_competitor' => 'MatchIndividualCompetitorController',
      'match_event_team' => 'MatchEventTeamController',
      'position_event_field' => 'PositionEventFieldController',
      'match_individual_competitor' => 'MatchIndividualCompetitorController',
      'competitor_venue_event_field' => 'CompetitorVenueEventFieldController',
      'competitor_venue_event_relation' => 'CompetitorVenueEventRelationController',
      'medalTable' => 'MedalTableController',
      'progressMatch' => 'ProgressOfMatchController'
    ]);

    //------------role ----------------------------------
    Route::apiResource('role', 'RoleController');
    Route::get('all-permissions', 'RoleController@getAllPermissions');
    Route::get('exportMember', 'ParticipantController@exportData');
    Route::get('countPersonalInfo', 'ParticipantController@countPersonalInfo')->name('countPersonalInfo');
    Route::get('bulkDecided/personalInfo', 'ParticipantController@bulkDecided');
    Route::post('bulkDelete/personalInfo', 'ParticipantController@bulkDelete');
    Route::get('reportPersonalInfo', 'ParticipantController@report');
    Route::get('bulkPrinted/personalInfo', 'ParticipantController@bulkPrinted');
    Route::get('bulkReceived/personalInfo', 'ParticipantController@bulkReceived');
    Route::put('approvePersonal/{id}', 'ParticipantController@approvePersonal');
    Route::get('bulkInActive/personalInfo', 'ParticipantController@bulkInActive');
    Route::get('reIssue/personalInfo', 'ParticipantController@reIssue');
    Route::get('generateMemberCard/{id}', 'ParticipantController@generateCard');
    Route::get('downloadCard/{id}', 'ParticipantController@downloadCard');
    Route::get('downloadFileScan/{id}', 'ParticipantController@downdLoadFileScan');
    Route::get('downloadDoping/{id}', 'ParticipantController@downloadDoping');
    Route::post('downloadCards', 'ParticipantController@MergerPersonalCard');
    Route::get('exportCountry', 'CountryController@exportData');
    Route::post('deleteListCountry', 'CountryController@deleteList');
    Route::get('exportOrganization', 'OrganizationController@exportData');
    Route::get('exportFunction', 'FunctionController@exportData');
    Route::get('exportCardTemplate', 'CardTemplateController@exportData');
    Route::post('deleteListCardTemplate', 'CardTemplateController@deleteList');
    Route::post('downloadForm/{name}', 'ParticipantController@downloadForm');
    Route::get('exportRecord', 'RecordController@exportData');
    Route::post('deleteListRecord', 'RecordController@deleteList');
    Route::get('exportReferee', 'RefereeController@exportData');
    Route::get('exportListAthletesTeam', 'EventTeamController@exportData');
    Route::get('exportListAthletes', 'CompetitorIndividualController@exportData');
    Route::post('bulkDelete/Referee', 'RefereeController@bulkDelete');
    Route::post('bulkDelete/functionReferee', 'FunctionsRefereeController@bulkDelete');
    Route::get('exportFunctionReferee', 'FunctionsRefereeController@exportData');
    Route::get('exportFoul', 'FoulController@exportData');
    Route::post('deleteListFoul', 'FoulController@deleteList');
    Route::get('exportCongressRecord', 'CongressRecordController@exportData');
    Route::post('deleteListCongressRecord', 'CongressRecordController@deleteList');
    Route::post('registerTeamEvent', 'EventTeamController@registerTeamEvent');
    Route::post('bulkDelete/listAthletes', 'CompetitorIndividualController@bulkDelete');
    Route::post('bulkDelete/listAthletesTeam', 'EventTeamController@bulkDelete');
    Route::get('exportUser', 'UserController@exportData');
    Route::get('exportTeam', 'TeamController@exportData');
    Route::get('exportRecordParticipant', 'RecordParticipantController@exportData');
    Route::post('matchReferee', 'MatchController@storeReferee');
    Route::get('exportRegion', 'RegionController@exportData');
    Route::post('score_1_vs_n', 'MatchRoundController@Score1vsN');
    Route::post('score_1_vs_n_no_round', 'MatchRoundController@Score1vsNNoRound');
    Route::post('record_1_vs_n', 'MatchRoundController@Record1vsN');
    Route::post('record_1_vs_n_no_round', 'MatchRoundController@Record1vsNNoRound');
    Route::post('target_record_1_vs_n', 'MatchRoundController@TargetRecord1vsN');
    Route::post('lineCompetitor', 'PositionEventFieldController@storeLine');
    Route::get('exportStage', 'StageController@exportData');
    Route::post('bulkDelete/role', 'RoleController@bulkDelete');

    //---- Sync data setting -------
    Route::apiResource('syncDataSetting', 'SyncDataController');
    Route::post('syncData', 'SyncDataController@syncData');

    //----- Data Sync----
    Route::post('syncDataParticipant', 'SyncDataController@syncDataParticipant');

    // entry by name
    Route::post('dataSyncSport', 'SportController@dataSync');
    Route::post('syncCardTemplate', 'CardTemplateController@syncData');
    Route::post('syncOrganization', 'OrganizationController@syncData');
    Route::post('syncFunction', 'FunctionController@syncData');
    Route::post('syncTeam', 'TeamController@syncData');
    Route::get('syncCountry', 'CountryController@syncData');
    Route::get('roleGroupName', 'RoleController@GetNameRoleGroup');
    //------------------

    //get Data
    Route::get('getSport', 'SportController@getSport');

    //stage group update
    Route::put('stageGroup/{id}', 'StageController@updateGroup');

    // Matches
    //rank table
    Route::get('rankTable/{id}', 'StageController@getRankTable');
    Route::get('stageRankTable', 'StageController@getStageRankTable');
    Route::post('noneStageEventAdward', 'StageController@noneStageEventAdward');
    //set qualified for stage group
    Route::post('qualifiedTableStage/{id}', 'StageController@qualifiedTableStage');

    Route::post('matches1vs1', 'MatchController@storeMatch1vs1');
    Route::post('matches1vs1Set', 'MatchController@storeMatch1vs1Set');
    Route::post('updateMatches1vs1', 'MatchController@updateMatch1vs1');
    Route::post('updateMatches1vs1Set', 'MatchController@updateMatch1vs1Set');

    Route::get('medalRankings', 'StageQualificationCompetitorController@medalRankings');
    Route::post('progressOfMatch', 'ProgressOfMatchController@store');
    Route::post('deleteProgressMatch', 'ProgressOfMatchController@deleteBulk');
    Route::get('all_match', "MatchController@all_match");
    Route::post('updateStatistic1vs1', 'MatchController@updateStatistic1vs1');
    Route::post('updateStatistic1vsN', 'MatchController@updateStatistic1vsN');
    Route::post('update1vs1NoRound', 'MatchController@update1vs1NoRound');
    Route::post('update1vs1koNoRound', 'MatchController@update1vs1koNoRound');
    Route::post('export_report_docx', 'ReportController@Report');
  });
});

Route::namespace('Admin')->group(function () {
  Route::get('syncToVrs', 'SyncVRSController@syncToVrs');
  Route::get('syncMatchToVrs', 'SyncVRSController@syncMatchToVrs');
});
