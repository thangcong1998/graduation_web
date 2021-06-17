import React from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
  const { t } = useTranslation();
  const columns = [
    {
      field: "name",
      title: t("card_template_screen.name"),
      display: true,
      sort: true,
      render: (row) =>
        row.name &&
        row.background_color && (
          <p>
            <b
              style={{
                backgroundColor: row.background_color,
                color: row.background_color,
                padding: 5,
              }}
            >
              0000
            </b>{" "}
            {row.name}
          </p>
        ),
    },
    {
      field: "text",
      title: t("card_template_screen.text"),
      display: true,
      // sort: true,
    },
  ];

  const filterInputs = [
    {
      field: "name_like",
      type: "text",
      label: t("card_template_screen.name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "background_color_like",
      type: "text",
      label: t("card_template_screen.back_color"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "text_like",
      type: "text",
      label: t("card_template_screen.text"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
  ];
  return { columns, filterInputs };
}
