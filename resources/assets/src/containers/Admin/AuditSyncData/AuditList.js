import React, { useContext, useEffect, useState } from "react";
import { useAPI, useFetch } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import AreaInput from "../Category/Area/AreaInput";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../components/Dialog";
import AreaForm from "../Category/Area/AreaForm";
import { Paper } from "@material-ui/core";
import Pagination from "../../../components/table/Pagination";
import AuditInput from "./AuditInput";
import { AuthContext } from "../../AuthProvider";

export default function AuditList(props) {
    const [endpoint, setEndpoint] = useState("/admin/sync_data_setting");
    const api = useAPI();
    const { t } = useTranslation();
    const [rowData, setRowData] = useState();
    const [keyData, setKeyData] = useState();
    const { dialog, handleClose } = useDialog();
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const history = useHistory();
    const [params, setParams] = useState(initialParams);

    const { data: data, revalidate: refetch, loading: loading } = useFetch([
        "get",
        `/admin/sync_data_setting`,
        params,
    ]);
    console.log("data", data);
    const { columns, filterInputs } = AuditInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });

    const map = (old_values, new_values) => {
        const arr = [];
        const values =
            Object.keys(new_values).length == 0 ? old_values : new_values;
        Object.keys(values).forEach((key) =>
            key !== "id" && key !== "password"
                ? arr.push({
                      key: key,
                      old: old_values[key],
                      new: new_values[key],
                  })
                : ""
        );
        return arr;
    };
    const onRowClick = (row) => {
        setKeyData(row.auditable_type);
        setRowData(map(row.old_values, row.new_values));
    };

    useEffect(() => {
        if (rowData) {
            openDialog(rowData);
        }
    }, [rowData]);
    const [checked, setChecked] = useState([]);

    return (
        <React.Fragment>
            <Paper style={{ padding: "5px 10px 10px 10px" }}>
                <TableToolbar
                    addButton={{
                        render: <div></div>,
                    }}
                    columns={columnCheck}
                    refetch={refetch}
                    checked={checked}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                />

                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    onClickRow={onRowClick}
                    onSort={setParams}
                    // checked={undefined}
                    //           // onCheck={setChecked}
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
