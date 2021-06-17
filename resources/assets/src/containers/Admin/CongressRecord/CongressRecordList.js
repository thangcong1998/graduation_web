import React, { useContext, useState } from "react";
import { useFetch } from "../../../api/api";
import Datatable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import CongressRecordInput from "./CongressRecordInput";
import { useHistory } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import PaperContainer from "../../../components/PaperContainer";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";

export default function RecordList(props) {
    const { t } = useTranslation();
    const { perms, admin } = useContext(AuthContext);
    const initialParams = {
        per_page: 50,
        page: 1,
        is_seagame: 2,
    };
    const endpoint = "/admin/congressRecord";
    const history = useHistory();
    const [params, setParams] = useState(initialParams);
    const { columns, filterInputs } = CongressRecordInput();
    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        endpoint,
        params,
    ]);
    const [checked, setChecked] = useState([]);
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });

    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        text: t("congress_record_screen.congress_record"),
                        onClick: () => {
                            history.push("/congressRecord/create");
                        },
                        display: checkPerm(perms, "congress_record_add")
                            ? true
                            : false,
                    }}
                    endpoint={"/admin/exportCongressRecord"}
                    endpointDelete={"/admin/deleteListCongressRecord"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"CongressRecord"}
                    columns={columnCheck}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    trashed={{
                        display: false,
                        isTrash: params?.only_trashed,
                    }}
                    checked={checked}
                    setChecked={setChecked}
                    loading={loading}
                    showDelete={checkPerm(perms, "congress_record_delete")}
                />
                <Datatable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: checkPerm(perms, "congress_record_edit"),
                            callback: (row) =>
                                history.push("/congressRecord/" + row.id),
                        },
                        onDelete: {
                            display: checkPerm(perms, "congress_record_delete"),
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={
                        checkPerm(perms, "congress_record_edit")
                            ? "/congressRecord"
                            : null
                    }
                    checked={checked}
                    onCheck={setChecked}
                    onSort={setParams}
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
            </PaperContainer>
        </React.Fragment>
    );
}
