import React, { useContext, useState, useMemo } from "react";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useHistory } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";
import { adminApi } from "../../../routes/AdminRoutes";
import { useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function ListAthletes(props) {
  const [endpoint] = useState("/admin/team");
  const { event_id } = props;
  const location = useLocation();
  const history = useHistory();
  const { perms } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const api = useAPI();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const [checked, setChecked] = useState([]);

  const [params, setParams] = useState(initialParams);

  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    `admin/competition_individual`,
    params,
  ]);
  const columns = useMemo(
    () => [
      {
        field: "ad.no",
        title: t("time_keeping_staff_screen.accreditation_number"),
        display: true,
        // sort: true,
        render: (row) => <div>{row?.participant?.accreditation_number}</div>,
      },
      {
        field: "full_name",
        title: t("reprint_card_screen.name"),
        display: true,
        // sort: true,
        render: (row) => (
          <span>
            {row?.participant?.family_name} {row?.participant?.given_name}
          </span>
        ),
      },
      {
        field: "name",
        title: t("team_screen.team"),
        display: true,
        // sort: true,
        render: (row) => (
          <div>
            {i18n.languages[0] == "vi"
              ? row?.participant?.team?.name
              : row?.participant?.team?.english_name}
          </div>
        ),
      },
      {
        field: "sport",
        title: t("member_registration.sport"),
        display: true,
        render: (row) => (
          <div>
            {i18n.languages[0] == "vi"
              ? row?.event?.sport_discipline?.sport?.name
              : row?.event?.sport_discipline?.sport?.english_name}
          </div>
        ),
      },
      {
        field: "sport_discipline",
        title: t("member_registration.sport_discipline"),
        display: true,
        // sort: true,
        render: (row) => (
          <div>
            {i18n.languages[0] == "vi"
              ? row?.event?.sport_discipline?.name
              : row?.event?.sport_discipline?.english_name}
          </div>
        ),
      },
      {
        field: "event",
        title: t("record_screen.event"),
        display: true,
        // sort: true,
        render: (row) => (
          <div>
            {i18n.languages[0] == "vi"
              ? row?.event?.name
              : row?.event?.english_name}
          </div>
        ),
      },
    ],
    [i18n.languages]
  );

  const filterInputs = useMemo(
    () => [
      {
        field: "ad_no",
        type: "text",
        label: t("timeKeeping_screen.ad_no"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "team_id",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/team",
        type: "autocompleteFilter",
        label: t("member_screen.team"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "sport_id",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sport",
        type: "autocompleteFilter",
        label: t("member_registration.sport"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "sport_discipline_id",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sportDiscipline",
        type: "autocompleteFilter",
        label: t("sport_screen.sport_discipline"),
        display: true,
        params: {
          per_page: 100,
        },
        sub_params: (value) => {
          return {
            sport_id_equal: value?.sport_id,
          };
        },
        grid: { xs: 12, sm: 6, md: 6 },
      },
      {
        field: "event_id",
        queryField:
          i18n.languages[0] == "en" ? "english_name_like" : "name_like",
        labelField: i18n.languages[0] == "en" ? "english_name" : "name",
        valueField: "id",
        endpoint: adminApi + "/sportDisciplineEvent",
        type: "autocompleteFilter",
        params: {
          per_page: 100,
        },
        sub_params: (value) => {
          return {
            sport_discipline_id_equal: value?.sport_discipline_id,
          };
        },
        label: t("sport_screen.sport_discipline_event"),
        display: true,
        grid: { xs: 12, sm: 6, md: 6 },
      },
    ],
    [i18n.languages]
  );
  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });

  return (
    <React.Fragment>
      <PaperContainer>
        {/* {loading == false && event_name && (
                    <h2>
                        {i18n?.language == "vi"
                            ? sport_name?.name
                            : sport_name?.english_name}{" "}
                        /{" "}
                        {i18n?.language == "vi"
                            ? discipline_name?.name
                            : discipline_name?.english_name}{" "}
                        /{" "}
                        {i18n?.language == "vi"
                            ? event_name?.name
                            : event_name?.english_name}
                    </h2>
                )} */}
        <TableToolbar
          addButton={{
            render: (
              <div>
                {checkPerm(perms, "list_athletes_management") && (
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/listAthletes/create")}
                  >
                    {t("button.register")}
                  </Button>
                )}
              </div>
            ),
          }}
          endpoint={"/admin/exportListAthletes"}
          nameFileExport={"List Athletes"}
          columns={columnCheck}
          refetch={refetch}
          filterInput={filterInputs}
          handleChangeParams={setParams}
          loading={loading}
          checked={checked}
          setChecked={setChecked}
          showDelete={true}
          endpointDelete={"/admin/bulkDelete/listAthletes"}
          actionDelete={"force"}
        />
        <DataTable
          data={data?.data}
          columns={columnCheck.columnChecked}
          actionColumn={{
            onDelete: {
              display: false,
              action: "force",
            },
            onRestore: true,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
            hide: true,
          }}
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
