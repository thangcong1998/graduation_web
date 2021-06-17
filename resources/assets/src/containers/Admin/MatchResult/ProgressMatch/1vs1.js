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

export default function Prm1vs1({
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
                {/* <img
                    style={{ height: 30, width: 45.42, marginRight: 5 }}
                    src={
                      process.env.MIX_REACT_APP_STORAGE_URL +
                      "/" +
                      value?.event_team?.team?.country?.flag_url
                    }
                  />{" "} */}
                {i18n?.languages?.[0] == "vi"
                  ? value?.player?.team?.name
                  : value?.player?.team?.english_name}
              </Grid>
            </Grid>
            <Grid className={classes.text}>
              <Grid className={classes.header}>
                {t("progress_match_screen.type_progess")}: &nbsp;
              </Grid>
              <Grid>{ChecktypeInProgressMatch(value?.type, t)}</Grid>
            </Grid>
            {value?.own_goal == true && (
              <Grid className={classes.text}>
                <Grid className={classes.header}>
                  {t("progress_match_screen.own_goal")}: &nbsp;
                </Grid>
                <Grid>
                  {value?.player
                    ? value?.player?.family_name +
                      " " +
                      value?.player?.given_name
                    : null}
                </Grid>
              </Grid>
            )}
            {value?.own_goal == false && (
              <Grid className={classes.text}>
                <Grid className={classes.header}>
                  {value?.type == progress_match_type.CHANGE
                    ? t("progress_match_screen.athletes_in")
                    : t("progress_match_screen.athletes")}
                  :&nbsp;
                </Grid>
                <Grid>
                  {value?.player
                    ? value?.player?.family_name +
                      " " +
                      value?.player?.given_name
                    : null}
                </Grid>
              </Grid>
            )}
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
                    ? value?.player_out?.family_name +
                      " " +
                      value?.player_out?.given_name
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
