import React, { useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as dates from "react-big-calendar/lib/utils/dates";
import { useTranslation } from "react-i18next";
import { Button, ButtonGroup, makeStyles } from "@material-ui/core";
import "./Schedule.css";

const useStyle = makeStyles((theme) => ({
  active: {
    backgroundColor: "#0000000a",
  },
}));

const localizer = momentLocalizer(moment); // or globalizeLocalizer
let allViews = Object.keys(Views).map((k) => Views[k]);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

let initTime = new Date(new Date());

export default function (props) {
  const {
    events,
    onSelectEvent,
    onSelectSlot,
    slotPropGetter,
    components,
    ...otherProps
  } = props;
  const { t, i18n } = useTranslation();
  const classes = useStyle();
  const defaultSlotPropGetter = (date) => {
    return {
      className: "",
      style: {
        minHeight: 60,
      },
    };
  };
  const [init, setInit] = useState();

  useEffect(() => {
    setTimeout(() => {
      setInit(initTime);
    }, 0);
  }, []);

  const CalendarToolbar = (toolbar) => {
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
        <ButtonGroup>
          <Button onClick={() => goToDay()}>{t("schedule.to_day")}</Button>
          <Button onClick={() => goToBack()}>{t("schedule.back")}</Button>
          <Button onClick={() => goToNext()}>{t("schedule.next")}</Button>
        </ButtonGroup>
        <div
          style={{
            fontSize: "1rem",
          }}
        >
          {toolbar.label}
        </div>
        <ButtonGroup>
          <Button
            className={toolbar.view === "month" && classes.active}
            onClick={() => viewMonth()}
          >
            {t("schedule.month")}
          </Button>
          <Button
            className={toolbar.view === "week" && classes.active}
            onClick={() => viewWeek()}
          >
            {t("schedule.week")}
          </Button>
          <Button
            className={toolbar.view === "day" && classes.active}
            onClick={() => viewDay()}
          >
            {t("schedule.day")}
          </Button>
          <Button
            className={toolbar.view === "agenda" && classes.active}
            onClick={() => viewAgenda()}
          >
            {t("schedule.agenda")}
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  let formats = {
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      return (
        moment(start).format("DD/MM/YYYY") +
        " – " +
        moment(end).format("DD/MM/YYYY")
      );
    },
    dayHeaderFormat: (date, culture, localizer) =>
      moment(date).format("ddd") + " " + moment(date).format("DD/MM"),
  };

  let eventPropGetter = (event, start, end, isSelected) => {
    return {
      className: "agenda-style",
      style: {
        backgroundColor: event?.color,
        borderRadius: 5,
      },
    };
  };

  const timeGutterHeader = (
    <div
      style={{
        fontSize: "1rem",
        fontWeight: "bolder",
        paddingTop: 10,
      }}
    >
      UTC +7
    </div>
  );

  return (
    <div style={{ minHeight: 800 }}>
      <Calendar
        selectable
        views={{ month: true, week: true, day: true, agenda: true }}
        onSelectEvent={(event) => onSelectEvent && onSelectEvent(event)}
        onSelectSlot={({ start, end }) =>
          onSelectSlot && onSelectSlot(start, end)
        }
        localizer={localizer}
        events={events ? events : []}
        culture={i18n.languages[0]}
        defaultView={Views.WEEK}
        step={30}
        timeslots={1}
        showMultiDayTimes
        slotPropGetter={slotPropGetter ? slotPropGetter : defaultSlotPropGetter}
        style={{ height: 800 }}
        scrollToTime={init}
        eventPropGetter={eventPropGetter}
        components={{
          timeGutterHeader: () => timeGutterHeader,
          ...components,
        }}
        formats={formats}
        {...otherProps}
      />
    </div>
  );
}
