import React from "react";
import {
  Button,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import i18n from "../../../../i18n/i18n";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  text: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function Prm1vs1N({
  editProMatch,
  doneProMatch,
  deleteProMatch,
  ChecktypeInProgressMatch,
  CheckUnit,
  t,
  value,
  index,
  edit,
  progress_match_type,
  achievements,
}) {
  const classes = useStyles();
  const { i18n } = useTranslation();
  return (
    <Grid>
      <Grid container>
        <IconButton size={"small"}>
          <FiberManualRecordIcon fontSize={"small"} />
        </IconButton>
        <Grid style={{ fontSize: "1rem", marginTop: 8 }}>{value?.time}</Grid>
        <Grid item>
          {edit != index ? (
            <Button onClick={() => editProMatch(index)}>
              <EditIcon size="small" />
            </Button>
          ) : (
            <Button onClick={() => doneProMatch(index)}>
              <DoneIcon size="small" />
            </Button>
          )}
          <Button onClick={() => deleteProMatch(index)}>
            <DeleteIcon size="small" />
          </Button>
        </Grid>
      </Grid>
      {edit != index && (
        <div
          style={{
            margin: "0px 0px 0px 13px",
            borderLeft: "#757575 solid 1px",
            minHeight: "60px",
            width: "100%",
          }}
        >
          <div
            style={{
              margin: 5,
              backgroundColor: "#fff",
              borderRadius: "10px",
              height: "100%",
              width: "100%",
              padding: 20,
            }}
          >
            <Grid className={classes.text}>
              <Grid className={classes.header}>
                {t("medal_table.team")}: &nbsp;
              </Grid>
              <Grid>
                {i18n?.languages?.[0] == "vi"
                  ? value?.player?.competitor?.team?.name
                  : value?.player?.competitor?.team?.english_name}
              </Grid>
            </Grid>
            <Grid className={classes.text}>
              <Grid className={classes.header}>
                {t("progress_match_screen.type_progess")}: &nbsp;
              </Grid>
              <Grid>{ChecktypeInProgressMatch(value?.type, t)}</Grid>
            </Grid>
            <Grid className={classes.text}>
              <Grid className={classes.header}>
                {value?.type == progress_match_type.CHANGE
                  ? t("progress_match_screen.athletes_in")
                  : t("progress_match_screen.athletes")}
                :&nbsp;
              </Grid>
              <Grid>
                {value?.player
                  ? value?.player?.competitor?.family_name +
                    " " +
                    value?.player?.competitor?.given_name
                  : null}
              </Grid>
            </Grid>
            {value?.type == progress_match_type.FOUL && (
              <Grid className={classes.text}>
                <Grid className={classes.header}>
                  {t("progress_match_screen.type.2")}:&nbsp;
                </Grid>
                <Grid>
                  {" "}
                  {i18n.languages?.[0] == "vi"
                    ? value?.foul?.name
                    : value?.foul?.english_name}
                </Grid>
              </Grid>
            )}
            {value?.type == progress_match_type.CHANGE && (
              <Grid className={classes.text}>
                <Grid className={classes.header}>
                  {t("progress_match_screen.athletes_out")}:&nbsp;
                </Grid>
                <Grid>
                  {value?.player_out
                    ? value?.player_out?.competitor?.family_name +
                      " " +
                      value?.player_out?.competitor?.given_name
                    : null}
                </Grid>
              </Grid>
            )}
            {value?.type == progress_match_type.ACHIEVEMENTS && (
              <Grid className={classes.text}>
                <Grid className={classes.header}>
                  {achievements
                    ? t("progress_match_screen.tns") +
                      "/" +
                      CheckUnit(achievements, t)
                    : t("progress_match_screen.tns")}
                  :&nbsp;
                </Grid>
                <Grid>{value?.tns ? value?.tns : null}</Grid>
              </Grid>
            )}
          </div>
        </div>
      )}
    </Grid>
  );
}
