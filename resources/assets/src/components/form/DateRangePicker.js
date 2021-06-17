import React, { Fragment, useEffect, useMemo, useState } from "react";
import { DateRangePicker } from "react-date-range";

import vi from "date-fns/locale/vi";
import en from "date-fns/locale/en-AU";
import TextInput from "./TextInput";
import * as moment from "moment";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import EventIcon from "@material-ui/icons/Event";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Popper from "../Popper";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import Collapse from "@material-ui/core/Collapse";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Popover from "../popover";
export default React.memo((props) => {
  const { label, value, variant, onChange, error, ...otherProps } = props;
  const { i18n } = useTranslation();

  const [close, setClose] = useState(false);
  const [date, setDate] = useState([new Date(), new Date()]);

  useEffect(() => {
    if (value === undefined) {
      setDate([new Date(), new Date()]);
    } else {
      setDate([new Date(value?.startDate), new Date(value?.endDate)]);
    }
  }, [value]);
  const handleSelect = (dateRange) => {
    if (dateRange?.length > 1) {
      setDate(dateRange);
      let startDate = moment(dateRange[0]).format("DD/MM/YYYY");
      let endDate = moment(dateRange[1]).format("DD/MM/YYYY");
      onChange({ startDate: dateRange[0], endDate: dateRange[1] });
      if (startDate !== endDate) {
        setClose(true);
      }
    }
  };

  const language = i18n?.languages[0];
  return (
    <Fragment>
      <Popover
        close={close}
        setClose={() => setClose(false)}
        content={
          <Paper>
            <Calendar
              onChange={handleSelect}
              value={date}
              allowPartialRange={true}
              selectRange={true}
              locale={language === "vi" ? "vi-VN" : "en-EU"}
            />
          </Paper>
        }
      >
        <TextInput
          margin={"none"}
          variant={variant}
          label={label}
          value={
            date && value?.startDate && value?.endDate
              ? moment(date[0]).format("DD/MM/YYYY") +
                " - " +
                moment(date[1]).format("DD/MM/YYYY")
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  // onMouseDown={handleMouseDownPassword}
                >
                  <EventIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Popover>
    </Fragment>
  );
});
