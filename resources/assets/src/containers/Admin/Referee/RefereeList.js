import React, { useState, useContext } from "react";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import RegistrationInputs from "./RefereeInput";
import { useHistory } from "react-router-dom";
import { Paper, makeStyles } from "@material-ui/core";
import Pagination from "../../../components/table/Pagination";
import { Button, ButtonGroup } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { checkPerm } from "../../../common/constants";
import { AuthContext } from "../../AuthProvider";
import { CheckSex } from "../../../common/constants";

export default function RegistrationList(props) {
  const [endpoint, setEndpoint] = useState("/admin/referee");
  const { t, i18n } = useTranslation();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const classes = useStyle();
  const history = useHistory();
  const { perms } = useContext(AuthContext);
  const [params, setParams] = useState(initialParams);
  const [checked, setChecked] = useState([]);
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/referee",
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
            history.push("/referee/create");
          }}
        >
          {`${t("button.add")} ${t("referee_screen.referee")}`}
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );

  const { filterInputs } = RegistrationInputs();

  const columns = [
    {
      field: "accreditation_number",
      title: t("referee_screen.accreditation_number"),
      display: true,
      sort: true,
    },
    {
      field: "given_name",
      title: t("member_screen.given_name"),
      display: true,
      sort: true,
    },
    {
      field: "family_name",
      title: t("member_screen.family_name"),
      display: true,
      sort: true,
    },
    {
      field: "sex",
      title: t("member_screen.sex"),
      display: true,
      render: (row) => {
        return CheckSex(row.sex, t);
      },
    },
    {
      field: "nationality",
      title: t("member_registration.nationality"),
      display: true,
      render: (row) => {
        return row?.nationality?.name;
      },
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
            render: checkPerm(perms, "referee_management_add") ? (
              GroupButton
            ) : (
              <div></div>
            ),
          }}
          endpoint={"/admin/exportReferee"}
          nameFileExport={"Referee"}
          columns={columnCheck}
          handleChangeParams={setParams}
          loading={loading}
          checked={checked}
          setChecked={setChecked}
          endpointDelete={"/admin/bulkDelete/Referee"}
          refetch={() => {
            refetch();
          }}
          showDelete={checkPerm(perms, "referee_management_delete")}
        />
        <DataTable
          data={data?.data}
          columns={[...columnCheck.columnChecked]}
          actionColumn={{
            onEdit: {
              display: checkPerm(perms, "referee_management_view"),
              callback: (row) => history.push("/referee/" + row.id),
            },
            onDelete: {
              display: checkPerm(perms, "referee_management_delete"),
              action: "force",
            },
            onRestore: false,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
            props: {
              style: {
                with: 100,
                textAlign: "right",
              },
            },
          }}
          checked={checked}
          onCheck={setChecked}
          onClickRow={
            checkPerm(perms, "referee_management_view") ? "/referee" : null
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
