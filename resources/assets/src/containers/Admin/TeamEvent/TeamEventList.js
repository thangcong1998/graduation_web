import React, { useContext, useState } from "react";
import { useFetch } from "../../../api/api";
import { Button } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import TeamEventInput from "./TeamEventInput";
import { useHistory } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";

export default function TeamEventList(props) {
  const [endpoint] = useState("/admin/teamEvent");
  const { perms } = useContext(AuthContext);
  const { t } = useTranslation();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const history = useHistory();
  const [params, setParams] = useState(initialParams);

  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/teamEvent",
    params,
  ]);

  const { columns, filterInputs } = TeamEventInput();
  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });
  const [checked, setChecked] = useState([]);
  // const ButtonAdd = (
  //         <Button onClick={() => history.push("/teamEvent/create")} variant={"contained"} color={"primary"}>
  //             {t("event_team_screen.create_new")}
  //         </Button>)

  return (
    <React.Fragment>
      <PaperContainer>
        <TableToolbar
          addButton={{
            render: (
              <div>
                {checkPerm(perms, "list_athletes_management") && (
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/teamEvent/create")}
                  >
                    {t("button.register")}
                  </Button>
                )}
              </div>
            ),
          }}
          columns={columnCheck}
          endpointDelete={"/admin/bulkDelete/listAthletesTeam"}
          refetch={refetch}
          endpoint={"/admin/exportListAthletesTeam"}
          nameFileExport={"Team_Event"}
          checked={checked}
          setChecked={setChecked}
          filterInput={filterInputs}
          handleChangeParams={setParams}
          loading={loading}
          showDelete={checkPerm(perms, "team_delete")}
        />
        <DataTable
          data={data?.data}
          columns={columnCheck.columnChecked}
          actionColumn={{
            onEdit: {
              // display: checkPerm(perms, "team_view"),
              display: true,
              callback: (row) => history.push("/teamEvent/" + row.id),
            },
            onDelete: {
              // display: checkPerm(perms, "team_delete"),
              display: true,
              action: "force",
            },
            onRestore: true,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
          }}
          onClickRow={
            // checkPerm(perms, "team_view") ? "/team" : null
            "/teamEvent"
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
