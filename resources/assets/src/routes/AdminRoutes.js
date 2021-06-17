import { lazy } from "react";
import { useTranslation } from "react-i18next";
import SplitGrooupsScore from "../containers/Admin/Stages/CompetitionType/SplitGroupsScore";
import SyncSetting from "../containers/Admin/SyncSetting/SyncSetting";

const Index = lazy(() => import("../containers/Admin/index"));
const AreaList = lazy(() =>
  import("../containers/Admin/Category/Area/AreaList")
);
const AreaForm = lazy(() =>
  import("../containers/Admin/Category/Area/AreaForm")
);
const ZoneList = lazy(() =>
  import("../containers/Admin/Category/Zone/ZoneList")
);
const ZoneForm = lazy(() =>
  import("../containers/Admin/Category/Zone/ZoneForm")
);
const VehicleList = lazy(() =>
  import("../containers/Admin/Category/Vehicle/VehicleList")
);
const VehicleForm = lazy(() =>
  import("../containers/Admin/Category/Vehicle/VehicleForm")
);
const CountryList = lazy(() =>
  import("../containers/Admin/Category/Country/CountryList")
);
const CountryForm = lazy(() =>
  import("../containers/Admin/Category/Country/CountryForm")
);
const OrganizationList = lazy(() =>
  import("../containers/Admin/Category/Organization/OrganizationList")
);
const OrganizationForm = lazy(() =>
  import("../containers/Admin/Category/Organization/OrganizationForm")
);
const CardTemplateList = lazy(() =>
  import("../containers/Admin/Category/CardTemplate/CardTemplateList")
);
const CardTemplateForm = lazy(() =>
  import("../containers/Admin/Category/CardTemplate/CardTemplateForm")
);
const FunctionList = lazy(() =>
  import("../containers/Admin/Category/Function/FunctionList")
);
const FunctionForm = lazy(() =>
  import("../containers/Admin/Category/Function/FunctionForm")
);
const RegionList = lazy(() =>
  import("../containers/Admin/Category/Region/RegionList")
);
const RegionForm = lazy(() =>
  import("../containers/Admin/Category/Region/RegionForm")
);
const UserList = lazy(() => import("../containers/Admin/User/UserList"));
const UserForm = lazy(() => import("../containers/Admin/User/UserForm"));

const SportList = lazy(() => import("../containers/Admin/Sport/SportList"));
const TeamList = lazy(() => import("../containers/Admin/Team/TeamList"));
const TeamForm = lazy(() => import("../containers/Admin/Team/TeamForm"));
const RegistrationList = lazy(() =>
  import("../containers/Admin/RegistrationApplication/RegistrationList")
);
const RegistrationForm = lazy(() =>
  import("../containers/Admin/RegistrationApplication/RegistrationForm")
);
const RegistrationFormOffice = lazy(() =>
  import("../containers/Admin/RegistrationApplication/RegistrationFormOffice")
);
const ImportMember = lazy(() =>
  import("../containers/Admin/RegistrationApplication/ImportMember")
);
const RecordList = lazy(() => import("../containers/Admin/Record/RecordList"));
const RecordForm = lazy(() => import("../containers/Admin/Record/RecordForm"));
const TeamEventList = lazy(() =>
  import("../containers/Admin/TeamEvent/TeamEventList")
);
const TeamEventForm = lazy(() =>
  import("../containers/Admin/TeamEvent/TeamEventForm")
);
const VenueList = lazy(() => import("../containers/Admin/Venue/VenueList"));

const VenueForm = lazy(() => import("../containers/Admin/Venue/VenueForm"));
const FoulList = lazy(() =>
  import("../containers/Admin/Category/Foul/FoulList")
);

