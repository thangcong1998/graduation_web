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
  Select,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import { useAPI, useFetch } from "../../../../../api/api";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
// import Select from "../../../../../components/form/Select";
import {
  CheckQualification,
  stage_type,
} from "../../../../../common/constants";

export default function Score1vs1new({ round, setRound, referee }) {
  const classes = useStyle();
  const api = useAPI();
  const { t } = useTranslation();
  const params = useParams();
  const [member1, setMember1] = useState([]);
  const [member2, setMember2] = useState([]);
  const { data: match, loading: loading } = useFetch([
    "get",
    "/admin/match/" + params?.id,
  ]);
  const history = useHistory();

  const [_round, _setRound] = useState([]);
  const [_referee, _setReferee] = useState([]);

  const [matchPointA, setMatchPointA] = useState();
  const [matchPointB, setMatchPointB] = useState();

  const [qualificationA, setQualificationA] = useState();
  const [qualificationB, setQualificationB] = useState();

  useEffect(() => {
    if (match) {
      setMember1(
        match?.event_teams?.length > 0
          ? match?.match_event_teams[0]
          : match?.match_individual_competitors[0]
      );
      setMember2(
        match?.event_teams?.length > 0
          ? match?.match_event_teams[1]
          : match?.match_individual_competitors[1]
      );
      setMatchPointA(
        match?.event_teams?.length > 0
          ? match?.match_event_team[0]?.match_point
          : match?.match_individual_competitors[0]?.match_point
      );
      setMatchPointB(match?.match_event_team[1]?.match_point);
      setQualificationA(
        match?.match_individual_competitors?.length > 0
          ? //individual
            match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.participant_id ==
                match?.match_individual_competitors[0]?.competitor_id
            )?.qualification_type == 1
            ? // qualified to stage
              match?.stage?.stage_qualification_competitors?.find(
                (e) =>
                  e?.participant_id ==
                  match?.match_individual_competitors[0]?.competitor_id
              )?.qualified_to_stage_id
            : // qualification_type
              match?.stage?.stage_qualification_competitors?.find(
                (e) =>
                  (e?.participant_id == e?.participant_id) ==
                  match?.match_individual_competitors[0]?.competitor_id
              )?.qualification_type
          : //event _team
          match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[0]?.event_team_id
            )?.qualification_type == 1
          ? // qualified to stage
            match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[0]?.event_team_id
            )?.qualified_to_stage_id
          : //qualification type
            match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[0]?.event_team_id
            )?.qualification_type
      );
      setQualificationB(
        match?.stage?.match_individual_competitors?.length > 0
          ? //individual
            match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.participant_id ==
                match?.match_individual_competitors[1]?.competitor_id
            )?.qualification_type == 1
            ? // qualified to stage
              match?.stage?.stage_qualification_competitors?.find(
                (e) =>
                  e?.participant_id ==
                  match?.match_individual_competitors[1]?.competitor_id
              )?.qualified_to_stage_id
            : // qualification_type
              match?.stage?.stage_qualification_competitors?.find(
                (e) =>
                  e?.event_team_id == match?.match_event_teams[1]?.event_team_id
              )?.qualification_type
          : //event _team
          match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[1]?.event_team_id
            )?.qualification_type == 1
          ? // qualified to stage
            match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[1]?.event_team_id
            )?.qualified_to_stage_id
          : // qualification_type
            match?.stage?.stage_qualification_competitors?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[1]?.event_team_id
            )?.qualification_type
      );
    }
  }, [match]);

  useEffect(() => {
    if (match) {
      if (match?.round.length > 0) {
        //search two aray
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
              final_score:
                e?.event_round?.is_winner_classification_round == 1
                  ? re?.score
                  : null,
            })),
          }))
        );
      } else {
        if (match?.event_teams?.length > 0) {
          _setRound(
            match?.stage?.event_rounds.map((e) => ({
              ...e,
              result: match?.match_event_teams?.map((gm) => ({
                ...gm,
                resultScore: 0,
              })),
            }))
          );
        } else {
          _setRound(
            match?.stage?.event_rounds.map((e) => ({
              ...e,
              result: match?.match_individual_competitors?.map((gm) => ({
                ...gm,
                resultScore: 0,
              })),
            }))
          );
        }
      }
    }
  }, [match]);

  const changeScoreReferee = (value, vlIndex, index) => {
    _setRound((pre) => [
      ...pre.map((e, rIndex) => {
        if (rIndex == index) {
          return {
            ...e,
            result: e?.result?.map((rl, rlIndex) => {
              if (vlIndex == rlIndex) {
                return {
                  ...rl,
                  resultScore: value ? value : 0,
                  final_score:
                    e?.is_winner_classification_round == 1 ? value : null,
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

  const scoreA = _round?.map((e) => {
    return e?.result[0]?.final_score ? 0 : parseInt(e?.result[0].resultScore);
  });
  const totalScoreA = scoreA.reduce(function (a, b) {
    return a + b;
  }, 0);
  const scoreB = _round?.map((e) => {
    return e?.result[1]?.final_score ? 0 : parseInt(e?.result[1].resultScore);
  });

  const totalScoreB = scoreB?.reduce(function (a, b) {
    return a + b;
  }, 0);

  const winnerScore = _round?.find((e) =>
    e?.result?.find((x) => x?.final_score != null)
  )?.result;

  const matchPoint = match?.stage?.match_points?.map((e) => ({
    value: e?.points == 0 ? "0" : e?.points,
    label: e?.point_name + ":" + " " + e?.points,
  }));

  const [qualification, setQualification] = useState();

  useEffect(() => {
    if (match) {
      setQualification(
        match?.stage?.stage_qualification_settings?.map((e) => {
          if (e?.qualification_type == 1) {
            return {
              value: e?.qualified_to_stage_id,
              label:
                CheckQualification(e?.qualification_type, t) +
                " " +
                `${
                  e?.qualification_type == 1 ? e?.qualified_to_stage?.name : ""
                }`,
            };
          } else {
            return {
              value: e?.qualification_type == 0 ? "0" : e?.qualification_type,
              label:
                CheckQualification(e?.qualification_type, t) +
                " " +
                `${
                  e?.qualification_type == 1 ? e?.qualified_to_stage?.name : ""
                }`,
            };
          }
        })
      );
    }
  }, [match]);

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

  const saveMatches = async () => {
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
          scoreA: totalScoreA,
          scoreB: totalScoreB,
          lose_scoreA: totalScoreB,
          lose_scoreB: totalScoreA,
          member1: member1,
          member2: member2,
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
    } catch (e) {}
  };

  return (
    <div>
      <div>
        <div>
          <TableContainer component={Paper} style={{ maxHeight: 550 }}>
            <Table>
              <TableHead className={`${classes.th}`}>
                <TableRow>
                  <TableCell
                    className={`${classes.th}`}
                    style={{ width: "40%" }}
                  >
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                      style={{ display: "flex" }}
                    >
                      <Grid
                        item
                        style={{ textAlign: "end", padding: 6 }}
                        xs={4}
                      >
                        <img
                          src={
                            match?.event_teams?.length > 0
                              ? process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                member1?.event_team?.team?.country.flag_url
                              : process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                member1?.competitor?.team?.country.flag_url
                          }
                          width={100}
                          height={"auto"}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Tooltip
                          title={
                            match?.event_teams?.length > 0
                              ? member1?.event_team?.name
                              : member1?.competitor?.given_name +
                                " " +
                                member1?.competitor?.family_name
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
                                width: "100%",
                              }}
                              className={classes.textName}
                            >
                              {match?.event_teams?.length > 0
                                ? member1?.event_team?.name
                                : member1?.competitor?.given_name +
                                  " " +
                                  member1?.competitor?.family_name}
                            </p>
                          </p>
                        </Tooltip>
                      </Grid>
                      {match?.stage?.stage_type ==
                        stage_type.QUALIFIED_USED_TABLE ||
                      match?.stage?.stage_type == stage_type.ROUND_ROBIN ? (
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
                        <Grid
                          item
                          className={classes.matchPoint}
                          xs={4}
                          style={{ textAlign: "end" }}
                        >
                          <Select
                            value={
                              qualificationA ? parseInt(qualificationA) : 0
                            }
                            variant="outlined"
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
                    </Grid>
                  </TableCell>
                  <TableCell
                    style={{ width: "7%" }}
                    className={`${classes.th}`}
                  >
                    <Grid style={{ fontSize: 30, textAlign: "end" }}>
                      {totalScoreA ? totalScoreA : 0}
                      {winnerScore?.find((e) => e?.final_score != 0) && (
                        <p className={classes.penalty}>
                          {winnerScore[0]?.final_score
                            ? winnerScore[0]?.final_score
                            : 0}
                        </p>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell className={`${classes.th}`}>
                    <Grid
                      item
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        padding: 3,
                      }}
                    >
                      -
                      {winnerScore?.find((e) => e?.final_score != 0) && (
                        <p className={classes.penalty}>penalty</p>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell
                    style={{ width: "7%" }}
                    className={`${classes.th}`}
                  >
                    <Grid style={{ fontSize: 30 }}>
                      {totalScoreB ? totalScoreB : 0}
                      {winnerScore?.find((e) => e?.final_score != 0) && (
                        <p className={classes.penalty}>
                          {winnerScore[1]?.final_score
                            ? winnerScore[1]?.final_score
                            : 0}
                        </p>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell
                    className={`${classes.th}`}
                    style={{ width: "39%" }}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      style={{ display: "flex" }}
                    >
                      {match?.stage?.stage_type ==
                        stage_type.QUALIFIED_USED_TABLE ||
                      match?.stage?.stage_type == stage_type.ROUND_ROBIN ? (
                        <Grid item className={classes.matchPoint} xs={4}>
                          <Select
                            value={matchPointB ? parseInt(matchPointB) : 0}
                            size="small"
                            variant="outlined"
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
                        <Grid item className={classes.matchPoint} xs={4}>
                          <Select
                            value={
                              qualificationB ? parseInt(qualificationB) : 0
                            }
                            variant="outlined"
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
                      <Grid item xs={4}>
                        <Tooltip
                          title={
                            match?.event_teams?.length > 0
                              ? member2?.event_team?.name
                              : member2?.competitor?.given_name +
                                " " +
                                member2?.competitor?.family_name
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
                                textAlign: "end",
                                width: "100%",
                              }}
                              className={classes.textName}
                            >
                              {match?.event_teams?.length > 0
                                ? member2?.event_team?.name
                                : member2?.competitor?.given_name +
                                  " " +
                                  member2?.competitor?.family_name}
                            </p>
                          </p>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={4} style={{ padding: 6 }}>
                        <img
                          src={
                            match?.event_teams?.length > 0
                              ? process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                member2?.event_team?.team?.country.flag_url
                              : process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                member2?.competitor?.team?.country.flag_url
                          }
                          width={100}
                          height={"auto"}
                        />
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_round?.map((value, index, array) => {
                  return (
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                        }}
                      >
                        <p> {value.name}</p>
                      </TableCell>
                      {value?.result?.map((vl, vlIndex) => {
                        return (
                          <React.Fragment>
                            {vlIndex == 0 && (
                              <TableCell
                                style={{ fontSize: "1.25rem", padding: 0 }}
                              >
                                <Grid
                                  container
                                  direction="row"
                                  alignItems="flex-end"
                                  style={{
                                    justifyContent: "flex-end",
                                    display: "flex",
                                  }}
                                >
                                  <TextField
                                    style={{
                                      marginRight: 5,
                                      marginLeft: 5,
                                    }}
                                    className={classes.input}
                                    type="number"
                                    onInput={(e) => {
                                      e.target.value = Math.max(
                                        0,
                                        parseInt(e.target.value)
                                      )
                                        .toString()
                                        .slice(0, 2);
                                    }}
                                    value={vl?.resultScore}
                                    size="small"
                                    variant={"outlined"}
                                    onChange={(e) =>
                                      changeScoreReferee(
                                        e.target.value,
                                        vlIndex,
                                        //   rfindex,
                                        index
                                      )
                                    }
                                  />
                                </Grid>
                              </TableCell>
                            )}
                            {vlIndex == 0 && <TableCell></TableCell>}
                            {vlIndex == 1 && (
                              <TableCell
                                style={{ fontSize: "1.25rem", padding: 0 }}
                              >
                                <Grid
                                  container
                                  direction="row"
                                  alignItems="flex-end"
                                  style={{
                                    alignItems: "center",
                                    display: "flex",
                                  }}
                                >
                                  <TextField
                                    style={{
                                      textAlign: "end",
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
                                        .slice(0, 2);
                                    }}
                                    variant={"outlined"}
                                    value={vl?.resultScore}
                                    size="small"
                                    onChange={(e) =>
                                      changeScoreReferee(
                                        e.target.value,
                                        vlIndex,
                                        //   rfindex,
                                        index
                                      )
                                    }
                                  />
                                </Grid>
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
        </div>
      </div>
      <Button
        disabled={api?.loading == false ? false : true}
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        onClick={(e) => saveMatches(e)}
      >
        {t("button.save")}
      </Button>
    </div>
  );
}

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
  th: {
    position: "sticky",
    backgroundColor: "#fafafa",
    top: -1,
    zIndex: 2,
    "&:first-child": {
      left: 0,
      zIndex: 3,
    },
  },
  textName: {
    maxWidth: 300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));
