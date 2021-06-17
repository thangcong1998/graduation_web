import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = [
    {
      field: "name",
      title: t("venue_screen.name"),
      display: true,
      sort: true,
    },
    {
      field: "address",
      title: t("venue_screen.address"),
      display: true,
      sort: false,
    },
    // {
    //   field: "",
    //   title: t("accommodation_screen.link"),
    //   display: true,
    //   sort: false,
    //   props: {onClick: () => {}},
    //   render: (row) =>
    //       row.latitude && row.longtitude && (
    //           <a
    //               href={`http://www.google.com/maps/place/${row.latitude},${row.longtitude}`}
    //           >http://www.google.com/maps/place/...</a>
    //       ),
    // },
  ];

  const filterInputs = [
    {
      field: "name_like",
      type: "text",
      label: t("venue_screen.name"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "region_like",
      label: t("venue_screen.region"),
      endpoint: "admin/regions?level_like=1",
      queryField: "name_like",
      labelField: "name",
      valueField: "id",
      type: "autocompleteFilter",
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
      size: "medium",
    },
    {
      field: "address_like",
      type: "text",
      label: t("venue_screen.address"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
  ];
  return { columns, filterInputs };
}
