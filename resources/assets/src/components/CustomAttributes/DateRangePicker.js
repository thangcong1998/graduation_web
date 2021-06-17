import React, { Fragment, useEffect, useMemo, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import vi from "date-fns/locale/vi";
import TextField from "./TextField";
import * as moment from "moment";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import EventIcon from "@material-ui/icons/Event";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Popper from "./Popper";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
export default React.memo((props) => {
  const { label, value, variant, onChange, error, ...otherProps } = props;

  const [close, setClose] = useState(() => null);

  const handleSelect = (ranges) => {
    let startDate = ranges.selection.startDate.toLocaleDateString();
    let endDate = ranges.selection.endDate.toLocaleDateString();
    onChange({ startDate, endDate });
    if (startDate !== endDate) {
      close();
    }
  };

  const selectionRange = {
    startDate: value?.startDate ? new Date(value?.startDate) : new Date(),
    endDate: value?.endDate ? new Date(value?.endDate) : new Date(),
    key: "selection",
  };

  return (
    <Fragment>
      <Popper
        setClose={setClose}
        content={
          <Paper>
            <DateRangePicker
              {...otherProps}
              locale={vi}
              ranges={[selectionRange]}
              onChange={handleSelect}
              staticRanges={[]}
              inputRanges={[]}
              startDatePlaceholder="Ngày bắt đầu"
              endDatePlaceholder="Ngày kết thúc"
              showDateDisplay={false}
            />
          </Paper>
        }
      >
        <TextField
          margin={"none"}
          variant={variant}
          label="Chọn ngày"
          value={
            value
              ? moment(value?.startDate).format("DD/MM/YYYY") +
                "-" +
                moment(value?.endDate).format("DD/MM/YYYY")
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
      </Popper>
    </Fragment>
  );
});
