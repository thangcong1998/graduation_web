import React, { useEffect, useState } from "react";
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
  TextField,
  TableBody,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import { useAPI, useFetch } from "../../../../../../api/api";
import { useDialog } from "../../../../../../components/Dialog";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { CheckQualification } from "../../../../../../common/constants";
import Select from "@material-ui/core/Select";
import { stage_type } from "../../../../../../common/constants";

export default function Score1vs1RoundTeam({}) {
  const classes = useStyle();
  const api = useAPI();
  const { dialog } = useDialog();
  const params = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const [member1, setMember1] = useState([]);
  const [member2, setMember2] = useState([]);
  const { data: match, loading: loading } = useFetch([
    "get",
    "/admin/match/" + params?.id,
  ]);

  const [matchPointA, setMatchPointA] = useState();
  const [matchPointB, setMatchPointB] = useState();

  const [qualificationA, setQualificationA] = useState();
  const [qualificationB, setQualificationB] = useState();

  useEffect(() => {
    if (match) {
      setMember1(match?.match_event_teams[0]);
      setMember2(match?.match_event_teams[1]);
      setMatchPointA(match?.match_event_team[0]?.match_point);
      setMatchPointB(match?.match_event_team[1]?.match_point);
      setQualificationA(
        match?.stage_qualification_competitor?.[0]?.qualification_type == 1
          ? match?.stage_qualification_competitor?.[0]?.qualified_to_stage_id
          : match?.stage_qualification_competitor?.[0]?.qualification_type
      );
      setQualificationB(
        match?.stage_qualification_competitor?.[1]?.qualification_type == 1
          ? match?.stage_qualification_competitor?.[1]?.qualified_to_stage_id
          : match?.stage_qualification_competitor?.[1]?.qualification_type
      );
    }
  }, [match]);

  const [_round, _setRound] = useState([]);
  const [_referee, _setReferee] = useState([]);

  useEffect(() => {
    if (match) {
      if (match?.round.length > 0) {
        let res = [];
        res = match?.round?.filter((el) => {
          return match?.stage?.event_rounds?.find((element) => {
            return element?.id == el?.event_round_id;
          });
        });
        _setRound(
          res?.map((e) => ({
            ...e,
            result: e?.result?.map((re) => ({
              ...re,
              resultScore: re?.score,
            })),
          }))
        );
      } else {
        _setRound(
          match?.stage?.event_rounds.map((e) => ({
            ...e,
            result: match?.match_event_teams?.map((gm) => ({
              ...gm,
              resultScore: 0,
            })),
          }))
        );
      }
    }
  }, [match]);

  const score = _round?.map((e, index) => {
    const abc = e?.result?.reduce((a, b) => {
      if (parseInt(a.resultScore) > parseInt(b.resultScore)) {
        return a;
      }
      if (parseInt(a.resultScore) < parseInt(b.resultScore)) {
        return b;
      }
      return null;
    });
    return abc;
  });
  const scoreA = score.filter(
    (e) => e?.event_team_id === member1?.event_team_id
  ).length;

  const scoreB = score.filter(
    (e) => e?.event_team_id === member2?.event_team_id
  ).length;

  const changeScoreReferee = (value, vlIndex, event_team_id) => {
    _setRound((pre) => [
      ...pre.map((e, rIndex) => {
        if (rIndex == vlIndex) {
          return {
            ...e,
            result: e?.result?.map((rl) => {
              if (rl?.event_team_id == event_team_id) {
                return {
                  ...rl,
                  resultScore: value ? value : 0,
                };
              }
              return rl;
            }),
          };
        }
        return e;
      }),
    ]);
  };

  const matchPoint = match?.stage?.match_points?.map((e) => ({
    value: e?.points == 0 ? "0" : e?.points,
    label: e?.point_name + ":" + " " + e?.points,
  }));
  const qualification = match?.stage?.stage_qualification_settings?.map((e) => {
    if (e?.qualification_type == 1) {
      return {
        value: e?.qualified_to_stage_id,
        label:
          CheckQualification(e?.qualification_type, t) +
          " " +
          `${e?.qualification_type == 1 ? e?.qualified_to_stage?.name : ""}`,
      };
    } else {
      return {
        value: e?.qualification_type == 0 ? "0" : e?.qualification_type,
        label:
          CheckQualification(e?.qualification_type, t) +
          " " +
          `${e?.qualification_type == 1 ? e?.qualified_to_stage?.name : ""}`,
      };
    }
  });

  const checkQualification = (e, value) => {
    setQualificationA(value);
  };
  const checkQualificationB = (e, value) => {
    setQualificationB(value);
  };

  const changeResultPoints = (e, value) => {
    setMatchPointA(value);
  };
  const changeResultPointsB = (e, value) => {
    setMatchPointB(value);
  };

  const saveMathes1vs1Round = async (e) => {
    try {
      let res = await api.fetcher(
        "post",
        match?.round.length == 0
          ? "admin/matches1vs1"
          : "admin/updateMatches1vs1",
        {
          round: JSON.stringify(_round),
          competition_type: match?.stage?.event?.competition_type,
          match_id: params?.id,
          scoreA: scoreA,
          scoreB: scoreB,
          member1: member1,
          member2: member2,
          lose_scoreA: scoreB,
          lose_scoreB: scoreA,
          matchPointA: matchPointA,
          matchPointB: matchPointB,
          qualificationA: qualificationA ? qualificationA : 0,
          qualificationB: qualificationB ? qualificationB : 0,
          stage_id: match?.stage_id,
          qualified_to_stage_id: match?.stage?.stage_qualification_settings,
        }
      );
      let updateMedalTable = await api.fetcher("get", "admin/medalRankings", {
        stage_id: match?.stage_id,
      });
      // if (res) {
      //   history.goBack();
      // }
    } catch ($e) {}
  };

  return (
    <div>
      <div>
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead
                className={`${classes.table}`}
                style={{
                  backgroundColor: "rgb(76, 175, 80)",
                  whiteSpace: "nowrap",
                }}
              >
                <TableRow>
                  <TableCell
                    style={{ width: "18%" }}
                    className={`${classes.table} ${classes.th}`}
                  ></TableCell>
                  {_round?.map((value, index) => {
                    return (
                      <TableCell
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          minWidth: 100,
                        }}
                        className={classes.table}
                      >
                        {value.name}
                      </TableCell>
                    );
                  })}
                  <TableCell className={classes.table}>
                    <p style={{ fontSize: "1rem", fontWeight: 600 }}>
                      {t("score1vs1.final_score")}
                    </p>
                  </TableCell>
                  {match?.stage?.stage_type == 1 ? (
                    <TableCell
                      className={classes.table}
                      style={{ fontSize: "1rem", fontWeight: 600 }}
                    >
                      {t("score1vs1.match_point")}
                    </TableCell>
                  ) : (
                    <TableCell
                      className={classes.table}
                      style={{ fontSize: "1rem", fontWeight: 600 }}
                    >
                      {t("score1vs1.qualification")}
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody
                style={{
                  whiteSpace: "nowrap",
                }}
                className={classes.tbody}
              >
                <TableRow>
                  <TableCell className={`${classes.table} ${classes.tbody}`}>
                    <Grid style={{ display: "flex" }}>
                      <img
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          member1?.event_team?.team?.country.flag_url
                        }
                        width={65}
                        height={"auto"}
                        style={{ minWidth: 55, maxHeight: 50, minHeight: 26 }}
                      />
                      <Tooltip
                        title={
                          member1?.event_team?.name
                            ? member1?.event_team?.name
                            : member1?.event_team?.team?.name
                        }
                        interactive
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            padding: 3,
                          }}
                        >
                          <p
                            style={{
                              margin: "0",
                              // textAlign: "center",
                              width: "100%",
                              fontWeight: 600,
                              fontSize: "1rem",
                            }}
                            className={classes.textName}
                          >
                            {member1?.event_team?.name
                              ? member1?.event_team?.name
                              : member1?.event_team?.team?.name}
                          </p>
                        </p>
                      </Tooltip>
                    </Grid>
                  </TableCell>

                  {_round?.map((value, vlIndex) => {
                    return (
                      <React.Fragment>
                        <TableCell
                          style={{ fontSize: "1.25rem", width: "10%" }}
                          className={`${classes.table} ${classes.tbody}`}
                        >
                          <Grid
                            container
                            direction="row"
                            style={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <TextField
                              style={{
                                // width: "40%",
                                marginRight: 5,
                                marginLeft: 5,
                              }}
                              type="number"
                              onInput={(e) => {
                                e.target.value = Math.max(
                                  0,
                                  parseInt(e.target.value)
                                )
                                  .toString()
                                  .slice(0, 3);
                              }}
                              value={
                                value?.result.find(
                                  (e) =>
                                    e?.event_team_id == member1?.event_team_id
                                )?.resultScore
                              }
                              size="small"
                              // variant={"outlined"}
                              onChange={(e) =>
                                changeScoreReferee(
                                  e.target.value,
                                  vlIndex,
                                  member1?.event_team_id
                                )
                              }
                            />
                          </Grid>
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                  <TableCell className={`${classes.table} ${classes.tbody}`}>
                    <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                      {scoreA}
                    </p>
                  </TableCell>
                  <TableCell className={`${classes.table} ${classes.tbody}`}>
                    {match?.stage?.stage_type ==
                      stage_type.QUALIFIED_USED_TABLE ||
                    match?.stage?.stage_type == stage_type.ROUND_ROBIN ? (
                      <Grid item className={classes.matchPoint}>
                        <Select
                          value={matchPointA ? parseInt(matchPointA) : 0}
                          size="small"
                          onChange={(e) =>
                            changeResultPoints(e, e.target.value)
                          }
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
                    ) : (
                      <Grid item className={classes.matchPoint}>
                        <Select
                          value={qualificationA ? parseInt(qualificationA) : 0}
                          size="small"
                          onChange={(e) =>
                            checkQualification(e, e.target.value)
                          }
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
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={`${classes.table} ${classes.tbody}`}>
                    <Grid style={{ display: "flex" }}>
                      <img
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          member2?.event_team?.team?.country.flag_url
                        }
                        width={65}
                        height={"auto"}
                        style={{ minWidth: 55 }}
                      />
                      <Tooltip
                        title={
                          member2?.event_team?.name
                            ? member2?.event_team?.name
                            : member2?.event_team?.team?.name
                        }
                        interactive
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <p
                            style={{
                              margin: "0",
                              padding: 3,
                              fontWeight: 600,
                              fontSize: "1rem",
                            }}
                            className={classes.textName}
                          >
                            {member2?.event_team?.name
                              ? member2?.event_team?.name
                              : member2?.event_team?.team?.name}
                          </p>
                        </p>
                      </Tooltip>
                    </Grid>
                  </TableCell>

                  {_round?.map((value, vlIndex) => {
                    return (
                      <React.Fragment>
                        <TableCell
                          style={{ fontSize: "1.25rem" }}
                          className={`${classes.table} ${classes.tbody}`}
                        >
                          <Grid
                            container
                            direction="row"
                            style={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <TextField
                              style={{
                                // width: "40%",
                                marginRight: 5,
                                marginLeft: 5,
                              }}
                              type="number"
                              onInput={(e) => {
                                e.target.value = Math.max(
                                  0,
                                  parseInt(e.target.value)
                                )
                                  .toString()
                                  .slice(0, 3);
                              }}
                              value={
                                value?.result.find(
                                  (e) =>
                                    e?.event_team_id == member2?.event_team_id
                                )?.resultScore
                              }
                              size="small"
                              // variant={"outlined"}
                              onChange={(e) =>
                                changeScoreReferee(
                                  e.target.value,
                                  vlIndex,
                                  member2?.event_team_id
                                )
                              }
                            />
                          </Grid>
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                  <TableCell className={`${classes.table} ${classes.tbody}`}>
                    <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                      {scoreB}
                    </p>
                  </TableCell>
                  <TableCell className={`${classes.table} ${classes.tbody}`}>
                    {match?.stage?.stage_type ==
                      stage_type.QUALIFIED_USED_TABLE ||
                    match?.stage?.stage_type == stage_type.ROUND_ROBIN ? (
                      <Grid item className={classes.matchPoint}>
                        <Select
                          value={matchPointB ? parseInt(matchPointB) : 0}
                          size="small"
                          onChange={(e) =>
                            changeResultPointsB(e, e.target.value)
                          }
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
                    ) : (
                      <Grid item className={classes.matchPoint}>
                        <Select
                          value={qualificationB ? parseInt(qualificationB) : 0}
                          size="small"
                          onChange={(e) =>
                            checkQualificationB(e, e.target.value)
                          }
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Button
        disabled={api?.loading == false ? false : true}
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        onClick={(e) => saveMathes1vs1Round(e)}
      >
        {t("button.save")}
      </Button>
    </div>
  );
}

const useStyle = makeStyles((theme) => ({
  textName: {
    maxWidth: 300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  KO_image: {
    float: "right",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 3px 0px",
      borderRadius: 5,
    },
  },
  matchPoint: {
    padding: 10,
  },
  table: {
    border: "1px solid",
  },
  tbody: {
    "&:first-child": {
      position: "sticky",
      backgroundColor: "#eee",
      left: -1,
      textAlign: "left",
      zIndex: 3,
    },
  },
  th: {
    position: "sticky",
    backgroundColor: "#4caf50",
    top: -1,
    zIndex: 2,
    "&:first-child": {
      left: 0,
      zIndex: 3,
    },
  },
}));
