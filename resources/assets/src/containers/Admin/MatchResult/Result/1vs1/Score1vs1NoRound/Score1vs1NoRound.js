import {
  Grid,
  makeStyles,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  TableBody,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { useAPI, useFetch } from "../../../../../../api/api";
import {
  CheckQualification,
  qualification_type,
  stage_type,
} from "../../../../../../common/constants";

const useStyles = makeStyles(() => ({
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
  td1: { width: "30%" },
  td2: { width: "15%" },
  td3: { width: "10%" },
}));
export default function Score1vs1NoRound({ match }) {
  const params = useParams();
  const classes = useStyles();
  const api = useAPI();
  const { t } = useTranslation();
  const history = useHistory();
  const [member1, setMember1] = useState([]);
  const [member2, setMember2] = useState([]);

  const [matchPointA, setMatchPointA] = useState();
  const [matchPointB, setMatchPointB] = useState();

  const [is_winnerA, setIsWinnerA] = useState();
  const [is_winnerB, setIsWinnerB] = useState();

  const [qualificationA, setQualificationA] = useState();
  const [qualificationB, setQualificationB] = useState();
  useEffect(() => {
    if (match) {
      setMember1(
        match?.match_event_teams?.length > 0
          ? match?.match_event_teams[0]
          : match?.match_individual_competitors[0]
      );
      setMember2(
        match?.match_event_teams?.length > 0
          ? match?.match_event_teams[1]
          : match?.match_individual_competitors[1]
      );
      setMatchPointA(
        match?.match_event_teams?.length > 0
          ? match?.match_event_team[0]?.match_point
          : match?.match_individual_competitors[0]?.match_point
      );
      setMatchPointB(
        match?.match_event_teams?.length > 0
          ? match?.match_event_team[1]?.match_point
          : match?.match_individual_competitors[1]?.match_point
      );
      setQualificationA(
        match?.stage_qualification_competitor?.[0]?.qualification_type ==
          qualification_type.QUALIFIED
          ? match?.stage_qualification_competitor?.[0]?.qualified_to_stage_id
          : match?.stage_qualification_competitor?.[0]?.qualification_type
      );
      setQualificationB(
        match?.stage_qualification_competitor?.[1]?.qualification_type ==
          qualification_type.QUALIFIED
          ? match?.stage_qualification_competitor?.[1]?.qualified_to_stage_id
          : match?.stage_qualification_competitor?.[1]?.qualification_type
      );

      setIsWinnerA(
        match?.match_event_teams?.length > 0
          ? match?.match_event_team[0]?.is_winner
          : match?.match_individual_competitors[0]?.is_winner
      );
      setIsWinnerB(
        match?.match_event_teams?.length > 0
          ? match?.match_event_team[1]?.is_winner
          : match?.match_individual_competitors[1]?.is_winner
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
  const matchPoint = match?.stage?.match_points?.map((e, index) => ({
    value: e?.points == 0 ? "0" : e?.points,
    label: e?.point_name + ":" + " " + e?.points,
  }));

  const changeIsWinnerA = (e, value) => {
    setIsWinnerA(value);
    if (value == 1) {
      setIsWinnerB(2);
    }
    if (value == 2) {
      setIsWinnerB(1);
    }
    if (value == 3) {
      setIsWinnerB(3);
    }
  };
  const changeIsWinnerB = (e, value) => {
    setIsWinnerB(value);
    if (value == 1) {
      setIsWinnerA(2);
    }
    if (value == 2) {
      setIsWinnerA(1);
    }
    if (value == 3) {
      setIsWinnerA(3);
    }
  };
  const is_winner = [
    {
      value: null,
      label: "-",
    },
    {
      value: 1,
      label: t("score1vs1.win"),
    },
    {
      value: 2,
      label: t("score1vs1.lose"),
    },
    {
      value: 3,
      label: t("score1vs1.draw"),
    },
  ];

  const saveMathes1vs1 = async (e) => {
    try {
      let res = await api.fetcher("post", "admin/update1vs1NoRound", {
        competition_type: match?.stage?.event?.competition_type,
        match_id: params?.id,
        member1: member1,
        member2: member2,
        matchPointA: matchPointA ? matchPointA : 0,
        matchPointB: matchPointB ? matchPointB : 0,
        is_winnerA: is_winnerA,
        is_winnerB: is_winnerB,
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

  return (
    <Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.td1}>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                  style={{ display: "flex" }}
                >
                  <Grid item style={{ padding: 6, textAlign: "end" }} xs={3}>
                    <img
                      src={
                        match?.match_event_teams?.length > 0
                          ? process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member1?.event_team?.team?.country.flag_url
                          : process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member1?.competitor?.team?.country.flag_url
                      }
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={"auto"}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Tooltip
                      title={
                        match?.match_event_teams?.length > 0
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
                          {match?.match_event_teams?.length > 0
                            ? member1?.event_team?.name
                            : member1?.competitor?.given_name +
                              " " +
                              member1?.competitor?.family_name}
                        </p>
                      </p>
                    </Tooltip>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell className={classes.td2}>
                <Grid
                  container
                  justify="flex-end"
                  alignItems="center"
                  className={classes.matchPoint}
                >
                  <Select
                    style={{ fontWeight: 600 }}
                    value={is_winnerA ? parseInt(is_winnerA) : 0}
                    size="small"
                    onChange={(e) => changeIsWinnerA(e, e.target.value)}
                  >
                    {is_winner?.map((e) => {
                      return <MenuItem value={e?.value}>{e?.label}</MenuItem>;
                    })}
                  </Select>
                </Grid>
              </TableCell>
              <TableCell className={classes.td3}>
                <Grid
                  container
                  justify="center"
                  style={{ fontSize: 50, textAlign: "center" }}
                >
                  -
                </Grid>
              </TableCell>
              <TableCell className={classes.td2}>
                <Grid container className={classes.matchPoint}>
                  <Select
                    style={{ fontWeight: 600 }}
                    value={is_winnerB ? parseInt(is_winnerB) : 0}
                    size="small"
                    onChange={(e) => changeIsWinnerB(e, e.target.value)}
                  >
                    {is_winner?.map((e, index) => {
                      return <MenuItem value={e?.value}>{e?.label}</MenuItem>;
                    })}
                  </Select>
                </Grid>
              </TableCell>
              {/* member2 */}
              <TableCell className={classes.td1}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  style={{ display: "flex" }}
                >
                  <Grid item xs={9}>
                    <Tooltip
                      title={
                        match?.match_event_teams?.length > 0
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
                          justifyContent: "flex-end",
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
                          {match?.match_event_teams?.length > 0
                            ? member2?.event_team?.name
                            : member2?.competitor?.given_name +
                              " " +
                              member2?.competitor?.family_name}
                        </p>
                      </p>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3} style={{ padding: 6 }}>
                    <img
                      src={
                        match?.match_event_teams?.length > 0
                          ? process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member2?.event_team?.team?.country.flag_url
                          : process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            member2?.competitor?.team?.country.flag_url
                      }
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={"auto"}
                    />
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {match?.stage?.stage_type == stage_type.QUALIFIED_USED_TABLE ? (
                  <Grid style={{ fontWeight: 600, fontSize: "1.15rem" }}>
                    {t("stages_screen.rank_type.match_point")}
                  </Grid>
                ) : (
                  <Grid style={{ fontWeight: 600, fontSize: "1.15rem" }}>
                    {t("score1vs1.qualification")}
                  </Grid>
                )}
              </TableCell>
              <TableCell>
                {match?.stage?.stage_type == stage_type.QUALIFIED_USED_TABLE ? (
                  <Grid
                    container
                    className={classes.matchPoint}
                    style={{ textAlign: "end" }}
                    justify="flex-end"
                    alignItems="center"
                  >
                    <Select
                      style={{ fontWeight: 600 }}
                      value={matchPointA ? parseInt(matchPointA) : 0}
                      size="small"
                      onChange={(e) => changeResultPoints(e, e.target.value)}
                      renderValue={(matchPointA) =>
                        `${matchPointA}` + " " + `${t("score1vs1.pts")}`
                      }
                    >
                      <MenuItem value="">-</MenuItem>
                      {matchPoint?.map((e) => {
                        return <MenuItem value={e?.value}>{e?.label}</MenuItem>;
                      })}
                    </Select>
                  </Grid>
                ) : (
                  <Grid
                    container
                    className={classes.matchPoint}
                    justify="flex-end"
                    alignItems="center"
                    style={{ textAlign: "end" }}
                  >
                    <Select
                      value={qualificationA ? parseInt(qualificationA) : 0}
                      size="small"
                      onChange={(e) => checkQualification(e, e.target.value)}
                    >
                      <MenuItem value="">-</MenuItem>
                      {qualification?.map((e) => {
                        return <MenuItem value={e?.value}>{e?.label}</MenuItem>;
                      })}
                    </Select>
                  </Grid>
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                {match?.stage?.stage_type == stage_type.QUALIFIED_USED_TABLE ? (
                  <Grid container className={classes.matchPoint}>
                    <Select
                      style={{ fontWeight: 600 }}
                      value={matchPointB ? parseInt(matchPointB) : 0}
                      size="small"
                      onChange={(e) => changeResultPointsB(e, e.target.value)}
                      renderValue={(matchPointB) =>
                        `${matchPointB}` + " " + `${t("score1vs1.pts")}`
                      }
                    >
                      <MenuItem value="">-</MenuItem>
                      {matchPoint?.map((e) => {
                        return <MenuItem value={e?.value}>{e?.label}</MenuItem>;
                      })}
                    </Select>
                  </Grid>
                ) : (
                  <Grid container className={classes.matchPoint}>
                    <Select
                      value={qualificationB ? parseInt(qualificationB) : 0}
                      size="small"
                      onChange={(e) => checkQualificationB(e, e.target.value)}
                    >
                      <MenuItem value="">-</MenuItem>
                      {qualification?.map((e) => {
                        return <MenuItem value={e?.value}>{e?.label}</MenuItem>;
                      })}
                    </Select>
                  </Grid>
                )}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        disabled={api?.loading == false ? false : true}
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        onClick={(e) => saveMathes1vs1(e)}
      >
        {t("button.save")}
      </Button>
    </Grid>
  );
}
