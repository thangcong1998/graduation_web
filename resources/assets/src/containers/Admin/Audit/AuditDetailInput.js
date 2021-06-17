import React from "react";
import { useTranslation } from "react-i18next";
import * as moment from "moment";
import { RenderModelName } from "../../../common/constants";

export default function (props) {
    const { keyData } = props;
    console.log(keyData);
    const { t } = useTranslation();
    const columns = [
        {
            field: "key",
            title: t("audit_screen.auditable_type"),
            display: true,
            sort: false,
            render: (row) => t(RenderModelName(keyData) + "." + row?.key),
        },
        {
            field: "old",
            title: t("audit_screen.old_values"),
            display: true,
            sort: false,
            render: (row) => row?.old,
        },
        {
            field: "new",
            title: t("audit_screen.new_values"),
            display: true,
            sort: false,
            render: (row) => row?.new,
        },
    ];
    const filterInputs = [
        {
            field: "name_like",
            type: "text",
            label: t("area_screen.name"),
            grid: { xs: 12, sm: 12, md: 12 },
        },
    ];

    return { columns, filterInputs };
}