const FoulForm = lazy(() =>
  import("../containers/Admin/Category/Foul/FoulForm")
);
const VenueDetail = lazy(() => import("../containers/Admin/Venue/VenueDetail"));
const RefereeList = lazy(() =>
  import("../containers/Admin/Referee/RefereeList")
);
const RefereeForm = lazy(() =>
  import("../containers/Admin/Referee/RefereeForm")
);
const RoleList = lazy(() => import("../containers/Admin/Role/RoleList"));
const RoleForm = lazy(() => import("../containers/Admin/Role/RoleForm"));
const FunctionRefereeForm = lazy(() =>
  import("../containers/Admin/FuncitonReferee/FunctionRefereeForm")
);
const FunctionRefereeList = lazy(() =>
  import("../containers/Admin/FuncitonReferee/FunctionRefereeList")
);
const Setting = lazy(() => import("../containers/Admin/Setting/Setting"));
const AuditList = lazy(() => import("../containers/Admin/Audit/AuditList"));
const CongressRecordList = lazy(() =>
  import("../containers/Admin/CongressRecord/CongressRecordList")
);
const CongressRecordForm = lazy(() =>
  import("../containers/Admin/CongressRecord/CongressRecordForm")
);
const ListAthletes = lazy(() =>
  import("../containers/Admin/ListAthletes/ListAthletes")
);
const ListAthletesTeam = lazy(() =>
  import("../containers/Admin/ListAthletesTeam/ListAthletesTeam")
);
const ListAthletesForm = lazy(() =>
  import("../containers/Admin/ListAthletes/ListAthletesForm")
);
const ListAthletesTeamForm = lazy(() =>
  import("../containers/Admin/ListAthletesTeam/ListAthletesTeamForm")
);
const StageList = lazy(() =>
  import("../containers/Admin/Math/Stages/StageList")
);
const AuditSyncDataList = lazy(() =>
  import("../containers/Admin/AuditSyncData/AuditList")
);
const DisplaySetting = lazy(() =>
  import("../containers/Admin/DisplaySetting/DisplaySetting")
);
const StagesForm = lazy(() => import("../containers/Admin/Stages/StagesForm"));
const MatchSchedule = lazy(() =>
  import("../containers/Admin/MatchView/MatchSchedule")
);
const MatchDetail = lazy(() =>
  import("../containers/Admin/MatchView/MatchDetail")
);
const MatchResultList = lazy(() =>
  import("../containers/Admin/MatchResult/MatchResultList")
);
const MatchResultForm = lazy(() =>
  import("../containers/Admin/MatchResult/MatchResultForm")
);
const StagesEdit = lazy(() => import("../containers/Admin/Stages/StagesEdit"));
const VenueTabForm = lazy(() =>
  import("../containers/Admin/Venue/VenueTabForm")
);
const sportDisciplineEventForm = lazy(() =>
  import("../containers/Admin/Sport/SportDisciplineEventForm")
);
const ScheduleCompetition = lazy(() =>
  import("../containers/Admin/SportDisciplineEvent/SportDisciplineEvent")
);
const MedalRankings = lazy(() =>
  import("../containers/Admin/MedalRankings/MedalRankings")
);
const Report = lazy(() => import("../containers/Admin/Report/Report"));
// export const adminPrefix = "/management";
export const adminApi = "/admin";

