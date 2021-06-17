import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../../routes/AdminRoutes";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = useMemo(
    () => [
      {
        field: "name",
        title: t("event_team_screen.name"),
        display: true,
        sort: false,
        render: (row) =>
          row.name ? (
            <p>{row.name}</p>
          ) : (
            <p>
              {i18n.language == "vi" ? row.team.name : row.team.english_name}
            </p>
          ),
      },
      {
        field: "event",
        title: t("sport_discipline_screen.sport_discipline_event"),
        display: true,
        sort: false,
        render: (row) =>
          row.event && (
            <p>
              {i18n.language == "vi"
                ? row?.event?.sport_discipline?.sport?.name
                : row?.event?.sport_discipline?.sport?.english_name}
              <span style={{ padding: "0px 5px" }}>/</span>
              {i18n.language == "vi"
                ? row?.event?.sport_discipline?.name
                : row?.event?.sport_discipline?.english_name}
              <span style={{ padding: "0px 5px" }}>/</span>
              {i18n.language == "vi"
                ? row?.event?.name
                : row?.event?.english_name}
            </p>
          ),
      },
      {
        field: "team",
        title: t("member_registration.team"),
        display: true,
        sort: false,
        render: (row) =>
          row.team && (
            <p>
              {i18n.language == "vi"
                ? row?.team?.name
                : row?.team?.english_name}
            </p>
          ),
      },
      {
        field: "total_registered",
        title: t("sport_discipline_event_screen.entries"),
        display: true,
        sort: false,
        render: (row) =>
          row.event_team_competitor && (
            <p>{row.event_team_competitor.length}</p>
          ),
      },
    ],
    [i18n.languages]
  );

  const filterInputs = useMemo(
    () => [
      {
        field: "name_like",
        type: "text",
        label: t("event_team_screen.name"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "sport_discipline_id",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sportDiscipline",
        type: "autocompleteFilter",
        label: t("sport_discipline_screen.sport_discipline"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "event_id_equal",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sportDisciplineEvent",
        type: "autocompleteFilter",
        label: t("sport_discipline_screen.sport_discipline_event"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "team_id_equal",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/team",
        type: "autocompleteFilter",
        label: t("event_team_screen.team"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
    ],
    [i18n.languages]
  );
  return { columns, filterInputs };
}
