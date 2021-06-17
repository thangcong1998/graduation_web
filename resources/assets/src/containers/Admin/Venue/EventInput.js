import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t, i18n } = useTranslation();
    const columns = [
        {
            field: "given_name",
            title: t("member_screen.given_name"),
            display: true,
            sort: true,
        },
        {
            field: "family_name",
            title: t("member_screen.family_name"),
            display: true,
            sort: true,
        }
    ];

    const filterInputs = [
        {
            field: "sport_id",
            type: "autocompleteFilter",
            label: t("member_screen.sport"),
            queryField:
                i18n.languages[0] === "en" ? "english_name_like" : "name_like",
            labelField: i18n.languages[0] === "en" ? "english_name" : "name",
            endpoint: "/admin/sport",
            valueField: "id",
            size: "medium",
            grid: { xs: 12, sm: 12, md: 12 },
        },
        {
            field: "sport_discipline_id_equal",
            type: "autocompleteFilter",
            label: t("sport_discipline_screen.discipline"),
            queryField:
                i18n.languages[0] === "en" ? "english_name_like" : "name_like",
            labelField: i18n.languages[0] === "en" ? "english_name" : "name",
            endpoint: "/admin/sportDiscipline",
            valueField: "id",
            size: "medium",
            grid: { xs: 12, sm: 12, md: 12 },
        }
    ];
    return { columns, filterInputs };
}
