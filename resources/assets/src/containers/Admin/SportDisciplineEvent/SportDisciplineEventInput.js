import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../../routes/AdminRoutes";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = useMemo(
    () => [
      {
        field: "sport",
        title: t("member_screen.sport"),
        display: true,
        sort: false,
        render: (row) =>
          row?.sport_discipline ? (
            <p>
              {i18n.language == "vi"
                ? row.sport_discipline.sport.name
                : row.sport_discipline.sport.english_name}
            </p>
          ) : null,
      },
      {
        field: "sport_discipline",
        title: t("sport_discipline_event_screen.sport_discipline"),
        display: true,
        sort: false,
        render: (row) =>
          row?.sport_discipline ? (
            <p>
              {i18n.language == "vi"
                ? row.sport_discipline.name
                : row.sport_discipline.english_name}
            </p>
          ) : null,
      },
      {
        field: "name",
        title: t("sport_discipline_event_screen.event"),
        display: true,
        sort: false,
        render: (row) => (
          <div>
            {row.icon && (
              <img
                alt=""
                src={process.env.MIX_REACT_APP_STORAGE_URL + "/" + row?.icon}
                width="30px"
                height="30px"
                style={{ marginRight: 20 }}
              />
            )}
            {i18n.language == "vi" ? row?.name : row?.english_name}
          </div>
        ),
      },
      {
        field: "competition_type",
        title: t("sport_discipline_event_screen.competition_type"),
        display: true,
        sort: false,
        render: (row) => (
          <div>
            {row.competition_type == 1 ? (
              <div>{t("sport_discipline_event_screen.individual")}</div>
            ) : (
              <div> {t("sport_discipline_event_screen.team")}</div>
            )}
          </div>
        ),
      },
    ],
    [i18n.languages[0]]
  );

  const filterInputs = useMemo(
    () => [
      {
        field: "sport_id",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sport",
        type: "autocompleteFilter",
        label: t("sport_discipline_screen.sport"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "sport_discipline_id_equal",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sportDiscipline",
        type: "autocompleteFilter",
        label: t("sport_discipline_screen.sport_discipline"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
        sub_params: (value) => {
          return {
            sport_id_equal: value?.sport_id,
          };
        },
      },
      {
        field: "id_equal",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sportDisciplineEvent",
        type: "autocompleteFilter",
        label: t("sport_discipline_screen.event"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
        sub_params: (value) => {
          return {
            sport_discipline_id_equal: value?.sport_discipline_id_equal,
          };
        },
      },
    ],
    [i18n.languages]
  );
  return { columns, filterInputs };
}
