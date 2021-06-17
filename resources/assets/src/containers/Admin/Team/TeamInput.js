import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t, i18n } = useTranslation();
    const columns = [
        {
            field: "name",
            title: t("team_screen.name"),
            display: true,
            sort: true,
        },
        {
            field: "english_name",
            title: t("team_screen.english_name"),
            display: true,
            sort: true,
        },

        {
            field: "country_id",
            title: t("team_screen.country_id"),
            display: true,
            render: (row) => row.country && <p>{row?.country?.name}</p>,
            // sort: true,
        },
    ];

    const filterInputs = [
        {
            field: "name_like",
            type: "text",
            label: t("team_screen.name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "english_name_like",
            type: "text",
            label: t("team_screen.english_name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "country_id_equal",
            type: "autocompleteFilter",
            label: t("team_screen.country_id"),
            endpoint: "/admin/country",
            queryField: "name",
            labelField: "name",
            valueField: "id",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
    ];
    return { columns, filterInputs };
}
