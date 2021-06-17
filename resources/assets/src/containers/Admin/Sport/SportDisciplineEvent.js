import React, { useContext, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import Datatable from "../../../components/table/DataTable";
import { useTranslation } from "react-i18next";
import SportDisciplineEventForm from "./SportDisciplineEventForm";
import { useDialog } from "../../../components/Dialog";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";

export default function SportDisciplineEvent(props) {
  const { sport, sportDiscipline, refetch } = props;
  const { t, i18n } = useTranslation();
  const { perms } = useContext(AuthContext);
  const history = useHistory();
  const endpoint = "/admin/sportDisciplineEvent";
  const columns = useMemo(
    () => [
      {
        field: "name",
        title: t("sport_screen.name"),
        display: true,
        render: (row) => (
          <div>
            {row?.icon ? (
              <img
                src={process.env.MIX_REACT_APP_STORAGE_URL + "/" + row?.icon}
                width="30px"
                height="30px"
                style={{ marginRight: 20 }}
              />
            ) : (
              ""
            )}

            {row?.name + " - " + row?.english_name}
          </div>
        ),
      },
    ],
    [i18n.languages]
  );
  const { dialog, handleClose } = useDialog();
  const editSportDisciplineEvent = async (row) => {
    await dialog({
      title: t("sport_screen.update_sport_discipline_event"),
      content: (
        <SportDisciplineEventForm
          sport={sport}
          sportDiscipline={sportDiscipline}
          row={row}
          close={handleClose}
          refetch={refetch}
        />
      ),
    });
  };

  return (
    <Box margin={1}>
      <Typography variant="h6" gutterBottom component="div">
        {t("sport_screen.sport_discipline_event")}
      </Typography>
      <div style={{ paddingLeft: 62 }}>
        <Datatable
          columns={columns}
          data={sportDiscipline.sport_discipline_events}
          actionColumn={{
            onEdit: {
              display: checkPerm(perms, "sport_management"),
              callback: (row) =>
                editSportDisciplineEvent(
                  history.push("/sportDisciplineEvent/" + row?.id, {
                    row,
                    sport,
                    sportDiscipline,
                  })
                ),
            },

            onDelete: {
              display: false,
              // display: checkPerm(perms, "sport_management"),
              action: "force",
            },
            endpoint: endpoint,
            refetch: refetch,
          }}
          header={{
            style: {
              display: "none",
            },
          }}
        />
      </div>
    </Box>
  );
}
