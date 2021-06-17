import React, { useContext, useState } from "react";
import { useFetch, useAPI } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import CardTemplateInput from "./CardTemplateInput";
import { useHistory } from "react-router-dom";
import Pagination from "../../../../components/table/Pagination";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";
import PaperContainer from "../../../../components/PaperContainer";
import { Button } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";

export default function CardTemplateList(props) {
    const endpoint = "/admin/cardTemplate";
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
        "/admin/cardTemplate",
        params,
    ]);

    const { columns, filterInputs } = CardTemplateInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });
    const [checked, setChecked] = useState([]);

    const syncData = async () => {
        try {
            let res = await api.fetcher("post", `admin/syncCardTemplate`, {});
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
                    checked={checked}
                    setChecked={setChecked}
                    endpointDelete={"/admin/deleteListCardTemplate"}
                    refetch={refetch}
                    endpoint={"/admin/exportCardTemplate"}
                    nameFileExport={"CardTemplate"}
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
                            display: checkPerm(perms, "card_template_view"),
                            callback: (row) =>
                                history.push("/cardTemplate/" + row.id),
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
                    onClickRow={
                        checkPerm(perms, "card_template_view")
                            ? "/cardTemplate"
                            : null
                    }
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
