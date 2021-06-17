import { values } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../../../api/api";

export default function (props) {
    const { t, i18n } = useTranslation();
    const api = useAPI();

    const filterInputs = [
        {
            field: "name_like",
            type: "text",
            label: t("function_referee_screen.name"),
            variant: "outlined",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "english_name_like",
            type: "text",
            display: true,
            variant: "outlined",
            label: t("function_referee_screen.english_name"),
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "sport_id",
            queryField:
                i18n.languages[0] == "en" ? "english_name_like" : "name_like",
            labelField: i18n.languages[0] == "en" ? "english_name" : "name",
            valueField: "id",
            endpoint: "/admin/sport",
            type: "autocompleteFilter",
            label: t("function_referee_screen.sport"),
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
            label: t("function_referee_screen.event"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
    ];
    return { filterInputs };
}
