import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
    const { t, i18n } = useTranslation();
    const columns = useMemo(
        () => [
            {
                field: "name",
                title: t("user_screen.name"),
                display: true,
                sort: true,
            },
            {
                field: "user_name",
                title: t("user_screen.user_name"),
                display: true,
                sort: true,
            },
            {
                field: "email",
                title: t("user_screen.email"),
                display: true,
                // sort: true,
            },
            {
                field: "phone",
                title: t("user_screen.phone"),
                display: true,
                // sort: true,
            },
            {
                field: "role_id",
                title: t("user_screen.role"),
                display: true,
                // sort: true,
                render: (row) => row?.role?.display_name,
            },
            // {
            //   field: "team",
            //   title: t("user_screen.team"),
            //   display: true,
            //   render: (row) =>
            //     row?.team && (
            //       <span>
            //         {" "}
            //         {i18n.language === "vi"
            //           ? row?.team?.name
            //           : row?.team?.english_name}
            //       </span>
            //     ),
            // },
            // {
            //   field: "organization",
            //   title: t("user_screen.organization"),
            //   display: true,
            //   render: (row) =>
            //     row?.organization && (
            //       <span>
            //         {" "}
            //         {i18n.language === "vi"
            //           ? row?.organization?.name
            //           : row?.organization?.english_name}
            //       </span>
            //     ),
            // },
            // {
            //   field: "country",
            //   title: t("user_screen.nationality"),
            //   display: true,
            //   render: (row) => row?.country && <span>{row?.country?.name}</span>,
            // },
        ],
        [i18n.languages]
    );

    const filterInputs = useMemo(
        () => [
            {
                field: "name_like",
                type: "text",
                label: t("user_screen.name"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "user_name_like",
                type: "text",
                label: t("user_screen.user_name"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "email_like",
                type: "text",
                label: t("user_screen.email"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "phone_like",
                type: "text",
                label: t("user_screen.phone"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "role_id_equal",
                label: t("user_screen.role"),
                type: "autocompleteFilter",
                endpoint: "/admin/role",
                labelField: "display_name",
                queryField: "display_name_like",
                valueField: "id",
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            // {
            //   field: "team_id_equal",
            //   type: "autocompleteFilter",
            //   label: t("member_screen.team"),
            //   endpoint: "/admin/team",
            //   labelField: i18n.language === "vi" ? "name" : "english_name",
            //   queryField: i18n.language === "vi" ? "name_like" : "english_name_like",
            //   valueField: "id",
            //   display: true,
            //   grid: { xs: 12, sm: 6, md: 6 },
            // },
            // {
            //   field: "organization_id",
            //   type: "autocompleteFilter",
            //   label: t("user_screen.organization"),
            //   endpoint: "/admin/organization",
            //   labelField: i18n.language === "vi" ? "name" : "english_name",
            //   queryField: i18n.language === "vi" ? "name_like" : "english_name_like",
            //   display: false,
            //   valueField: "id",
            //   grid: { xs: 12, sm: 6, md: 6 },
            // },
            // {
            //   field: "country_id",
            //   type: "autocompleteFilter",
            //   label: t("user_screen.nationality"),
            //   endpoint: "/admin/country",
            //   labelField: "name",
            //   queryField: "name_like",
            //   display: false,
            //   valueField: "id",
            //   grid: { xs: 12, sm: 6, md: 6 },
            // },
        ],
        [i18n.languages]
    );
    return { columns, filterInputs };
}
