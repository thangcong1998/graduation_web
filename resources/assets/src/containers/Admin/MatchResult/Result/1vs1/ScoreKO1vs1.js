import React, { useEffect, useState } from "react";
import {
  IconButton,
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
  Tooltip,
} from "@material-ui/core";
import { useAPI, useFetch } from "../../../../../api/api";
import { useDialog } from "../../../../../components/Dialog";
import { useTranslation } from "react-i18next";
import Popover from "../../../../../components/popover";
import { useHistory, useParams } from "react-router";
import Select from "../../../../../components/form/Select";
import { CheckQualification } from "../../../../../common/constants";

export default function ScoreKO1vs1({}) {
  const classes = useStyle();
  const [close, setClose] = useState(false);
  const api = useAPI();
  const { dialog } = useDialog();
  const { t } = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [member1, setMember1] = useState([]);
  const [member2, setMember2] = useState([]);
  const { data: match, loading: loading } = useFetch([
    "get",
    "/admin/match/" + params?.id,
  ]);

  const [qualificationA, setQualificationA] = useState();
  const [qualificationB, setQualificationB] = useState();

  useEffect(() => {
    if (match) {
      setMember1(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors?.[0]
          : match?.match_event_teams?.[0]
      );
      setMember2(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors?.[1]
          : match?.match_event_teams?.[1]
      );
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
              competitor_id: re?.competitor_id,
              event_team_id: re?.event_team_id,
              resultScore: re?.score,
              referee: re?.match_round_result_referee_relation?.map((sc) => ({
                ...sc,
                score: sc?.score,
                family_name: sc?.referee?.family_name,
                given_name: sc?.referee?.given_name,
              })),
            })),
          }))
        );
      } else {
        _setRound(
          match?.stage?.event?.event_rounds.map((e) => ({
            ...e,
            result:
              match?.match_individual_competitors?.length > 0
                ? match?.match_individual_competitors?.map((gm) => ({
                    ...gm,
                    is_ko: 0,
                    resultScore: 0,
                    referee: match?.match_referee_relations?.map((rf) => ({
                      ...rf,
                      score: 0,
                    })),
                  }))
                : match?.match_event_teams?.map((gm) => ({
                    ...gm,
                    is_ko: 0,
                    resultScore: 0,
                    referee: match?.match_referee_relations?.map((rf) => ({
                      ...rf,
                      score: 0,
                    })),
                  })),
          }))
        );
      }
    }
  }, [match]);

  const scoreA = _round?.map((e) => {
    return e?.result[0]?.resultScore ? parseInt(e?.result[0].resultScore) : 0;
  });
  const totalScoreA = scoreA.reduce(function (a, b) {
    return a + b;
  }, 0);
  const scoreB = _round?.map((e) => {
    return e?.result[1]?.resultScore ? parseInt(e?.result[1].resultScore) : 0;
  });

  const totalScoreB = scoreB?.reduce(function (a, b) {
    return a + b;
  }, 0);

  const changeScoreReferee = (value, vlIndex, rfIndex, index) => {
    _setRound((pre) => [
      ...pre.map((e, rIndex) => {
        if (rIndex == index) {
          return {
            ...e,
            result: e?.result?.map((rl, rlIndex) => {
              if (vlIndex == rlIndex) {
                return {
                  ...rl,
                  referee: rl?.referee?.map((rf, i) => {
                    if (i == rfIndex) {
                      return { ...rf, score: value };
                    }
                    return rf;
                  }),
                  resultScore: rl?.referee
                    ?.map((rf, i) => {
                      if (i == rfIndex) {
                        return parseInt(value);
                      }
                      return parseInt(rf.score);
                    })
                    .reduce(function (a, b) {
                      return a + b;
                    }, 0),
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

  const handleKO = async (vlIndex, index) => {
    _setRound((pre) => [
      ...pre.map((pr, prIndex) => {
        if (prIndex == index) {
          return {
            ...pr,
            result: pr?.result?.map((re, reIndex) => {
              if (reIndex == vlIndex) {
                return {
                  ...re,
                  is_ko: 1,
                  event_round_id: pr?.event_round_id
                    ? pr?.event_round_id
                    : pr?.id,
                  // participant: reIndex,
                };
              }
              return re;
            }),
          };
        }
        return pr;
      }),
    ]);
  };

  const handleBackKO = async (vlIndex, index) => {
    _setRound((pre) => [
      ...pre.map((pr, prIndex) => {
        if (prIndex == index) {
          return {
            ...pr,
            result: pr?.result?.map((re, reIndex) => {
              if (reIndex == vlIndex) {
                return { ...re, is_ko: 0 };
              }
              return re;
            }),
          };
        }
        return pr;
      }),
    ]);
  };

  const ko = _round
    ?.map((e) => {
      return e?.result?.map((i) => {
        return {
          ...i,
          event_round_id: i?.event_round_id
            ? i?.event_round_id
            : e?.event_round_id,
        };
      });
    })
    .flat(1)
    .filter((e) => e?.is_ko == 1);

  const saveMathes1vs1Ko = async (e) => {
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
          member1: member1,
          member2: member2,
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

  const checkQualification = (e) => {
    setQualificationA(e);
  };

  const checkQualificationB = (e) => {
    setQualificationB(e);
  };
  console.log({ ko });
  console.log({ _round });

  return (
    <div>
      <div>
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableRow>
                <TableCell>
                  <Grid style={{ display: "flex" }}>
                    <img
                      src={
                        match?.match_individual_competitors?.length > 0
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
                    <Tooltip
                      title={
                        match?.match_individual_competitors?.length > 0
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
                            textAlign: "start",
                            width: "100%",
                            padding: 10,
                          }}
                          className={classes.textName}
                        >
                          {match?.match_individual_competitors?.length > 0
                            ? member1?.competitor?.family_name +
                              " " +
                              member1?.competitor?.given_name
                            : member1?.event_team?.name}
                        </p>
                      </p>
                    </Tooltip>
                  </Grid>
                </TableCell>
                <TableCell>
                  {match?.match_individual_competitors?.length > 0 ? (
                    <Grid
                      container
                      style={{ fontSize: 30, padding: 16 }}
                      justify="flex-end"
                    >
                      {ko[0]?.competitor_id == member1?.competitor_id ? (
                        <div style={{ display: "flex" }}>
                          <div>{totalScoreA + "(KO)"}</div>
                        </div>
                      ) : (
                        <div>{totalScoreA}</div>
                      )}
                    </Grid>
                  ) : (
                    <Grid
                      container
                      style={{ fontSize: 30, padding: 16 }}
                      justify="flex-end"
                    >
                      {match?.round.length <= 0 ? (
                        ko[0]?.event_team_id == member1?.event_team_id ? (
                          <div style={{ display: "flex" }}>
                            <div>{totalScoreA + "(KO)"}</div>
                          </div>
                        ) : (
                          <div>{totalScoreA}</div>
                        )
                      ) : ko[0]?.event_team_id == member1?.event_team_id ? (
                        <div style={{ display: "flex" }}>
                          <div>{totalScoreA + "(KO)"}</div>
                        </div>
                      ) : (
                        <div>{totalScoreA}</div>
                      )}
                    </Grid>
                  )}
                </TableCell>
                <TableCell>
                  <Grid
                    container
                    justify="center"
                    style={{ fontSize: 50, textAlign: "center" }}
                  >
                    -
                  </Grid>
                </TableCell>
                <TableCell>
                  {match?.match_individual_competitors?.length > 0 ? (
                    <Grid
                      container
                      style={{
                        fontSize: 30,
                        textAlign: "end",
                        padding: 23,
                      }}
                    >
                      {ko[0]?.competitor_id == member2?.competitor_id
                        ? totalScoreB + "(KO)"
                        : totalScoreB}
                    </Grid>
                  ) : (
                    <Grid
                      container
                      style={{
                        fontSize: 30,
                        textAlign: "end",
                        padding: 23,
                      }}
                    >
                      {match?.round.length <= 0
                        ? ko[0]?.event_team_id == member2?.event_team_id
                          ? totalScoreB + "(KO)"
                          : totalScoreB
                        : ko[0]?.event_team_id == member2?.event_team_id
                        ? totalScoreB + "(KO)"
                        : totalScoreB}
                    </Grid>
                  )}
                </TableCell>
                <TableCell>
                  <Grid style={{ display: "flex" }}>
                    <Tooltip
                      title={
                        match?.match_individual_competitors?.length > 0
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
                          justifyContent: "flex-end",
                        }}
                      >
                        <p
                          style={{
                            margin: "0",
                            textAlign: "end",
                            width: "100%",
                            padding: 10,
                          }}
                          className={classes.textName}
                        >
                          {match?.match_individual_competitors?.length > 0
                            ? member2?.competitor?.family_name +
                              " " +
                              member2?.competitor?.given_name
                            : member2?.event_team?.name}
                        </p>
                      </p>
                    </Tooltip>

                    <img
                      src={
                        match?.match_individual_competitors?.length > 0
                          ? process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member2?.competitor?.team?.country.flag_url
                          : process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member2?.event_team?.team?.country.flag_url
                      }
                      width={100}
                      height={"auto"}
                      style={{ float: "right" }}
                    />
                  </Grid>
                  {/* </Grid> */}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                  }}
                >
                  <p> {t("score1vs1.qualification")}</p>
                </TableCell>
                <TableCell>
                  <Grid container justify="flex-end">
                    <Select
                      style={{ width: "73%" }}
                      value={qualificationA}
                      // label={"hieu ga"}
                      size="small"
                      handleChange={(e) => checkQualification(e)}
                      options={[
                        {
                          value: null,
                          label: "-",
                        },
                        ...qualification?.map((e) => ({
                          value: e?.value,
                          label: e?.label,
                        })),
                      ]}
                      fullWidth
                    />
                  </Grid>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Grid container>
                    <Select
                      style={{ width: "73%" }}
                      value={qualificationB}
                      size="small"
                      handleChange={(e) => checkQualificationB(e)}
                      options={[
                        {
                          value: null,
                          label: "-",
                        },
                        ...qualification?.map((e) => ({
                          value: e?.value,
                          label: e?.label,
                        })),
                      ]}
                      fullWidth
                    />
                  </Grid>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
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
                          <TableCell style={{ fontSize: "1.25rem" }}>
                            {vlIndex == 0 && (
                              <Grid
                                container
                                direction="row"
                                alignItems="space-between"
                                justify="flex-end"
                                style={{
                                  alignItems: "center",
                                  display: "flex",
                                }}
                              >
                                {ko.length == 0 ? (
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      size="medium"
                                      style={{}}
                                      onClick={() => handleKO(vlIndex, index)}
                                    >
                                      KO
                                    </Button>
                                  </Grid>
                                ) : (
                                  <Grid item>
                                    <Button
                                      disabled={
                                        (match?.match_individual_competitors
                                          ?.length > 0
                                          ? ko?.[0]?.competitor_id ==
                                            vl?.competitor_id
                                          : ko?.[0]?.event_team_id ==
                                            vl?.event_team_id) &&
                                        ko?.[0]?.event_round_id ==
                                          (value?.event_round_id
                                            ? value?.event_round_id
                                            : value?.id)
                                          ? false
                                          : true
                                      }
                                      variant="contained"
                                      color="secondary"
                                      size="medium"
                                      style={{}}
                                      onClick={() =>
                                        handleBackKO(vlIndex, index)
                                      }
                                    >
                                      KO
                                    </Button>
                                  </Grid>
                                )}
                                <Grid item>
                                  <Popover
                                    close={close}
                                    setClose={() => setClose(false)}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "center",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "center",
                                    }}
                                    content={
                                      ko.length == 0 ? (
                                        <div>
                                          <div
                                            style={{
                                              padding: "10px 10px 0px 10px",
                                              fontSize: "1rem",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {t("referee_screen.referee")}:
                                          </div>
                                          <Paper
                                            style={{
                                              padding: "0px 10px 10px 10px",
                                              display: "flex",
                                            }}
                                          >
                                            {vl?.referee?.map((rf, rfindex) => {
                                              return (
                                                <table>
                                                  <tr>
                                                    {rf?.referee?.given_name +
                                                      " " +
                                                      rf?.referee?.family_name}
                                                  </tr>
                                                  <tr>
                                                    <td>
                                                      <TextField
                                                        style={{
                                                          marginRight: 5,
                                                        }}
                                                        type="number"
                                                        onInput={(e) => {
                                                          e.target.value = Math.max(
                                                            0,
                                                            parseInt(
                                                              e.target.value
                                                            )
                                                          )
                                                            .toString()
                                                            .slice(0, 2);
                                                        }}
                                                        value={rf?.score}
                                                        size="small"
                                                        variant={"outlined"}
                                                        onChange={(e) =>
                                                          changeScoreReferee(
                                                            e.target.value,
                                                            vlIndex,
                                                            rfindex,
                                                            index
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </td>
                                                  </tr>
                                                </table>
                                              );
                                            })}
                                          </Paper>
                                        </div>
                                      ) : (
                                        <div>
                                          <div
                                            style={{
                                              padding: "10px 10px 0px 10px",
                                              fontSize: "1rem",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {t("referee_screen.referee")}
                                          </div>
                                          <Paper
                                            style={{
                                              padding: "0px 10px 10px 10px",
                                              display: "flex",
                                            }}
                                          >
                                            {vl?.referee?.map((rf, rfindex) => {
                                              return (
                                                <table
                                                  style={{
                                                    border: "1px solid",
                                                    borderCollapse: "collapse",
                                                  }}
                                                >
                                                  <tr>
                                                    <th
                                                      style={{
                                                        padding: 5,
                                                        border: "1px solid",
                                                      }}
                                                    >
                                                      {rf?.referee?.given_name +
                                                        " " +
                                                        rf?.referee
                                                          ?.family_name}
                                                    </th>
                                                  </tr>
                                                  <tr>
                                                    <td style={{ padding: 5 }}>
                                                      <div>{rf?.score}</div>
                                                    </td>
                                                  </tr>
                                                </table>
                                              );
                                            })}
                                          </Paper>
                                        </div>
                                      )
                                    }
                                  >
                                    <Grid>
                                      <Button
                                        style={{ justifyContent: "flex-end" }}
                                      >
                                        <p
                                          style={{
                                            margin: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "1.3rem",
                                            marginRight: 10,
                                          }}
                                        >
                                          {/* Điểm: */}
                                          {vl?.resultScore
                                            ? vl?.resultScore
                                            : 0}
                                        </p>
                                      </Button>
                                    </Grid>
                                  </Popover>
                                </Grid>
                              </Grid>
                            )}
                            {vlIndex == 1 && (
                              <Grid
                                container
                                direction="row"
                                alignItems="space-between"
                                style={{
                                  alignItems: "center",
                                  display: "flex",
                                }}
                              >
                                <Grid item>
                                  <Popover
                                    close={close}
                                    setClose={() => setClose(false)}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "center",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "center",
                                    }}
                                    content={
                                      ko.length == 0 ? (
                                        <div>
                                          <div
                                            style={{
                                              padding: "10px 10px 0px 10px",
                                              fontSize: "1rem",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {t("referee_screen.referee")}:
                                          </div>
                                          <Paper
                                            style={{
                                              padding: "0px 10px 10px 10px",
                                              display: "flex",
                                            }}
                                          >
                                            {vl?.referee?.map((rf, rfindex) => {
                                              return (
                                                <table>
                                                  <tr>
                                                    {rf?.referee?.given_name +
                                                      " " +
                                                      rf?.referee?.family_name}
                                                  </tr>
                                                  <tr>
                                                    <td>
                                                      <TextField
                                                        style={{
                                                          marginRight: 5,
                                                        }}
                                                        type="number"
                                                        onInput={(e) => {
                                                          e.target.value = Math.max(
                                                            0,
                                                            parseInt(
                                                              e.target.value
                                                            )
                                                          )
                                                            .toString()
                                                            .slice(0, 2);
                                                        }}
                                                        value={rf?.score}
                                                        size="small"
                                                        variant={"outlined"}
                                                        onChange={(e) =>
                                                          changeScoreReferee(
                                                            e.target.value,
                                                            vlIndex,
                                                            rfindex,
                                                            index
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </td>
                                                  </tr>
                                                </table>
                                              );
                                            })}
                                          </Paper>
                                        </div>
                                      ) : (
                                        <div>
                                          <div
                                            style={{
                                              padding: "10px 10px 0px 10px",
                                              fontSize: "1rem",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {t("referee_screen.referee")}:
                                          </div>
                                          <Paper
                                            style={{
                                              padding: "0px 10px 10px 10px",
                                              display: "flex",
                                            }}
                                          >
                                            {vl?.referee?.map((rf, rfindex) => {
                                              return (
                                                <table
                                                  style={{
                                                    border: "1px solid",
                                                    borderCollapse: "collapse",
                                                  }}
                                                >
                                                  <tr>
                                                    <th
                                                      style={{
                                                        padding: 5,
                                                        border: "1px solid",
                                                      }}
                                                    >
                                                      {rf?.referee?.given_name +
                                                        " " +
                                                        rf?.referee
                                                          ?.family_name}
                                                    </th>
                                                  </tr>
                                                  <tr>
                                                    <td style={{ padding: 5 }}>
                                                      <div>{rf?.score}</div>
                                                    </td>
                                                  </tr>
                                                </table>
                                              );
                                            })}
                                          </Paper>
                                        </div>
                                      )
                                    }
                                  >
                                    <Grid>
                                      <Button style={{ marginLeft: 5 }}>
                                        <p
                                          style={{
                                            margin: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "1.3rem",
                                          }}
                                        >
                                          {/* Điểm: */}
                                          {vl?.resultScore
                                            ? vl?.resultScore
                                            : 0}
                                        </p>
                                      </Button>
                                    </Grid>
                                  </Popover>
                                </Grid>
                                {ko.length == 0 ? (
                                  <Grid>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      size="medium"
                                      style={{}}
                                      onClick={() => handleKO(vlIndex, index)}
                                    >
                                      KO
                                    </Button>
                                  </Grid>
                                ) : (
                                  <Grid>
                                    <Button
                                      disabled={
                                        (match?.match_individual_competitors
                                          ?.length > 0
                                          ? ko?.[0]?.competitor_id ==
                                            vl?.competitor_id
                                          : ko?.[0]?.event_team_id ==
                                            vl?.event_team_id) &&
                                        ko?.[0]?.event_round_id ==
                                          (value?.event_round_id
                                            ? value?.event_round_id
                                            : value?.id)
                                          ? false
                                          : true
                                      }
                                      variant="contained"
                                      color="secondary"
                                      size="medium"
                                      style={{}}
                                      onClick={() =>
                                        handleBackKO(vlIndex, index)
                                      }
                                    >
                                      KO
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            )}
                          </TableCell>
                          {vlIndex == 0 && <TableCell></TableCell>}
                        </React.Fragment>
                      );
                    })}
                    <TableCell></TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </TableContainer>
        </div>
      </div>
      {match?.match_referee_relations.length == 0 && (
        <div
          style={{
            color: "red",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: 10,
          }}
        >
          {t("score1vs1.referee_does_not_exist")}
        </div>
      )}

      {match?.match_referee_relations.length > 0 && (
        <Button
          disabled={api?.loading == false ? false : true}
          variant="contained"
          color="primary"
          size="medium"
          style={{ marginTop: 10 }}
          onClick={(e) => saveMathes1vs1Ko(e)}
        >
          {t("button.save")}
        </Button>
      )}
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
  matchPoint: {
    padding: 10,
    width: "50%",
  },
  textName: {
    maxWidth: 300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));
