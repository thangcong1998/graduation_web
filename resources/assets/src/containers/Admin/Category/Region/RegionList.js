import React, { useContext, useState } from "react";
import { useFetch, useAPI } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import RegionInput from "./RegionInput";
import RegionForm from "./RegionForm";
import { useHistory } from "react-router-dom";
import Pagination from "../../../../components/table/Pagination";
import { checkPerm } from "../../../../common/constants";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { useDialog } from "../../../../components/Dialog";

export default function UserList(props) {
    const [endpoint, setEndpoint] = useState("/admin/regions");
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const api = useAPI();
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const history = useHistory();
    const [params, setParams] = useState(initialParams);
    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        "/admin/regions",
        params,
    ]);
    const { columns, filterInputs } = RegionInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    const [checked, setChecked] = useState([]);
    const { dialog, handleClose } = useDialog();
    const editRegion = async (row) => {
        await dialog({
            title: t("region_screen.region_edit"),
            content: (
                <RegionForm row={row} close={handleClose} refetch={refetch} />
            ),
        });
    };
    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        display: false,
                    }}
                    columns={columnCheck}
                    endpoint={"/admin/exportRegion"}
                    endpointDelete={"/admin/deleteListRegion"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"Region"}
                    checked={checked}
                    setChecked={setChecked}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                    showDelete={true}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: checkPerm(perms, "region_view"),
                            callback: (row) => editRegion(row),
                        },
                        onDelete: {
                            display: checkPerm(perms, "region_delete"),
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
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
