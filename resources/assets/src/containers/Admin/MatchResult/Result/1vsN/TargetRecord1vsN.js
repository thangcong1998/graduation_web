import React, { useEffect, useState } from "react";
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
  InputAdornment,
} from "@material-ui/core";
import { useAPI, useFetch } from "../../../../../api/api";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@material-ui/icons/Delete";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  qualification_type,
  measurement_unit,
} from "../../../../../common/constants";

export default function TargetRecord1vsN({ match, status }) {
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const params = useParams();
  const [newTarget, setNewTarget] = useState("");
  const [target, setTarget] = useState([]);
  const [turnTarget, setTurnTarget] = useState([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const [member, setMember] = useState([]);
  const formData = new FormData();
  const [unit, setUnit] = useState();
  const [winner, setWinner] = useState([]);
  const [participantCheck, setParticipantCheck] = useState(0);
  const search = {
    match_id_equal: params?.id,
    is_winner_like: 1,
  };
  const [qualification, setQualification] = useState([]);
  const [qualificationResult, setQualificationResult] = useState([]);
  const [nextStageId, setNextStageId] = useState();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      formData.append("match_id", params?.id ? params?.id : "");
      formData.append("status", status?.id ? status?.id : 1);
      let data = [];
      let dataMember = [...member];
      dataMember.sort(function (a, b) {
        return parseFloat(a.score) - parseFloat(b.score);
      });
      let max = 0;
      let win = [];
      let winner_member = [];
      target.map((value, index) => {
        let tempRound = {
          name: value,
          match_id: params?.id,
          status: 1,
          member: [],
        };
        member.map((competitor) => {
          let count = 0;
          let turn = 0;
          competitor.target.map((target) => {
            if (value == target.name) {
              target.score.map((score, indexScore) => {
                if (score.value == 1) {
                  count++;
                  turn = indexScore;
                }
              });
            }
          });
          if (count > 0) {
            let tempMember = {
              competitor_id: "",
              score: "",
              turn: "",
              participant_has: "",
              event_team_id: "",
              qualification_type: "",
            };
            tempMember.competitor_id = competitor.id;
            if (competitor.participant_has == 1) {
              tempMember.competitor_id = competitor.id;
              tempMember.participant_has = 1;
            } else {
              tempMember.event_team_id = competitor.id;
              tempMember.participant_has = 2;
            }
            tempMember.score = value;
            tempMember.turn = turn;
            tempMember.qualification_type = competitor.qualification_type;
            tempMember.qualified_to_stage_id = competitor.qualified_to_stage_id;
            tempMember.team_id = competitor.team.id;
            tempRound.member.push(tempMember);
          }
        });
        data.push(tempRound);
      });
      formData.append("match_id", params?.id ? params?.id : "");
      formData.append("event_id", match?.stage?.event_id);
      formData.append("unit", match?.stage?.unit);
      formData.append("stage_id", match?.stage?.id);
      formData.append("next_stage_id", nextStageId === true ? 1 : 2);
      formData.append("member", JSON.stringify(data));
      formData.append("result", JSON.stringify(dataMember));
      formData.append("winner", JSON.stringify(winner_member));
      formData.append("participant_check", participantCheck);
      formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          "admin/target_record_1_vs_n",
          formData
        );
        let updateMedalTable = await api.fetcher("get", "admin/medalRankings");
        if (res) {
        }
      } catch (e) {}
    },
  });

  useEffect(() => {
    if (match && firstLoading === true) {
      setQualification(match?.stage?.stage_qualification_settings);
      if (match?.stage?.next_stage?.length > 0) {
        setNextStageId(true);
      } else {
        setNextStageId(false);
      }
      setQualificationResult(match?.stage?.stage_qualification_competitors);
      let _unit = match?.stage.unit;
      switch (_unit) {
        case measurement_unit.HOUR:
          setUnit("h");
          break;
        case measurement_unit.MINUTE:
          setUnit("m");
          break;
        case measurement_unit.SECONDS:
          setUnit("s");
          break;
        case measurement_unit.KILOMETER:
          setUnit("km");
          break;
        case measurement_unit.METER:
          setUnit("m");
          break;
        case measurement_unit.CENTIMETER:
          setUnit("cm");
          break;
        case measurement_unit.KILOGRAM:
          setUnit("kg");
          break;
        default:
          setUnit("cm");
      }
      let _turn = match?.stage?.match_turn_num;
      let tempTurn = [];
      for (let i = 0; i < parseFloat(_turn); i++) {
        let tempTurnData = {
          value: 0,
          check: false,
        };
        tempTurn.push(tempTurnData);
      }
      setTurnTarget(tempTurn);
      let temp = [];
      if (match?.match_individual_competitors?.length > 0) {
        temp = match?.match_individual_competitors;
      } else {
        temp = match?.match_event_teams;
      }
      if (match.round?.length > 0) {
        let data = [];
        let tempTarget = [...target];
        temp.map((value) => {
          let tempRound = {
            name: "",
            score: 0,
            target: [],
            team: {},
            participant_has: 1,
            id: 0,
          };
          if (value?.competitor_id) {
            tempRound.team = value?.competitor?.team;
            tempRound.name =
              value?.competitor?.given_name +
              " " +
              value?.competitor?.family_name;
            tempRound.participant_has = 1;
            tempRound.id = value?.competitor?.id;
            let count_reward = 0;
            match?.stage?.stage_qualification_competitors.map((qualifi) => {
              if (qualifi.participant_id == value?.competitor?.id) {
                tempRound.qualification_type = qualifi.qualification_type;
                tempRound.qualified_to_stage_id = qualifi.qualified_to_stage_id;
                if (
                  qualifi.qualification_type == qualification_type.QUALIFIED
                ) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                if (qualifi.qualification_type == qualification_type.HCV) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                if (qualifi.qualification_type == qualification_type.HCB) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                if (qualifi.qualification_type == qualification_type.HCD) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                count_reward++;
              }
            });
            if (count_reward == 0) {
              tempRound.qualification_type = qualification_type.NONE;
              tempRound.qualified_to_stage_id = 0;
              tempRound.color = "";
              tempRound.text = "";
            }
            let count = 0;
            match?.stage?.stage_qualification_competitors.map((qualifi) => {
              if (qualifi.participant_id == value?.competitor?.id) {
                tempRound.qualification_type = qualifi.qualification_type;
                count++;
              }
            });
            if (count == 0) {
              tempRound.qualification_type = qualification_type.NONE;
            }
            setParticipantCheck(1);
          } else {
            tempRound.team = value?.event_team?.team;
            tempRound.name = value?.event_team?.name;
            tempRound.participant_has = 2;
            tempRound.id = value?.event_team?.id;
            let count_reward = 0;
            match?.stage?.stage_qualification_competitors.map((qualifi) => {
              if (qualifi.event_team_id == value?.event_team_id) {
                tempRound.qualification_type = qualifi.qualification_type;
                tempRound.qualified_to_stage_id = qualifi.qualified_to_stage_id;
                if (
                  qualifi.qualification_type == qualification_type.QUALIFIED
                ) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                if (qualifi.qualification_type == qualification_type.HCV) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                if (qualifi.qualification_type == qualification_type.HCB) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                if (qualifi.qualification_type == qualification_type.HCD) {
                  tempRound.color = "#f4e4bc";
                  tempRound.text = "black";
                }
                count_reward++;
              }
            });
            if (count_reward == 0) {
              tempRound.qualification_type = qualification_type.NONE;
              tempRound.qualified_to_stage_id = 0;
              tempRound.color = "";
              tempRound.text = "";
            }
            let count = 0;
            match?.stage?.stage_qualification_competitors.map((qualifi) => {
              if (qualifi.event_team_id == value?.event_team?.id) {
                tempRound.qualification_type = qualifi.qualification_type;
                count++;
              }
            });
            if (count == 0) {
              tempRound.qualification_type = qualification_type.NONE;
            }
            setParticipantCheck(2);
          }
          match.round.map((valueRound) => {
            let has_target = 0;
            if (!tempTarget.includes(parseFloat(valueRound.name))) {
              tempTarget.push(parseFloat(valueRound.name));
            }
            valueRound.result.map((valueResult) => {
              let turn = [];
              for (
                let i = 0;
                i < parseFloat(match?.stage?.match_turn_num);
                i++
              ) {
                if (
                  value.competitor_id == valueResult.competitor_id &&
                  i == valueResult.turn
                ) {
                  let tempTurnData = {
                    value: 1,
                    check: false,
                  };
                  turn.push(tempTurnData);
                } else {
                  if (
                    value.competitor_id == valueResult.competitor_id &&
                    i < valueResult.turn
                  ) {
                    let tempTurnData = {
                      value: 2,
                      check: false,
                    };
                    turn.push(tempTurnData);
                  } else {
                    let tempTurnData = {
                      value: 0,
                      check: false,
                    };
                    turn.push(tempTurnData);
                  }
                }
              }
              let tempTarget = {
                name: "",
                score: turn,
              };
              tempTarget.name = parseFloat(valueResult.score);
              if (value.competitor_id == valueResult.competitor_id) {
                tempRound.target.push(tempTarget);
                has_target++;
              }
            });
            if (has_target == 0) {
              let turn2 = [];
              for (
                let i = 0;
                i < parseFloat(match?.stage?.match_turn_num);
                i++
              ) {
                let tempTurnData = {
                  value: 0,
                  check: false,
                };
                turn2.push(tempTurnData);
              }
              let tempTarget = {
                name: "",
                score: turn2,
              };
              tempTarget.name = parseFloat(valueRound.name);
              tempRound.target.push(tempTarget);
            }
          });
          data.push(tempRound);
        });
        tempTarget.sort(function (a, b) {
          return a - b;
        });
        setTarget(tempTarget);
        data.map((value) => {
          value.target.sort(function (a, b) {
            return parseFloat(a.name) - parseFloat(b.name);
          });
        });
        setMember(data);
        setFirstLoading(false);
      } else {
        temp.map((value, index) => {
          value.target = [];
          value.score = 0;
          if (value?.competitor_id) {
            value.team = value?.competitor?.team;
            value.name =
              value?.competitor?.given_name +
              " " +
              value?.competitor?.family_name;
            value.participant_has = 1;
            value.id = value?.competitor?.id;
            value.qualification_type = 0;
            let count_reward = 0;
            match?.stage?.stage_qualification_competitors.map((qualifi) => {
              if (qualifi.participant_id == value?.competitor?.id) {
                value.qualification_type = qualifi.qualification_type;
                value.qualified_to_stage_id = qualifi.qualified_to_stage_id;
                if (
                  qualifi.qualification_type == qualification_type.QUALIFIED
                ) {
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
            setParticipantCheck(1);
          } else {
            value.team = value?.event_team?.team;
            value.name = value?.event_team?.name;
            value.participant_has = 2;
            value.id = value?.event_team?.id;
            value.qualification_type = 0;
            let count_reward = 0;
            match?.stage?.stage_qualification_competitors.map((qualifi) => {
              if (qualifi.participant_id == value?.competitor?.id) {
                value.qualification_type = qualifi.qualification_type;
                value.qualified_to_stage_id = qualifi.qualified_to_stage_id;
                if (
                  qualifi.qualification_type == qualification_type.QUALIFIED
                ) {
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
            setParticipantCheck(2);
          }
        });
        setMember(temp);
        setFirstLoading(false);
      }
      //
    }
  }, [match, firstLoading]);
  useEffect(() => {
    if (firstLoading == false) {
      let tempMember = [...member];
      let final_score = 0;
      let count = 0;
      tempMember.map((member) => {
        let _value = 0;
        member.target.map((target) => {
          target.score.map((score) => {
            if (score.value == 1) {
              count = count + 1;
              _value = parseFloat(target.name);
            }
          });
          if (count != 0) {
            final_score = _value;
          }
          member.score = final_score;
        });
      });
      setMember(tempMember);
    }
  }, [firstLoading]);
  const addTarget = () => {
    if (newTarget !== "" && target.includes(parseFloat(newTarget)) != true) {
      let turn = [];
      for (let i = 0; i < parseFloat(match?.stage?.match_turn_num); i++) {
        let tempTurnData = {
          value: 0,
          check: false,
        };
        turn.push(tempTurnData);
      }
      let temp = [...member];
      let tempTarget = [...target];
      tempTarget.push(parseFloat(newTarget));
      tempTarget.sort(function (a, b) {
        return parseFloat(a) - parseFloat(b);
      });
      setTarget(tempTarget);
      temp.map((value, index) => {
        let tempTarget = {
          name: parseFloat(newTarget),
          score: turn,
        };
        value.target.push(tempTarget);
        value.target.sort(function (a, b) {
          return parseFloat(a.name) - parseFloat(b.name);
        });
      });
      setMember(temp);
      setNewTarget("");
    }
  };
  const changeTarget = (indexTarget, score, indexMember, indexScore) => {
    let temp = [...member];
    temp[indexMember] = { ...member[indexMember] };
    temp[indexMember].target = [...member[indexMember].target];
    temp[indexMember].target[indexTarget] = {
      ...member[indexMember].target[indexTarget],
    };
    temp[indexMember].target[indexTarget].score = [
      ...member[indexMember].target[indexTarget].score,
    ];
    temp[indexMember].target[indexTarget].score[indexScore] = {
      ...member[indexMember].target[indexTarget].score[indexScore],
    };
    temp[indexMember].target[indexTarget].score[indexScore].value =
      score.target.value;
    changeFinalRecord(indexMember, temp);
    setMember(temp);
  };
  const deleteTarget = (index) => {
    let temp = [...member];
    temp.map((member, indexMember) => {
      member.target.splice(index, 1);
    });
    temp.map((member, indexMember) => {
      let final_score = 0;
      let count = 0;
      let _value = 0;
      member.target.map((target, indexTarget) => {
        target.score.map((score) => {
          if (score.value == 1) {
            count = count + 1;
            _value = parseFloat(target.name);
          }
        });
      });
      if (count != 0) {
        final_score = _value;
      }
      member.score = final_score;
    });
    setMember(temp);
    let tempTarget = [...target];
    tempTarget.splice(index, 1);
    setTarget(tempTarget);
  };
  const changeFinalRecord = (index, tempMember) => {
    let final_score = 0;
    let count = 0;
    let _value = 0;
    tempMember[index].target.map((value) => {
      value.score.map((score) => {
        if (score.value == 1) {
          count = count + 1;
          _value = parseFloat(value.name);
        }
      });
    });
    if (count != 0) {
      final_score = _value;
    }
    tempMember[index].score = final_score;
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
    <Paper style={{ margin: 10 }}>
      <div style={{ display: "flex", padding: "10px 0px" }}>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{unit}</InputAdornment>
            ),
          }}
          type={"number"}
          label={t("target_record_1vsN_screen.new_target")}
          variant={"outlined"}
          size={"small"}
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          style={{ margin: "0px 10px" }}
        />
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => addTarget()}
          style={{ margin: "0px 10px" }}
        >
          {t("target_record_1vsN_screen.add_target")}
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#4CAF50" }}>
              <TableCell
                style={{ width: "30%", fontSize: "1.3rem", color: "#fff" }}
                align={"center"}
              >
                {t("target_record_1vsN_screen.name_competitor")}
              </TableCell>
              {target.map((value, index) => {
                return (
                  <TableCell
                    style={{
                      fontSize: "1.3rem",
                      color: "#fff",
                      minWidth: "300px",
                    }}
                    align={"center"}
                  >
                    {value} {unit}
                    <IconButton
                      size={"small"}
                      onClick={() => deleteTarget(index)}
                      color={"secondary"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                );
              })}
              <TableCell style={{ fontSize: "1.3rem", color: "#fff" }}>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <p style={{ margin: 0, width: "100%" }}>
                    {t("target_record_1vsN_screen.final_record")}
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
                  style={{ fontSize: "1.3rem", color: "#fff" }}
                  align={"center"}
                >
                  {t("qualification_type.qualification")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {member.map((row, index) => {
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
                        }
                      : {
                          backgroundColor:
                            row.qualification_type == qualification_type.NONE
                              ? ""
                              : row.color,
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
                          row.team?.country.flag_url
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
                  {row.target?.length != 0 &&
                    row.target.map((tar, indexTar) => {
                      return (
                        <TableCell
                          align={"center"}
                          style={{ minWidth: "300px", display: "table-cell" }}
                        >
                          <div style={{ display: "flex" }}>
                            {tar.score.map((score, indexScore) => {
                              return (
                                <select
                                  IconComponent={() => (
                                    <div
                                      style={{ margin: 0, padding: 0 }}
                                    ></div>
                                  )}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={score.value}
                                  onChange={(e) =>
                                    changeTarget(indexTar, e, index, indexScore)
                                  }
                                  style={{
                                    margin: "0px 5px",
                                    color:
                                      row.qualification_type ==
                                      qualification_type.NONE
                                        ? ""
                                        : row.text,
                                      width: "40px",
                                      appearance: 'none',
                                      border: '0px',
                                      borderBottom: '#f3f3f3 solid 1px',
                                      height: '40px',
                                      fontSize: '1.3rem',
                                      textAlignLast: 'center',
                                      backgroundColor: '#ffffff00',
                                      msTextAlignLast: 'center',
                                      mozTextAlignLast: 'center',
                                      padding: 10
                                  }}
                                >
                                  <option value={0}>--</option>
                                  <option value={1}>O</option>
                                  <option value={2}>X</option>
                                </select>
                              );
                            })}
                          </div>
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
                    <TableCell
                      style={{
                        borderRight: "#919191 solid 1px",
                        minWidth: 200,
                      }}
                    >
                      <Select
                        IconComponent={() => <div></div>}
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
            <Button color={"primary"}>Lưu kết quả</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}
