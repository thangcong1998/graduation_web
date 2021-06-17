import React, { useState } from "react";
import DataTable from "../../../components/table/DataTable";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import AuditDetailInput from "./AuditDetailInput";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../components/Dialog";
import { Paper } from "@material-ui/core";
import AuditInput from "./AuditInput";

export default function CardTemplateList(props) {
    const { rowData, keyData } = props;

    const history = useHistory();
    const [params, setParams] = useState();

    const { columns, filterInputs } = AuditDetailInput({ keyData: keyData });

    return (
        <React.Fragment>
            <Paper style={{ padding: "5px 10px 10px 10px" }}>
                <DataTable
                    data={rowData}
                    columns={columns}
                    onSort={setParams}
                />
            </Paper>
        </React.Fragment>
    );
}
