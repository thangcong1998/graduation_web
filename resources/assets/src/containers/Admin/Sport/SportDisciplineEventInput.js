import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../../routes/AdminRoutes";

export default function(props) {
    const { t, i18n } = useTranslation();
    const columns = useMemo(
        () => [
            {
                field: "sport_discipline",
                title: t("sport_discipline_event_screen.sport_discipline"),
                display: true,
                sort: false,
                render: row =>
                    row?.sport_discipline ? (
                        <p>
                            {i18n.language == "vi"
                                ? row.sport_discipline.name
                                : row.sport_discipline.english_name}
                        </p>
                    ) : null
            },
            {
                field: "name",
                title: t("sport_discipline_event_screen.event"),
                display: true,
                sort: false,
                render: row => (
                    <div>
                        {row.icon && (
                            <img
                                alt=""
                                src={
                                    process.env.MIX_REACT_APP_STORAGE_URL +
                                    "/" +
                                    row?.icon
                                }
                                width="30px"
                                height="30px"
                                style={{ marginRight: 20 }}
                            />
                        )}
                        {i18n.language == "vi" ? row?.name : row?.english_name}
                    </div>
                )
            },
            {
                field: "total_document",
                title: t("sport_discipline_event_screen.total_document"),
                display: true,
                sort: false,
                render: row => (row?.files ? <p>{row.files.length}</p> : null)
            }
        ],
        [i18n.languages]
    );

    const filterInputs = useMemo(
        () => [
            {
                field: "sport_discipline_id_equal",
                queryField:
                    i18n.languages[0] == "en"
                        ? "english_name_like"
                        : "name_like",
                labelField: i18n.languages[0] == "en" ? "english_name" : "name",
                valueField: "id",
                endpoint: adminApi + "/sportDiscipline",
                type: "autocompleteFilter",
                label: t("sport_discipline_screen.sport_discipline"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 }
            },
            {
                field: "id_equal",
                queryField:
                    i18n.languages[0] == "en"
                        ? "english_name_like"
                        : "name_like",
                labelField: i18n.languages[0] == "en" ? "english_name" : "name",
                valueField: "id",
                endpoint: adminApi + "/sportDisciplineEvent",
                type: "autocompleteFilter",
                label: t("sport_discipline_screen.event"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 }
            }
        ],
        [i18n.languages]
    );
    return { columns, filterInputs };
}
