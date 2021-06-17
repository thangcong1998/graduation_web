import React from "react";
import { useTranslation } from "react-i18next";
import * as moment from "moment";
import { RenderModel } from "../../../common/constants";

export default function (props) {
    const { t, i18n } = useTranslation();
    const columns = [
        {
            field: "auditable_type",
            title: t("audit_screen.auditable_type"),
            display: true,
            sort: true,
            render: (row) => RenderModel(row?.auditable_type, t),
        },
        {
            field: "event",
            title: t("audit_screen.event"),
            display: true,
            sort: true,
            render: (row) => t("action." + row.event),
        },
        {
            field: "user_id",
            title: t("audit_screen.user"),
            display: true,
            sort: false,
            render: (row) => row?.user?.name,
        },
        {
            field: "created_at",
            title: t("audit_screen.created_at"),
            display: true,
            sort: false,
            render: (row) =>
                moment(row?.created_at).format("DD-MM-YYYY HH:mm:ss"),
        },
    ];

    const filterInputs = [
        {
            field: "user_id_equal",
            label: t("audit_screen.user"),
            endpoint: "admin/user",
            // params: "?role=admin",
            queryField: "name_like",
            labelField: "name",
            valueField: "id",
            type: "autocompleteFilter",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
            size: "medium",
        },
        {
            label: t("audit_screen.date_picker"),
            field: "date_range",
            type: "date-range",
            display: true,
            grid: { xs: 12, sm: 6, md: 6 },
            checked: true,
        },
        {
            label: t("audit_screen.action"),
            field: "event",
            type: "checkbox",
            display: true,
            formGroupProps: {
                style: { flexDirection: "row" },
            },
            options: [
                {
                    label: t("action.created"),
                    value: "created",
                },
                {
                    label: t("action.updated"),
                    value: "updated",
                },
                {
                    label: t("action.deleted"),
                    value: "deleted",
                },
                {
                    label: t("action.restored"),
                    value: "restored",
                },
            ],

            grid: { xs: 12, sm: 6, md: 6 },
            checked: true,
        },
    ];
    return { columns, filterInputs };
}
