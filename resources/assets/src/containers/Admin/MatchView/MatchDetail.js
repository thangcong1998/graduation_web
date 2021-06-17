import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  makeStyles,
  Paper,
  Grid,
  Button,
} from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import Autocomplete from "../../../components/form/Autocomplete";
import Date from "../../../components/form/Date";
import "./loading.css";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import AvTimerIcon from "@material-ui/icons/AvTimer";

export default function MatchDetail() {
  const { t, i18n } = useTranslation();
  const classes = useStyle();
  const location = useLocation();
  const api = useAPI();
  const history = useHistory();
  const [params, setParams] = useState({});
  const [firstLoading, setFirstLoading] = useState(true);
  const [date, setDate] = useState();
  const formik = useFormik({
    initialValues: {
      discipline_id: null,
      event_id: null,
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("venue_id", params?.id ? params?.id : "");
      formData.append("_method", "PUT");
      try {
        let res = await api.fetcher(
          "post",
          "/admin/venue/" + params?.id,
          formData
        );
        if (res) {
          history.goBack();
        }
      } catch (e) {}
    },
  });
  useEffect(() => {
    if (firstLoading === true && location?.state?.sport_discipline_id) {
      let tempParams = { ...params };
      if (location.state.day) {
        tempParams.event_date =
          "2021/" + location.state.month + "/" + location.state.day;
        setDate("2021/" + location.state.month + "/" + location.state.day);
      }
      tempParams.sport_discipline_id = location.state.sport_discipline_id?.id;
      formik.setFieldValue("discipline_id", location.state.sport_discipline_id);
      setParams(tempParams);
      setFirstLoading(false);
    }
  }, [firstLoading, location.state]);
  const { data: matches, loading: loading } = useFetch(
    params?.sport_discipline_id || params?.sport_discipline_event_id
      ? ["get", "/admin/match", params]
      : [null, null]
  );
  const [array, setArray] = useState([]);
  useEffect(() => {
    if (matches) {
      let array_date = [];
      let array_match = [];
      matches?.data.map((value) => {
        if (!array_date.includes(value.event_date)) {
          array_date.push(value.event_date);
        }
      });
      array_date.map((value) => {
        let temp = { date: value, matches: [] };
        matches?.data.map((item) => {
          if (item.event_date == value) {
            temp.matches.push(item);
            temp.date = value;
          }
        });
        array_match.push(temp);
      });

      setArray(array_match);
    }
  }, [matches]);
  const ChangeDate = (e) => {
    setDate(e);
  };
  const searchData = () => {
    let search = {};
    if (formik?.values?.event_id) {
      search.sport_discipline_event_id = formik.values?.event_id?.id
        ? formik.values?.event_id?.id
        : "";
      search.event_date = date;
    } else {
      search.sport_discipline_id = formik?.values?.discipline_id?.id
        ? formik?.values?.discipline_id?.id
        : location.state.sport_discipline_id;
      search.event_date = date;
    }
    setParams(search);
  };

  return (
    <div>
      <Paper
        style={{
          padding: 10,
          marginTop: 20,
          overflow: "auto",
          display: "inline-block",
        }}
      >
        <div style={{ display: "flex" }}>
          <div className={classes.input}>
            <Autocomplete
              endpoint={"admin/sportDiscipline"}
              queryField={
                i18n.language == "vi" ? "name_like" : "english_name_like"
              }
              labelField={i18n.language == "vi" ? "name" : "english_name"}
              valueField={"id"}
              label={t("sport_discipline_screen.sport_discipline")}
              value={formik.values?.discipline_id}
              handleChange={(e) => {
                formik.setFieldValue("discipline_id", e);
                formik.setFieldValue("event_id", null);
              }}
              error={
                api.error?.discipline_id ||
                (formik.touched.discipline_id && formik.errors?.discipline_id)
              }
              helpText={
                api.error?.team_id ||
                (formik.touched.discipline_id && formik.errors?.discipline_id)
              }
            />
          </div>
          <div className={classes.input}>
            <Autocomplete
              endpoint={
                formik.values?.discipline_id
                  ? "admin/sportDisciplineEvent?sport_discipline_id_equal=" +
                    formik.values?.discipline_id?.id
                  : ""
              }
              queryField={
                i18n.language == "vi" ? "name_like" : "english_name_like"
              }
              labelField={i18n.language == "vi" ? "name" : "english_name"}
              valueField={"id"}
              label={t("sport_discipline_screen.event")}
              value={formik.values?.event_id}
              handleChange={(e) => formik.setFieldValue("event_id", e)}
              error={
                api.error?.event_id ||
                (formik.touched.event_id && formik.errors?.event_id)
              }
              helpText={
                api.error?.team_id ||
                (formik.touched.event_id && formik.errors?.event_id)
              }
            />
          </div>

          <div className={classes.input}>
            <Date
              label={t("match_view_screen.date")}
              value={date}
              size={"small"}
              handleChange={(e) => ChangeDate(e)}
            />
          </div>
          <div>
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={() => searchData()}
            >
              {t("button.filter")}
            </Button>
          </div>
        </div>

        {!loading && (
          <div style={{ display: "flex", marginTop: 20 }}>
            {array?.map((value) => {
              return (
                <Card className={classes.cardContainer}>
                  <Typography className={classes.event_date}>
                    {moment(value.date).format("DD-MM-YYYY")}
                  </Typography>
                  <hr />
                  {value?.matches.map((item) => {
                    return (
                      <div
                        className={classes.match}
                        onClick={() => {
                          console.log(111, item);
                          history.push("/matchSchedule/matchView/" + item.id);
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <img
                            className={classes.img}
                            src={
                              process.env.MIX_REACT_APP_STORAGE_URL +
                              "/" +
                              item?.stage?.event?.icon
                            }
                          />
                          <Typography className={classes.event}>
                            {i18n.language == "en"
                              ? item?.stage?.event?.english_name
                              : item?.stage?.event?.name}
                          </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                          <AvTimerIcon
                            style={{
                              color: "#2196f3",
                            }}
                          />
                          <Typography className={classes.time}>
                            <i>
                              {moment(item?.start_time).format("H:m:s") +
                                " - " +
                                item?.end_time}
                            </i>
                          </Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                          <LocationOnIcon
                            style={{
                              color: "#d50000",
                            }}
                          />
                          <Typography
                            style={{
                              fontSize: 15,
                            }}
                          >
                            <i>{item?.venue?.name}</i>
                          </Typography>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              );
            })}
          </div>
        )}
      </Paper>
      {loading && (
        <div className={classes.div}>
          <div className="loader">Loading...</div>
        </div>
      )}
      {array.length == 0 && !loading && (
        <div className={classes.div2}>
          <div
            style={{ textAlign: "center", fontSize: "1.3rem", width: "100%" }}
          >
            {t("title.empty_data")}
          </div>
        </div>
      )}
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  cardContainer: {
    width: 330,
    minHeight: 200,
    backgroundColor: "#e0e0e0",
    padding: 10,
    margin: 10,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  input: {
    width: 300,
    marginRight: 10,
  },
  match: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    cursor: "pointer",
    " &:hover": {
      backgroundColor: "#c8e6c9",
    },
  },

  event_date: {
    fontSize: 20,
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#4caf50",
    borderRadius: 4,
    color: "white",
  },
  event: {
    fontSize: "1.25rem",
    textAlign: "center",
    marginBottom: 10,
  },
  div: {
    height: 200,
    width: "100%",
    backgroundColor: "#ffffff",
    display: "inline-flex",
    border: "#d6d6d6 solid 1px",
    borderRadius: 5,
    boxShadow: "0px 0px 3px 0px",
    alignItems: "center",
  },
  div2: {
    height: 200,
    width: "100%",
    backgroundColor: "#ffffff",
    display: "inline-flex",
    border: "#d6d6d6 solid 1px",
    borderRadius: 5,
    alignItems: "center",
  },
  img: {
    width: 20,
    height: 20,
    marginRight: 5,
    marginTop: 5,
  },
  time: {
    fontSize: 18,
    color: "#e53935",
  },
}));
