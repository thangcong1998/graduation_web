import React, { useState } from "react";
import {
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  TableBody,
  makeStyles,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyle = makeStyles((theme) => ({
  input: {
    "& input": {
      textAlign: "end",
    },
  },
  selectEmpty: {
    "& div": {
      textAlign: "start",
    },
  },
}));

export default function GameResult({
  set,
  index,
  changeScoreGame,
  totalScoreA,
  totalScoreB,
  changeSetPoint,
  round_points,
}) {
  const classes = useStyle();
  const { t } = useTranslation();

  return (
    <Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <React.Fragment>
              <TableRow>
                <TableCell style={{}}></TableCell>
                <TableCell style={{ textAlign: "end" }}>
                  <Grid style={{ fontSize: "1.15rem" }}>
                    {totalScoreA ? totalScoreA : 0}
                  </Grid>
                </TableCell>
                <TableCell
                  style={{
                    width: "8%",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  {t("score1vs1.total_score_set_game")}
                </TableCell>
                <TableCell>
                  <Grid style={{ fontSize: "1.15rem" }}>
                    {totalScoreB ? totalScoreB : 0}
                  </Grid>
                </TableCell>
                <TableCell style={{ width: "5%" }}></TableCell>
              </TableRow>
              {round_points?.length > 0 && (
                <TableRow>
                  <TableCell
                    style={{
                      width: "5%",
                    }}
                  ></TableCell>
                  {set?.match_individual_competitors?.length > 0
                    ? set?.match_individual_competitors?.map((i, comIndex) => {
                        return (
                          <React.Fragment>
                            <TableCell style={{ textAlign: "end" }}>
                              <Grid
                                container
                                direction="row"
                                style={{
                                  display: "flex",
                                  justifyContent: comIndex == 0 && "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                <Select
                                  style={{ maxHeight: "44px", width: "27%" }}
                                  variant="outlined"
                                  value={i?.setPoint}
                                  onChange={(e) =>
                                    changeSetPoint(
                                      e.target.value,
                                      index,
                                      comIndex
                                    )
                                  }
                                  displayEmpty
                                  className={
                                    comIndex == 1 && classes.selectEmpty
                                  }
                                  inputProps={{ "aria-label": "Without label" }}
                                  renderValue={(value) =>
                                    `${value}` + " " + `${t("score1vs1.pts")}`
                                  }
                                >
                                  <MenuItem value={null}>
                                    <em>-</em>
                                  </MenuItem>
                                  {round_points?.map((e) => {
                                    return (
                                      <MenuItem value={e?.points}>
                                        {e?.point_name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </Grid>
                            </TableCell>
                            {comIndex == 0 && (
                              <TableCell
                                style={{
                                  width: "8%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                {t("score1vs1.set_point")}
                              </TableCell>
                            )}
                          </React.Fragment>
                        );
                      })
                    : set?.match_event_teams?.map((i, comIndex) => {
                        return (
                          <React.Fragment>
                            <TableCell style={{ textAlign: "end" }}>
                              <Grid
                                container
                                direction="row"
                                style={{
                                  display: "flex",
                                  justifyContent: comIndex == 0 && "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                <Select
                                  style={{ maxHeight: "44px", width: "27%" }}
                                  variant="outlined"
                                  value={i?.setPoint}
                                  onChange={(e) =>
                                    changeSetPoint(
                                      e.target.value,
                                      index,
                                      comIndex
                                    )
                                  }
                                  displayEmpty
                                  className={
                                    comIndex == 1 && classes.selectEmpty
                                  }
                                  inputProps={{ "aria-label": "Without label" }}
                                  renderValue={(value) =>
                                    `${value}` + " " + `${t("score1vs1.pts")}`
                                  }
                                >
                                  <MenuItem value={null}>
                                    <em>-</em>
                                  </MenuItem>
                                  {round_points?.map((e) => {
                                    return (
                                      <MenuItem value={e?.points}>
                                        {e?.point_name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </Grid>
                            </TableCell>
                            {comIndex == 0 && (
                              <TableCell
                                style={{
                                  width: "8%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                {t("score1vs1.set_point")}
                              </TableCell>
                            )}
                          </React.Fragment>
                        );
                      })}
                  <TableCell></TableCell>
                </TableRow>
              )}
            </React.Fragment>

            {set?.game_result?.map((e, gaIndex) => {
              return (
                <TableRow>
                  <TableCell></TableCell>
                  {e?.result?.map((re, reIndex) => {
                    return (
                      <React.Fragment>
                        <TableCell>
                          <Grid
                            container
                            direction="row"
                            alignItems="flex-end"
                            style={{
                              display: "flex",
                              justifyContent: reIndex == 0 && "flex-end",
                            }}
                          >
                            <TextField
                              style={{
                                width: "27%",
                              }}
                              type="number"
                              className={reIndex == 0 && classes.input}
                              onInput={(e) => {
                                e.target.value = Math.max(
                                  0,
                                  parseInt(e.target.value)
                                )
                                  .toString()
                                  .slice(0, 2);
                              }}
                              value={re?.resultScore}
                              size="small"
                              variant={"outlined"}
                              onChange={(e) =>
                                changeScoreGame(
                                  e.target.value,
                                  reIndex,
                                  gaIndex,
                                  index
                                )
                              }
                            />
                          </Grid>
                        </TableCell>
                        {reIndex == 0 && (
                          <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            {"Game" + " "}
                            {gaIndex + 1}
                          </TableCell>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
