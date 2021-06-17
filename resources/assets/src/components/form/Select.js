import React, { useEffect, useMemo, useState } from "react";
import { TextField, MenuItem, InputAdornment } from "@material-ui/core";
import { inputTypes } from "../../common/constants";
import LocationOnIcon from "@material-ui/icons/LocationOn";

export default React.memo((props) => {
  const { label, value, handleChange, error, readOnly, ...otherProps } = props;

  const TextFieldDefaultProps = useMemo(
    () => ({
      fullWidth: true,
      variant: "outlined",
      //   size: "small",
    }),
    []
  );

  const SelectProps = useMemo(
    () => ({
      select: true,
      defaultValue: otherProps?.defaultValue,
      children: otherProps.options?.map((option) => (
        <MenuItem
          disabled={option?.disabled}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </MenuItem>
      )),
    }),
    [props]
  );

  return (
    <TextField
      {...TextFieldDefaultProps}
      {...otherProps}
      {...SelectProps}
      label={label}
      value={value || ""}
      onChange={({ target: { value } }) => handleChange(value)}
      error={!!error}
      helperText={error}
      InputLabelProps={{ shrink: !!value }}
      readOnly={readOnly}
    />
  );
});
