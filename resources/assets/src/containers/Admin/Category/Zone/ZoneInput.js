import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
  const { t } = useTranslation();
  const columns = [
    {
      field: "name",
      title: t("zone_screen.name"),
      display: true,
      sort: true,
      render: (row) =>
        row.name &&
        row.icon_url && (
          <p>
            <img
              height="20"
              src={process.env.REACT_APP_STORAGE_URL + "/" + row.icon_url}
            />
            <span style={{ paddingLeft: 5 }}>{row.name}</span>
          </p>
        ),
    },
  ];

  const filterInputs = [
    {
      field: "name_like",
      type: "text",
      label: t("zone_screen.name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
  ];
  return { columns, filterInputs };
}
