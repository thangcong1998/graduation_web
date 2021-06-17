import React, { useState } from "react";
import { FormControl, FormHelperText, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/vi";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";

export function TimeInput(props) {
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
                <TimePicker
                    className={
                        size === "small" &&
                        classes.small +
                            " " +
                            `${error ? classes.errors : classes.normal}`
                    }
                    autoOk={false}
                    variant={otherProps.variant ? otherProps.variant : "dialog"}
                    inputVariant={
                        otherProps.inputVariant
                            ? otherProps.inputVariant
                            : "outlined"
                    }
                    ampm={false}
                    format={format ? format : "HH:mm"}
                    variant={otherProps.variant ? otherProps.variant : "inline"}
                    inputVariant={
                        otherProps.inputVariant
                            ? otherProps.inputVariant
                            : "outlined"
                    }
                    label={label}
                    value={value ? value : null}
                    InputAdornmentProps={{ position: "end" }}
                    onChange={(date) => handleChange(date)}
                    openTo="hours"
                />
            </MuiPickersUtilsProvider>
            <FormHelperText>{helperText ? helperText : error}</FormHelperText>
        </FormControl>
    );
}
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
export default TimeInput;
