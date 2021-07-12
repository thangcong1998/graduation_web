import React from "react";
import { useTranslation } from "react-i18next";
import { CheckProfileStatus, CheckSex } from "../../../common/constants";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = [
    {
      field: "given_name",
      title: t("member_screen.given_name"),
      display: true,
      sort: true,
    },
    {
      field: "family_name",
      title: t("member_screen.family_name"),
      display: true,
      sort: true,
    },
    {
      field: "sex",
      title: t("member_screen.sex"),
      display: true,
      render: (row) => {
        return CheckSex(row.sex, t);
      },
    },
    // {
    //   field: "organization",
    //   title: t("member_screen.organization"),
    //   display: true,
    //   render: (row) => {
    //     return row?.organization?.abbreviation;
    //   },
    // },
    // {
    //   field: "function",
    //   title: t("member_screen.function"),
    //   display: true,
    //   render: (row) => {
    //     return i18n.languages[0] == "en"
    //       ? row?.function?.english_name
    //       : row?.function?.name;
    //   },
    // },
    {
      field: "team",
      title: t("team_screen.team"),
      display: true,
      render: (row) => {
        return i18n.languages[0] == "en"
          ? row?.team?.english_name
          : row?.team?.name;
      },
    },
    // {
    //   field: "sport",
    //   title: t("member_screen.sport"),
    //   display: true,
    //   render: (row) => {
    //     return i18n.languages[0] == "en"
    //       ? row?.sport?.english_name
    //       : row?.sport?.name;
    //   },
    // },
  ];

  const filterInputs = [
    {
      field: "given_name_like",
      type: "text",
      label: t("member_screen.given_name"),
      grid: { xs: 12, sm: 12, md: 12 },
    },
    {
      field: "family_name_like",
      type: "text",
      label: t("member_screen.family_name"),
      grid: { xs: 12, sm: 12, md: 12 },
    },
    {
      field: "cardTemplate:name_like",
      type: "text",
      label: t("member_screen.card_template"),
      grid: { xs: 12, sm: 12, md: 12 },
    },
    {
      field: "organization:abbreviation_like",
      type: "text",
      label: t("member_screen.organization"),
      grid: { xs: 12, sm: 12, md: 12 },
    },
    {
      field:
        i18n.languages[0] === "en"
          ? "function:english_name_like"
          : "function:name_like",
      type: "text",
      label: t("member_screen.function"),
      grid: { xs: 12, sm: 12, md: 12 },
    },
    {
      field: "sport_id_equal",
      type: "autocompleteFilter",
      label: t("member_screen.sport"),
      queryField:
        i18n.languages[0] === "en" ? "english_name_like" : "name_like",
      labelField: i18n.languages[0] === "en" ? "english_name" : "name",
      endpoint: "/admin/sport",
      valueField: "id",
      size: "medium",
      grid: { xs: 12, sm: 12, md: 12 },
    },
  ];
  return { columns, filterInputs };
}
