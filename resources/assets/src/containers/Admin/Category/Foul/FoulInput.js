import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t, i18n } = useTranslation();
    const columns = [
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
                            : row?.event?.sport_discipline?.sport.english_name}
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
            field: "name",
            title: t("foul_screen.name"),
            display: true,
            sort: false,
        },
        {
            field: "english_name",
            title: t("foul_screen.english_name"),
            display: true,
            sort: false,
        },
    ];

    const filterInputs = [
        {
            field: "sport_id",
            queryField:
                i18n.languages[0] == "en" ? "english_name_like" : "name_like",
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
                i18n.languages[0] == "en" ? "english_name_like" : "name_like",
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
                i18n.languages[0] == "en" ? "english_name_like" : "name_like",
            labelField: i18n.languages[0] == "en" ? "english_name" : "name",
            valueField: "id",
            endpoint: "/admin/sportDisciplineEvent",
            type: "autocompleteFilter",
            label: t("sport_discipline_screen.event"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "name_like",
            type: "text",
            label: t("foul_screen.name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "english_name_like",
            type: "text",
            label: t("foul_screen.english_name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
    ];
    return { columns, filterInputs };
}
