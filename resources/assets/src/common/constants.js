import loading from "../assets/image/25.gif";
import { useContext } from "react";
import { AuthContext } from "../containers/AuthProvider";

export const inputTypes = {
  TEXT: "text",
  PASSWORD: "password",
  NUMBER: "number",
  TEXTAREA: "textarea",
  SWITCH: "switch",
  SELECT: "select",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  DATE: "date",
  DATETIME: "datetime",
  QUERY_SELECT: "query-select",
};

export const profile_status = {
  REGISTRATION: 1,
  APPROVAL: 2,
  REJECT: 3,
};

export const sex = {
  FEMALE: 1,
  MALE: 2,
};
export const audit = {
  PROVINCE: 1,
  DISTRICT: 2,
  WARDS: 3,
};
export const problem_status = {
  ACCOMPLISHED: 1,
  UNFINISHED: 2,
};
export const is_active = {
  INACTIVE: 1,
  ACTIVE: 2,
};
export const card_type = {
  MEMBER: "App\\Models\\PersonalInfo",
  STAFF: "App\\Models\\Staff",
  VOLUNTEER: "App\\Models\\Volunteer",
};
export const support_status = {
  PROCESSING: 1,
  SUPPORTED: 2,
  REJECT: 3,
};
export const severity_status = {
  NOT_URGENT: 1,
  NORMAL: 2,
  SERIOUS: 3,
};
export const attribute_type = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  DATE: "date",
};
export const reprint_card = {
  PRINTED_STATUS: 1,
  UNPRINTED_CARD: 0,
};
export const UNIT = {
  HOUR: 1,
  MINUTE: 2,
  SECONDS: 3,
  KILOMETER: 4,
  METER: 5,
  CENTIMETER: 6,
  KILOGRAM: 7,
  MATCH: 8,
  GOAL: 9,
  POINT: 10,
  TIME: 11,
};

export function CheckReprintCard(status, tran) {
  if (status == reprint_card.PRINTED_STATUS) {
    return tran("member_screen.printed_status");
  }
  if (status == reprint_card.UNPRINTED_CARD) {
    return tran("member_screen.unprinted_card");
  }
}
export function CheckAttributeType(value_type, tran) {
  if (value_type == attribute_type.TEXT) {
    return tran("customs_attributes_screen.text");
  }
  if (value_type == attribute_type.NUMBER) {
    return tran("customs_attributes_screen.number");
  }
  if (value_type == attribute_type.SELECT) {
    return tran("customs_attributes_screen.select");
  }
  if (value_type == attribute_type.DATE) {
    return tran("customs_attributes_screen.date");
  }
}
export function CheckProblemStatus(status, tran) {
  if (status == problem_status.ACCOMPLISHED) {
    return tran("problem_creen.accomplished");
  }
  if (status == problem_status.UNFINISHED) {
    return tran("problem_creen.unfinished");
  }
}
export function CheckSeverity(severity, tran) {
  if (severity == severity_status.NOT_URGENT) {
    return tran("problem_creen.not_urgent");
  }
  if (severity == severity_status.NORMAL) {
    return tran("problem_creen.normal");
  }
  if (severity == severity_status.SERIOUS) {
    return tran("problem_creen.serious");
  }
}
export function CheckLevel(level, tran) {
  if (level == audit.PROVINCE) {
    return tran("administrative_division_screen.province");
  }
  if (level == audit.DISTRICT) {
    return tran("administrative_division_screen.district");
  }
  if (level == audit.WARDS) {
    return tran("administrative_division_screen.wards");
  }
}
export function CheckProfileStatus(status, tran) {
  if (status == profile_status.REGISTRATION) {
    return tran("member_registration.column.processing");
  }
  if (status == profile_status.APPROVAL) {
    return tran("member_registration.column.approved");
  }
  if (status == profile_status.REJECT) {
    return tran("member_registration.column.rejected");
  }
  return null;
}

export function CheckSex(gender, tran) {
  if (gender == sex.FEMALE) {
    return tran("sex.female");
  }
  if (gender == sex.MALE) {
    return tran("sex.male");
  }
  return null;
}

export function CheckRecord(record, tran) {
  if (record === 2) {
    return tran("record_screen.yes");
  } else {
    return tran("record_screen.no");
  }
}
export function CheckSupportStatus(status, tran) {
  if (status == support_status.PROCESSING) {
    return tran("support_screen.processing");
  }
  if (status == support_status.SUPPORTED) {
    return tran("support_screen.supported");
  }
  if (status == support_status.REJECT) {
    return tran("support_screen.reject");
  }
}
export function CheckUnit(unit, tran) {
  if (unit == UNIT.HOUR) {
    return tran("record_screen.hour");
  }
  if (unit == UNIT.MINUTE) {
    return tran("record_screen.minute");
  }
  if (unit == UNIT.SECONDS) {
    return tran("record_screen.seconds");
  }
  if (unit == UNIT.KILOMETER) {
    return tran("record_screen.kilometer");
  }
  if (unit == UNIT.METER) {
    return tran("record_screen.meter");
  }
  if (unit == UNIT.CENTIMETER) {
    return tran("record_screen.centimeter");
  }
  if (unit == UNIT.KILOGRAM) {
    return "Kilogram";
  }
  if (unit == UNIT.MATCH) {
    return tran("record_screen.match");
  }
  if (unit == UNIT.GOAL) {
    return tran("record_screen.goal");
  }
  if (unit == UNIT.POINT) {
    return tran("record_screen.point");
  }
  if (unit == UNIT.TIME) {
    return tran("record_screen.time");
  }
}
export const loadingStyle = {
  backgroundImage: "url(" + loading + ")",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#f3f3f3",
  backgroundPosition: "center",
  opacity: 0.5,
};

