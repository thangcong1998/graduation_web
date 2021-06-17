import React from "react";
import { useTranslation } from "react-i18next";
import * as moment from "moment";

export default function (props) {
    const { t, i18n } = useTranslation();
    const columns = [
        {
            field: "auditable_type",
            title: t("audit_screen.auditable_type"),
            display: true,
            sort: false,
            render: (row) => row?.name,
        },
        {
            field: "event",
            title: t("audit_screen.event"),
            display: true,
            sort: false,
            render: (row) => t("action." + row.status),
        },
        {
            field: "updated_at",
            title: t("audit_screen.updated_at"),
            display: true,
            sort: false,
            render: (row) =>
                moment(row?.updated_at).format("DD-MM-YYYY HH:mm:ss"),
        },
    ];

    const filterInputs = [
        {
            label: t("audit_screen.date_picker"),
            field: "date_range",
            type: "date-range",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
            checked: true,
        },
    ];
    return { columns, filterInputs };
}
