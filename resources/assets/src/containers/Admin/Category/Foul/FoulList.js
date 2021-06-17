import React, { useContext, useState } from "react";
import { useFetch } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import FoulInput from "./FoulInput";
import { useHistory } from "react-router-dom";
import Pagination from "../../../../components/table/Pagination";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";

export default function UserList(props) {
    const [endpoint, setEndpoint] = useState("/admin/foul");
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const history = useHistory();
    const [params, setParams] = useState(initialParams);
    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        "/admin/foul",
        params,
    ]);
    const { columns, filterInputs } = FoulInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    const [checked, setChecked] = useState([]);

    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        text: t("foul_screen.foul"),
                        onClick: () => {
                            history.push("/foul/create");
                        },
                        display: checkPerm(perms, "foul_add"),
                    }}
                    columns={columnCheck}
                    endpoint={"/admin/exportFoul"}
                    endpointDelete={"/admin/deleteListFoul"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"Foul"}
                    checked={checked}
                    setChecked={setChecked}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                    showDelete={checkPerm(perms, "foul_delete")}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: checkPerm(perms, "foul_edit"),
                            callback: (row) => history.push("/foul/" + row.id),
                        },
                        onDelete: {
                            display: checkPerm(perms, "foul_delete"),
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={"/foul"}
                    onSort={setParams}
                    checked={checked}
                    onCheck={setChecked}
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
