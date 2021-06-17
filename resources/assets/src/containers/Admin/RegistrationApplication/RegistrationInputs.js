import React from "react";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../../../api/api";

export default function (props) {
    const { t, i18n } = useTranslation();
    const api = useAPI();

    const filterInputs = [
        {
            field: "given_name_like",
            type: "text",
            label: t("member_screen.given_name"),
            variant: "outlined",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "family_name_like",
            type: "text",
            label: t("member_screen.family_name"),
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "organization_id_equal",
            type: "autocompleteFilter",
            endpoint: "/admin/organization",
            labelField: "abbreviation",
            queryField: "abbreviation_like",
            valueField: "id",
            variant: "outlined",
            display: true,
            label: t("member_screen.organization"),
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "team_id_equal",
            type: "autocompleteFilter",
            label: t("member_screen.team"),
            endpoint: "/admin/team",
            labelField: i18n.language === "vi" ? "name" : "english_name",
            queryField:
                i18n.language === "vi" ? "name_like" : "english_name_like",
            valueField: "id",
            variant: "outlined",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "function_id_equal",
            type: "autocompleteFilter",
            params: {
                filter: true,
                per_page: 200,
            },
            label: t("member_screen.function"),
            endpoint: "/admin/function",
            queryField: i18n.language === "vi" ? "name" : "english_name",
            labelField: i18n.language === "vi" ? "name" : "english_name",
            valueField: "id",
            variant: "outlined",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
    ];
    return { filterInputs };
}
