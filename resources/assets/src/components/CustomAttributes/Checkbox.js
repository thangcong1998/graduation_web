import React, { useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

export default React.memo(props => {
  const { label, value, onChange, error, options } = props;

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <FormGroup row>
        <React.Fragment>
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={value?.includes(option.value) || false}
                  onChange={e =>
                    onChange(
                      e.target.checked
                        ? [...(value ? value : []), option.value]
                        : value.filter(item => item !== option.value)
                    )
                  }
                  name={label}
                  color="primary"
                />
              }
              label={option.label}
            />
          ))}
        </React.Fragment>
      </FormGroup>
    </FormControl>
  );
});
