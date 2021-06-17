import React, { useEffect, useState } from "react";
import { useAPI, useFetch } from "../../../../../api/api";
import {
  Paper,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TableContainer,
  Table,
  TextField,
  IconButton,
  makeStyles,
  Grid,
  ButtonGroup,
  Button,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { createStyles } from "@material-ui/core/styles";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  qualification_type,
  measurement_unit,
  match_scoring_method,
} from "../../../../../common/constants";
import InputMask from "react-input-mask";

export default function Record1vsN({ match, status }) {
  const classes = useStyles();
  const [winner, setWinner] = useState([]);
  const params = useParams();
  const [participantCheck, setParticipantCheck] = useState(0);
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const [dataInfo, setDataInfo] = useState([]);
  const [dataCompetitor, setArrayCompetitor] = useState([]);
  const { data: foul } = useFetch([
    "get",
    "/admin/foul?event_id_equal=" + match?.stage?.event?.id,
  ]);
  const [firstCheck, setFirstCheck] = useState(true);
  const [member, setMember] = useState([]);
  const search = {
    match_id_equal: params?.id,
    is_winner_like: 1,
  };
  const [qualification, setQualification] = useState([]);
  const [unit, setUnit] = useState();
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
    if (match && firstCheck == true && foul) {
      Test();
      setQualification(match?.stage?.stage_qualification_settings);
      if (match?.stage?.next_stage?.length > 0) {
        setNextStageId(true);
      } else {
        setNextStageId(false);
      }
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
        case measurement_unit.POINT:
          setUnit("pts");
          break;
        case measurement_unit.TIME:
          setUnit("ti");
          break;
        case measurement_unit.POINT:
          setUnit("pts");
          break;
        default:
          setUnit("cm");
      }
      let data = [];
      let tempMember = [];
      let tempFoul = [];
      let tempDataInfo = [...dataInfo];
      match?.round.map((round, indexRound) => {
        let temp_round = {
          id: "",
          competitor: [],
        };
        temp_round.id = round?.event_round?.id;
        round.result.map((result, indexResult) => {
          let temp_foul = {
            id: "",
            foul: [],
            score: "",
          };
          temp_foul.score = parseFloat(result.score);
          if(result.competitor_id) {
              temp_foul.id = result.competitor_id;
          } else {
              temp_foul.id = result.event_team_id;
          }
          result.match_round_result_referee_relation.map((foul, indexFoul) => {
            let temp_result_referee = {
              count: "",
              score: "",
              id: "",
              foul_type: "",
            };
            temp_result_referee.id = foul.foul_id;
            temp_result_referee.foul_type = foul.foul.foul_type;
            if (foul.foul.penalty > 0) {
              temp_result_referee.count =
                parseFloat(foul.score) / parseFloat(foul.foul.penalty);
              temp_result_referee.score = parseFloat(foul.foul.penalty);
            } else {
              temp_result_referee.count = 0;
              temp_result_referee.score = 0;
            }
            temp_foul.foul.push(temp_result_referee);
          });
          temp_round.competitor.push(temp_foul);
        });
        tempDataInfo.push(temp_round);
      });
      setDataInfo(tempDataInfo);
      match?.stage?.event_rounds.map((value) => {
        let _round = {
          name: "",
          id: "",
        };
        _round.name = value.name;
        _round.id = value.id;
        data.push(_round);
      });
      if (match?.match_individual_competitors?.length > 0) {
        match?.match_individual_competitors.map((value) => {
          let _member = {
            team: "",
            name: "",
            disable: false,
            final_score: 0,
          };
          setParticipantCheck(1);
          _member.team = value?.competitor?.team;
          _member.name =
            value?.competitor?.given_name +
            " " +
            value?.competitor?.family_name;
          _member.participant_has = 1;
          _member.id = value?.competitor?.id;
          _member.final_score = value.final_score;
          let count = 0;
          match?.stage?.stage_qualification_competitors.map((qualifi) => {
            if (qualifi.participant_id == value?.competitor?.id) {
              _member.qualification_type = qualifi.qualification_type;
              _member.qualified_to_stage_id = qualifi.qualified_to_stage_id;
              if (qualifi.qualification_type == qualification_type.QUALIFIED) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCV) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCB) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCD) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              count++;
            }
          });
          if (count == 0) {
            _member.qualification_type = qualification_type.NONE;
            _member.qualified_to_stage_id = 0;
            _member.color = "";
            _member.text = "";
          }
          tempMember.push(_member);
        });
      } else {
        match?.match_event_teams.map((value) => {
          let _member = {
            team: "",
            name: "",
            disable: false,
            final_score: 0,
          };
          setParticipantCheck(2);
          _member.team = value?.event_team?.team;
          _member.name = value?.event_team?.name;
          _member.participant_has = 2;
          _member.id = value?.event_team_id;
          _member.final_score = value.final_score;
          let count = 0;
          match?.stage?.stage_qualification_competitors.map((qualifi) => {
            if (qualifi.event_team_id == value?.event_team_id) {
              _member.qualification_type = qualifi.qualification_type;
              _member.qualified_to_stage_id = qualifi.qualified_to_stage_id;
              if (qualifi.qualification_type == qualification_type.QUALIFIED) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCV) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCB) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              if (qualifi.qualification_type == qualification_type.HCD) {
                _member.color = "#f4e4bc";
                _member.text = "black";
              }
              count++;
            }
          });
          if (count == 0) {
            _member.qualification_type = qualification_type.NONE;
            _member.qualified_to_stage_id = 0;
            _member.color = "";
            _member.text = "";
          }
          tempMember.push(_member);
        });
      }
      setArrayCompetitor(tempMember);
      data.map((value) => {
        value.member = tempMember;
      });
      setMember(data);
      setFirstCheck(false);
    }
  }, [match, foul]);
  useEffect(() => {
    if (foul?.data && firstCheck == false) {
      if (match?.round?.length !== 0) {
        let temp = [...member];
        let temp_data_competitor = [];
        let temp_member = [];
        temp.forEach((value, index, array) => {
          let temp_round = {
            name: "",
            id: "",
            member: [],
          };
          temp_round.id = value.id;
          temp_round.name = value.name;
          value.member.forEach((members, indexMember) => {
            let temp_competitor = {
              ...members,
              foul: [],
              score: "",
              finalScore: "",
            };
            dataInfo.forEach((fouls) => {
              fouls.competitor.forEach((competitor) => {
                if (members.id == competitor.id && value.id === fouls.id) {
                  temp_competitor.foul = competitor.foul;
                  temp_competitor.score = parseFloat(competitor.score);
                  let result = 0;
                  competitor.foul.map((score) => {
                    result =
                      result +
                      parseFloat(score.count) * parseFloat(score.score);
                  });
                  temp_competitor.finalScore =
                    parseFloat(competitor.score) - result;
                }
              });
            });
            temp_round.member.push(temp_competitor);
          });
          temp_member.push(temp_round);
        });
        setMember(temp_member);
      } else {
        let tempFoul = foul.data;
        tempFoul.map((value) => {
          value.count = 0;
          value.check = false;
          if(value.penalty === null) {
              value.score = 0;
          } else {
              value.score = value.penalty;
          }
        });
        let temp = [...member];
        temp.map((value) => {
          value.member.map((member) => {
            member.foul = tempFoul;
            member.score = 0;
            member.finalScore = 0;
          });
        });
        setMember(temp);
      }
    }
  }, [foul, match, firstCheck, dataInfo]);
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
      formData.append("stage_id", match?.stage?.id);
      formData.append(
        "next_stage_id",
        match?.stage?.next_stage?.length > 0 ? 1 : 2
      );
      formData.append("status", status?.id ? status?.id : 1);
      let data = [...member];
      formData.append("member", JSON.stringify(data));
      formData.append("participant_check", participantCheck);
      formData.append("winner", JSON.stringify(winner_member));
      formData.append("competitor", JSON.stringify(dataCompetitor));
      formData.append("_method", "POST");
      try {
        let res = await api.fetcher("post", "admin/record_1_vs_n", formData);
        let updateMedalTable = await api.fetcher("get", "admin/medalRankings");
        if (res) {
        }
      } catch (e) {}
    },
  });
  const addError = (index, indexFoul, indexRound) => {
    let temp = [...member];
    inheritance(temp, indexRound, index);
    temp[indexRound].member[index].foul[indexFoul] = {
      ...member[indexRound].member[index].foul[indexFoul],
    };
    temp[indexRound].member[index].foul[indexFoul].count =
      temp[indexRound].member[index].foul[indexFoul].count + 1;
    let finalScore = member[indexRound].member[index].score;
    temp[indexRound].member[index].foul.map((value, index) => {
      finalScore =
        parseFloat(finalScore) -
        parseFloat(value.count) * parseFloat(value.score);
    });
    temp[indexRound].member[index].finalScore = finalScore;
    setMember(temp);
  };
  const removeError = (index, indexFoul, indexRound) => {
    let temp = [...member];
    inheritance(temp, indexRound, index);
    temp[indexRound].member[index].foul[indexFoul] = {
      ...member[indexRound].member[index].foul[indexFoul],
    };
    if (temp[indexRound].member[index].foul[indexFoul].count != 0) {
      temp[indexRound].member[index].foul[indexFoul].count =
        temp[indexRound].member[index].foul[indexFoul].count - 1;
    }
    let finalScore = member[indexRound].member[index].score;
    temp[indexRound].member[index].foul.map((value, index) => {
      finalScore =
        parseFloat(finalScore) -
        parseFloat(value.count) * parseFloat(value.score);
    });
    temp[indexRound].member[index].finalScore = finalScore;
    setMember(temp);
  };
  const changeErrorValue = (index, indexFoul, value, indexRound) => {
    let temp = [...member];
    inheritance(temp, indexRound, index);
    temp[indexRound].member[index].foul[indexFoul] = {
      ...member[indexRound].member[index].foul[indexFoul],
    };
    temp[indexRound].member[index].foul[indexFoul].count = parseFloat(value);
    let finalScore = member[indexRound].member[index].score;
    temp[indexRound].member[index].foul.map((value, index) => {
      finalScore =
        parseFloat(finalScore) -
        parseFloat(value.count) * parseFloat(value.score);
    });
    temp[indexRound].member[index].finalScore = finalScore;
    setMember(temp);
  };
  const changeRecord = (index, value, indexRound) => {
    let temp = [...member];
    inheritance(temp, indexRound, index);
    let finalScore = value;
    temp[indexRound].member[index].foul.map((value, index) => {
      finalScore =
        parseFloat(finalScore) -
        parseFloat(value.count) * parseFloat(value.score);
    });
    temp[indexRound].member[index].finalScore = finalScore;
    temp[indexRound].member[index].score = value;
    setMember(temp);
  };
  const cancelRecord = (indexRound, index, indexFoul) => {
    let temp = [...member];
    inheritance(temp, indexRound, index);
    temp[indexRound].member[index].foul[indexFoul] = {
      ...member[indexRound].member[index].foul[indexFoul],
    };
    temp[indexRound].member[index].foul[indexFoul].count =
      temp[indexRound].member[index].foul[indexFoul].count + 1;
    temp[indexRound].member[index].finalScore = -1;
    temp[indexRound].member[index].score = 0;
    temp[indexRound].member[index].disable = true;
    setMember(temp);
  };
  const ReverseCancel = (indexRound, index, indexFoul) => {
    let temp = [...member];
    inheritance(temp, indexRound, index);
    temp[indexRound].member[index].foul[indexFoul] = {
      ...member[indexRound].member[index].foul[indexFoul],
    };
    temp[indexRound].member[index].foul[indexFoul].count =
      temp[indexRound].member[index].foul[indexFoul].count - 1;
    let finalScore = temp[indexRound].member[index].score;
    temp[indexRound].member[index].foul.map((value, index) => {
      finalScore =
        parseFloat(finalScore) -
        parseFloat(value.count) * parseFloat(value.score);
    });
    temp[indexRound].member[index].finalScore = finalScore;
    temp[indexRound].member[index].disable = false;
    setMember(temp);
  };
  const inheritance = (temp, indexRound, index) => {
    temp[indexRound] = { ...member[indexRound] };
    temp[indexRound].member = [...member[indexRound].member];
    temp[indexRound].member[index] = { ...member[indexRound].member[index] };
    temp[indexRound].member[index].foul = [
      ...member[indexRound].member[index].foul,
    ];
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
  useEffect(() => {
    let tempCompetitor = [...dataCompetitor];
    let tempMember = [...member];
    tempCompetitor.map((competitor) => {
      let score = 0;
      tempMember.map((round) => {
        round.member.map((data_member) => {
          if (competitor.id == data_member.id) {
              if(match?.stage?.match_scoring_method == match_scoring_method.BEST_RECORD) {
                  if(score < data_member.finalScore) {
                      score = parseFloat(data_member.finalScore);
                  }
              } else {
                  score = score + parseFloat(data_member.finalScore);
              }
          }
        });
      });
      competitor.final_score = score;
    });
    setArrayCompetitor(tempCompetitor);
  }, [member]);
  const sortUp = () => {
    let temp = [...member];
    temp.map((round, indexRound) => {
      round.member.sort(function (a, b) {
        return a.finalScore - b.finalScore;
      });
    });
    setMember(temp);
  };
  const sortDown = () => {
    let temp = [...member];
    temp.map((round, indexRound) => {
      round.member.sort(function (a, b) {
        return b.finalScore - a.finalScore;
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
  return (
    <Paper style={{ margin: 10 }}>
      {member.map((round, indexRound) => {
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
                      {t("record_1vsN_screen.record")} {"("}
                      {unit}
                      {")"}
                    </TableCell>
                    {foul?.data?.length > 0 && (
                      <TableCell
                        style={{ fontSize: "1.3rem", color: "#fff" }}
                        align={"center"}
                        colSpan={foul?.data?.length}
                      >
                        {t("record_1vsN_screen.foul")}
                      </TableCell>
                    )}
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
                  {foul?.data?.length > 0 && (
                    <TableRow style={{ backgroundColor: "#4CAF50" }}>
                      {foul?.data.map((value) => {
                        return (
                          <TableCell
                            style={{ fontSize: "1.3rem", color: "#fff" }}
                            align={"center"}
                          >
                            <p
                              style={{
                                textOverflow: "ellipsis",
                                width: 100,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                margin: 0,
                              }}
                            >
                              {i18n.language == "vi"
                                ? value.name
                                : value.english_name}
                            </p>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
                </TableHead>
                <TableBody>
                  {round.member.map((row, index) => (
                    <TableRow
                      key={row}
                      style={
                        index % 2 != 0
                          ? {
                              backgroundColor: "#E8F5E9",
                              color:
                                row.qualification_type == 0 ? "" : row.text,
                              width: "100%",
                            }
                          : {
                              width: "100%",
                              backgroundColor: "",
                            }
                      }
                    >
                      <TableCell
                        style={{ borderRight: "#919191 solid 1px", color: "" }}
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
                              color: "",
                            }}
                          >
                            {row.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          borderRight: "#919191 solid 1px",
                          minWidth: "150px",
                          color: "",
                        }}
                      >
                          {unit == "ti" ? (
                              <InputMask
                                  mask="999:99:99.999"
                                  value={row.score || ""}
                                  onChange={(e) => changeRecord(index, e.target.value, indexRound)}
                                  disabled={false}
                                  maskChar="_"
                              >
                                  {() => <TextField variant={"outlined"} fullWidth label={t("record_1vsN_screen.record")} size={"small"} />}
                              </InputMask>
                          ) : (
                              <TextField
                          disabled={row.disable}
                          inputProps={{
                            min: 0,
                            style: { color: "" },
                          }}
                          style={{ color: "" }}
                          fullWidth
                          type={"number"}
                          size={"small"}
                          label={t("record_1vsN_screen.record")}
                          variant={"outlined"}
                          value={row.score || ""}
                          onChange={(e) =>
                            changeRecord(index, e.target.value, indexRound)
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end" color={""}>
                                {unit}
                              </InputAdornment>
                            ),
                          }}
                        />)}
                      </TableCell>

                      {row.foul?.map((value, indexFoul) => {
                        return value.foul_type != 1 ? (
                          <TableCell
                            style={{
                              borderRight: "#919191 solid 1px",
                              width: "100px",
                              color: "",
                            }}
                          >
                            <div
                              style={{
                                width: 100,
                                minHeight: 30,
                                display: "flex",
                                boxShadow: "0px 0px 5px 0px",
                                borderRadius: "20px",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ width: "20%" }}>
                                <IconButton
                                  size={"small"}
                                  onClick={() =>
                                    removeError(index, indexFoul, indexRound)
                                  }
                                  disabled={row.disable}
                                >
                                  <RemoveIcon />
                                </IconButton>
                              </div>
                              <div
                                style={{
                                  width: "60%",
                                  textAlign: "center",
                                  fontSize: "1.3rem",
                                }}
                              >
                                <TextField
                                  style={{ color: "" }}
                                  disabled={row.disable}
                                  value={value.count}
                                  inputProps={{
                                    min: 0,
                                    style: { textAlign: "center", color: "" },
                                  }}
                                  onChange={(e) =>
                                    changeErrorValue(
                                      index,
                                      indexFoul,
                                      e.target.value,
                                      indexRound
                                    )
                                  }
                                  type={"number"}
                                  size={"small"}
                                  margin={"dense"}
                                />
                              </div>
                              <div style={{ width: "20%" }}>
                                <IconButton
                                  disabled={row.disable}
                                  style={{ float: "right" }}
                                  size={"small"}
                                  onClick={() =>
                                    addError(index, indexFoul, indexRound)
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                              </div>
                            </div>
                          </TableCell>
                        ) : (
                          <TableCell
                            style={{
                              borderRight: "#919191 solid 1px",
                              width: "100px",
                              color: "",
                            }}
                          >
                            {row.disable == true && (
                              <div
                                className={classes.reverseRecord}
                                onClick={() =>
                                  ReverseCancel(indexRound, index, indexFoul)
                                }
                              >
                                <p
                                  style={{
                                    textAlign: "center",
                                    width: "100%",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {t("record_1vsN_screen.reverse")}
                                </p>
                              </div>
                            )}
                            {row.disable == true && value.count == 0 && (
                              <div className={classes.cancelRecord}>
                                <p
                                  style={{
                                    textAlign: "center",
                                    width: "100%",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {t("record_1vsN_screen.cancel_record")}
                                </p>
                              </div>
                            )}
                            {row.disable == false && (
                              <div
                                className={classes.cancelRecord}
                                onClick={() =>
                                  cancelRecord(indexRound, index, indexFoul)
                                }
                              >
                                <p
                                  style={{
                                    textAlign: "center",
                                    width: "100%",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {t("record_1vsN_screen.cancel_record")}
                                </p>
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        style={{
                          minWidth: "150px",
                          borderRight: "#919191 solid 1px",
                          color: "",
                        }}
                        align={"center"}
                      >
                        {row.disable == false ? (
                          <p
                            style={{
                              margin: 0,
                              color: "#FF9E30",
                              fontSize: "1.3rem",
                            }}
                          >
                            {row.finalScore} {unit}
                          </p>
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              color: "#FF0000",
                              fontSize: "1.3rem",
                            }}
                          >
                            {row.finalScore}
                          </p>
                        )}
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
          <ButtonGroup variant={"contained"}>
            <Button color={"primary"} onClick={formik.handleSubmit}>
              {t("button.save")}
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}
const useStyles = makeStyles(() =>
  createStyles({
    errorMessage: {
      padding: 5,
      border: "#f3f3f3 solid 1px",
      borderRadius: "15px",
      display: "flex",
      backgroundColor: "#4caf50",
      color: "#fff",
      cursor: "pointer",
      marginRight: 10,
    },
    deleteMessage: {
      padding: 5,
      minWidth: "80px",
      border: "#f3f3f3 solid 1px",
      borderRadius: "15px",
      display: "flex",
      color: "#fff",
      cursor: "pointer",
      backgroundColor: "#FF9E30",
      textAlign: "center",
      marginRight: 10,
    },
    addButtonError: {
      textAlign: "center",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#000",
      "&:hover": {
        backgroundColor: "#999999",
        color: "#fff",
      },
    },
    removeButtonError: {
      textAlign: "center",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#000",
      "&:hover": {
        backgroundColor: "#999999",
        color: "#fff",
      },
    },
    cancelRecord: {
      width: 100,
      minHeight: 30,
      display: "flex",
      borderRadius: "20px",
      alignItems: "center",
      backgroundColor: "#B2B2B2",
      color: "#fff",
      cursor: "pointer",
    },
    reverseRecord: {
      width: 100,
      minHeight: 30,
      display: "flex",
      borderRadius: "20px",
      alignItems: "center",
      backgroundColor: "#FF3939",
      color: "#fff",
      cursor: "pointer",
    },
  })
);
