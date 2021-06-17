import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = [
    {
      field: "code",
      title: t("function_screen.code"),
      display: true,
      // sort: true,
    },
    {
      field: "name",
      title: t("function_screen.name"),
      display: true,
      sort: true,
    },
    {
      field: "english_name",
      title: t("function_screen.english_name"),
      display: true,
      sort: true,
    },
    {
      field: "organization",
      title: t("function_screen.organization"),
      display: true,
      render: (row) =>
        i18n?.languages[0] === "vi"
          ? row?.organization?.name
          : row?.organization?.english_name,
    },
  ];

  const filterInputs = [
    {
      field: "name_like",
      type: "text",
      label: t("function_screen.name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "english_name_like",
      type: "text",
      label: t("function_screen.english_name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    // {
    //     field: "abbreviation_like",
    //     type: "text",
    //     label: t("function_screen.abbreviation"),
    //     grid: { xs: 12, sm: 12, md: 12 },
    // },
    {
      field: "code_like",
      type: "text",
      label: t("function_screen.code"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "organization_id_equal",
      label: t("function_screen.organization"),
      endpoint: "admin/organization",
      queryField:
        i18n.languages[0] === "vi" ? "name_like" : "english_name_like",
      labelField: i18n.languages[0] === "vi" ? "name" : "english_name",
      valueField: "id",
      type: "autocompleteFilter",
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
      size: "medium",
    },
    // {
    //     field: "sub_code_like",
    //     type: "text",
    //     label: t("function_screen.sub_code"),
    //     grid: { xs: 12, sm: 12, md: 12 },
    // },
  ];
  return { columns, filterInputs };
}
