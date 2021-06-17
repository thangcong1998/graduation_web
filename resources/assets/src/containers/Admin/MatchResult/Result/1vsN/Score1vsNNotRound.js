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
    measurement_unit, match_scoring_method,
} from "../../../../../common/constants";

export default function Score1vsNNotRound({ match, status }) {
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const params = useParams();
  const [member, setMember] = useState([]);
  const [referee, setReferee] = useState([]);
  const [winner, setWinner] = useState([]);
  const [participantCheck, setParticipantCheck] = useState(0);
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
      let data = [];
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
        temp.map((value) => {
          value.target = [];
          value.score = value.final_score;
          value.team = value?.competitor?.team;
          value.name =
            value?.competitor?.given_name +
            " " +
            value?.competitor?.family_name;
          value.participant_has = 1;
          value.match_round_result = value.id;
          value.id = value?.competitor?.id;
          let count_reward = 0;
          match?.stage?.stage_qualification_competitors.map((qualifi) => {
            if (qualifi.participant_id == value?.competitor?.id) {
              value.qualification_type = qualifi.qualification_type;
              value.qualified_to_stage_id = qualifi.qualified_to_stage_id;
              if (qualifi.qualification_type == qualification_type.QUALIFIED) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCV) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCB) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCD) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              count_reward++;
            }
          });
          if (count_reward == 0) {
            value.qualification_type = qualification_type.NONE;
            value.qualified_to_stage_id = 0;
            value.color = "";
            value.text = "";
          }
          let array_referee = [];
          if (value.result?.length > 0) {
            referee.map((referee_data) => {
              let temp_referee = {
                match_referee_id: referee_data.match_referee_id,
                referee: referee_data.referee,
                score: 0,
              };
              value.result.map((result) => {
                let count = 0;
                let has_result = 0;
                result.match_round_result_referee_relation.map(
                  (referee_relation) => {
                    if (
                      referee_data.match_referee_id ==
                      referee_relation.match_referee_id
                    ) {
                      count = referee_relation.score;
                      has_result++;
                    }
                  }
                );
                if (has_result > 0) {
                  temp_referee.score = count;
                }
                array_referee.push(temp_referee);
              });
            });
          } else {
            referee.map((referee_data) => {
              let temp_referee = {
                match_referee_id: 0,
                referee: {},
                score: 0,
              };
              temp_referee.score = 0;
              temp_referee.match_referee_id = referee_data.match_referee_id;
              temp_referee.referee = referee_data.referee;
              array_referee.push(temp_referee);
            });
          }
          value.referee = array_referee;
          setParticipantCheck(1);
        });
        setMember(temp);
      } else {
        let temp = match?.match_event_teams;
        temp.map((value) => {
          value.target = [];
          value.score = value?.final_score || 0;
          value.team = value?.event_team?.team;
          value.name = value?.event_team.name;
          value.participant_has = 2;
          value.match_round_result = value?.id;
          value.id = value?.event_team?.id;
          let count_reward = 0;
          match?.stage?.stage_qualification_competitors.map((qualifi) => {
            if (qualifi.event_team_id == value?.event_team_id) {
              value.qualification_type = qualifi.qualification_type;
              value.qualified_to_stage_id = qualifi.qualified_to_stage_id;
              if (qualifi.qualification_type == qualification_type.QUALIFIED) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCV) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCB) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCD) {
                value.color = "#f4e4bc";
                value.text = "black";
              }
              count_reward++;
            }
          });
          if (count_reward == 0) {
            value.qualification_type = qualification_type.NONE;
            value.qualified_to_stage_id = 0;
            value.color = "";
            value.text = "";
          }
          let array_referee = [];
          if (value.result?.length > 0) {
            referee.map((referee_data) => {
              let temp_referee = {
                match_referee_id: referee_data.match_referee_id,
                referee: referee_data.referee,
                score: 0,
              };
              value.result.map((result) => {
                let count = 0;
                let has_result = 0;
                result.match_round_result_referee_relation.map(
                  (referee_relation) => {
                    if (
                      referee_data.match_referee_id ==
                      referee_relation.match_referee_id
                    ) {
                      count = referee_relation.score;
                      has_result++;
                    }
                  }
                );
                if (has_result > 0) {
                  temp_referee.score = count;
                }
                array_referee.push(temp_referee);
              });
            });
          } else {
            referee.map((referee_data) => {
              let temp_referee = {
                match_referee_id: 0,
                referee: {},
                score: 0,
              };
              temp_referee.score = 0;
              temp_referee.match_referee_id = referee_data.match_referee_id;
              temp_referee.referee = referee_data.referee;
              array_referee.push(temp_referee);
            });
          }
          value.referee = array_referee;
          setParticipantCheck(2);
        });
        setMember(temp);
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
      let data = [...member];
      formData.append("member", JSON.stringify(data));
      formData.append("winner", JSON.stringify(winner_member));
      formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          "admin/score_1_vs_n_no_round",
          formData
        );
        let updateMedalTable = await api.fetcher("get", "admin/medalRankings");
        if (res) {
        }
      } catch (e) {}
    },
  });
  const changeScoreReferee = (index, indexRef, value) => {
      if(!value) {
          value = 0;
      } else {
          value = value.replace(/^0+/, '');
      }
    let temp = [...member];
    temp[index] = { ...member[index] };
    temp[index].referee = [...member[index].referee];
    temp[index].referee[indexRef] = { ...member[index].referee[indexRef] };
    temp[index].referee[indexRef].score = parseFloat(value);
    setFinalScore(temp, index, indexRef);
    setMember(temp);
  };
  const setFinalScore = (temp, index, indexRef) => {
    let score = 0;
    let count = 0;
    let min = 10000;
    let max = 0;
    temp[index].referee.map((value) => {
        if(min > value.score) {
            min = value.score;
        }
        if(max < value.score) {
            max = value.score;
        }
      score = parseFloat(score) + parseFloat(value.score);
      count++;
    });
    if(match?.stage?.match_scoring_method == 5 && count != 0) {
        score = parseFloat(score)/count;
        score = parseFloat(score).toFixed(2);
    }
    if(match?.stage?.match_scoring_method == match_scoring_method.AVERAGE_BETWEEN && count > 2) {
        score = (parseFloat(score) - parseFloat(min) - parseFloat(max)) / (parseFloat(count) - 2);
        score = parseFloat(score).toFixed(2);
    }
    temp[index].score = score;
  };
  const changeQualification = (index, value) => {
    let temp = [...member];
    temp[index] = { ...member[index] };
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
    setMember(temp);
  };
  const sortUp = () => {
    let temp = [...member];
    temp.sort(function (a, b) {
      return a.score - b.score;
    });
    setMember(temp);
  };
  const sortDown = () => {
    let temp = [...member];
    temp.sort(function (a, b) {
      return b.score - a.score;
    });
    setMember(temp);
  };
  return (
    <Paper style={{ padding: 20 }}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#4CAF50" }}>
              <TableCell
                rowSpan={2}
                style={{ width: "30%", fontSize: "1.3rem", color: "#fff" }}
                align={"center"}
              >
                {t("score_1vsN_screen.name_competitor")}
              </TableCell>
              {referee?.length > 0 && (
                <TableCell
                  colSpan={referee?.length}
                  style={{ fontSize: "1.3rem", color: "#fff" }}
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
                  <p style={{ margin: 0, width: "100%" }}>
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
              {qualification?.length > 0 && (
                <TableCell
                  rowSpan={2}
                  style={{ fontSize: "1.3rem", color: "#fff" }}
                  align={"center"}
                >
                  {t("qualification_type.qualification")}
                </TableCell>
              )}
            </TableRow>
            <TableRow style={{ backgroundColor: "#4CAF50" }}>
              {referee.map((value, index) => {
                return (
                  <TableCell
                    style={{
                      fontSize: "1.3rem",
                      color: "#fff",
                      minWidth: "300px",
                    }}
                    align={"center"}
                  >
                    {value?.referee?.given_name} {value?.referee?.family_name}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {member.map((row, index) => (
              <TableRow
                key={row}
                style={
                  index % 2 != 0
                    ? {
                        backgroundColor:
                          row.qualification_type == qualification_type.NONE
                            ? "#E8F5E9"
                            : row.color,
                      }
                    : {
                        backgroundColor:
                          row.qualification_type == 0 ? "" : row.color,
                      }
                }
              >
                <TableCell
                  style={{ width: "30%", borderRight: "#919191 solid 1px" }}
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
                {row.referee.map((ref, indexRef) => {
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
                        value={ref.score ? ref.score : ''}
                        inputProps={{
                          min: 0,
                          style: {
                            color:
                              row.qualification_type == qualification_type.NONE
                                ? ""
                                : row.text,
                          },
                        }}
                        onChange={(e) =>
                          changeScoreReferee(index, indexRef, e.target.value)
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
                        color:
                          row.qualification_type == qualification_type.NONE
                            ? "#FF9E30"
                            : row.text,
                      }}
                    >
                      {row.score}
                    </p>
                  </div>
                </TableCell>
                {qualification?.length > 0 && (
                  <TableCell style={{ borderRight: "#919191 solid 1px" }}>
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
                            <MenuItem value={value.pivot.qualified_to_stage_id}>
                              {
                                <span>
                                  {t("qualification_type.1")}{" "}
                                  <span style={{ textTransform: "lowercase" }}>
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
            ))}
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
