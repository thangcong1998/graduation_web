import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Grid,
  makeStyles,
  IconButton,
  TextField, InputAdornment, Button
} from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import { useTranslation } from "react-i18next";
import EventNoteIcon from "@material-ui/icons/EventNote";
import moment from "moment";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import { useHistory, useLocation } from "react-router-dom";
import "./loading.css";
import SearchIcon from "@material-ui/icons/Search";
import {MuiPickersUtilsProvider, TimePicker, DatePicker} from "@material-ui/pickers";
import TimeFnsUtils from "@date-io/date-fns";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";

export default function MatchSchedule() {
  const classes = useStyle();
  const history = useHistory();
  const location = useLocation();
  const [params, setParams] = useState({
    sport_name: "",
    per_page: 200,
  });
  const { data: discipline, loading: loading } = useFetch([
    "get",
    "admin/sportDiscipline",
    params,
  ]);
  const {data: date, loading: loadingDate} = useFetch(['get', 'admin/setting']);
  const [month, setMonth] = useState([]);
  const month31 = [1, 3, 5, 7, 8, 10, 12];
  const month30 = [4,6,9,11];
  const { data: match } = useFetch(["get", "admin/all_match"]);
  const [eventDate, setEventDate] = useState([]);
  useEffect(() => {
      if(date) {
          let start_date;
          let end_date;
          if(date?.start_date == null)
          {
              start_date = new Date("2021/11/15");
          } else {
              start_date = new Date(date.start_date);
          }
          if(date?.end_date == null) {
              end_date = new Date("2021/12/05");
          } else {
              end_date = new Date(date.end_date);
          }
          // let start_year = moment(start_date).format("YYYY");
          let start_month = moment(start_date).format("MM");
          let start_day = moment(start_date).format("DD");
          // let end_year = moment(end_date).format("YYYY");
          let end_month = moment(end_date).format("MM");
          let end_day = moment(end_date).format("DD");
          let temp_start_month = start_month;
          temp_start_month = parseInt(temp_start_month);
          let tempDateArray = [...month];
          for (let i = 0; i <= (end_month - start_month); i++)
          {
              let temp = {
                  month: "",
                  day: [],
              }
              temp.month = temp_start_month;
              if(temp_start_month == start_month && month31.includes(parseInt(temp_start_month))) {
                  for (let j = (parseInt(start_day) - 1); j < 31; j++)
                  {
                      let temp_day = j + 1;
                      temp.day.push(temp_day);
                  }
              }
              if(temp_start_month == start_month && month30.includes(parseInt(temp_start_month))) {
                  for (let j = (parseInt(start_day) - 1); j < 30; j++)
                  {
                      let temp_day = j + 1;
                      temp.day.push(temp_day);
                  }
              }
              if(temp_start_month == end_month && temp_start_month != start_month) {
                  for (let j = 0; j < end_day; j++)
                  {
                      let temp_day = j + 1;
                      temp.day.push(temp_day);
                  }
              }
              if(temp_start_month != end_month && temp_start_month != start_month)
              {
                  if (month30.includes(parseInt(temp_start_month))) {
                      for (let j = 0; j < 30; j++)
                      {
                          let temp_day = j + 1;
                          temp.day.push(temp_day);
                      }
                  }
                  if(month31.includes(parseInt(temp_start_month))) {
                      for (let j = 0; j < 31; j++)
                      {
                          let temp_day = j + 1;
                          temp.day.push(temp_day);
                      }
                  }
              }
              tempDateArray.push(temp);
              temp_start_month++;
          }
          setMonth(tempDateArray);
      }
  }, [date])
    console.log(month);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (match) {
      let tempData = [...eventDate];
      let tempDate = [];
      match.map((value, index) => {
        let temp = {
          day: "",
          month: "",
          sport_discipline_id: "",
        };
        temp.day = moment(value.event_date).format("DD");
        temp.month = moment(value.event_date).format("MM");
        temp.sport_discipline_id = value?.stage?.event?.sport_discipline?.id;
        tempData.push(temp);
      });
      tempData.map((value, index, array) => {
        let count = 0;
        tempDate.map((date) => {
          if (
            date?.day == value.day &&
            date?.month == value.month &&
            date?.sport_discipline_id == value.sport_discipline_id
          ) {
            count++;
          }
        });
        if (count == 0) {
          tempDate.push(value);
        }
      });
      setEventDate(tempDate);
    }
  }, [match]);
  console.log(eventDate);
  const changeName = (value) => {
    let temp = { ...params };
    temp.sport_name = value;
    setParams(temp);
  };
  return (
    <Paper style={{ padding: 20 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ overflow: 'auto' }}>
          <table
            style={{
              width: "100%",
              borderSpacing: 0,
              borderRight: "#d6d6d6 solid 1px",
              borderBottom: "#d6d6d6 solid 1px",
            }}
          >
            <tr className={classes.color_header}>
              <td
                style={{ minWidth: 250, display: "flex", minHeight: "38px" }}
                className={classes.border_table}
              >
                <IconButton size={"small"}>
                  <SearchIcon />
                </IconButton>
                <TextField
                  fullWidth
                  size={"small"}
                  value={params?.name_like}
                  onChange={(e) => changeName(e.target.value)}
                />
              </td>
                {month.map(value => {
                    return (
                        <td
                            style={{ textAlign: "center" }}
                            className={classes.border_date}
                            colSpan={value.day.length}
                        >
                            {value.month}
                        </td>
                    )
                })}
            </tr>
            <tr>
              <td style={{ minWidth: 250 }} className={classes.header_table}>
                {t("match_view_screen.discipline")}
              </td>
                {month.length > 0 && month.map((value) => {
                    return (<>
                        {value.day.map((temp_day) => {
                            return (
                                <td
                                    style={
                                        { textAlign: "center"}
                                    }
                                    className={classes.border_date}
                                >
                                    {temp_day < 10 ? "0" + temp_day : temp_day}
                                </td>
                            )
                        })}
                    </>)
                })}
            </tr>
            {loading != true &&
              discipline?.data.map((discipline, index) => {
                if (index % 2 === 0) {
                  return (
                    <tr className={classes.color_header}>
                      <td
                        style={{
                          minWidth: 250,
                          paddingLeft: 5,
                        }}
                        className={classes.name_discipline}
                      >
                        <span style={{ color: "blue" }}>
                          {i18n.language == "vi"
                            ? discipline?.sport?.name
                            : discipline?.sport?.english_name}
                        </span>
                        {"-"}
                        {i18n.language == "vi"
                          ? discipline.name
                          : discipline.english_name}
                        {"  "}
                        <IconButton size={"small"} style={{ float: "right" }}>
                          <EventNoteIcon
                            onClick={() =>
                              history.push({
                                pathname: "/matchSchedule/matchView",
                                state: {
                                  sport_discipline_id: discipline,
                                },
                              })
                            }
                          />
                        </IconButton>
                      </td>
                        {month.map(value => {
                            return (<>
                                {value.day.map(day => {
                                    return (
                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                            className={classes.border_date_detail}
                                        >
                                            {eventDate.map((event) => {
                                                if (
                                                    parseInt(event.day) == parseInt(day) &&
                                                    parseInt(event.month) == parseInt(value.month) &&
                                                    event.sport_discipline_id == discipline.id
                                                ) {
                                                    return (
                                                        <IconButton size={"small"}>
                                                            <Brightness1Icon
                                                                onClick={() =>
                                                                    history.push({
                                                                        pathname: "/matchSchedule/matchView",
                                                                        state: {
                                                                            sport_discipline_id: discipline,
                                                                            day: parseInt(day),
                                                                            month: parseInt(value.month),
                                                                        },
                                                                    })
                                                                }
                                                                fontSize={"small"}
                                                            />
                                                        </IconButton>
                                                    );
                                                }
                                            })}
                                        </td>
                                    )
                                })}
                            </>)
                        })}
                    </tr>
                  );
                } else {
                  return (
                    <tr>
                      <td
                        style={{
                          minWidth: 250,
                          paddingLeft: 5,
                        }}
                        className={classes.name_discipline}
                      >
                        <span style={{ color: "blue" }}>
                          {i18n.language == "vi"
                            ? discipline?.sport?.name
                            : discipline?.sport?.english_name}
                        </span>
                        {"-"}
                        {i18n.language == "vi"
                          ? discipline.name
                          : discipline.english_name}
                        <IconButton size={"small"} style={{ float: "right" }}>
                          <EventNoteIcon
                            onClick={() =>
                              history.push({
                                pathname: "/matchSchedule/matchView",
                                state: {
                                  sport_discipline_id: discipline,
                                },
                              })
                            }
                          />
                        </IconButton>
                      </td>
                        {month.map(value => {
                            return (<>
                                {value.day.map(day => {
                                    return (
                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                            className={classes.border_date_detail}
                                        >
                                            {eventDate.map((event) => {
                                                if (
                                                    parseInt(event.day) == parseInt(day) &&
                                                    parseInt(event.month) == parseInt(value.month) &&
                                                    event.sport_discipline_id == discipline.id
                                                ) {
                                                    return (
                                                        <IconButton size={"small"}>
                                                            <Brightness1Icon
                                                                onClick={() =>
                                                                    history.push({
                                                                        pathname: "/matchSchedule/matchView",
                                                                        state: {
                                                                            sport_discipline_id: discipline,
                                                                            day: parseInt(day),
                                                                            month: parseInt(value.month),
                                                                        },
                                                                    })
                                                                }
                                                                fontSize={"small"}
                                                            />
                                                        </IconButton>
                                                    );
                                                }
                                            })}
                                        </td>
                                    )
                                })}
                            </>)
                        })}
                    </tr>
                  );
                }
              })}
            {loading && (
              <tr>
                <td colSpan={22} style={{ minHeight: "200px" }}>
                  <div className="loader">Loading...</div>
                </td>
              </tr>
            )}
          </table>
        </Grid>
      </Grid>
    </Paper>
  );
}
const useStyle = makeStyles((theme) => ({
  sport_name: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto Condensed,Arial,sans-serif",
  },
  border_table: {
    border: "#d6d6d6 solid 1px",
    fontFamily: "Roboto Condensed,Arial,sans-serif",
  },
  border_date_detail: {
    borderTop: "#fafafa solid 1px",
    borderBottom: "#fafafa solid 1px",
    borderLeft: "#fafafa solid 1px",
    borderRight: "#fafafa solid 1px",
    fontSize: "1.5rem",
    fontFamily: "Roboto Condensed,Arial,sans-serif",
  },
  border_date: {
    borderTop: "#d6d6d6 solid 1px",
    borderBottom: "#d6d6d6 solid 1px",
    borderLeft: "#d6d6d6 solid 1px",
    borderRight: "#d6d6d6 solid 1px",
    fontSize: "1.5rem",
    fontFamily: "Roboto Condensed,Arial,sans-serif",
  },
  header_table: {
    border: "#d6d6d6 solid 1px",
    fontSize: "16px",
    fontWeight: 600,
    fontFamily: "Roboto Condensed,Arial,sans-serif",
  },
  name_discipline: {
    borderTop: "#fafafa solid 1px",
    borderBottom: "#fafafa solid 1px",
    borderLeft: "#d6d6d6 solid 1px",
    borderRight: "#d6d6d6 solid 1px",
    fontSize: "16px",
    fontWeight: 600,
    fontFamily: "Roboto Condensed,Arial,sans-serif",
  },
  color_header: {
    backgroundColor: "#f7f7f7",
  },
}));
