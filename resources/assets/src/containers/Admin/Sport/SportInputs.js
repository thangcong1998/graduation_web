import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function (props) {
  const { t, i18n } = useTranslation();
  const columns = useMemo(
    () => [
      {
        field: "name",
        title: t("sport_screen.name"),
        display: true,
        sort: true,
        render: (row) => (
          <div>
            {row?.icon && (
              <img
                alt=""
                src={process.env.MIX_REACT_APP_STORAGE_URL + "/" + row?.icon}
                width="30px"
                height="30px"
                style={{ marginRight: 20 }}
              />
            )}

            {row?.name + " - " + row?.english_name}
          </div>
        ),
      },
      {
        field: "code",
        title: t("sport_screen.code"),
        display: true,
        sort: true,
      },
      // {
      //   field: "english_name",
      //   title: t("sport_screen.english_name"),
      //   display: true,
      //   sort: true,
      //   header: {
      //     style: {
      //       width: "30%",
      //     },
      //   },
      // },
    ],
    [i18n.languages]
  );

  const filterInputs = useMemo(
    () => [
      {
        field: "code_like",
        type: "text",
        label: t("sport_screen.code"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "id_equal",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: "/admin/sport",
        type: "autocompleteFilter",
        label: t("sport_screen.name"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      //   {
      //     field: "english_name_like",
      //     type: "text",
      //     label: t("sport_screen.english_name"),
      //     display: true,
      //     grid: { xs: 12, sm: 6, md: 6 },
      //   },
    ],
    [i18n.languages]
  );
  return { columns, filterInputs };
}
