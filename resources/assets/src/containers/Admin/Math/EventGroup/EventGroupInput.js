import React from "react";
import { useTranslation } from "react-i18next";

export default function(props) {
    const { t } = useTranslation();
    const columns = [
        {
            field: "name_stage",
            title: "Tên vòng đấu",
            display: true,
            sort: true
        },
        {
            field: "name",
            title: "Tên bảng đấu",
            display: true,
            sort: true
        },
        {
            field: "count",
            title: "Số người tham dự",
            display: true,
            sort: true
        },
        // {
        //     field: "status",
        //     title: "Trạng thái",
        //     display: true
        //     sort: true,
        // }
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
