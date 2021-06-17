import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { CheckUnit } from "../../../../common/constants";

export default function (props) {
    const { t, i18n } = useTranslation();

    const columns = useMemo(
        () => [
            {
                field: "sport",
                title: t("sport_discipline_event_screen.sport"),
                display: true,
                sort: false,
                render: (row) =>
                    row?.event?.sport_discipline?.sport && (
                        <p>
                            {i18n.language == "vi"
                                ? row?.event?.sport_discipline?.sport.name
                                : row?.event?.sport_discipline?.sport
                                      .english_name}
                        </p>
                    ),
            },
            {
                field: "sport_discipline",
                title: t("sport_discipline_event_screen.sport_discipline"),
                display: true,
                sort: false,
                render: (row) =>
                    row?.event?.sport_discipline && (
                        <p>
                            {i18n.language == "vi"
                                ? row?.event?.sport_discipline.name
                                : row?.event?.sport_discipline.english_name}
                        </p>
                    ),
            },
            {
                field: "event",
                title: t("record_screen.event"),
                display: true,
                sort: false,
                render: (row) =>
                    row?.event && (
                        <span>
                            {i18n.language == "en"
                                ? row?.event?.english_name
                                : row?.event?.name}
                        </span>
                    ),
            },
            {
                field: "result_record",
                title: t("record_screen.result_record"),
                display: true,
                sort: false,
            },
            {
                field: "unit",
                title: t("record_screen.unit"),
                display: true,
                sort: false,
                render: (row) => {
                    return CheckUnit(row.unit, t);
                },
            },
            {
                field: "take_time",
                title: t("record_screen.take_time"),
                render: (row) =>
                    row?.take_time && (
                        <p>{moment(row?.take_time).format("DD/MM/YYYY")}</p>
                    ),
            },
            {
                field: "take_place",
                title: t("record_screen.take_place"),
                display: true,
                sort: false,
            },
        ],
        [i18n.languages]
    );

    const filterInputs = useMemo(
        () => [
            {
                field: "sport_id",
                queryField:
                    i18n.languages[0] == "en"
                        ? "english_name_like"
                        : "name_like",
                labelField: i18n.languages[0] == "en" ? "english_name" : "name",
                valueField: "id",
                endpoint: "/admin/sport",
                type: "autocompleteFilter",
                label: t("sport_discipline_screen.sport"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "sport_discipline_id",
                queryField:
                    i18n.languages[0] == "en"
                        ? "english_name_like"
                        : "name_like",
                labelField: i18n.languages[0] == "en" ? "english_name" : "name",
                valueField: "id",
                endpoint: "/admin/sportDiscipline",
                type: "autocompleteFilter",
                label: t("sport_discipline_screen.sport_discipline"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "event_id_equal",
                queryField:
                    i18n.languages[0] == "en"
                        ? "english_name_like"
                        : "name_like",
                labelField: i18n.languages[0] == "en" ? "english_name" : "name",
                valueField: "id",
                endpoint: "/admin/sportDisciplineEvent",
                type: "autocompleteFilter",
                label: t("sport_discipline_screen.event"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "result_record_like",
                type: "text",
                label: t("record_screen.result_record"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "take_time_equal",
                type: "date",
                label: t("record_screen.take_time"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "take_place_like",
                type: "text",
                label: t("record_screen.take_place"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
        ],
        [i18n.languages]
    );
    return { columns, filterInputs };
}
