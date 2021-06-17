import React, { useState, useEffect } from "react";
import { Grid, IconButton, Popper } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MatchResultParticipants from "./MatchResultParticipants";
import ProgressOfTheMatch from "./ProgressOfTheMatch";
import Result from "./Result";
import moment from "moment";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import stadium from "./san.jpg";
import Autocomplete from "../../../components/form/Autocomplete";
import { useFormik } from "formik";
import Statistic from "./Statistic/Statistic";

export default function MatchResultForm() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [tab, setTab] = useState(1);
  const [round, setRound] = useState([]);
  const [venue, setVenue] = useState({});
  const api = useAPI();
  const params = useParams();
  const [status, setStatus] = useState({
    name: "Đang diễn ra",
    id: 2,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const { data: match } = useFetch(["get", "/admin/match/" + params?.id]);

  const changeStatus = (name, id) => {
    let temp = { ...status };
    temp.name = name;
    temp.id = id;
    setStatus(temp);
    handleClick();
  };
  const [field, setField] = useState();

  const handleChange = (e) => {
    setField(e);
  };
  const [arr, setArr] = useState([]);
  useEffect(() => {
    if (match) {
      let temp = { ...status };
      if (match.status == 1) {
        temp.name = "Chưa diễn ra";
        temp.id = 1;
      }
      if (match.status == 2) {
        temp.name = "Đang diễn ra";
        temp.id = 2;
      }
      if (match.status == 3) {
        temp.name = "Đã kết thúc";
        temp.id = 3;
      }
      setStatus(temp);
      // let tempParams = { ...param };
      // tempParams.competitor_venue_event_id_equal = match?.venue_id;
      // setParam(tempParams);
      setField(
        match?.match_individual_competitors[0]?.line?.event_field ||
          match?.venue_event_field
      );
      const arrField = [];
      match?.venue?.venue_relation?.map((item) => {
        if (
          item.competitor_venue_id == match?.venue_id &&
          item.event_id == match?.stage?.event_id
        ) {
          item.event_field.map((e) => {
            arrField.push(e);
          });
          if (item.event_field.length == 1) {
            setField(item.event_field[0]);
          }
        }
      });
      setArr(arrField);
    }
  }, [match]);

  return (
    <div>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          style={{
            padding: 0,
            borderTop: "#297728 solid 5px",
            borderLeft: "#297728 solid 5px",
            borderRight: "#297728 solid 5px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            backgroundImage: `url(${stadium})`,
            backgroundSize: "cover"
          }}
        >
          <div
            style={{
              minHeight: "120px",
              width: "100%",
              padding: "5px 5px 0px 5px",
            }}
          >
            <div style={{ display: "flex", width: "100%", padding: 5 }}>
              <div
                aria-describedby={id}
                onClick={handleClick}
                style={
                  status.id === 1
                    ? {
                        width: "20%",
                        padding: 5,
                        backgroundColor: "orange",
                        color: "white",
                        textAlign: "center",
                      }
                    : status.id === 2
                    ? {
                        width: "20%",
                        padding: 5,
                        backgroundColor: "#297728",
                        color: "white",
                        textAlign: "center",
                      }
                    : {
                        width: "20%",
                        padding: 5,
                        backgroundColor: "red",
                        color: "white",
                        textAlign: "center",
                      }
                }
              >
                <p
                  style={{
                    margin: 0,
                    display: "grid",
                    alignItems: "center",
                    height: "100%",
                    fontSize: "1rem",
                  }}
                >
                  {status.name}
                </p>
              </div>
              <Popper id={id} open={open} anchorEl={anchorEl}>
                <div
                  className={classes.popper_status}
                  style={{ backgroundColor: "orange" }}
                  onClick={() => changeStatus("Chưa diễn ra", 1)}
                >
                  {t("match_result_form_screen.prepare")}
                </div>
                <div
                  className={classes.popper_status}
                  style={{ backgroundColor: "#297728" }}
                  onClick={() => changeStatus("Đang diễn ra", 2)}
                >
                  {t("match_result_form_screen.happening")}
                </div>
                <div
                  className={classes.popper_status}
                  style={{ backgroundColor: "red" }}
                  onClick={() => changeStatus("Đã kết thúc", 3)}
                >
                  {t("match_result_form_screen.close")}
                </div>
              </Popper>
              <div
                style={{
                  width: "60%",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#297728",
                }}
              >
                <IconButton size={"small"}>
                  <DateRangeIcon style={{ color: "#297728" }} />
                </IconButton>
                {moment(match?.start_time).format("H:mm")}
                {","}
                {moment(match?.event_date).format("DD/MM/YYYY")} {"|"}{" "}
                <IconButton size={"small"}>
                  <LocationOnIcon style={{ color: "#297728" }} />
                </IconButton>
                {match?.venue?.id
                  ? match?.venue?.name
                  : t("match_result_form_screen.non_venue")}
              </div>
              <div
                style={{
                  width: "20%",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  height: "100%",
                }}
              >
                <Autocomplete
                  label="Sân đấu"
                  variant="outlined"
                  queryField={"name_like"}
                  labelField={"name"}
                  options={arr}
                  // endpoint="/admin/competitor_venue_event_field"
                  handleChange={(e) => handleChange(e)}
                  // params={param}
                  value={field}
                />
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={3}>
                    {match?.stage?.event?.sport_discipline?.icon && (
                        <img
                            src={
                                process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                match?.stage?.event?.sport_discipline?.icon
                            }
                            width={"50px"}
                            height={"auto"}
                            style={{ float: "right" }}
                        />
                    )}
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.5rem",
                      width: "100%",
                    }}
                  >
                    <span style={{ margin: 0 }}>
                      {i18n.language == "vi"
                        ? match?.stage?.event?.sport_discipline?.sport?.name
                        : match?.stage?.event?.sport_discipline?.sport
                            ?.english_name}{" "}
                      {"/"}{" "}
                      {i18n.language == "vi"
                        ? match?.stage?.event?.sport_discipline?.name
                        : match?.stage?.event?.sport_discipline
                            ?.english_name}{" "}
                      {"/"}{" "}
                      {i18n.language == "vi"
                        ? match?.stage?.event?.name
                        : match?.stage?.event?.english_name}{" "}
                      {"/"} {match?.stage?.name}
                    </span>
                  </h2>
                </Grid>
                <Grid item xs={3}>
                    {match?.stage?.event?.icon && (
                        <img
                            src={
                                process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                match?.stage?.event?.icon
                            }
                            width={"40px"}
                            height={"auto"}
                            style={{ float: "left" }}
                        />
                    )}
                </Grid>
              </Grid>
            </div>
          </div>
          <Grid container spacing={0} style={{ height: '100%', maxHeight: '80px'}}>
            <Grid item xs={3} style={{ padding: "5px 1px 0px 2px", height: '100%' }}>
              <div
                className={
                  tab === 1 ? classes.tab_select : classes.tab_not_select
                }
                onClick={() => setTab(1)}
                style={{ height: '100%'}}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                  }}
                >
                  {t("match_result_form_screen.participants")}
                </p>
              </div>
            </Grid>
            <Grid item xs={3} style={{ padding: "5px 1px 0px 1px", height: '100%' }}>
              <div
                className={
                  tab === 2 ? classes.tab_select : classes.tab_not_select
                }
                onClick={() => setTab(2)}
                style={{ height: '100%'}}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                  }}
                >
                  {t("match_result_form_screen.progress_of_the_match")}
                </p>
              </div>
            </Grid>
            <Grid item xs={3} style={{ padding: "5px 1px 0px 1px", height: '100%' }}>
              <div
                className={
                  tab === 3 ? classes.tab_select : classes.tab_not_select
                }
                onClick={() => setTab(3)}
                style={{ height: '100%'}}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                  }}
                >
                  {t("match_result_form_screen.statistic")}
                </p>
              </div>
            </Grid>
            <Grid item xs={3} style={{ padding: "5px 2px 0px 1px" , height: '100%'}}>
              <div
                className={
                  tab === 4 ? classes.tab_select : classes.tab_not_select
                }
                onClick={() => setTab(4)}
                style={{ height: '100%'}}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                  }}
                >
                  {t("match_result_form_screen.result")}
                </p>
              </div>
            </Grid>
          </Grid>
        </Grid>
        {tab === 1 && (
          <MatchResultParticipants
            field={field}
            setField={setField}
            match={match}
          />
        )}
        {tab === 2 && (
          <ProgressOfTheMatch
            round={round}
            setRound={setRound}
            match={match}
            status={status}
          />
        )}
        {tab === 3 && (
          <Statistic
            round={round}
            setRound={setRound}
            match={match}
            status={status}
          />
        )}
        {tab === 4 && (
          <Result
            round={round}
            setRound={setRound}
            match={match}
            status={status}
          />
        )}
      </Grid>
    </div>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    popper_status: {
      padding: 10,
      color: "#fff",
      border: "#f3f3f3 solid 1px",
      minWidth: "180px",
      fontSize: "1rem",
      textAlign: "center",
    },
    tab_select: {
      backgroundColor: "#f3f3f3",
      textAlign: "center",
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      cursor: "pointer",
      color: "#000",
    },
    tab_not_select: {
      backgroundColor: "#297728",
      textAlign: "center",
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      cursor: "pointer",
      color: "#fff",
    },
  })
);
