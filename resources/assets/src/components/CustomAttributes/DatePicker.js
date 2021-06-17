import React, { useMemo } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { FormControl, FormHelperText } from "@material-ui/core";
import moment from "moment";

export default React.memo((props) => {
  const { label, value, onChange, variant, error, ...otherProps } = props;

  const isValid =
    moment(value, "DD/MM/YYYY").isValid() ||
    moment(value, "YYYY-MM-DD").isValid();
  const isNull = value === undefined || value === null || value === "";

  return (
    <MuiPickersUtilsProvider>
      <KeyboardDatePicker
        disableToolbar
        autoOk
        error={!!error || (!isValid && !isNull)}
        helperText={error || (!isValid && !isNull && "Ngày nhập sai định dạng")}
        fullWidth={true}
        variant="inline"
        inputVariant={variant || "outlined"}
        size="small"
        format="DD/MM/YYYY"
        id="date-picker-inline"
        label={label}
        value={value || null}
        onChange={(date) => onChange(date?.format("YYYY/MM/DD"))}
        invalidDateMessage="Ngày nhập sai"
        minDateMessage="Ngày nhập vượt giới hạn"
        maxDateMessage="Ngày nhập vượt giới hạn"
        {...otherProps}
      />
    </MuiPickersUtilsProvider>
  );
});
