import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

const Radios = React.memo((props) => {
  const {
    label,
    value,
    error,
    handleChange,
    options,
    flexDirection,
    ...otherProps
  } = props;
  return (
    <FormControl
      component="fieldset"
      error={!!error}
      {...otherProps.formControlProps}
    >
      <FormLabel
        component="legend"
        {...otherProps.formLabelProps}
        required={otherProps.required}
      >
        {label}
      </FormLabel>
      <RadioGroup
        name="position"
        //if want row => style {flexDirection: "row"}
        // {...otherProps.radioGroupProps}
        style={{ flexDirection: flexDirection ? flexDirection : "row" }}
      >
        {options.map(
          (e, index) =>
            !e?.hide && (
              <FormControlLabel
                key={e.label}
                value={e.value}
                control={
                  <Radio
                    color="primary"
                    {...otherProps.radioProps}
                    disabled={e?.disabled}
                    checked={
                      e.value == "" || e.value == null
                        ? value == "" || value == undefined
                        : e.value == value
                    }
                  />
                }
                label={e.label}
                onChange={(e) => handleChange(e.target.value)}
                {...otherProps.formControlLabelProps}
              />
            )
        )}
      </RadioGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
});

export default Radios;
