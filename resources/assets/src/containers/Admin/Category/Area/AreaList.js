import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import AreaInput from "./AreaInput";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../../components/Dialog";
import AreaForm from "./AreaForm";
import Pagination from "../../../../components/table/Pagination";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { Button } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";

export default function CardTemplateList(props) {
    const [endpoint, setEndpoint] = useState("/admin/area");
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
        "/admin/area",
        params,
    ]);

    const { columns, filterInputs } = AreaInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });

    const editArea = async (row) => {
        await dialog({
            title: t("area_screen.area_update"),
            content: (
                <AreaForm row={row} close={handleClose} refetch={refetch} />
            ),
        });
    };
    const [checked, setChecked] = useState([]);

    const syncData = async () => {
        try {
            let res = await api.fetcher("post", `admin/syncArea`, {});
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
                    endpoint={"/admin/exportArea"}
                    endpointDelete={"/admin/deleteListArea"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"Area"}
                    checked={checked}
                    setChecked={setChecked}
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
                            callback: (row) => editArea(row),
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
                    onClickRow={(row) => editArea(row)}
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
            </PaperContainer>
        </React.Fragment>
    );
}
