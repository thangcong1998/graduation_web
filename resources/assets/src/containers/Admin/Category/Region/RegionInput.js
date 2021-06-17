import React from "react";
import { useTranslation } from "react-i18next";
import { CheckLevel } from "../../../../common/constants";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = [
    {
      field: "name",
      title: t("administrative_division_screen.name"),
      display: true,
      sort: true,
    },
    {
      field: "level",
      title: t("administrative_division_screen.level"),
      display: true,
      render: (row) => {
        return CheckLevel(row.level, t);
      },
      sort: true,
    },
  ];
  const filterInputs = [
    {
      field: "name_like",
      type: "text",
      label: t("administrative_division_screen.name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "level_equal",
      type: "radio",
      options: [
        { label: t("administrative_division_screen.all"), value: null },
        { label: t("administrative_division_screen.province"), value: 1 },
        { label: t("administrative_division_screen.district"), value: 2 },
        { label: t("administrative_division_screen.wards"), value: 3 },
      ],
      label: t("administrative_division_screen.level"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
  ];
  return { columns, filterInputs };
}
