import React, { useEffect, useMemo, useState } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { inputTypes } from '../../common/constants';

const CustomTextField = props => {
  const { type, label, value, onChange, error, ...otherProps } = props;

  const TextFieldDefaultProps = useMemo(
    () => ({
      fullWidth: true,
      variant: 'outlined',
      size: 'small'
    }),
    [props]
  );

  const TextAreaProps = useMemo(
    () => ({
      multiline: type === inputTypes.TEXTAREA
    }),
    []
  );

  return (
    <TextField
      label={label}
      //value={value||''} cannot be used for type number
      value={type === 'number' ? value : value || ''}
      onChange={e => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      InputLabelProps={{ shrink: !!value }}
      {...TextFieldDefaultProps}
      {...otherProps}
      {...TextAreaProps}
    />
  );
};

export default React.memo(CustomTextField);

export const UncontrolledTextField = props => {
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
    <CustomTextField
      {...otherProps}
      value={_value}
      onChange={setValue}
      inputProps={{ onBlur }}
    />
  );
};

export const TextFieldWrap = props => {
  const { controlled, ...other } = props;

  if (controlled) {
    return <CustomTextField {...other} />;
  }
  return <UncontrolledTextField {...other} />;
};
