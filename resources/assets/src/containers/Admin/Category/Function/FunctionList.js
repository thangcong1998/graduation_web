import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import FunctionInput from "./FunctionInput";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Pagination from "../../../../components/table/Pagination";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDialog } from "../../../../components/Dialog";
import { Button } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";

export default function FunctionList(props) {
    const endpoint = "/admin/function";
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const history = useHistory();
    const [loading_delete, setLoadingDelete] = useState(false);
    const [params, setParams] = useState(initialParams);

    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        "/admin/function",
        params,
    ]);
    const api = useAPI();
    const { dialog, handleClose } = useDialog();

    const { columns, filterInputs } = FunctionInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    const [checked, setChecked] = useState([]);
    const formData = new FormData();
    const CheckDelete = async (row) => {
        setLoadingDelete(true);
        formData.append("status", "check");
        try {
            let res = await api.fetcher("delete", "admin/function/" + row.id, {
                status: "check",
            });
            if (res) {
                deleteConfirm(row, refetch, res);
                setLoadingDelete(false);
            }
        } catch (e) {
            setLoadingDelete(false);
        }
    };
    const deleteConfirm = async (row, refetch, message) => {
        await dialog({
            title: (
                <div>
                    <p style={{ padding: 0, margin: 0 }}>
                        {t("function_screen.delete_start")}
                    </p>
                    <p style={{ padding: "0px 0px 0px 10px", margin: 0 }}>
                        {t("member_screen.member") +
                            ":" +
                            message.member[0].member}
                    </p>
                    <p style={{ padding: "0px 0px 0px 10px", margin: 0 }}>
                        {t("staff_screen.staff") + ":" + message.staff[0].staff}
                    </p>
                    <p style={{ padding: "0px 0px 0px 10px", margin: 0 }}>
                        {t("volunteer_screen.volunteer") +
                            ":" +
                            message.volunteer[0].volunteer}
                    </p>
                    <p style={{ padding: 0, margin: 0 }}>
                        {t("function_screen.delete_end")}
                        {t("action_column.delete.confirm")}
                    </p>
                </div>
            ),
            type: "confirm",
            confirmationText: t("action_column.delete.confirm_text"),
            cancellationText: t("action_column.delete.cancel_text"),
        });
        try {
            const res = await api.fetcher(
                "delete",
                "admin/function/" + row.id,
                {
                    status: "delete",
                }
            );
            if (res) {
                refetch();
                handleClose();
            }
        } catch (e) {
            handleClose();
        }
    };
    const syncData = async () => {
        try {
            let res = await api.fetcher("post", `admin/syncFunction`, {});
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
                                <SyncIcon /> {t("team_screen.sync")}
                            </Button>
                        ),
                    }}
                    columns={columnCheck}
                    endpoint={"/admin/exportFunction"}
                    nameFileExport={"Function"}
                    checked={checked}
                    setChecked={setChecked}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                    // showDelete={checkPerm(perms, "function_delete")}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        // onEdit: {
                        //   display: checkPerm(perms,"function_view"),
                        //   callback: (row) =>
                        //     history.push(adminPrefix + "/function/" + row.id),
                        // },
                        // onDelete: {
                        //   display: checkPerm(perms,"function_delete"),
                        //   action: "force",
                        // },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                        render: (row) => (
                            <React.Fragment>
                                {checkPerm(perms, "function_view") && (
                                    <IconButton
                                        color="primary"
                                        variant="contained"
                                        onClick={() =>
                                            history.push("/function/" + row.id)
                                        }
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                                {/*{checkPerm(perms, "function_delete") && (*/}
                                {/*  <IconButton*/}
                                {/*    color="secondary"*/}
                                {/*    variant="contained"*/}
                                {/*    onClick={() => CheckDelete(row)}*/}
                                {/*    disabled={loading_delete}*/}
                                {/*  >*/}
                                {/*    <DeleteIcon />*/}
                                {/*  </IconButton>*/}
                                {/*)}*/}
                            </React.Fragment>
                        ),
                    }}
                    onClickRow={
                        checkPerm(perms, "function_view") && "/function"
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
