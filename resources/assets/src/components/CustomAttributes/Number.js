import React, { useEffect, useMemo, useState } from "react";
import TextField from "./TextField";
import InputMask from "react-input-mask";

const NumberField = (props) => {
  const { value, onChange, ...other } = props;

  return (
    <InputMask
      mask="99999999999999999"
      maskChar={""}
      value={value || ""}
      onChange={onChange}
    >
      {() => <TextField InputLabelProps={{ shrink: !!value }} {...other} />}
    </InputMask>
  );
};

export const UncontrolledNumberField = (props) => {
  const { value, onChange, ...otherProps } = props;

  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const onBlur = ({ target: { value } }) => {
    onChange(value);
    setValue(value);
  };

  return (
    <NumberField
      {...otherProps}
      value={_value}
      onChange={setValue}
      inputProps={{ onBlur }}
    />
  );
};

export const NumberFieldWrap = (props) => {
  const { controlled, ...other } = props;

  if (controlled) {
    return <NumberField {...other} />;
  }
  return <UncontrolledNumberField {...other} />;
};

export default React.memo(NumberField);
