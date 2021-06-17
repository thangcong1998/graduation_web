import React from "react";
import { useTranslation } from "react-i18next";

export default function(props) {
    const { t } = useTranslation();
    const columns = [
        {
            field: "flag",
            title: t("country_screen.flag"),
            display: true,
            render: row =>
                row.flag_url && (
                    <img
                        height={30}
                        width={45.42}
                        src={
                            process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            row.flag_url
                        }
                    />
                )
        },
        {
            field: "name",
            title: t("country_screen.name"),
            display: true,
            sort: true
        },
        {
            field: "country_code_3_digits",
            title: t("country_screen.country_code_3_digits"),
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
