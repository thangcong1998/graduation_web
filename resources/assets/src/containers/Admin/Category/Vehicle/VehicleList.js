import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import VehicleInput from "./VehicleInput";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../../components/Dialog";
import VehicleForm from "./VehicleForm";
import i18n from "../../../../i18n/i18n";
import Pagination from "../../../../components/table/Pagination";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { Button } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";

export default function CardTemplateList(props) {
    const [endpoint, setEndpoint] = useState("/admin/vehicle");
    const api = useAPI();
    const { dialog, handleClose } = useDialog();
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const history = useHistory();
    const [params, setParams] = useState(initialParams);

    const { data: data, revalidate: refetch, loading: loading } = useFetch([
        "get",
        "/admin/vehicle",
        params,
    ]);

    const { columns, filterInputs } = VehicleInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });

    const editVehicle = async (row) => {
        await dialog({
            title: i18n.t("vehicle_screen.vehicle_update"),
            content: (
                <VehicleForm row={row} close={handleClose} refetch={refetch} />
            ),
        });
    };
    const [checked, setChecked] = useState([]);
    const syncData = async () => {
        try {
            let res = await api.fetcher("post", `admin/syncVehicle`, {});
            refetch();
        } catch (e) {}
    };
    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        render: (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => syncData()}
                            >
                                <SyncIcon />
                                {t("team_screen.sync")}
                            </Button>
                        ),
                        display: true,
                    }}
                    columns={columnCheck}
                    checked={checked}
                    setChecked={setChecked}
                    endpoint={"/admin/exportVehicle"}
                    endpointDelete={"/admin/deleteListVehicle"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"Vehicle"}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                    showDelete={false}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: true,
                            callback: (row) => editVehicle(row),
                        },
                        onDelete: {
                            display: false,
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={(row) => editVehicle(row)}
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
