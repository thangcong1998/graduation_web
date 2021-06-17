import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../api/api";
import Datatable from "../../../components/table/DataTable";
import { adminPrefix } from "../../../routes/AdminRoutes";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import SportInputs from "./SportInputs";
import { useHistory } from "react-router-dom";
import SportDiscipline from "./SportDiscipline";
import { useDialog } from "../../../components/Dialog";
import SportForm from "./SportForm";
import { Paper } from "@material-ui/core";
import SportDisciplineForm from "./SportDisciplineForm";
import SportDisciplineEventForm from "./SportDisciplineEventForm";
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
    const endpoint = "/admin/sport";
    const history = useHistory();
    const [params, setParams] = useState(initialParams);
    const { columns, filterInputs } = SportInputs();
    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        endpoint,
        params,
    ]);
    const { dialog, handleClose } = useDialog();
    const GroupAddbtn = (
        <ButtonGroup variant="contained" color="primary">
            <ButtonAdd
                text={t("sport_screen.sport")}
                onClick={() => {
                    addSport();
                }}
            />
            <ButtonAdd
                text={t("sport_screen.sport_discipline")}
                onClick={() => {
                    addSportDiscipline();
                }}
            />
            <ButtonAdd
                text={t("sport_screen.sport_discipline_event")}
                onClick={() => {
                    addSportDisciplineEvent(
                        history.push("/sportDisciplineEvent/create")
                    );
                }}
            />
        </ButtonGroup>
    );
    const addSport = async (row) => {
        await dialog({
            title: row
                ? t("sport_screen.update_sport")
                : t("sport_screen.add_sport"),
            content: (
                <SportForm row={row} close={handleClose} refetch={refetch} />
            ),
        });
    };
    const addSportDiscipline = async (row) => {
        await dialog({
            title: t("sport_screen.add_sport_discipline"),
            content: (
                <SportDisciplineForm
                    row={row}
                    close={handleClose}
                    refetch={refetch}
                />
            ),
        });
    };
    const addSportDisciplineEvent = async (row) => {
        await dialog({
            title: t("sport_screen.add_sport_discipline_event"),
            content: (
                <SportDisciplineEventForm
                    row={row}
                    close={handleClose}
                    refetch={refetch}
                />
            ),
        });
    };
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        render: checkPerm(perms, "sport_management") ? (
                            GroupAddbtn
                        ) : (
                            <div></div>
                        ),
                    }}
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
                            callback: (row) => addSport(row),
                        },
                        onDelete: {
                            display: false,
                            action: "force",
                        },
                        onRestore: false,
                        endpoint: endpoint,
                        refetch: refetch,
                    }}
                    onClickRow={{ collapse: true }}
                    onSort={setParams}
                    loading={loading}
                    collapse={(row) => (
                        <SportDiscipline sport={row} refetch={refetch} />
                    )}
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
