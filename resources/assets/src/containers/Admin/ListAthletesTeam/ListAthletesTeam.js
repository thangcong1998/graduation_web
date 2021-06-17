import React, { useContext, useState, useMemo } from "react";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useHistory, useLocation } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";
import { adminApi } from "../../../routes/AdminRoutes";
import { Button } from "@material-ui/core";

export default function ListAthletesTeam(props) {
    const [endpoint] = useState("/admin/team");
    const { perms } = useContext(AuthContext);
    const location = useLocation();
    const [checked, setChecked] = useState([]);
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const api = useAPI();
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const [params, setParams] = useState(initialParams);

    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        `admin/teamEvent?event_id_equal=${location?.state?.id}`,
        params,
    ]);
    const { data: event } = useFetch([
        "get",
        `admin/sportDisciplineEvent?id_equal=${location?.state?.id}`,
    ]);

    const columns = useMemo(
        () => [
            {
                field: "team",
                title: t("team_screen.team"),
                display: true,
                // sort: true,
                render: (row) => (
                    <div>
                        {i18n.languages[0] == "vi"
                            ? row?.team?.name
                            : row?.team?.english_name}
                    </div>
                ),
            },
            {
                field: "name",
                title: t("ListAthletes_screen.name"),
                display: true,
                // sort: true,
                render: (row) => <div>{row?.name}</div>,
            },
        ],
        [i18n.languages]
    );

    const filterInputs = useMemo(
        () => [
            {
                field: "team_id",
                queryField:
                    i18n.languages[0] == "en"
                        ? "english_name_like"
                        : "name_like",
                labelField: i18n.languages[0] == "en" ? "english_name" : "name",
                valueField: "id",
                endpoint: adminApi + "/team",
                type: "autocompleteFilter",
                label: t("team_screen.team"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: "name_like",
                value: "name_like",
                type: "text",
                label: t("ListAthletes_screen.name"),
                display: true,
                grid: { xs: 12, sm: 6, md: 6 },
            },
        ],
        [i18n.languages]
    );
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });

    const event_name = event?.data[0];
    const discipline_name = event?.data[0]?.sport_discipline;
    const sport_name = event?.data[0]?.sport_discipline?.sport;
    return (
        <React.Fragment>
            <PaperContainer>
                {loading == false && event_name && (
                    <h2>
                        {i18n?.language == "vi"
                            ? sport_name?.name
                            : sport_name?.english_name}{" "}
                        /{" "}
                        {i18n?.language == "vi"
                            ? discipline_name?.name
                            : discipline_name?.english_name}{" "}
                        /{" "}
                        {i18n?.language == "vi"
                            ? event_name?.name
                            : event_name?.english_name}
                    </h2>
                )}
                <TableToolbar
                    addButton={{
                        render: (
                            <div>
                                {checkPerm(
                                    perms,
                                    "list_athletes_management"
                                ) && (
                                    <Button
                                        size="medium"
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            history.push(
                                                "/sport/listAthletesTeam/create",
                                                {
                                                    event_id:
                                                        location?.state?.id,
                                                }
                                            )
                                        }
                                    >
                                        {t("button.register")}
                                    </Button>
                                )}
                            </div>
                        ),
                    }}
                    endpoint={"/admin/exportListAthletesTeam"}
                    nameFileExport={"List Athletes"}
                    columns={columnCheck}
                    refetch={refetch}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                    showDelete={false}
                    checked={checked}
                    setChecked={setChecked}
                    showDelete={true}
                    endpointDelete={"/admin/bulkDelete/listAthletesTeam"}
                    actionDelete={"force"}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onDelete: {
                            display: false,
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={(row) =>
                        history.push("/sport/listAthletesTeam/create", {
                            event_id: location?.state?.id,
                            id: row?.id,
                        })
                    }
                    onSort={setParams}
                    loading={loading}
                    checked={checked}
                    onCheck={setChecked}
                />
                <Pagination
                    setParams={setParams}
                    count={data?.last_page}
                    page={params.page}
                    perPage={params.per_page}
                    fromTo={[data?.from, data?.to]}
                    total={data?.total}
                />
            </PaperContainer>
        </React.Fragment>
    );
}
