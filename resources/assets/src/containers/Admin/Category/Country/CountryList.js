import React, { useContext, useState } from "react";
import { useFetch, useAPI } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import CountryInput from "./CountryInput";
import { useHistory } from "react-router-dom";
import Pagination from "../../../../components/table/Pagination";
import { checkPerm } from "../../../../common/constants";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { Button } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";

export default function UserList(props) {
  const [endpoint, setEndpoint] = useState("/admin/country");
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
    "/admin/country",
    params,
  ]);
  const { columns, filterInputs } = CountryInput();
  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });
  const [checked, setChecked] = useState([]);
  const syncData = async () => {
    try {
      let res = await api.fetcher("post", `admin/syncCountry`, {});
      refetch();
    } catch (e) {}
  };
  return (
    <React.Fragment>
      <PaperContainer>
        <TableToolbar
          addButton={{
            display: true,
            text: t("country_screen.country"),
            onClick: () => {
              history.push("/country/create");
            },
          }}
          columns={columnCheck}
          endpoint={"/admin/exportCountry"}
          endpointDelete={"/admin/deleteListCountry"}
          refetch={refetch}
          actionDelete={"force"}
          nameFileExport={"Country"}
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
              display: checkPerm(perms, "country_view"),
              callback: (row) => history.push("/country/" + row.id),
            },
            onDelete: {
              display: true,
              action: "force",
            },
            onRestore: true,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
          }}
          onClickRow={checkPerm(perms, "country_view") ? "/country" : null}
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
