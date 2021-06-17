import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t } = useTranslation();
    const columns = [
        {
            field: "name",
            title: t("match_screen.name"),
            display: true,
            sort: true,
        },
        {
            field: "event_date",
            title: t("match_screen.event_date"),
            display: true,
            sort: true,
        },
        {
            field: "stage_id",
            title: t("match_screen.stage_id"),
            display: true,
            sort: true,
        },
        {
            field: "start_time",
            title: t("match_screen.start_time"),
            display: true,
            sort: true,
        },
    ];

    const filterInputs = [
        // {
        //     field: "display_name_like",
        //     type: "text",
        //     label: t("role_screen.name"),
        //     display: true,
        //     grid: { xs: 12, sm: 6, md: 6 },
        // },
    ];
    return { columns, filterInputs };
}
