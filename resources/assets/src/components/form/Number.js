import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

const Number = React.memo((props) => {
  const { type, label, value, handleChange, error, ...otherProps } = props;

  return (
    <TextField
      fullWidth
      label={label}
      value={value ? value : ""}
      onChange={(e) => handleChange(e.target.value)}
      error={!!error}
      helperText={error}
      {...otherProps}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />
  );
});
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      allowLeadingZeros
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default Number;
