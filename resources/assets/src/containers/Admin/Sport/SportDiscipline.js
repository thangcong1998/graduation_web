import React, { useContext, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import Datatable from "../../../components/table/DataTable";
import { useTranslation } from "react-i18next";
import SportDisciplineEvent from "./SportDisciplineEvent";
import SportDisciplineForm from "./SportDisciplineForm";
import { useDialog } from "../../../components/Dialog";
import { checkPerm } from "../../../common/constants";
import { AuthContext } from "../../AuthProvider";

export default function SportDiscipline(props) {
  const { sport, refetch } = props;
  const { t, i18n } = useTranslation();
  const { perms } = useContext(AuthContext);
  const endpoint = "/admin/sportDiscipline";
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
      // {
      //   field: "english_name",
      //   title: t("sport_screen.english_name"),
      //   display: true,
      //   header: {
      //     style: {
      //       width: "30%",
      //     },
      //   },
      // },
    ],
    [i18n.languages]
  );
  const { dialog, handleClose } = useDialog();
  const editSportDiscipline = async (row) => {
    await dialog({
      title: t("sport_screen.update_sport_discipline"),
      content: (
        <SportDisciplineForm
          sport={sport}
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
        {t("sport_screen.sport_discipline")}
      </Typography>
      <Datatable
        columns={columns}
        data={sport.sport_disciplines}
        actionColumn={{
          onEdit: {
            display: checkPerm(perms, "sport_management"),
            callback: (row) => editSportDiscipline(row),
          },
          onDelete: {
            display: checkPerm(perms, "sport_management"),
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
        onClickRow={{ collapse: true }}
        collapse={(row) => (
          <SportDisciplineEvent
            sport={sport}
            sportDiscipline={row}
            refetch={refetch}
          />
        )}
      />
    </Box>
  );
}
