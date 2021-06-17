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
import { useAPI, useFetch } from "../../../../../../api/api";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import Select from "../../../../../../components/form/Select";
import { CheckQualification } from "../../../../../../common/constants";

export default function Score1vs1KoNoRound({}) {
  const classes = useStyle();
  const [close, setClose] = useState(false);
  const api = useAPI();
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

  const [KO, setKO] = useState({
    is_ko: null,
    competitor_id: null,
  });

  useEffect(() => {
    if (match) {
      setMember1(match?.match_individual_competitors[0]);
      setMember2(match?.match_individual_competitors[1]);
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
      if (match?.match_individual_competitors?.[0]?.result?.length > 0) {
        _setRound(
          match?.match_referee_relations.map((e) => ({
            ...e,
            result: match?.match_individual_competitors?.map((gm) => ({
              ...gm,
              resultScore: gm?.result?.[0]?.match_round_result_referee_relation?.find(
                (i) => i?.referee_id == e?.referee_id
              )?.score,
            })),
          }))
        );
        setKO({
          is_ko: match?.match_individual_competitors?.find((e) => e?.is_ko == 1)
            ?.competitor_id
            ? 1
            : null,
          competitor_id: match?.match_individual_competitors?.find(
            (e) => e?.is_ko == 1
          )?.competitor_id,
        });
      } else {
        _setRound(
          match?.match_referee_relations.map((e) => ({
            ...e,
            result: match?.match_individual_competitors?.map((gm) => ({
              ...gm,
              resultScore: 0,
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

  const changeScoreReferee = (value, index, memberIndex) => {
    _setRound((pre) => [
      ...pre.map((e, rIndex) => {
        if (rIndex == index) {
          return {
            ...e,
            result: e?.result?.map((re, reIndex) => {
              if (reIndex == memberIndex) {
                return {
                  ...re,
                  resultScore: value ? value : 0,
                };
              }
              return re;
            }),
          };
        }
        return e;
      }),
    ]);
  };

  const saveMathes1vs1Ko = async (e) => {
    try {
      let res = await api.fetcher("post", "admin/update1vs1koNoRound", {
        referee: JSON.stringify(_round),
        competition_type: match?.stage?.event?.competition_type,
        match_id: params?.id,
        scoreA: totalScoreA,
        scoreB: totalScoreB,
        member1: member1,
        member2: member2,
        is_ko: KO,
        qualificationA: qualificationA ? qualificationA : 0,
        qualificationB: qualificationB ? qualificationB : 0,
        stage_id: match?.stage_id,
        qualified_to_stage_id: match?.stage?.stage_qualification_settings,
      });
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

  const handleKo = (competitor_id) => {
    setKO({
      is_ko: 1,
      competitor_id: competitor_id,
    });
  };
  const handleBackKo = (competitor_id) => {
    setKO({
      is_ko: null,
      competitor_id: null,
    });
  };

  return (
    <div>
      <div>
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableRow>
                <TableCell style={{ width: "30%" }}>
                  <Grid
                    style={{ display: "flex", alignItems: "center" }}
                    container
                  >
                    <Grid item xs={3}>
                      <img
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          member1?.competitor?.team?.country.flag_url
                        }
                        width={"100%"}
                        height={"auto"}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Tooltip
                        title={
                          member1?.competitor?.given_name +
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
                              padding: 10,
                            }}
                            className={classes.textName}
                          >
                            {member1?.competitor?.given_name +
                              " " +
                              member1?.competitor?.family_name}
                          </p>
                        </p>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell style={{ width: "15%" }}>
                  <Grid
                    container
                    justify="flex-end"
                    alignItems="center"
                    style={{ fontSize: 30, padding: 16 }}
                  >
                    <Grid item xs={6} style={{ textAlign: "end" }}>
                      {KO.is_ko != 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleKo(member1?.competitor_id)}
                        >
                          K.O
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleBackKo(member1?.competitor_id)}
                          disabled={
                            KO.competitor_id == member1?.competitor_id
                              ? false
                              : true
                          }
                        >
                          K.O
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={6} style={{ padding: 4 }}>
                      {totalScoreA}
                    </Grid>
                  </Grid>
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
                <TableCell style={{ width: "15%" }}>
                  <Grid container style={{ fontSize: 30, padding: 16 }}>
                    <Grid item xs={6} style={{ padding: 4, textAlign: "end" }}>
                      {totalScoreB}
                    </Grid>
                    <Grid item xs={6}>
                      {KO.is_ko != 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleKo(member2?.competitor_id)}
                        >
                          K.O
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleBackKo(member2?.competitor_id)}
                          disabled={
                            KO.competitor_id == member2?.competitor_id
                              ? false
                              : true
                          }
                        >
                          K.O
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell style={{ width: "30%" }}>
                  <Grid
                    style={{ display: "flex", alignItems: "center" }}
                    container
                  >
                    <Grid item xs={9}>
                      <Tooltip
                        title={
                          member2?.competitor?.given_name +
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
                            justifyContent: "flex-end",
                            textAlign: "end",
                          }}
                        >
                          <p
                            style={{
                              margin: "0",
                              // textAlign: "center",
                              width: "100%",
                              padding: 10,
                            }}
                            className={classes.textName}
                          >
                            {member2?.competitor?.given_name +
                              " " +
                              member2?.competitor?.family_name}
                          </p>
                        </p>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={3}>
                      <img
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          member2?.competitor?.team?.country.flag_url
                        }
                        width={"100%"}
                        height={"auto"}
                        style={{ float: "right" }}
                      />
                    </Grid>
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
                  <p> {t("qualification_type.qualification")}</p>
                </TableCell>
                <TableCell>
                  <Grid container justify="flex-end">
                    <Select
                      //   style={{ width: "73%" }}
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
                      //   style={{ width: "73%" }}
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
                      <p>
                        {" "}
                        {value?.referee?.family_name +
                          " " +
                          value?.referee?.given_name}
                      </p>
                    </TableCell>
                    {value?.result?.map((e, memberIndex) => {
                      return (
                        <React.Fragment>
                          <TableCell>
                            <TextField
                              className={memberIndex == 0 && classes.input}
                              style={{
                                marginRight: 5,
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
                              value={e?.resultScore}
                              size="small"
                              variant={"outlined"}
                              onChange={(e) =>
                                changeScoreReferee(
                                  e.target.value,
                                  index,
                                  memberIndex
                                )
                              }
                              fullWidth
                            />
                          </TableCell>
                          {memberIndex == 0 && <TableCell></TableCell>}
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

      {loading == false && match?.match_referee_relations.length > 0 && (
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
    width: "50%",
  },
  input: {
    "& input": {
      textAlign: "end",
    },
  },
}));