export function AdminRoutes() {
  const { i18n } = useTranslation();
  const adminRoutes = [
    {
      path: "/",
      component: Index,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.home"),
    },
    {
      path: "/country",
      component: CountryList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.country_list"),
    },
    {
      path: "/country/create",
      component: CountryForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.country_create"),
    },
    {
      path: "/country/:id",
      component: CountryForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.country_info"),
    },
    {
      path: "/organization",
      component: OrganizationList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.organization_list"),
    },
    {
      path: "/organization/create",
      component: OrganizationForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.organization_create"),
    },
    {
      path: "/organization/:id",
      component: OrganizationForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.organization_info"),
    },
    {
      path: "/cardTemplate",
      component: CardTemplateList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.card_template_list"),
    },
    {
      path: "/cardTemplate/create",
      component: CardTemplateForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.card_template_create"),
    },
    {
      path: "/cardTemplate/:id",
      component: CardTemplateForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.card_template_info"),
    },
    {
      path: "/function",
      component: FunctionList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.function_list"),
    },
    {
      path: "/function/create",
      component: FunctionForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.function_create"),
    },
    {
      path: "/function/:id",
      component: FunctionForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.function_info"),
    },
    {
      path: "/sport",
      component: SportList,
      protected: true,
      perm: "sport_all",
      name: i18n.t("breadcrums.sport_list"),
    },
    {
      path: "/user",
      component: UserList,
      protected: true,
      perm: "user_all",
      name: i18n.t("breadcrums.user_list"),
    },
    {
      path: "/user/create",
      component: UserForm,
      protected: true,
      perm: "user_add",
      name: i18n.t("breadcrums.user_create"),
    },
    {
      path: "/user/:id(\\d+)",
      component: UserForm,
      protected: true,
      perm: "user_view",
      name: i18n.t("breadcrums.user_info"),
    },
    {
      path: "/record",
      component: RecordList,
      perm: "",
      name: i18n.t("breadcrums.record"),
    },
    {
      path: "/record/create",
      component: RecordForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.record_create"),
    },
    {
      path: "/record/:id",
      component: RecordForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.record_info"),
    },
    {
      path: "/team",
      component: TeamList,
      protected: true,
      perm: "all_team",
      name: i18n.t("breadcrums.team_list"),
    },
    {
      path: "/team/create",
      component: TeamForm,
      protected: true,
      perm: "team_add",
      name: i18n.t("breadcrums.team_create"),
    },
    {
      path: "/team/:id",
      component: TeamForm,
      protected: true,
      perm: "team_view",
      name: i18n.t("breadcrums.team_info"),
    },
    {
      path: "/registration",
      component: RegistrationList,
      protected: true,
      perm: "register_management_all",
      name: i18n.t("breadcrums.registration"),
    },
    {
      path: "/registration/importMember",
      component: ImportMember,
      protected: true,
      perm: "register_management_add",
      name: i18n.t("breadcrums.import_member"),
    },
    {
      path: "/registration/create",
      component: RegistrationForm,
      protected: true,
      perm: "register_management_add",
      name: i18n.t("breadcrums.registration_create"),
    },
    {
      path: "/registration/create_office",
      component: RegistrationFormOffice,
      protected: true,
      perm: "register_management_add",
      name: i18n.t("breadcrums.registration_download"),
    },
    {
      path: "/registration/:id(\\d+)",
      component: RegistrationForm,
      protected: true,
      perm: "register_management_view",
      name: i18n.t("breadcrums.registration_info"),
    },
    {
      path: "/teamEvent",
      component: TeamEventList,
      protected: true,
      perm: "list_athletes_all",
      name: i18n.t("breadcrums.team_event_list"),
    },
    {
      path: "/teamEvent/create",
      component: ListAthletesTeamForm,
      protected: true,
      perm: "list_athletes_management",
      name: i18n.t("breadcrums.team_event_create"),
    },
    {
      path: "/teamEvent/:id(\\d+)",
      component: ListAthletesTeamForm,
      protected: true,
      perm: "list_athletes_management",
      name: i18n.t("breadcrums.team_event_info"),
    },
    {
      path: "/venue",
      component: VenueList,
      protected: true,
      perm: "venue_all",
      name: i18n.t("breadcrums.venue_list"),
    },
    {
      path: "/venue/create",
      component: VenueForm,
      protected: true,
      perm: "venue_add",
      name: i18n.t("breadcrums.venue_create"),
    },
    {
      path: "/venue/:id",
      component: VenueTabForm,
      protected: true,
      perm: "venue_view",
      name: i18n.t("breadcrums.venue_info"),
    },
    {
      path: "/venue/detail/:id",
      component: VenueDetail,
      protected: true,
      perm: "venue_view",
      name: i18n.t("breadcrums.venue_detail"),
    },
    {
      path: "/referee",
      component: RefereeList,
      protected: true,
      perm: "referee_management_all",
      name: i18n.t("breadcrums.referee_list"),
    },
    {
      path: "/referee/Create",
      component: RefereeForm,
      protected: true,
      perm: "referee_management_view",
      name: i18n.t("breadcrums.referee_form"),
    },
    {
      path: "/referee/:id",
      component: RefereeForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.referee_info"),
    },
    {
      path: "/syncDataSetting",
      component: SyncSetting,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.sync_data_setting"),
    },
    {
      path: "/role",
      component: RoleList,
      protected: true,
      perm: "role_all",
      name: i18n.t("breadcrums.role_screen"),
    },
    {
      path: "/role/create",
      component: RoleForm,
      protected: true,
      perm: "role_add",
      name: i18n.t("breadcrums.role_create"),
    },
    {
      path: "/role/:id",
      component: RoleForm,
      protected: true,
      perm: "role_view",
      name: i18n.t("breadcrums.role_info"),
    },
    {
      path: "/functionReferee",
      component: FunctionRefereeList,
      protected: true,
      perm: "function_referee_all",
      name: i18n.t("breadcrums.function_referee_list"),
    },
    {
      path: "/functionReferee/Create",
      component: FunctionRefereeForm,
      protected: true,
      perm: "function_referee_view",
      name: i18n.t("breadcrums.function_referee_form"),
    },
    {
      path: "/functionReferee/:id",
      component: FunctionRefereeForm,
      protected: true,
      perm: "function_referee_edit",
      name: i18n.t("breadcrums.function_referee_info"),
    },
    // {
    //     path: "/registration/importMember",
    //     component: ImportMember,
    //     protected: true,
    //     perm: "register_management_add",
    //     name: i18n.t("breadcrums.import_member"),
    // },
    {
      path: "/area",
      component: AreaList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.area_list"),
    },
    {
      path: "/area/Create",
      component: AreaForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.area_form"),
    },
    {
      path: "/area/:id",
      component: AreaForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.area_info"),
    },
    {
      path: "/zone",
      component: ZoneList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.zone_list"),
    },
    {
      path: "/zone/Create",
      component: ZoneForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.zone_form"),
    },
    {
      path: "/zone/:id",
      component: ZoneForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.zone_info"),
    },
    {
      path: "/vehicle",
      component: VehicleList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.vehicle_list"),
    },
    {
      path: "/vehicle/Create",
      component: VehicleForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.vehicle_form"),
    },
    {
      path: "/vehicle/:id",
      component: VehicleForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.vehicle_info"),
    },
    {
      path: "/setting",
      component: Setting,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.setting"),
    },
    {
      path: "/audit",
      component: AuditList,
      perm: "",
      name: i18n.t("breadcrums.audit"),
    },
    {
      path: "/region",
      component: RegionList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.region_list"),
    },
    {
      path: "/region/:id",
      component: RegionForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.region_info"),
    },
    {
      path: "/foul",
      component: FoulList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.foul_list"),
    },
    {
      path: "/foul/create",
      component: FoulForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.foul_create"),
    },
    {
      path: "/foul/:id",
      component: FoulForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.foul_info"),
    },
    {
      path: "/congressRecord",
      component: CongressRecordList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.congress_record_list"),
    },
    {
      path: "/congressRecord/create",
      component: CongressRecordForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.congress_record_create"),
    },
    {
      path: "/congressRecord/:id",
      component: CongressRecordForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.congress_record_info"),
    },
    {
      path: "/listAthletes/create",
      component: ListAthletesForm,
      protected: true,
      perm: "list_athletes_management",
      name: i18n.t("breadcrums.list_athletes_form"),
    },
    {
      path: "/listAthletes",
      component: ListAthletes,
      protected: true,
      perm: "list_athletes_all",
      name: i18n.t("breadcrums.list_athletes"),
    },
    {
      path: "/listAthletes/:id(\\d+)",
      component: ListAthletesForm,
      protected: true,
      perm: "list_athletes_management",
      name: i18n.t("breadcrums.list_athletes_form"),
    },
    {
      path: "/sport/listAthletesTeam",
      component: ListAthletesTeam,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.list_athletes"),
    },
    {
      path: "/sport/listAthletesTeam/create",
      component: ListAthletesTeamForm,
      protected: true,
      name: "listAthletesTeam",
    },
    {
      path: "/displaySetting",
      component: DisplaySetting,
      protected: true,
      name: i18n.t("breadcrums.display_setting"),
    },
    {
      path: "/auditSyncData",
      component: AuditSyncDataList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.audit_sync_data"),
    },
    {
      path: "/matchSchedule",
      component: MatchSchedule,
      perm: "",
      name: i18n.t("breadcrums.match_schedule"),
    },
    {
      path: "/matchSchedule/matchView",
      component: MatchDetail,
      perm: "",
      name: i18n.t("breadcrums.match_view"),
    },
    {
      path: "/matchResult",
      component: MatchResultList,
      perm: "",
      name: i18n.t("breadcrums.match_result"),
    },
    {
      path: "/matchResult/:id",
      component: MatchResultForm,
      perm: "",
      name: i18n.t("breadcrums.match_result_detail"),
    },
    {
      path: "/matchSchedule/matchView/:id",
      component: MatchResultForm,
      perm: "",
      name: i18n.t("breadcrums.match_view"),
    },
    {
      path: "/sportDisciplineEvent",
      component: SportList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.event_list"),
    },
    {
      path: "/sportDisciplineEvent/create",
      component: sportDisciplineEventForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.event_create"),
    },
    {
      path: "/sportDisciplineEvent/:id(\\d+)",
      component: sportDisciplineEventForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.event_info"),
    },
    {
      path: "/scheduleCompetition",
      component: ScheduleCompetition,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.competition_schedule"),
    },
    {
      path: "/scheduleCompetition/:sub_id/stageList",
      component: StageList,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.stage_list"),
    },
    {
      path: "/scheduleCompetition/:sub_id/stageList/create",
      component: StagesForm,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.create_stage"),
    },
    {
      path: "/scheduleCompetition/:sub_id/stageList/:id(\\d+)",
      component: StagesEdit,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.stage_info"),
    },
    {
      path: "/medalTable",
      component: MedalRankings,
      protected: true,
      perm: "",
      name: i18n.t("breadcrums.medal_table"),
    },
    {
      path: "/report",
      component: Report,
      protected: true,
      perm: "",
      name: i18n.t("report_screen.report"),
    },
  ];

  return { adminRoutes };
}
