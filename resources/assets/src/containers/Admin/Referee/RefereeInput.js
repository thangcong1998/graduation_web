import { useTranslation } from "react-i18next";
import { useAPI } from "../../../api/api";

export default function (props) {
  const { t, i18n } = useTranslation();

  const filterInputs = [
    {
      field: "given_name_like",
      type: "text",
      label: t("member_screen.given_name"),
      variant: "outlined",
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "family_name_like",
      type: "text",
      display: true,
      variant: "outlined",
      label: t("member_screen.family_name"),
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "accreditation_number_like",
      type: "text",
      display: true,
      variant: "outlined",
      label: t("referee_screen.accreditation_number"),
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "Sport_id",
      queryField: i18n.languages[0] == "en" ? "english_name_like" : "name_like",
      labelField: i18n.languages[0] == "en" ? "english_name" : "name",
      valueField: "id",
      endpoint: "/admin/sport",
      type: "autocompleteFilter",
      label: t("function_referee_screen.sport"),
      display: true,
      grid: { xs: 12, sm: 6, md: 6 },
    },
    {
      field: "sex_equal",
      type: "radio",
      display: true,
      variant: "outlined",
      options: [
        {
          label: t("administrative_division_screen.all"),
          value: null,
        },
        {
          label: t("referee_screen.male"),
          value: 2,
        },
        {
          label: t("referee_screen.female"),
          value: 1,
        },
      ],
      label: t("member_screen.sex"),
      grid: { xs: 12, sm: 12, md: 12 },
    },
  ];
  return { filterInputs };
}
