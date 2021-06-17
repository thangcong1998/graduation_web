import React from "react";
import { Button, ButtonGroup, makeStyles, IconButton } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CalendarIcon from "../../assets/icons/calendar.svg";
import moment from "moment";

const useStyle = makeStyles((theme) => ({
  active: {
    backgroundColor: "#eaf6ff",
  },
  labelToolbar: {
    fontSize: "1.45rem",
  },
  today: {
    fontWeight: "bold",
    color: "#2096f3",
    fontSize: "1rem",
    "&:hover": {
      cursor: "pointer",
    },
  },
  rightBtn: {
    fontWeight: "bolder",
    maxHeight: 45,
  },
}));
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
export default function CalendarToolbar({toolbar, views}) {
  const { t, i18n } = useTranslation();
  const classes = useStyle();
  function viewMonth() {
    toolbar.onView("month");
  }
  function viewWeek() {
    toolbar.onView("week");
  }
  function viewDay() {
    toolbar.onView("day");
  }
  function viewAgenda() {
    toolbar.onView("agenda");
  }
  const goToBack = () => {
    let view = toolbar.view;
    let mDate = toolbar.date;
    let newDate;
    if (view === "month") {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
    } else if (view === "week") {
      newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() - 7,
        1
      );
    } else {
      newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() - 1,
        1
      );
    }
    toolbar.onNavigate("prev", newDate);
  };
  const goToNext = () => {
    let view = toolbar.view;
    let mDate = toolbar.date;
    let newDate;
    if (view === "month") {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
    } else if (view === "week") {
      newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() + 7,
        1
      );
    } else {
      newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() + 1,
        1
      );
    }
    toolbar.onNavigate("next", newDate);
  };
  const goToDay = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate("current", now);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        flexWrap: "wrap",
      }}
    >
      <div className={classes.today} onClick={() => goToDay()}>
        <div
          style={{
            width: 70,
            height: 25,
            borderRadius: "5px 5px 0px 0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fc1f1fc7",
            color: "#fff",
          }}
        >
          {i18n.languages[0] == "vi"
            ? "T" + moment(new Date()).format("MM")
            : months.find((e, i) => i + 1 == moment(new Date()).format("MM"))}
        </div>
        <div
          style={{
            width: 70,
            height: 45,
            borderBottom: "1px solid #ddd",
            borderRight: "1px solid #ddd",
            borderLeft: "1px solid #ddd",
            borderRadius: "0px 0px 5px 5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
          }}
        >
          {moment(new Date()).format("DD")}
        </div>
      </div>
      <div className={classes.labelToolbar}>
        <IconButton onClick={() => goToBack()} title={t("schedule.back")}>
          <ChevronLeftIcon />
        </IconButton>
        <span
          style={{
            textTransform: "capitalize",
          }}
        >
          {toolbar?.label}
        </span>
        <IconButton onClick={() => goToNext()} title={t("schedule.next")}>
          <ChevronRightIcon />
        </IconButton>
      </div>

      <ButtonGroup className={classes.right}>
        {(views.month === true || !views) &&<Button
          className={`${toolbar.view === "month" && classes.active} ${
            classes.rightBtn
          }`}
          onClick={() => viewMonth()}
        >
          {t("schedule.month")}
        </Button>}
        {(views.week === true || !views) &&<Button
          className={`${toolbar.view === "week" && classes.active} ${
            classes.rightBtn
          }`}
          onClick={() => viewWeek()}
        >
          {t("schedule.week")}
        </Button>}
        {(views.day === true || !views) &&<Button
          className={`${toolbar.view === "day" && classes.active} ${
            classes.rightBtn
          }`}
          onClick={() => viewDay()}
        >
          {t("schedule.day")}
        </Button>}
        {(views.agenda === true || !views) &&<Button
          className={`${toolbar.view === "agenda" && classes.active} ${
            classes.rightBtn
          }`}
          onClick={() => viewAgenda()}
        >
          {t("schedule.agenda")}
        </Button>}
      </ButtonGroup>
    </div>
  );
}
