import React, { useContext, useState } from "react";
import { useFetch } from "../../../api/api";
import Datatable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
// import { columns, filterInputs } from "./UserInputs";
import UserInputs from "./UserInputs";
import { useHistory } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import PaperContainer from "../../../components/PaperContainer";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";

export default function UserList(props) {
    const { t } = useTranslation();
    const { perms, admin } = useContext(AuthContext);
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const endpoint = "/admin/user";
    const history = useHistory();
    const [params, setParams] = useState(initialParams);
    const { columns, filterInputs } = UserInputs();
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

    const checkDelete = (row) => {
        let check;
        // check đang đăng nhập
        if (row?.id === admin?.id && admin?.role?.name === row?.role?.name) {
            check = false;
        } else {
            if (row?.role?.name === "admin") {
                if (admin?.role?.name === "admin") {
                    check = true;
                } else {
                    check = false;
                }
            } else {
                check = true;
            }
        }
        return check;
    };

    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        text: t("user_screen.user"),
                        onClick: () => {
                            history.push("/user/create");
                        },
                        display: checkPerm(perms, "user_add"),
                    }}
                    endpoint={"/admin/exportUser"}
                    endpointDelete={"/admin/bulkDelete/user"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"User"}
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
                    showDelete={false}
                />
                <Datatable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: checkPerm(perms, "user_view"),
                            callback: (row) => history.push("/user/" + row.id),
                        },
                        onDelete: {
                            display: (row) =>
                                checkPerm(perms, "user_delete") &&
                                checkDelete(row),
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={checkPerm(perms, "user_view") ? "/user" : null}
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
