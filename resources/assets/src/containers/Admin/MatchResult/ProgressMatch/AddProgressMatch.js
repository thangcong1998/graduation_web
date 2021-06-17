import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  InputAdornment,
  Switch,
} from "@material-ui/core";
import Select from "../../../../components/form/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useTranslation } from "react-i18next";
import { progress_match_type } from "../../../../common/constants";
import InputMask from "react-input-mask";
import Dialog from "../../../../components/DialogMui";

export default function AddProgressMatch({
  match,
  changeType,
  addToArray,
  setTime,
  time,
  type,
  setPlayer,
  setPlayerOut,
  player,
  foul,
  player_out,
  setFoul,
  team,
  setTeam,
  setTns,
  tns,
  CheckUnit,
  achievements,
  changeOwnGoal,
  ownGoal,
  setOwnGoal,
}) {
  const { t } = useTranslation();
  const index = match?.match_event_teams?.findIndex(
    (e) => e?.event_team_id == team?.id
  );
  const _index = match?.match_event_teams?.findIndex(
    (e) => e?.event_team_id != team?.id
  );
  const member = match?.match_event_teams[index]?.member?.map((e) => {
    return e?.competitor?.accreditation_number;
  });

  return (
    <React.Fragment>
      <Dialog
        fullWidth={false}
        title={t("progress_match_screen.add")}
        content={(close) => (
          <Grid
            container
            spacing={3}
            style={{
              minWidth: 500,
              backgroundColor: "#fff",
              borderRadius: 10,
              marginLeft: "1%",
              width: "100%",
            }}
          >
            <Grid item xs={6}>
              <InputMask
                mask="99:99:99"
                value={time || ""}
                onChange={(e) => setTime(e.target.value)}
                disabled={false}
                maskChar="0"
              >
                {() => (
                  <TextField
                    variant={"outlined"}
                    fullWidth
                    size={"small"}
                    label={t("progress_match_screen.time")}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                variant={"outlined"}
                size="small"
                handleChange={(e) => changeType(e)}
                value={type ? type : null}
                label={t("progress_match_screen.type_progess")}
                options={[
                  {
                    value: null,
                    label: "-",
                  },
                  {
                    value: progress_match_type.ACHIEVEMENTS,
                    label: t("progress_match_screen.type.1"),
                  },
                  {
                    value: progress_match_type.FOUL,
                    label: t("progress_match_screen.type.2"),
                  },
                  {
                    value: progress_match_type.CHANGE,
                    label: t("progress_match_screen.type.3"),
                  },
                ]}
              />
            </Grid>
            {type != null && match?.match_individual_competitors?.length == 0 && (
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={match?.event_teams}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, newValue) => {
                    setTeam(newValue);
                    team == null && setPlayer();
                    team == null && setPlayerOut();
                  }}
                  style={{}}
                  value={team ? team : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("medal_table.team")}
                      variant="outlined"
                    />
                  )}
                  size="small"
                  noOptionsText={t("progress_match_screen.no_data")}
                />
              </Grid>
            )}
            {type == progress_match_type.ACHIEVEMENTS && (
              <Grid xs={6} style={{ marginTop: 14 }}>
                <Switch
                  checked={ownGoal}
                  onChange={(e) => changeOwnGoal(e)}
                  color="primary"
                />
                {t("progress_match_screen.own_goal")}
              </Grid>
            )}
            {/* vđv phản lưới nhà */}
            {ownGoal == true && team && (
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={
                    match?.match_individual_competitors?.length > 0
                      ? match?.match_individual_competitors
                      : match?.match_event_teams?.[_index]?.event_team
                          ?.event_team_competitor
                  }
                  getOptionLabel={(option) =>
                    option.family_name + " " + option.given_name
                  }
                  onChange={(e, newValue) => setPlayer(newValue)}
                  value={player ? player : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("progress_match_screen.athletes_own_goal")}
                      variant="outlined"
                    />
                  )}
                  size="small"
                  noOptionsText={t("progress_match_screen.no_data")}
                />
              </Grid>
            )}
            {type != null && team && ownGoal == false && (
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={
                    match?.match_individual_competitors?.length > 0
                      ? match?.match_individual_competitors
                      : match?.match_event_teams?.[
                          index
                        ]?.event_team?.event_team_competitor?.filter(function (
                          item
                        ) {
                          return !member?.includes(item?.accreditation_number);
                        })
                  }
                  getOptionLabel={(option) =>
                    option.family_name + " " + option.given_name
                  }
                  onChange={(e, newValue) => setPlayer(newValue)}
                  value={player ? player : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        type == progress_match_type.CHANGE
                          ? t("progress_match_screen.athletes_in")
                          : t("progress_match_screen.athletes")
                      }
                      variant="outlined"
                    />
                  )}
                  size="small"
                  noOptionsText={t("progress_match_screen.no_data")}
                />
              </Grid>
            )}
            {type == progress_match_type.CHANGE && team && (
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={
                    match?.match_individual_competitors?.length > 0
                      ? match?.match_individual_competitors
                      : match?.match_event_teams?.[index]?.member?.map((e) => {
                          return e?.competitor;
                        })
                  }
                  getOptionLabel={(option) =>
                    option.family_name + " " + option.given_name
                  }
                  onChange={(e, newValue) => setPlayerOut(newValue)}
                  value={player_out ? player_out : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("progress_match_screen.athletes_out")}
                      variant="outlined"
                    />
                  )}
                  size="small"
                  noOptionsText={t("progress_match_screen.no_data")}
                />
              </Grid>
            )}
            {type == progress_match_type.ACHIEVEMENTS && team && (
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  label={
                    achievements
                      ? t("progress_match_screen.tns") +
                        "/" +
                        CheckUnit(achievements, t)
                      : t("progress_match_screen.tns")
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={tns}
                  onChange={(e) => setTns(e.target.value)}
                />
              </Grid>
            )}
            {type == progress_match_type.FOUL && team && (
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={match?.stage?.fouls}
                  getOptionLabel={(option) => option.name}
                  style={{}}
                  value={foul ? foul : null}
                  onChange={(e, newValue) => setFoul(newValue)}
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
            {type != null && player && (
              <Grid item xs={12}>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  size={"small"}
                  onClick={() => addToArray(close)}
                >
                  {t("button.add")}
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      >
        <Button variant={"contained"} color={"primary"} size={"small"}>
          {t("progress_match_screen.add")}
        </Button>
      </Dialog>
    </React.Fragment>
  );
}
