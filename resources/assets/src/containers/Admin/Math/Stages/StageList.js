import React, { useContext, useEffect, useState } from "react";
import { useFetch, useAPI } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import StageInput from "./StageInput";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Pagination from "../../../../components/table/Pagination";
import { checkPerm } from "../../../../common/constants";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { Box, Button, Tab, Tabs, Typography } from "@material-ui/core";
import StageRankTable from "./StageRankTable";

function TabPanel(props) {
  const { children, value, index, rerender, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {rerender ? (
        index === value && (
          <Box>
            <Typography component={"div"}>{children}</Typography>
          </Box>
        )
      ) : (
        <Box>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function StageList(props) {
  const [endpoint, setEndpoint] = useState("/admin/stage");
  const { t, i18n } = useTranslation();
  const { perms, setUrlParam } = useContext(AuthContext);
  const api = useAPI();
  const param = useParams();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const history = useHistory();
  const [params, setParams] = useState(initialParams);
  const location = useLocation();
  useEffect(() => {
    setUrlParam((pre) => ({
      ...pre,
      sub_id: param?.sub_id,
    }));
  }, []);
  const { data: event, loading: evLoading, revalidate: evRefetch } = useFetch([
    "get",
    `/admin/sportDisciplineEvent/` + param?.sub_id,
  ]);
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    `/admin/stage?event_id_equal=${param?.sub_id}`,
    params,
  ]);
  const { columns, filterInputs } = StageInput();
  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });
  const [checked, setChecked] = useState([]);
  const sport_name =
    i18n.languages[0] == "en"
      ? event?.sport_discipline.sport.english_name
      : event?.sport_discipline.sport.name;
  const sd_name =
    i18n.languages[0] == "en"
      ? event?.sport_discipline.english_name
      : event?.sport_discipline.name;
  const sde_name =
    i18n.languages[0] == "en" ? event?.english_name : event?.name;
  const [valueTab, setValueTab] = useState(1);
  return (
    <React.Fragment>
      <PaperContainer>
        <div
          style={{
            minHeight: 50,
            fontSize: "1rem",
            paddingTop: 10,
            fontWeight: 600,
          }}
        >
          {event && <div>{`${sport_name} / ${sd_name} / ${sde_name}`}</div>}
        </div>
        {event?.is_decathlon_heptathlon ? (
          <Tabs
            value={valueTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(ev, val) => {
              setValueTab(val);
            }}
            style={{ marginBottom: 10 }}
          >
            <Tab value={1} label={t("stages_screen.stage")} />
            <Tab value={2} label={t("rank_table.rank_table")} />
          </Tabs>
        ) : (
          " "
        )}
        <TabPanel value={valueTab} index={1}>
          <TableToolbar
            addButton={{
              render: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    history.push(
                      "/scheduleCompetition/" +
                        param?.sub_id +
                        "/stageList/create",
                      {
                        event,
                      }
                    )
                  }
                >
                  {t("stages_screen.add_stage")}
                </Button>
              ),
            }}
            columns={columnCheck}
            endpoint={"/admin/exportStage"}
            endpointDelete={"/admin/deleteListCountry"}
            refetch={refetch}
            actionDelete={"force"}
            nameFileExport={"Stage"}
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
                display: true,
                callback: (row) =>
                  history.push(
                    "/scheduleCompetition/" +
                      param?.sub_id +
                      "/stageList/" +
                      row.id,
                    {
                      event,
                    }
                  ),
              },
              onDelete: {
                display: true,
                action: "delete",
              },
              onRestore: true,
              endpoint: endpoint,
              trashed: params?.only_trashed,
              refetch: refetch,
            }}
            onClickRow={(row) =>
              history.push(
                "/scheduleCompetition/" +
                  param?.sub_id +
                  "/stageList/" +
                  row.id,
                {
                  event,
                }
              )
            }
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
        </TabPanel>
        <TabPanel index={2} value={valueTab} rerender={true}>
          <StageRankTable event={event} />
        </TabPanel>
      </PaperContainer>
    </React.Fragment>
  );
}
