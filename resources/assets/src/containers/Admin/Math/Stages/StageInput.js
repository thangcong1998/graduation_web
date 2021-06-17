import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t } = useTranslation();
    const columns = [
        {
            field: "name",
            title: t("stages_screen.name"),
            display: true,
            sort: true,
        },
        {
            field: "english_name",
            title: t("stages_screen.english_name"),
            display: true,
            sort: true,
        },
    ];

    const filterInputs = [
        {
            field: "name_like",
            type: "text",
            label: t("stages_screen.name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        {
            field: "english_name_like",
            type: "text",
            label: t("stages_screen.english_name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
        // {
        //     field: "country_code_3_digits_like",
        //     type: "text",
        //     label: t("country_screen.country_code_3_digits"),
        //     display: true,
        //     grid: { xs: 12, sm: 6, md: 6 }
        // }
    ];
    return { columns, filterInputs };
}
