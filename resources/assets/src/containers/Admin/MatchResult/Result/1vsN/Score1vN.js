import React, { useEffect, useState } from "react";
import { useAPI, useFetch } from "../../../../../api/api";
import {
  IconButton,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Grid,
  ButtonGroup,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  qualification_type,
  measurement_unit,
} from "../../../../../common/constants";

export default function Score1vsN({ match, status }) {
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const params = useParams();
  const [member, setMember] = useState([]);
  const [referee, setReferee] = useState([]);
  const [winner, setWinner] = useState([]);
  const [participantCheck, setParticipantCheck] = useState(0);
  const [dataCompetitor, setArrayCompetitor] = useState([]);
  const search = {
    match_id_equal: params?.id,
    is_winner_like: 1,
  };
  const [qualification, setQualification] = useState([]);
  const [nextStageId, setNextStageId] = useState();
  useEffect(() => {
    const Test = async () => {
      if (match?.stage?.event?.competition_type == 1) {
        setParticipantCheck(1);
      }
      if (match?.stage?.event?.competition_type == 2) {
        setParticipantCheck(2);
      }
    };
    if (match) {
      Test();
      setQualification(match?.stage?.stage_qualification_settings);
      if (match?.stage?.next_stage?.length > 0) {
        setNextStageId(true);
      } else {
        setNextStageId(false);
      }
      if (match?.round.length > 0) {
        let data = [];
        let tempRefereeArray = [];
        match.round?.map((round) => {
          let temp_round = {
            name: "",
            id: "",
            member: [],
          };
          temp_round.name = round.name;
          temp_round.id = round.event_round_id;
          round.result?.map((result) => {
            let tempMember = {
              name: "",
              team: {},
              score: 0,
              referee: [],
              participant_has: 1,
              id: 1,
            };
            if (result.competitor_id) {
              tempMember.name =
                result.competitor.given_name +
                " " +
                result.competitor.family_name;
              tempMember.team = result.competitor.team;
              tempMember.score = result.score;
              tempMember.participant_has = 1;
              tempMember.id = result.competitor.id;
              let count_reward = 0;
              match?.stage?.stage_qualification_competitors.map((qualifi) => {
                if (qualifi.participant_id == result?.competitor?.id) {
                  tempMember.qualification_type = qualifi.qualification_type;
                  tempMember.qualified_to_stage_id =
                    qualifi.qualified_to_stage_id;
                  if (
                    qualifi.qualification_type == qualification_type.QUALIFIED
                  ) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  if (qualifi.qualification_type == qualification_type.HCV) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  if (qualifi.qualification_type == qualification_type.HCB) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  if (qualifi.qualification_type == qualification_type.HCD) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  count_reward++;
                }
              });
              if (count_reward == 0) {
                tempMember.qualification_type = qualification_type.NONE;
                tempMember.qualified_to_stage_id = 0;
                tempMember.color = "";
                tempMember.text = "";
              }
              let count_final = 0;
              match?.match_individual_competitors.map((final) => {
                if (final?.competitor_id == result.competitor_id) {
                  count_final++;
                  tempMember.final_score = final.final_score;
                }
              });
              if (count_final == 0) {
                tempMember.final_score = 0;
              }
              let count = 0;
              match?.stage?.stage_qualification_competitors?.map((qualifi) => {
                if (qualifi.participant_id == result?.competitor?.id) {
                  tempMember.qualification_type = qualifi.qualification_type;
                  count++;
                }
              });
              if (count == 0) {
                tempMember.qualification_type = 0;
              }
              setParticipantCheck(1);
            } else {
              tempMember.name = result?.event_team.name;
              tempMember.team = result?.event_team.team;
              tempMember.score = result.score;
              tempMember.participant_has = 2;
              tempMember.id = result?.event_team.id;
              let count_reward = 0;
              match?.stage?.stage_qualification_competitors.map((qualifi) => {
                if (qualifi.event_team_id == result?.event_team_id) {
                  tempMember.qualification_type = qualifi.qualification_type;
                  tempMember.qualified_to_stage_id =
                    qualifi.qualified_to_stage_id;
                  if (
                    qualifi.qualification_type == qualification_type.QUALIFIED
                  ) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  if (qualifi.qualification_type == qualification_type.HCV) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  if (qualifi.qualification_type == qualification_type.HCB) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  if (qualifi.qualification_type == qualification_type.HCD) {
                    tempMember.color = "#f4e4bc";
                    tempMember.text = "black";
                  }
                  count_reward++;
                }
              });
              if (count_reward == 0) {
                tempMember.qualification_type = qualification_type.NONE;
                tempMember.qualified_to_stage_id = 0;
                tempMember.color = "";
                tempMember.text = "";
              }
              let count_final = 0;
              match?.match_event_teams.map((final) => {
                if (final?.event_team_id == result.event_team_id) {
                  count_final++;
                  tempMember.final_score = final.final_score;
                }
              });
              if (count_final == 0) {
                tempMember.final_score = 0;
              }
              let count = 0;
              match?.stage?.stage_qualification_competitors?.map((qualifi) => {
                if (qualifi.event_team_id == result?.event_team?.id) {
                  tempMember.qualification_type = qualifi.qualification_type;
                  count++;
                }
              });
              if (count == 0) {
                tempMember.qualification_type = 0;
              }
              setParticipantCheck(2);
            }
            result.match_round_result_referee_relation?.map((refereeValue) => {
              let tempReferee = {
                referee: {},
                score: 0,
                match_referee_id: 0,
              };
              tempReferee.referee = refereeValue.referee;
              tempReferee.match_referee_id = refereeValue.match_referee_id;
              tempReferee.score = refereeValue.score;
              tempMember.referee.push(tempReferee);
            });
            temp_round.member.push(tempMember);
          });
          setArrayCompetitor(temp_round.member);
          data.push(temp_round);
        });
        setReferee(match?.match_referee_relations);
        setMember(data);
      } else {
        let data = [];
        match?.stage?.event_rounds?.map((value) => {
          let _round = {
            name: "",
            id: "",
          };
          _round.name = value.name;
          _round.id = value.id;
          data.push(_round);
        });
        setReferee(match?.match_referee_relations);
        let referee = [];
        match?.match_referee_relations?.map((value) => {
          let tempReferee = {
            referee: {},
            score: 0,
            match_referee_id: 0,
          };
          tempReferee.referee = value;
          tempReferee.match_referee_id = value.id;
          referee.push(tempReferee);
        });
        if (match?.match_individual_competitors?.length > 0) {
          let temp = match?.match_individual_competitors;
          temp?.map((value) => {
            value.target = [];
            value.score = 0;
            value.final_score = 0;
            value.referee = referee;
            value.team = value?.competitor?.team;
            value.name =
              value?.competitor?.given_name +
              " " +
              value?.competitor?.family_name;
            value.participant_has = 1;
            value.id = value?.competitor?.id;
            value.qualification_type = 0;
            setParticipantCheck(1);
          });
          data?.map((value) => {
            value.member = temp;
          });
          setMember(data);
        } else {
          let temp = match?.match_event_teams;
          temp?.map((value) => {
            value.target = [];
            value.score = 0;
            value.final_score = 0;
            value.referee = referee;
            value.team = value?.event_team?.team;
            value.name = value?.event_team?.name;
            value.participant_has = 2;
            value.id = value.event_team_id;
            value.qualification_type = 0;
            setParticipantCheck(2);
          });
          setArrayCompetitor(temp);
          data?.map((value) => {
            value.member = temp;
          });
          setMember(data);
        }
      }
    }
  }, [match]);
  const formData = new FormData();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      let max = 0;
      let win = [];
      let winner_member = [];
      formData.append("match_id", params?.id ? params?.id : "");
      formData.append("event_id", match?.stage?.event_id);
      formData.append("unit", match?.stage?.unit);
      formData.append("next_stage_id", nextStageId === true ? 1 : 2);
      formData.append("stage_id", match?.stage?.id);
      formData.append("participant_check", participantCheck);
      formData.append("status", status?.id ? status?.id : 1);
      formData.append("competitor", JSON.stringify(dataCompetitor));
      let data = [...member];
      data?.map((value) => {
        value.member.sort(function (a, b) {
          return parseFloat(a.score) - parseFloat(b.score);
        });
      });
      formData.append("member", JSON.stringify(data));
      formData.append("winner", JSON.stringify(winner_member));
      formData.append("_method", "POST");
      try {
        let res = await api.fetcher("post", "admin/score_1_vs_n", formData);
        let updateMedalTable = await api.fetcher("get", "admin/medalRankings");
        if (res) {
        }
      } catch (e) {}
    },
  });
  const changeScoreReferee = (index, indexRef, value, indexRound) => {
      if(!value) {
          value = 0;
      } else {
          value = value.replace(/^0+/, '');
      }
    let temp = [...member];
    temp[indexRound] = { ...member[indexRound] };
    temp[indexRound].member = [...member[indexRound].member];
    temp[indexRound].member[index] = { ...member[indexRound].member[index] };
    temp[indexRound].member[index].referee = [
      ...member[indexRound].member[index].referee,
    ];
    temp[indexRound].member[index].referee[indexRef] = {
      ...member[indexRound].member[index].referee[indexRef],
    };
    temp[indexRound].member[index].referee[indexRef].score = parseFloat(value);
    setFinalScore(temp, index, indexRef, indexRound);
    setMember(temp);
  };
  const setFinalScore = (temp, index, indexRef, indexRound) => {
    let score = 0;
    temp[indexRound].member[index].referee?.map((value) => {
      score = parseFloat(score) + parseFloat(value.score);
    });
    temp[indexRound].member[index].score = score;
    temp.map((round) => {
      round.member.map((member) => {
        let final = 0;
        member;
      });
    });
  };
  const changeQualification = (index, value) => {
    let temp = [...dataCompetitor];
    if (nextStageId === true) {
      temp[index].qualification_type = 1;
      temp[index].qualified_to_stage_id = value.target.value;
      temp[index].color = "#f4e4bc";
      temp[index].text = "black";
    }
    if (value.target.value == qualification_type.HCV && nextStageId === false) {
      temp[index].qualification_type = value.target.value;
      temp[index].color = "#f4e4bc";
      temp[index].text = "black";
    }
    if (value.target.value == qualification_type.HCB && nextStageId === false) {
      temp[index].qualification_type = value.target.value;
      temp[index].color = "#f4e4bc";
      temp[index].text = "black";
    }
    if (value.target.value == qualification_type.HCD && nextStageId === false) {
      temp[index].qualification_type = value.target.value;
      temp[index].color = "#f4e4bc";
      temp[index].text = "black";
    }
    if (value.target.value == qualification_type.NONE) {
      temp[index].qualification_type = value.target.value;
      temp[index].qualified_to_stage_id = 0;
      temp[index].color = "";
      temp[index].text = "";
    }
    setArrayCompetitor(temp);
  };
  const sortUp = () => {
    let temp = [...member];
    temp.map((round, indexRound) => {
      round.member.sort(function (a, b) {
        return a.score - b.score;
      });
    });
    setMember(temp);
  };
  const sortDown = () => {
    let temp = [...member];
    temp.map((round, indexRound) => {
      round.member.sort(function (a, b) {
        return b.score - a.score;
      });
    });
    setMember(temp);
  };
  const sortUpFinal = () => {
    let temp = [...dataCompetitor];
    temp.sort(function (a, b) {
      return a.final_score - b.final_score;
    });
    setArrayCompetitor(temp);
  };
  const sortDownFinal = () => {
    let temp = [...dataCompetitor];
    temp.sort(function (a, b) {
      return b.final_score - a.final_score;
    });
    setArrayCompetitor(temp);
  };
  useEffect(() => {
    if (dataCompetitor.length > 0) {
      let tempCompetitor = [...dataCompetitor];
      let tempMember = [...member];
      tempCompetitor.map((competitor) => {
        let score = 0;
        tempMember.map((round) => {
          round.member.map((data_member) => {
            if (competitor.id == data_member.id) {
              score = score + parseFloat(data_member.score);
            }
          });
        });
        competitor.final_score = score;
      });
      setArrayCompetitor(tempCompetitor);
    }
  }, [member]);
  return (
    <Paper style={{ padding: 20 }}>
      {member?.map((round, indexRound) => {
        return (
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "1.5rem",
                color: "#919191",
                padding: 20,
              }}
            >
              {round.name}
            </p>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#4CAF50" }}>
                    <TableCell
                      rowSpan={2}
                      style={{
                        width: "30%",
                        fontSize: "1.3rem",
                        color: "#fff",
                      }}
                      align={"center"}
                    >
                      {t("score_1vsN_screen.name_competitor")}
                    </TableCell>
                    {referee?.length > 0 && (
                      <TableCell
                        colSpan={referee?.length}
                        style={{
                          width: "30%",
                          fontSize: "1.3rem",
                          color: "#fff",
                        }}
                        align={"center"}
                      >
                        {t("score_1vsN_screen.referee")}
                      </TableCell>
                    )}
                    <TableCell
                      rowSpan={2}
                      style={{ fontSize: "1.3rem", color: "#fff" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {t("score_1vsN_screen.final_record")}
                        </p>
                        <div>
                          <IconButton
                            size={"small"}
                            color={"#ffffff"}
                            onClick={() => sortUp()}
                          >
                            <ArrowUpwardIcon style={{ color: '#fff'}} />
                          </IconButton>
                          <IconButton
                            size={"small"}
                            color={"#ffffff"}
                            onClick={() => sortDown()}
                          >
                            <ArrowDownwardIcon style={{ color: '#fff'}} />
                          </IconButton>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "#4CAF50" }}>
                    {referee?.map((value, index) => {
                      return (
                        <TableCell
                          style={{
                            fontSize: "1.3rem",
                            color: "#fff",
                            minWidth: "300px",
                          }}
                          align={"center"}
                        >
                          {value?.referee?.given_name}{" "}
                          {value?.referee?.family_name}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {round?.member?.map((row, index) => (
                    <TableRow
                      key={row}
                      style={
                        index % 2 != 0
                          ? { backgroundColor: "#E8F5E9" }
                          : { backgroundColor: "" }
                      }
                    >
                      <TableCell
                        style={{
                          width: "30%",
                          borderRight: "#919191 solid 1px",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <img
                            src={
                              process.env.MIX_REACT_APP_STORAGE_URL +
                              "/" +
                              row?.team?.country?.flag_url
                            }
                            height={50}
                            width={80}
                          />
                          <p
                            style={{
                              margin: 0,
                              paddingLeft: 20,
                              display: "flex",
                              alignItems: "center",
                              fontSize: "1.3rem",
                              color: "",
                            }}
                          >
                            {row.name}
                          </p>
                        </div>
                      </TableCell>
                      {row?.referee?.map((ref, indexRef) => {
                        return (
                          <TableCell
                            align={"center"}
                            style={{
                              minWidth: "300px",
                              borderRight: "#919191 solid 1px",
                            }}
                          >
                            <TextField
                              type={"number"}
                              variant={"outlined"}
                              value={ref.score != 0 ? ref.score : ''}
                              inputProps={{
                                min: 0,
                                style: { color: "" },
                              }}
                              onChange={(e) =>
                                changeScoreReferee(
                                  index,
                                  indexRef,
                                  e.target.value,
                                  indexRound
                                )
                              }
                              fullWidth
                            />
                          </TableCell>
                        );
                      })}
                      <TableCell style={{ borderRight: "#919191 solid 1px" }}>
                        <div style={{ display: "flex" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "1.3rem",
                              color: "#FF9E30",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {row.score}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      })}
      <p
        style={{
          fontSize: "1.5rem",
          color: "#919191",
          paddingLeft: 20,
          marginTop: 20,
        }}
      >
        {t("record_1vsN_screen.final_record")}
      </p>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#4CAF50" }}>
              <TableCell
                style={{ fontSize: "1.3rem", color: "#fff" }}
                align={"center"}
                rowSpan={2}
              >
                {t("record_1vsN_screen.name_competitor")}
              </TableCell>
              <TableCell
                style={{ fontSize: "1.3rem", color: "#fff" }}
                align={"center"}
                rowSpan={2}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <p style={{ margin: 0, width: "100%" }}>
                    {t("record_1vsN_screen.final_record")}
                  </p>
                  <div>
                    <IconButton
                      size={"small"}
                      color={"#ffffff"}
                      onClick={() => sortUpFinal()}
                    >
                      <ArrowUpwardIcon style={{ color: '#fff'}} />
                    </IconButton>
                    <IconButton
                      size={"small"}
                      color={"#ffffff"}
                      onClick={() => sortDownFinal()}
                    >
                      <ArrowDownwardIcon style={{ color: '#fff'}} />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
              {qualification?.length > 0 && (
                <TableCell
                  style={{ fontSize: "1.3rem", color: "#fff" }}
                  align={"center"}
                  rowSpan={2}
                >
                  {t("qualification_type.qualification")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataCompetitor.map((row, index) => {
              return (
                <TableRow
                  key={row}
                  style={
                    index % 2 != 0
                      ? {
                          backgroundColor:
                            row.qualification_type == qualification_type.NONE
                              ? "#E8F5E9"
                              : row.color,
                          color: row.qualification_type == 0 ? "" : row.text,
                          width: "100%",
                        }
                      : {
                          width: "100%",
                          backgroundColor:
                            row.qualification_type == qualification_type.NONE
                              ? ""
                              : row.color,
                        }
                  }
                >
                  <TableCell
                    style={{
                      borderRight: "#919191 solid 1px",
                      color:
                        row.qualification_type == qualification_type.NONE
                          ? ""
                          : row.text,
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <img
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          row.team.country.flag_url
                        }
                        height={50}
                        width={80}
                      />
                      <p
                        style={{
                          margin: 0,
                          paddingLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "1.3rem",
                          color:
                            row.qualification_type == qualification_type.NONE
                              ? ""
                              : row.text,
                        }}
                      >
                        {row.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ borderRight: "#919191 solid 1px" }}
                  >
                    <p style={{ fontSize: "1.3rem" }}>{row.final_score}</p>
                  </TableCell>
                  {qualification?.length > 0 && (
                    <TableCell
                      style={{
                        borderRight: "#919191 solid 1px",
                        color:
                          row.qualification_type == qualification_type.NONE
                            ? ""
                            : row.text,
                      }}
                    >
                      <Select
                        fullWidth
                        variant={"outlined"}
                        value={
                          nextStageId == false
                            ? row.qualification_type
                            : row.qualified_to_stage_id
                        }
                        onChange={(e) => changeQualification(index, e)}
                      >
                        <MenuItem value={0}>
                          <span>{t("qualification_type.0")}</span>
                        </MenuItem>
                        {nextStageId === false &&
                          qualification.map((value) => {
                            return (
                              <MenuItem value={value.qualification_type}>
                                {value.qualification_type ==
                                  qualification_type.NONE && (
                                  <span>{t("qualification_type.0")}</span>
                                )}
                                {value.qualification_type ==
                                  qualification_type.HCV && (
                                  <span>{t("qualification_type.2")}</span>
                                )}
                                {value.qualification_type ==
                                  qualification_type.HCB && (
                                  <span>{t("qualification_type.3")}</span>
                                )}
                                {value.qualification_type ==
                                  qualification_type.HCD && (
                                  <span>{t("qualification_type.4")}</span>
                                )}
                              </MenuItem>
                            );
                          })}
                        {nextStageId === true &&
                          match?.stage?.next_stage.map((value) => {
                            return (
                              <MenuItem
                                value={value.pivot.qualified_to_stage_id}
                              >
                                {
                                  <span>
                                    {t("qualification_type.1")}{" "}
                                    <span
                                      style={{ textTransform: "lowercase" }}
                                    >
                                      {i18n.language == "vi"
                                        ? value?.name
                                        : value?.english_name}
                                    </span>
                                  </span>
                                }
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={3} style={{ padding: 20 }}>
        <Grid item xs={6}>
          <ButtonGroup variant={"contained"} onClick={formik.handleSubmit}>
            <Button color={"primary"}>{t("button.save")}</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}
