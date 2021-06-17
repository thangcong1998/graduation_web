import React, { Fragment, useState } from "react";
import { FormControl, FormHelperText, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/vi";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Date = React.memo((props) => {
  const {
    value,
    label,
    handleChange,
    error,
    helperText,
    size,
    format,
    disablePast,
    ...otherProps
  } = props;
  const classes = useStyle();
  const { t, i18n } = useTranslation();
  const lang = i18n.languages[0];
  const minDate = "1900/01/01";
  return (
    <FormControl
      error={!!error}
      style={{
        width: "100%",
      }}
      {...otherProps.formControlProps}
    >
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        locale={lang}
      >
        <KeyboardDateTimePicker
          className={
            size === "small" &&
            classes.small + " " + `${error ? classes.errors : classes.normal}`
          }
          autoOk
          variant={otherProps.variant ? otherProps.variant : "inline"}
          inputVariant={
            otherProps.inputVariant ? otherProps.inputVariant : "outlined"
          }
          ampm={false}
          label={label}
          format={format ? format : "DD/MM/YYYY HH:mm"}
          value={value}
          InputAdornmentProps={{ position: "end" }}
          onChange={(date) => handleChange(date)}
          maxDate={otherProps.maxDate}
          maxDateMessage={otherProps.maxDateMessage}
          minDate={otherProps.minDate || minDate}
          minDateMessage={otherProps.minDateMessage}
          invalidDateMessage={
            value === undefined && t("errors.invalid_date_format")
          }
          maxDateMessage={t("errors.max_date") + " " + otherProps.maxDate}
          minDateMessage={
            t("errors.min_date") + " " + (otherProps.minDate || minDate)
          }
          disablePast={disablePast}
        />
      </MuiPickersUtilsProvider>
      <FormHelperText>{helperText ? helperText : error}</FormHelperText>
    </FormControl>
  );
});

const useStyle = makeStyles((theme) => ({
  errors: {
    "& label": {
      color: "#f44336",
    },
    "& fieldset": {
      borderColor: "#f44336",
    },
  },
  small: {
    "& input": {
      padding: "10.5px 14px",
    },
    "& label": {
      transform: "translate(14px, 12px) scale(1)",
    },
  },
}));
export default Date;
