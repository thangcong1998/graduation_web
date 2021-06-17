import React, { useState, useEffect, useContext, useMemo } from "react";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import RegistrationInputs from "./FunctionRefereeInput";
import { adminApi } from "../../../routes/AdminRoutes";
import { useHistory } from "react-router-dom";
import { Paper, makeStyles } from "@material-ui/core";
import Pagination from "../../../components/table/Pagination";
import { IconButton, Button, ButtonGroup } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { checkPerm, profile_status } from "../../../common/constants";
import { AuthContext } from "../../AuthProvider";

export default function RegistrationList(props) {
  const [endpoint, setEndpoint] = useState("/admin/functions_referee");
  const { t, i18n } = useTranslation();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const classes = useStyle();
  const history = useHistory();
  const { perms } = useContext(AuthContext);
  const api = useAPI();
  const [params, setParams] = useState(initialParams);
  const [checked, setChecked] = useState([]);
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/functions_referee",
    params,
  ]);

  const GroupButton = (
    <ButtonGroup variant="contained" color="primary">
      <ButtonGroup variant="contained" color="primary">
        <Button
          startIcon={<AddIcon />}
          style={{
            color: "#ffffff",
          }}
          color="primary"
          variant="contained"
          onClick={() => {
            history.push("/functionReferee/Create");
          }}
        >
          {t("function_referee_screen.create_referee")}
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );

  const { filterInputs } = RegistrationInputs();

  const columns = [
    {
      field: "name",
      title: t("function_referee_screen.name"),
      display: true,
      sort: true,
    },
    {
      field: "english_name",
      title: t("function_referee_screen.english_name"),
      display: true,
      sort: true,
    },
    {
      field: "event_id",
      title: t("function_referee_screen.event"),
      display: true,
      render: (row) => (
        <p>
          {i18n.language == "vi" ? row?.event?.name : row?.event?.english_name}
        </p>
      ),
    },
    {
      field: "sport",
      title: t("function_referee_screen.sport"),
      display: true,
      render: (row) => (
        <p>
          {i18n.language == "vi"
            ? row?.event?.sport_discipline?.sport?.name
            : row?.event?.sport_discipline?.sport?.english_name}
        </p>
      ),
    },
  ];

  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });

  return (
    <React.Fragment>
      <Paper style={{ padding: "5px 10px 10px 10px" }}>
        <TableToolbar
          addButton={{
            render: checkPerm(perms, "function_referee_add") ? (
              GroupButton
            ) : (
              <div></div>
            ),
          }}
          endpoint={"/admin/exportFunctionReferee"}
          nameFileExport={"Function referee"}
          columns={columnCheck}
          handleChangeParams={setParams}
          loading={loading}
          checked={checked}
          setChecked={setChecked}
          endpointDelete={"/admin/bulkDelete/functionReferee"}
          refetch={() => {
            refetch();
          }}
          showDelete={checkPerm(perms, "function_referee_delete")}
        />
        <DataTable
          data={data?.data}
          columns={[
            ...columnCheck.columnChecked,
            {
              display: true,
              props: { onClick: (row) => {} },
              render: (row) => {},
            },
          ]}
          actionColumn={{
            onEdit: {
              display: checkPerm(perms, "function_referee_edit"),
              callback: (row) =>
                history.push("/functionReferee/" + row.id, { row: row }),
            },
            onDelete: {
              display: checkPerm(perms, "function_referee_delete"),
              action: "force",
            },
            onRestore: true,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
          }}
          checked={checked}
          onCheck={setChecked}
          onClickRow={
            checkPerm(perms, "function_referee_edit")
              ? "/functionReferee"
              : null
          }
          onSort={setParams}
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
      </Paper>
    </React.Fragment>
  );
}

const useStyle = makeStyles((theme) => ({
  table: {
    marginTop: 10,
    width: "100%",
    fontSize: "1rem",
  },
  cellHead: {
    padding: 10,
    fontWeight: 549,
    textAlign: "start",
    width: "10%",
    backgroundColor: "#9c9a9a2e",
  },
  cell: {
    width: "25%",

    textAlign: "start",
    padding: 4,
  },
  buttonSearch: {
    backgroundColor: "#2296f3",
    color: "white",
    marginTop: 10,
    fontWeight: 400,
  },
  actionColumn: {
    padding: 3,
  },
  attachImg: {
    width: 300,
    height: 400,
    objectFit: "contain",
  },
}));
