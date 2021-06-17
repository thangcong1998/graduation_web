import React from "react";
import {
  Grid,
  Paper,
  makeStyles,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  Button,
  Tab,
  MenuItem,
  Select,
  Tooltip,
} from "@material-ui/core";
import { stage_type } from "../../../../../../common/constants";
import { useTranslation } from "react-i18next";

const useStyle = makeStyles((theme) => ({
  KO_image: {
    float: "right",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 3px 0px",
      borderRadius: 5,
    },
  },
  penalty: {
    padding: 2,
    fontSize: "1rem",
  },
  input: {
    "& input": {
      textAlign: "end",
    },
  },
  matchPoint: {
    padding: 10,
  },
  textName: {
    maxWidth: 300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export default function Score1vs1UI({
  match,
  member1,
  member2,
  matchPoint,
  matchPointA,
  matchPointB,
  qualification,
  qualificationA,
  qualificationB,
  checkQualification,
  checkQualificationB,
  changeResultPoints,
  changeResultPointsB,
  scoreA,
  scoreB,
}) {
  const { t } = useTranslation();
  const classes = useStyle();
  const individual = match?.match_individual_competitors?.length;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "40%" }}>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                  style={{ display: "flex" }}
                >
                  <Grid item style={{ textAlign: "end", padding: 10 }} xs={4}>
                    <img
                      src={
                        individual > 0
                          ? process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member1?.competitor?.team?.country.flag_url
                          : process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member1?.event_team?.team?.country.flag_url
                      }
                      width={100}
                      height={"auto"}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip
                      title={
                        individual > 0
                          ? member1?.competitor?.given_name +
                            " " +
                            member1?.competitor?.family_name
                          : member1?.event_team?.name
                      }
                      interactive
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.5rem",
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            margin: "0",
                            textAlign: "center",
                            width: "100%",
                          }}
                          className={classes.textName}
                        >
                          {individual > 0
                            ? member1?.competitor?.given_name +
                              " " +
                              member1?.competitor?.family_name
                            : member1?.event_team?.name}
                        </p>
                      </p>
                    </Tooltip>
                  </Grid>
                  {(match?.stage?.stage_type ==
                    stage_type.QUALIFIED_USED_TABLE ||
                    match?.stage?.stage_type == stage_type.ROUND_ROBIN) && (
                    <Grid
                      item
                      className={classes.matchPoint}
                      xs={4}
                      style={{ textAlign: "end" }}
                    >
                      <Select
                        value={matchPointA ? parseInt(matchPointA) : 0}
                        size="small"
                        variant="outlined"
                        onChange={(e) => changeResultPoints(e, e.target.value)}
                        renderValue={(matchPointA) =>
                          `${matchPointA}` + " " + `${t("score1vs1.pts")}`
                        }
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {matchPoint?.map((e) => {
                          return (
                            <MenuItem value={e?.value}>{e?.label}</MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  )}
                  {match?.stage?.stage_type == stage_type.KNOCK_OUT && (
                    <Grid item className={classes.matchPoint} xs={4}>
                      <Select
                        value={qualificationA ? parseInt(qualificationA) : 0}
                        variant="outlined"
                        size="small"
                        onChange={(e) => checkQualification(e, e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {qualification?.map((e) => {
                          return (
                            <MenuItem value={e?.value}>{e?.label}</MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  )}
                </Grid>
              </TableCell>
              <TableCell style={{ width: "12%" }}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item style={{ fontSize: 30 }}>
                    {scoreA ? scoreA : 0}
                  </Grid>
                  <Grid item style={{ fontSize: 30 }}>
                    -
                  </Grid>
                  <Grid item style={{ fontSize: 30 }}>
                    {scoreB ? scoreB : 0}
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell style={{ width: "40%" }}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  style={{ display: "flex" }}
                >
                  {(match?.stage?.stage_type ==
                    stage_type.QUALIFIED_USED_TABLE ||
                    match?.stage?.stage_type == stage_type.ROUND_ROBIN) && (
                    <Grid item className={classes.matchPoint} xs={4}>
                      <Select
                        value={matchPointB ? parseInt(matchPointB) : 0}
                        size="small"
                        variant="outlined"
                        onChange={(e) => changeResultPointsB(e, e.target.value)}
                        renderValue={(matchPointB) =>
                          `${matchPointB}` + " " + `${t("score1vs1.pts")}`
                        }
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {matchPoint?.map((e) => {
                          return (
                            <MenuItem value={e?.value}>{e?.label}</MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  )}
                  {match?.stage?.stage_type == stage_type.KNOCK_OUT && (
                    <Grid item className={classes.matchPoint} xs={4}>
                      <Select
                        value={qualificationB ? parseInt(qualificationB) : 0}
                        size="small"
                        variant="outlined"
                        onChange={(e) => checkQualificationB(e, e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {qualification?.map((e) => {
                          return (
                            <MenuItem value={e?.value}>{e?.label}</MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  )}
                  <Grid item xs={4}>
                    <Tooltip
                      title={
                        individual > 0
                          ? member2?.competitor?.given_name +
                            " " +
                            member2?.competitor?.family_name
                          : member2?.event_team?.name
                      }
                      interactive
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1.5rem",
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            margin: "0",
                            textAlign: "center",
                            width: "100%",
                          }}
                          className={classes.textName}
                        >
                          {individual > 0
                            ? member2?.competitor?.given_name +
                              " " +
                              member2?.competitor?.family_namee
                            : member2?.event_team?.name}
                        </p>
                      </p>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4} style={{ padding: 10 }}>
                    <img
                      src={
                        individual > 0
                          ? process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member2?.competitor?.team?.country.flag_url
                          : process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member2?.event_team?.team?.country.flag_url
                      }
                      width={100}
                      height={"auto"}
                    />
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </div>
  );
}
