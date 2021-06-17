import React, { useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

export default React.memo(props => {
  const { type, label, value, onChange, error, ...otherProps } = props;

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        value={value?.toString() || null}
        onChange={e => onChange(e.target.value)}
      >
        {otherProps.options.map((option, index) => (
          <FormControlLabel
            key={index}
            label={option.label}
            value={option.value}
            control={<Radio color="primary" />}
          />
        ))}
      </RadioGroup>
      <FormHelperText error={!!error}>{error}</FormHelperText>
    </FormControl>
  );
});
