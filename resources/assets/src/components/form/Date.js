import React, { Fragment, useState } from "react";
import { FormControl, FormHelperText, TextField } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
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
                <KeyboardDatePicker
                    className={
                        size === "small" &&
                        (otherProps.inputVariant === "standard"
                            ? classes.smallStandard
                            : classes.smallOutlined) +
                            " " +
                            `${error ? classes.errors : classes.normal}`
                    }
                    autoOk
                    variant={otherProps.variant ? otherProps.variant : "inline"}
                    inputVariant={
                        otherProps.inputVariant
                            ? otherProps.inputVariant
                            : "outlined"
                    }
                    label={label}
                    format={format ? format : "DD/MM/YYYY"}
                    value={value ? value : null}
                    InputAdornmentProps={{ position: "end" }}
                    onChange={(date) =>
                        handleChange(date?.format("YYYY/MM/DD"))
                    }
                    maxDate={otherProps.maxDate}
                    minDate={otherProps.minDate || minDate}
                    invalidDateMessage={
                        value === undefined && t("errors.invalid_date_format")
                    }
                    maxDateMessage={
                        t("errors.max_date") + " " + otherProps.maxDate
                    }
                    minDateMessage={
                        t("errors.min_date") +
                        " " +
                        (otherProps.minDate || minDate)
                    }
                    disablePast={!!otherProps.disablePast}
                    disableFuture={!!otherProps.disableFuture}
                    // TextFieldComponent={(TextFieldProps) => (
                    //   <TextField {...TextFieldProps} size={size} />
                    // )}
                />
                {/* <DatePicker
        className={error ? classes.errors : classes.normal}
        label={label}
        variant={otherProps.variant}
        inputVariant={otherProps.inputVariant}
        value={value}
        onChange={(e) => handleChange(e)}
        format="DD/MM/YYYY"
        TextFieldComponent={(TextFieldProps) => (
          <TextField {...TextFieldProps} size={size} />
        )}
        views={["date", "month", "year",]}
      /> */}
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
    smallOutlined: {
        "& input": {
            padding: "10.5px 14px",
        },
        "& label": {
            transform: "translate(14px, 12px) scale(1)",
        },
    },
    smallStandard: {
        "& input": {
            padding: "10.5px 0px",
        },
    },
}));
export default Date;
