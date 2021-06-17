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
    MenuItem,
    Select,
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
} from "../../../../../common/constants";
import InputMask from "react-input-mask";

export default function Record1vsNNotRoundTime({ match, status }) {
    const classes = useStyles();
    const [winner, setWinner] = useState([]);
    const params = useParams();
    const [participantCheck, setParticipantCheck] = useState(0);
    const api = useAPI();
    const { t, i18n } = useTranslation();
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
            setQualification(match?.stage?.stage_qualification_settings);
            if (match?.stage?.next_stage?.length > 0) {
                setNextStageId(true);
            } else {
                setNextStageId(false);
            }
            Test();
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
                case measurement_unit.TIME:
                    setUnit("ti");
                    break;
                default:
                    setUnit("cm");
            }
            let data = [];
            let tempMember = [];
            let tempFoul = [];
            if (match?.match_individual_competitors?.length > 0) {
                match?.match_individual_competitors.forEach((value) => {
                    let _member = {
                        team: "",
                        name: "",
                        disable: false,
                        foul: [],
                    };
                    setParticipantCheck(1);
                    _member.team = value?.competitor?.team;
                    _member.name =
                        value?.competitor?.given_name +
                        " " +
                        value?.competitor?.family_name;
                    _member.participant_has = 1;
                    _member.id = value?.competitor?.id;
                    _member.match_round_result = value.id;
                    let count = 0;
                    match?.stage?.stage_qualification_competitors.map((qualifi) => {
                        if (qualifi.participant_id == value?.competitor?.id) {
                            _member.qualification_type = qualifi.qualification_type;
                            count++;
                        }
                    });
                    if (count == 0) {
                        _member.qualification_type = 0;
                    }
                    if (value.final_score) {
                        _member.finalScore = value.final_score;
                        let time;
                        if(parseInt(value.final_score) > 0)
                        {
                            time = value.final_score.toString().split(":");
                        } else {
                            time = '00:00:00.000'.split(":");
                        }
                        _member.time = parseInt(time[0])*3600 + parseInt(time[1])*60 + parseFloat(time[2]);
                    } else {
                        _member.finalScore = 0;
                        _member.time = 0;
                    }
                    let count_reward = 0;
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
                            count_reward++;
                        }
                    });
                    if (count_reward == 0) {
                        _member.qualification_type = qualification_type.NONE;
                        _member.qualified_to_stage_id = 0;
                        _member.color = "";
                        _member.text = "";
                    }
                    if (value.result?.length > 0) {
                        value.result.forEach((result) => {
                            _member.score = result.score;
                            result.match_round_result_referee_relation.forEach(
                                (result_relation) => {
                                    let count = 0;
                                    if (result_relation.foul.penalty > 0) {
                                        count =
                                            parseFloat(result_relation.score) /
                                            parseFloat(result_relation.foul.penalty);
                                    } else {
                                        count = 0;
                                    }
                                    result_relation.foul.count = count;
                                    if (result_relation.foul.penalty == null) {
                                        result_relation.foul.score = 0;
                                    } else {
                                        result_relation.foul.score = parseFloat(
                                            result_relation.foul.penalty
                                        );
                                    }
                                    tempFoul.push(result_relation.foul.id);
                                    _member.foul.push(result_relation.foul);
                                }
                            );
                        });
                        foul?.data?.forEach((foul_has) => {
                            if (!tempFoul.includes(foul_has.id)) {
                                foul_has.count = 0;
                                if (foul_has?.penalty == null) {
                                    foul_has.score = 0;
                                } else {
                                    foul_has.score = parseFloat(foul_has.penalty);
                                }
                                _member.foul.push(foul_has);
                            }
                        });
                    } else {
                        _member.score = 0;
                        foul?.data.map((foulData) => {
                            foulData.count = 0;
                            if (parseFloat(foulData.penalty) > 0) {
                                foulData.score = parseFloat(foulData.penalty);
                            } else {
                                foulData.score = 0;
                            }
                            if (foulData.penalty == null) {
                                foulData.score = 0;
                            }
                            _member.foul.push(foulData);
                        });
                    }
                    tempMember.push(_member);
                });
            } else {
                match?.match_event_teams.forEach((value) => {
                    let _member = {
                        team: "",
                        name: "",
                        disable: false,
                        foul: [],
                    };
                    let temp_foul = [];
                    setParticipantCheck(2);
                    _member.team = value?.event_team?.team;
                    _member.name = value?.event_team?.name;
                    _member.participant_has = 2;
                    _member.id = value?.event_team?.id;
                    _member.match_round_result = value.id;
                    let count_reward = 0;
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
                            count_reward++;
                        }
                    });
                    if (count_reward == 0) {
                        _member.qualification_type = qualification_type.NONE;
                        _member.qualified_to_stage_id = 0;
                        _member.color = "";
                        _member.text = "";
                    }
                    let count = 0;
                    match?.stage?.stage_qualification_competitors.map((qualifi) => {
                        if (qualifi.event_team_id == value?.event_team?.id) {
                            _member.qualification_type = qualifi.qualification_type;
                            count++;
                        }
                    });
                    if (count == 0) {
                        _member.qualification_type = qualification_type.NONE;
                    }
                    if (value.final_score) {
                        _member.finalScore = value.final_score;
                        let time;
                        if(parseInt(value.final_score) > 0)
                        {
                            time = value.final_score.toString().split(":");
                        } else {
                            time = '00:00:00.000'.split(":");
                        }
                        _member.time = parseInt(time[0])*3600 + parseInt(time[1])*60 + parseFloat(time[2]);
                    } else {
                        _member.finalScore = 0;
                        _member.time = 0;
                    }
                    if (value.result?.length > 0) {
                        value.result.forEach((result) => {
                            _member.score = result.score;
                            result.match_round_result_referee_relation.forEach(
                                (result_relation) => {
                                    let count = 0;
                                    if (result_relation.foul.penalty > 0) {
                                        count =
                                            parseFloat(result_relation.score) /
                                            parseFloat(result_relation.foul.penalty);
                                    } else {
                                        count = 0;
                                    }
                                    result_relation.foul.count = count;
                                    if (result_relation.foul.penalty == null) {
                                        result_relation.foul.score = 0;
                                    } else {
                                        result_relation.foul.score = parseFloat(
                                            result_relation.foul.penalty
                                        );
                                    }
                                    temp_foul.push(result_relation.foul.id);
                                    _member.foul.push(result_relation.foul);
                                }
                            );
                        });
                        foul?.data?.forEach((foul_has) => {
                            if (!tempFoul.includes(foul_has.id)) {
                                foul_has.count = 0;
                                if (foul_has?.penalty == null) {
                                    foul_has.score = 0;
                                } else {
                                    foul_has.score = parseFloat(foul_has.penalty);
                                }
                                _member.foul.push(foul_has);
                            }
                        });
                    } else {
                        _member.score = 0;
                        foul?.data.map((foulData) => {
                            foulData.count = 0;
                            if (parseFloat(foulData.penalty) > 0) {
                                foulData.score = parseFloat(foulData.penalty);
                            } else {
                                foulData.score = 0;
                            }
                            if (foulData.penalty == null) {
                                foulData.score = 0;
                            }
                            _member.foul.push(foulData);
                        });
                    }
                    tempMember.push(_member);
                });
            }
            setMember(tempMember);
            setFirstCheck(false);
        }
    }, [match, foul]);
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
            formData.append("status", status?.id ? status?.id : 1);
            formData.append("member", JSON.stringify(member));
            formData.append("participant_check", participantCheck);
            formData.append("winner", JSON.stringify(winner_member));
            formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    "admin/record_1_vs_n_no_round",
                    formData
                );
                let updateMedalTable = await api.fetcher("get", "admin/medalRankings");
                if (res) {
                }
            } catch (e) {}
        },
    });
    const addError = (index, indexFoul) => {
        let temp = [...member];
        inheritance(temp, index);
        temp[index].foul[indexFoul] = {
            ...member[index].foul[indexFoul],
        };
        temp[index].foul[indexFoul].count = temp[index].foul[indexFoul].count + 1;
        let finalScore = member[index].score;
        let time = 0;
        temp[index].foul.map((value, index) => {
            let time_score = finalScore.split(":");
            time_score[2] = parseFloat(time_score[2]) + (parseFloat(value.count) * parseFloat(value.score));
            if(time_score[2] > 60 || time_score[1] > 60) {
                let minute = Math.floor(parseFloat(time_score[2])/60);
                let second = parseFloat(time_score[2]) - (60*minute);
                second = second.toString().slice(0, 6);
                time_score[1] = minute + parseInt(time_score[1]);
                time_score[2] = second;
                if(time_score[1] >= 60) {
                    let hour = Math.floor(parseInt(time_score[1])/60);
                    let minute_2 = parseInt(time_score[1]) - (60*hour);
                    time_score[0] = hour + parseInt(time_score[0]);
                    time_score[1] = minute_2;
                }
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
                finalScore = time_score.join(":");
            } else {
                finalScore = time_score.join(":");
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
            }
        });
        temp[index].finalScore = finalScore;
        temp[index].time = time;
        setMember(temp);
    };
    const removeError = (index, indexFoul) => {
        let temp = [...member];
        inheritance(temp, index);
        temp[index].foul[indexFoul] = {
            ...member[index].foul[indexFoul],
        };
        if (temp[index].foul[indexFoul].count != 0) {
            temp[index].foul[indexFoul].count = temp[index].foul[indexFoul].count - 1;
        }
        let finalScore = member[index].score;
        let time = 0;
        temp[index].foul.map((value, index) => {
            let time_score = finalScore.split(":");
            time_score[2] = parseFloat(time_score[2]) + (parseFloat(value.count) * parseFloat(value.score));
            if(time_score[2] > 60 || time_score[1] > 60) {
                let minute = Math.floor(parseFloat(time_score[2])/60);
                let second = parseFloat(time_score[2]) - (60*minute);
                second = second.toString().slice(0, 6);
                time_score[1] = minute + parseInt(time_score[1]);
                time_score[2] = second;
                if(time_score[1] >= 60) {
                    let hour = Math.floor(parseInt(time_score[1])/60);
                    let minute_2 = parseInt(time_score[1]) - (60*hour);
                    time_score[0] = hour + parseInt(time_score[0]);
                    time_score[1] = minute_2;
                }
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
                finalScore = time_score.join(":");
            } else {
                finalScore = time_score.join(":");
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
            }
        });
        temp[index].finalScore = finalScore;
        temp[index].time = time;
        setMember(temp);
    };
    const changeErrorValue = (index, indexFoul, value) => {
        let temp = [...member];
        inheritance(temp, index);
        temp[index].foul[indexFoul] = {
            ...member[index].foul[indexFoul],
        };
        temp[index].foul[indexFoul].count = parseFloat(value);
        let finalScore = member[index].score;
        let time = 0;
        temp[index].foul.map((value, index) => {
            let time_score = finalScore.split(":");
            time_score[2] = parseFloat(time_score[2]) + (parseFloat(value.count) * parseFloat(value.score));
            if(time_score[2] > 60 || time_score[1] > 60) {
                let minute = Math.floor(parseFloat(time_score[2])/60);
                let second = parseFloat(time_score[2]) - (60*minute);
                second = second.toString().slice(0, 6);
                time_score[1] = minute + parseInt(time_score[1]);
                time_score[2] = second;
                if(time_score[1] >= 60) {
                    let hour = Math.floor(parseInt(time_score[1])/60);
                    let minute_2 = parseInt(time_score[1]) - (60*hour);
                    time_score[0] = hour + parseInt(time_score[0]);
                    time_score[1] = minute_2;
                }
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
                finalScore = time_score.join(":");
            } else {
                finalScore = time_score.join(":");
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
            }
        });
        temp[index].finalScore = finalScore;
        temp[index].time = time;
        setMember(temp);
    };
    const changeRecord = (index, value) => {
        let temp = [...member];
        inheritance(temp, index);
        let finalScore = value;
        let time = 0;
        temp[index].foul.map((value, index) => {
            let time_score = finalScore.split(":");
            time_score[2] = parseFloat(time_score[2]) + (parseFloat(value.count) * parseFloat(value.score));
            if(time_score[2] > 60 || time_score[1] > 60) {
                let minute = Math.floor(parseFloat(time_score[2])/60);
                let second = parseFloat(time_score[2]) - (60*minute);
                second = second.toString().slice(0, 6);
                time_score[1] = minute + parseInt(time_score[1]);
                time_score[2] = second;
                if(time_score[1] >= 60) {
                    let hour = Math.floor(parseInt(time_score[1])/60);
                    let minute_2 = parseInt(time_score[1]) - (60*hour);
                    time_score[0] = hour + parseInt(time_score[0]);
                    time_score[1] = minute_2;
                }
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
                finalScore = time_score.join(":");
            } else {
                finalScore = time_score.join(":");
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
            }
        });
        temp[index].finalScore = finalScore;
        temp[index].score = value;
        temp[index].time = time;
        setMember(temp);
    };
    const cancelRecord = (index, indexFoul) => {
        let temp = [...member];
        inheritance(temp, index);
        temp[index].foul[indexFoul] = {
            ...member[index].foul[indexFoul],
        };
        temp[index].foul[indexFoul].count = temp[index].foul[indexFoul].count + 1;
        temp[index].finalScore = '00:00:00.000';
        temp[index].score = '00:00:00.000';
        temp[index].disable = true;
        setMember(temp);
    };
    const ReverseCancel = (index, indexFoul) => {
        let temp = [...member];
        inheritance(temp, index);
        temp[index].foul[indexFoul] = {
            ...member[index].foul[indexFoul],
        };
        temp[index].foul[indexFoul].count = temp[index].foul[indexFoul].count - 1;
        let finalScore = temp[index].score;
        let time = 0;
        temp[index].foul.map((value, index) => {
            let time_score = finalScore.split(":");
            time_score[2] = parseFloat(time_score[2]) + (parseFloat(value.count) * parseFloat(value.score));
            if(time_score[2] > 60 || time_score[1] > 60) {
                let minute = Math.floor(parseFloat(time_score[2])/60);
                let second = parseFloat(time_score[2]) - (60*minute);
                second = second.toString().slice(0, 6);
                time_score[1] = minute + parseInt(time_score[1]);
                time_score[2] = second;
                if(time_score[1] >= 60) {
                    let hour = Math.floor(parseInt(time_score[1])/60);
                    let minute_2 = parseInt(time_score[1]) - (60*hour);
                    time_score[0] = hour + parseInt(time_score[0]);
                    time_score[1] = minute_2;
                }
                time = parseInt(time_score[0])*3600 + parseInt(time_score[1])*60 + parseFloat(time_score[2]);
                finalScore = time_score.join(":");
            } else {
                finalScore = time_score.join(":");
            }
        });
        temp[index].finalScore = finalScore;
        temp[index].disable = false;
        temp[index].time = time;
        setMember(temp);
    };
    const inheritance = (temp, index) => {
        temp[index] = { ...member[index] };
        temp[index].foul = [...member[index].foul];
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
            return a.time - b.time;
        });
        setMember(temp);
    };
    const sortDown = () => {
        let temp = [...member];
        temp.sort(function (a, b) {
            return b.time - a.time;
        });
        setMember(temp);
    };
    return (
        <Paper style={{ margin: 10 }}>
            <div>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#4CAF50" }}>
                                <TableCell
                                    style={{ fontSize: "1.3rem", color: "#fff" }}
                                    align={"center"}
                                    rowSpan={2}
                                >
                                    {t("record_1vsN_time_screen.name_competitor")}
                                </TableCell>
                                <TableCell
                                    style={{ fontSize: "1.3rem", color: "#fff" }}
                                    align={"center"}
                                    rowSpan={2}
                                >
                                    {t("record_1vsN_time_screen.record")}
                                </TableCell>
                                {foul?.data?.length > 0 && (
                                    <TableCell
                                        style={{ fontSize: "1.3rem", color: "#fff" }}
                                        align={"center"}
                                        colSpan={foul?.data?.length}
                                    >
                                        {t("record_1vsN_time_screen.foul")}
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
                                            {t("record_1vsN_time_screen.final_record")}
                                        </p>
                                        <p style={{ margin: 0}}>
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
                                                <ArrowDownwardIcon style={{ color: '#fff'}}/>
                                            </IconButton>
                                        </p>
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
                                    <TableCell style={{ borderRight: "#919191 solid 1px" }}>
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
                                        style={{
                                            borderRight: "#919191 solid 1px",
                                            minWidth: "150px",
                                        }}
                                    >
                                        {unit == "ti" ? (
                                            <InputMask
                                                mask="99:99:99.999"
                                                value={row.score || ""}
                                                onChange={(e) => changeRecord(index, e.target.value)}
                                                disabled={false}
                                                maskChar="0"
                                            >
                                                {() => <TextField variant={"outlined"} fullWidth size={"small"} label={t("record_1vsN_time_screen.record")} />}
                                            </InputMask>
                                        ) : (
                                            <TextField
                                                disabled={row.disable}
                                                fullWidth
                                                inputProps={{
                                                    min: 0,
                                                    style: {
                                                        color:
                                                            row.qualification_type == qualification_type.NONE
                                                                ? ""
                                                                : row.text,
                                                    },
                                                }}
                                                type={"number"}
                                                size={"small"}
                                                label={t("record_1vsN_time_screen.record")}
                                                variant={"outlined"}
                                                value={row.score || ""}
                                                onChange={(e) => changeRecord(index, e.target.value)}
                                            />
                                        )}
                                    </TableCell>
                                    {row?.foul?.map((value, indexFoul) => {
                                        return value.foul_type != 1 ? (
                                            <TableCell
                                                style={{
                                                    borderRight: "#919191 solid 1px",
                                                    width: "100px",
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
                                                            onClick={() => removeError(index, indexFoul)}
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
                                                            disabled={row.disable}
                                                            value={value.count}
                                                            inputProps={{
                                                                min: 0,
                                                                style: {
                                                                    textAlign: "center",
                                                                    color:
                                                                        row.qualification_type ==
                                                                        qualification_type.NONE
                                                                            ? ""
                                                                            : row.text,
                                                                },
                                                            }}
                                                            onChange={(e) =>
                                                                changeErrorValue(
                                                                    index,
                                                                    indexFoul,
                                                                    e.target.value
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
                                                            onClick={() => addError(index, indexFoul)}
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
                                                }}
                                            >
                                                {row.disable == true && value.count != 0 && (
                                                    <div
                                                        className={classes.reverseRecord}
                                                        onClick={() => ReverseCancel(index, indexFoul)}
                                                    >
                                                        <p
                                                            style={{
                                                                textAlign: "center",
                                                                width: "100%",
                                                                fontSize: "1rem",
                                                            }}
                                                        >
                                                            {t("record_1vsN_time_screen.reverse")}
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
                                                            {t("record_1vsN_time_screen.cancel_record")}
                                                        </p>
                                                    </div>
                                                )}
                                                {row.disable == false && (
                                                    <div
                                                        className={classes.cancelRecord}
                                                        onClick={() => cancelRecord(index, indexFoul)}
                                                    >
                                                        <p
                                                            style={{
                                                                textAlign: "center",
                                                                width: "100%",
                                                                fontSize: "1rem",
                                                            }}
                                                        >
                                                            {t("record_1vsN_time_screen.cancel_record")}
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
                                        }}
                                        align={"center"}
                                    >
                                        {row.disable == false ? (
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
                                                {row.finalScore}
                                            </p>
                                        ) : (
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "1.3rem",
                                                    color:
                                                        row.qualification_type == qualification_type.NONE
                                                            ? "#FF0000"
                                                            : row.text,
                                                }}
                                            >
                                                {row.finalScore}
                                            </p>
                                        )}
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
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
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
