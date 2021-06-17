import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import MatchResultInput from "./MatchResultInput";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../components/Dialog";
// import AreaForm from "./AreaForm";
import { Paper } from "@material-ui/core";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";

export default function MatchResultList(props) {
    const [endpoint, setEndpoint] = useState("/admin/match");
    const api = useAPI();
    const { perms } = useContext(AuthContext);
    const { dialog, handleClose } = useDialog();
    const { t } = useTranslation();
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const history = useHistory();
    const [params, setParams] = useState(initialParams);

    const { data: data, revalidate: refetch, loading: loading } = useFetch([
        "get",
        "/admin/match",
        params,
    ]);

    const { columns, filterInputs } = MatchResultInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    const [checked, setChecked] = useState([]);
    const checkDelete = (row) => {
        if (row?.id === 1 || row?.id === 2) {
            return false;
        }
        return true;
    };
    return (
        <React.Fragment>
            <Paper style={{ padding: "5px 10px 10px 10px" }}>
                <TableToolbar
                    addButton={{
                        text: t("role_screen.role"),
                        onClick: () => {
                            history.push("/matchResult/create");
                        },
                        display: false,
                    }}
                    columns={columnCheck}
                    endpointDelete={"/admin/bulkDelete/role"}
                    refetch={refetch}
                    actionDelete={"force"}
                    endpoint={"/admin/exportRole"}
                    nameFileExport={"Role"}
                    checked={checked}
                    setChecked={setChecked}
                    handleChangeParams={setParams}
                    loading={loading}
                    showDelete={false}
                    showExport={false}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: true,
                            callback: (row) => history.push("/matchResult/" + row.id),
                        },
                        onDelete: {
                            display: (row) =>
                                checkPerm(perms, "match_delete") &&
                                checkDelete(row),
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={!checkPerm(perms, "match_view") ? "/matchResult" : null}
                    onSort={setParams}
                    checked={checked}
                    onCheck={setChecked}
                    loading={loading}
                />
                <Pagination
                    setParams={setParams}
                    count={data?.last_page}
                    page={params.page}
                    perPage={params.per_page}
                    fromTo={[data?.from, data?.to]}
                    total={data?.total}
                />
            </Paper>
        </React.Fragment>
    );
}