export const color = {
  PRIMARY: "#1976d2",
  SECONDARY: "#dc004e",
  SUCCESS: "#4caf50",
  ERROR: "#f44336",
  WARNING: "#ff9800",
  INFO: "#2196f3",
};

export const colorList = {
  ACTIVE: {
    backgroundColor: "#bbdefb",
  },
  INACTIVE: {
    backgroundColor: "#f6f6f6",
  },
};
export const printStatus = {
  Printed: 2,
  NotPrintedYet: 1,
};
export const receivedStatus = {
  Received: 2,
  NotReceived: 1,
};
export const attributeCategories = {
  PARTNER: 0,
  CUSTOMER: 1,
};
export const attributeTypes = {
  TEXT: "text",
  STRING: "string", // TODO: replaced by TEXT
  SELECT: "select", // TODO: deprecated
  DATETIME: "datetime",
  LIST: "list",
};
export const displayDefault = {
  noneDisplay: 0,
  display: 1,
};
export function CheckPrintStatus(print, tran) {
  if (print == printStatus.Printed) {
    return tran("print.printed");
  }
  if (print == printStatus.NotPrintedYet) {
    return tran("print.NotPrintedYet");
  }
  return null;
}
export function CheckReceiveStatus(received, tran) {
  if (received == receivedStatus.Received) {
    return tran("receive.received");
  }
  if (received == receivedStatus.NotReceived) {
    return tran("receive.NotReceivedYet");
  }
  return null;
}

export const SCHEDULE_COLORS = [
  "#d50000",
  "#f4511e",
  "#33b679",
  "#039be5",
  "#7986cb",
  "#616161",
  "#e67c73",
  "#f6bf26",
  "#0b8043",
  "#3f51b5",
  "#8e24aa",
];
/**
 * @return {string}
 */
export function RenderModel(model, tran) {
  switch (model) {
    case "App\\Models\\Category":
      return tran("sidebar.country");
      break;
    case "App\\Models\\Role":
      return tran("sidebar.role");
      break;
    case "App\\Models\\User":
      return tran("sidebar.user");
      break;
    case "App\\Models\\Record":
      return tran("sidebar.record_history");
      break;
    case "App\\Models\\Participant":
      return tran("sidebar.participant");
      break;
    case "App\\Models\\CongressRecord":
      return tran("sidebar.congress_record");
      break;
    case "App\\Models\\Foul":
      return tran("sidebar.foul");
      break;
    case "App\\Models\\SyncDataSetting":
      return tran("sidebar.sync_data_setting");
      break;
    case "App\\Models\\RecordParticipant":
      return tran("sidebar.record_participant");
      break;
    case "App\\Models\\FunctionsReferee":
      return tran("sidebar.function_referee");
      break;
    case "App\\Models\\Regions":
      return tran("sidebar.region");
      break;
    case "App\\Models\\Match":
      return tran("sidebar.match");
      break;
    case "App\\Models\\Team":
      return tran("sidebar.team");
      break;
    case "App\\Models\\CompetitorVenue":
      return tran("sidebar.venue");
      break;
    case "App\\Models\\Sport":
      return tran("sidebar.sport");
      break;
    case "App\\Models\\SportDiscipline":
      return tran("sidebar.sport_discipline");
      break;
    case "App\\Models\\SportDisciplineEvent":
      return tran("sidebar.sport_discipline_event");
      break;
    case "App\\Models\\Referee":
      return tran("sidebar.referee");
      break;
    case "App\\Models\\Country":
      return tran("sidebar.country");
      break;
    default:
      return model;
      break;
  }
}
/**
 * @return {string}
 */
