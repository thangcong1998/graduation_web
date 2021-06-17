import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import VenueInput from "./VenueInput";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Pagination from "../../../components/table/Pagination";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";
import VisibilityIcon from "@material-ui/icons/Visibility";
import mapicon from "./google-maps.png";

export default function CarList(props) {
  const [endpoint, setEndpoint] = useState("/admin/venue");
  const api = useAPI();
  const { t } = useTranslation();
  const { perms } = useContext(AuthContext);
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const history = useHistory();
  const [params, setParams] = useState(initialParams);

  const { data: data, revalidate: refetch, loading: loading } = useFetch([
    "get",
    "/admin/venue",
    params,
  ]);

  const { columns, filterInputs } = VenueInput();
  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });
  const [checked, setChecked] = useState([]);

  return (
    <React.Fragment>
      <PaperContainer>
        <TableToolbar
          addButton={{
            text: t("venue_screen.venue"),
            onClick: () => {
              history.push("/venue/create");
            },
            display: checkPerm(perms, "venue_add"),
          }}
          columns={columnCheck}
          endpointDelete={"/admin/deleteListVenue"}
          endpoint={"/admin/exportVenue"}
          nameFileExport={"Venue"}
          refetch={refetch}
          setChecked={setChecked}
          actionDelete={"force"}
          checked={checked}
          filterInput={filterInputs}
          handleChangeParams={setParams}
          loading={loading}
          showDelete={checkPerm(perms, "venue_delete")}
          showExport={false}
        />
        <DataTable
          data={data?.data}
          columns={columnCheck.columnChecked}
          actionColumn={{
            onEdit: {
              display: checkPerm(perms, "venue_view"),
              callback: (row) => history.push("/venue/" + row.id),
            },
            onDelete: {
              display: checkPerm(perms, "venue_delete"),
              action: "force",
            },
            onRestore: true,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
            render: (row) => (
              <React.Fragment>
                <IconButton>
                  {row.latitude && row.latitude && (
                    <a
                      target="_blank"
                      alt=""
                      href={`http://www.google.com/maps/place/${row.latitude},${row.longtitude}`}
                    >
                      <img style={{ width: "1em" }} alt="" src={mapicon} />
                    </a>
                  )}
                </IconButton>
                {checkPerm(perms, "venue_view") && (
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      history.push("/venue/detail/" + row.id)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                )}
              </React.Fragment>
            ),
          }}
          onClickRow={
            checkPerm(perms, "venue_view") ? "/venue" : null
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
