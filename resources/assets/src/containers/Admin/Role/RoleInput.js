import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t } = useTranslation();
    const columns = [
        {
            field: "display_name",
            title: t("role_screen.name"),
            display: true,
            sort: true,
        },
    ];

    const filterInputs = [
        {
            field: "display_name_like",
            type: "text",
            label: t("role_screen.name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
        },
    ];
    return { columns, filterInputs };
}
