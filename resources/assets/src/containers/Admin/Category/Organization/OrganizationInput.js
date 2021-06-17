import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
  const { t } = useTranslation();
  const columns = [
    {
      field: "name",
      title: t("organization_screen.name"),
      display: true,
      sort: true,
    },
    {
      field: "english_name",
      title: t("organization_screen.english_name"),
      display: true,
      sort: true,
    },
    {
      field: "abbreviation",
      title: t("organization_screen.abbreviation"),
      display: true,
      // sort: true,
    },
  ];

  const filterInputs = [
    {
      field: "name_like",
      type: "text",
      label: t("organization_screen.name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "english_name_like",
      type: "text",
      label: t("organization_screen.english_name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "abbreviation_like",
      type: "text",
      label: t("organization_screen.abbreviation"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "is_holder_equal",
      type: "radio",
      label: t("organization_screen.is_holder"),
      display: true,
      options: [
        {
          value: null,
          label: t("organization_screen.all"),
        },
        {
          value: 1,
          label: t("organization_screen.is_holder_select.not_holder"),
        },
        {
          value: 2,
          label: t("organization_screen.is_holder_select.is_holder"),
        },
      ],
      grid: { xs: 12, sm: 6, md: 6 },
      render: (row) => (row.is_holder === 1 ? <p>No</p> : <p>Yes</p>),
    },
  ];
  return { columns, filterInputs };
}
