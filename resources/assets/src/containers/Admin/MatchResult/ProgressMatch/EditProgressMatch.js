import React from "react";
import { TextField, Grid, makeStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useTranslation } from "react-i18next";
import { CheckUnit } from "../../../../common/constants";

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

export default function EditProgressMatch({
  value,
  progress_match_type,
  ChecktypeInProgressMatch,
  t,
  editPlayer,
  index,
  editTns,
  editPlayerOut,
  match,
  editFoul,
  achievements,
}) {
  const { i18n } = useTranslation();
  const classes = useStyles();
  const _index = match?.match_event_teams?.findIndex(
    (e) => e?.event_team?.team_id == value?.player?.team_id
  );
  return (
    <React.Fragment>
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
            <Grid>{value?.event_team?.name}</Grid>
          </Grid>
          <Grid className={classes.text}>
            <Grid className={classes.header}>
              {t("progress_match_screen.type_progess")}: &nbsp;
            </Grid>
            <Grid>{ChecktypeInProgressMatch(value.type, t)}</Grid>
          </Grid>
          {value?.ownGoal == true && (
            <Grid item xs={6} style={{ marginTop: 10 }}>
              <Autocomplete
                id="combo-box-demo"
                options={
                  match?.match_event_teams?.[_index]?.event_team
                    ?.event_team_competitor
                }
                getOptionLabel={(option) =>
                  option.family_name + " " + option.given_name
                }
                onChange={(e, newValue) => editPlayer(index, newValue)}
                value={value?.player ? value?.player : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("progress_match_screen.athletes_own_goal")}
                    variant="outlined"
                  />
                )}
                size="small"
              />
            </Grid>
          )}
          {value?.type != null && value?.ownGoal == false && (
            <Grid item xs={6} style={{ marginTop: 10 }}>
              <Autocomplete
                id="combo-box-demo"
                options={value?.event_team?.event_team_competitor}
                getOptionLabel={(option) =>
                  option.family_name + " " + option.given_name
                }
                onChange={(e, newValue) => editPlayer(index, newValue)}
                style={{}}
                value={value?.player ? value?.player : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      value?.type == progress_match_type.CHANGE
                        ? t("progress_match_screen.athletes_in")
                        : t("progress_match_screen.athletes")
                    }
                    variant="outlined"
                  />
                )}
                size="small"
              />
            </Grid>
          )}
          {value?.type == progress_match_type.FOUL && (
            <Grid item xs={6} style={{ marginTop: 15 }}>
              <Autocomplete
                id="combo-box-demo"
                options={match?.stage?.fouls}
                getOptionLabel={(option) => option.name}
                style={{}}
                value={value?.foul ? value?.foul : null}
                onChange={(e, newValue) => editFoul(index, newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("progress_match_screen.foul")}
                    variant="outlined"
                  />
                )}
                size="small"
              />
            </Grid>
          )}
          {value?.type == progress_match_type.CHANGE && (
            <Grid item xs={6} style={{ marginTop: 10 }}>
              <Autocomplete
                id="combo-box-demo"
                options={value?.event_team?.event_team_competitor}
                getOptionLabel={(option) =>
                  option.family_name + " " + option.given_name
                }
                onChange={(e, newValue) => editPlayerOut(index, newValue)}
                style={{}}
                value={value?.player_out ? value?.player_out : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("progress_match_screen.athletes_out")}
                    variant="outlined"
                  />
                )}
                size="small"
              />
            </Grid>
          )}
          {value?.type == progress_match_type.ACHIEVEMENTS && (
            <Grid xs={6} style={{ marginTop: 15 }}>
              <TextField
                label={
                  achievements
                    ? t("progress_match_screen.tns") +
                      "/" +
                      CheckUnit(achievements, t)
                    : t("progress_match_screen.tns")
                }
                value={value?.tns}
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => editTns(index, e.target.value)}
              />
            </Grid>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
