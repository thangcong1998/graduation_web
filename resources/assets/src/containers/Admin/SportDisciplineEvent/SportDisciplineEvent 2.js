import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../api/api";
import Datatable from "../../../components/table/DataTable";
import { adminPrefix } from "../../../routes/AdminRoutes";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import SportDisciplineEventInput from "./SportDisciplineEventInput";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../components/Dialog";
import { Paper } from "@material-ui/core";
// import SportDisciplineEventForm from "./SportDisciplineEventForm";
import ButtonAdd from "../../../components/button/ButtonAddSolashi";
import { ButtonGroup, Button } from "@material-ui/core";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";

export default function SportList(props) {
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const api = useAPI();
    const endpoint = "/admin/sportDisciplineEvent";
    const history = useHistory();
    const [params, setParams] = useState(initialParams);
    const { columns, filterInputs } = SportDisciplineEventInput();
    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        endpoint,
        params,
    ]);
    // const GroupAddbtn = (
    //     <ButtonGroup variant="contained" color="primary">
    //         <ButtonAdd
    //             text={t("sport_screen.sport_discipline_event")}
    //             onClick={() => {
    //                 history.push("/sportDisciplineEvent/create");
    //             }}
    //         />
    //     </ButtonGroup>
    // );

    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{}}
                    columns={columnCheck}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    trashed={params?.only_trashed}
                    loading={loading}
                />
                <Datatable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: checkPerm(perms, "sport_management"),
                            callback: (row) =>
                                history.push("/scheduleCompetition/stageList", {
                                    row: row.id,
                                }),
                        },
                        onDelete: {
                            display: false,
                            action: "force",
                        },
                        onRestore: false,
                        endpoint: endpoint,
                        refetch: refetch,
                    }}
                    onClickRow={(row) =>
                        history.push("/scheduleCompetition/stageList", {
                            row: row.id,
                        })
                    }
                    onSort={setParams}
                    loading={loading}
                />
                <Pagination
                    setParams={setParams}
                    count={data?.last_page}
                    page={params?.page}
                    perPage={params.per_page}
                    fromTo={[data?.from, data?.to]}
                    total={data?.total}
                />
            </PaperContainer>
        </React.Fragment>
    );
}