export function RenderModelName(model) {
  switch (model) {
    case "App\\Models\\Category":
      return "country_screen";
      break;
    case "App\\Models\\Role":
      return "role_screen";
      break;
    case "App\\Models\\User":
      return "user_screen";
      break;
    case "App\\Models\\Record":
      return "record_screen";
      break;
    case "App\\Models\\Participant":
      return "member_screen";
      break;
    case "App\\Models\\CongressRecord":
      return "record_screen";
      break;
    case "App\\Models\\Foul":
      return "foul_screen";
      break;
    case "App\\Models\\RecordParticipant":
      return "record_participant_screen";
      break;
    case "App\\Models\\FunctionsReferee":
      return "function_referee_screen";
      break;
    case "App\\Models\\Regions":
      return "region_screen";
      break;
    case "App\\Models\\Match":
      return "match_screen";
      break;

    case "App\\Models\\Team":
      return "team_screen";
      break;
    case "App\\Models\\CompetitorVenue":
      return "venue_screen";
      break;
    case "App\\Models\\Sport":
      return "sport_screen";
      break;
    case "App\\Models\\SportDiscipline":
      return "sport_discipline_screen";
      break;
    case "App\\Models\\SportDisciplineEvent":
      return "sport_discipline_event_screen";
      break;
    case "App\\Models\\Referee":
      return "referee_screen";
      break;
    default:
      return model;
      break;
  }
}
export function checkPerm(perms, perm) {
  return perms?.some((x) => x.name === perm);
}
export function checkActive(active, tran) {
  if (active == is_active.ACTIVE) {
    return tran("is_active.active");
  }
  if (active == is_active.INACTIVE) {
    return tran("is_active.inactive");
  }
  return null;
}
export function cardType(type, tran) {
  if (type == card_type.MEMBER) {
    return tran("card_type.member");
  }
  if (type == card_type.STAFF) {
    return tran("card_type.staff");
  }
  if (type == card_type.VOLUNTEER) {
    return tran("card_type.volunteer");
  }
  return null;
}
export function AddDate(date, day) {
  let d = new Date(date);
  d.setDate(d.getDate() + day);
  return d;
}

export const SCHEDULE_TYPE = {
  ENTRY: 1,
  EXIT: 2,
  TRANSPORT: 3,
  STAY: 4,
  TRAINING: 5,
};

export const ItemTypes = {
  FOOD: "food",
  GLASS: "glass",
  PAPER: "paper",
};

export const match_attendant_type = {
  _1VS1: 1,
  _1VSN: 2,
};

export const match_score_type = {
  RECORD: 1,
  TARGET_RECORD: 2,
  SCORE: 3,
  SCORE_KO: 4,
};

export const stage_type = {
  QUALIFIED_USED_TABLE: 1,
  KNOCK_OUT: 2,
  ROUND_ROBIN: 3,
};

export const event_type = {
  INDIVIDUAL: 1,
  TEAM: 2,
};

export const sidebardWidth = 300;

export const DragdropColors = [
  "#2e8fdc",
  "#e9871b",
  "#d02f2f",
  "#ff4dc6c7",
  "#2ed1dc",
  "#1be938",
  "#2edcb1",
  "#ff894d",
  "#dc2eaa",
  "#e6b821",
];

export const qualification_type = {
  NONE: 0,
  QUALIFIED: 1,
  HCV: 2,
  HCB: 3,
  HCD: 4,
};

export const measurement_unit = {
  HOUR: 1,
  MINUTE: 2,
  SECONDS: 3,
  KILOMETER: 4,
  METER: 5,
  CENTIMETER: 6,
  KILOGRAM: 7,
  POINT: 10,
  TIME: 11,
};

export const match_scoring_method = {
  ROUND_WIN: 1,
  SUM_SCORE: 2,
  SUM_RECORD: 3,
  BEST_RECORD: 4,
  AVERAGE: 5,
  BEST_TARGET_RECORD: 6,
  WIN_LOSE: 7,
  AVERAGE_BETWEEN: 8,
  SUM_SCORE_KO: 9,
};

export const round_type = {
  HAS_ROUND: 1,
  HAS_SET: 2,
  NO_ROUND: 3,
};

export function CheckQualification(qualification, tran) {
  if (qualification == qualification_type.QUALIFIED) {
    return tran("qualification_type.1");
  }
  if (qualification == qualification_type.HCV) {
    return tran("qualification_type.2");
  }
  if (qualification == qualification_type.HCB) {
    return tran("qualification_type.3");
  }
  if (qualification == qualification_type.HCD) {
    return tran("qualification_type.4");
  }
}

export const rank_type = {
  MATCH_POINT: 1,
  RECORD: 2,
};

export const event_distinguish_player_method = {
  UNIFORM: 1,
  PEEP: 2,
  CUSTOM: 3,
  NO_NEED: null,
};
export const progress_match_type = {
  ACHIEVEMENTS: 1,
  FOUL: 2,
  CHANGE: 3,
};
export function ChecktypeInProgressMatch(type, tran) {
  if (type == progress_match_type.ACHIEVEMENTS) {
    return tran("progress_match_screen.type.1");
  }
  if (type == progress_match_type.FOUL) {
    return tran("progress_match_screen.type.2");
  }
  if (type == progress_match_type.CHANGE) {
    return tran("progress_match_screen.type.3");
  }
}
export const sub_criterias_type = {
  WIN_MATCH: 1,
  SCORE: 2,
  DIFFERENCE: 3,
  GOAL: 4,
  OTHER: 5,
};

export const sport_discipline_event_type = {
  MEN_EVENT: 1,
  WOMEN_EVENT: 2,
  MIX_EVENT: 3,
};

export const competition_type = {
  INDIVIDUAL: 1,
  TEAM: 2,
};

export const round_result_type = {
  RECORD: 1,
  REFEREE_POINT: 2,
  ROUND_POINT: 3,
  ROUND_WIN: 4,
};
