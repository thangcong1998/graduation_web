import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { FormHelperText } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const CheckBox = React.memo((props) => {
    const { label, value, error, handleChange, options, ...otherProps } = props;
    const { t } = useTranslation();
    const checked = (val) =>
        value ? value.map((e) => String(e))?.includes(String(val)) : false;
    return (
        <FormControl
            component="fieldset"
            error={!!error}
            {...otherProps.formControlProps}
        >
            <FormLabel component="legend" {...otherProps.formLabelProps}>
                {label}
            </FormLabel>
            <FormGroup
                style={{ marginTop: 15 }}
                aria-label="position"
                {...otherProps.formGroupProps}
            >
                {otherProps.empty ? (
                    <div
                        style={{
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        {t("title.empty_data")}
                    </div>
                ) : (
                    options?.map((e, index) => (
                        <FormControlLabel
                            {...otherProps.formControlLabelProps}
                            style={{
                                alignItems: "flex-start",
                                marginLeft: 0,
                            }}
                            key={index}
                            value={e.value}
                            control={
                                <Checkbox
                                    style={{ padding: 0 }}
                                    {...otherProps.checkboxProps}
                                    color="primary"
                                    checked={checked(e.value)}
                                />
                            }
                            label={
                                <span style={{ overflowWrap: "anywhere" }}>
                                    {e.label}
                                </span>
                            }
                            onChange={(event) => {
                                value
                                    ? value.includes(event.target.value) ||
                                      value.find(
                                          (element) => element == e.value
                                      )
                                        ? handleChange(
                                              value.filter(
                                                  (c) => c != event.target.value
                                              )
                                          )
                                        : handleChange([
                                              ...value,
                                              event.target.value,
                                          ])
                                    : handleChange([event.target.value]);
                            }}
                        />
                    ))
                )}
            </FormGroup>
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    );
});
export default CheckBox;
