import React, { useContext, useState } from "react";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import TeamInput from "./TeamInput";
import { useHistory } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";
import { Button } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";

export default function TeamList(props) {
  const [endpoint] = useState("/admin/team");
  const { perms } = useContext(AuthContext);
  const { t } = useTranslation();
  const api = useAPI();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const history = useHistory();
  const [params, setParams] = useState(initialParams);

  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/team",
    params,
  ]);

  const { columns, filterInputs } = TeamInput();
  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });
  const [checked, setChecked] = useState([]);
  const syncData = async () => {
    try {
      let res = await api.fetcher("post", `/syncTeam`, {});
      refetch();
    } catch (e) {}
  };

  return (
    <React.Fragment>
      <PaperContainer>
        <TableToolbar
          addButton={{
            display: false,
          }}
          columns={columnCheck}
          endpointDelete={"/admin/bulkDelete/team"}
          refetch={refetch}
          endpoint={"/admin/exportTeam"}
          nameFileExport={"Team"}
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
              display: checkPerm(perms, "team_view"),
              callback: (row) => history.push("/team/" + row.id),
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
          onClickRow={checkPerm(perms, "team_view") ? "/team" : null}
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
