import React from "react";
import { useTranslation } from "react-i18next";

export default function(props) {
    const { t } = useTranslation();
    const columns = [
        {
            field: "stage_name",
            title: "Tên vòng đấu",
            display: true,
            sort: true
        },
        {
            field: "event_date",
            title: "Ngày thi đấu",
            display: true
            // sort: true,
        },
        {
            field: "start_time",
            title: "Thời gian thi đấu",
            display: true
            // sort: true,
        },
        {
            field: "status",
            title: "Trạng thái",
            display: true
            // sort: true,
        },
        {
            field: "match_type",
            title: "Loại trận đấu",
            display: true
            // sort: true,
        }
    ];

    const filterInputs = [
        {
            field: "name_like",
            type: "text",
            label: t("country_screen.name"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 }
        },
        {
            field: "country_code_3_digits_like",
            type: "text",
            label: t("country_screen.country_code_3_digits"),
            display: true,
            grid: { xs: 12, sm: 6, md: 6 }
        }
    ];
    return { columns, filterInputs };
}
