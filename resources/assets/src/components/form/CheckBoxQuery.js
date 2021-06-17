import React, { useMemo } from "react";
import { useFetch } from "../../api/api";
import CheckBox from "./CheckBox";

const CheckboxQuery = React.memo((props) => {
  const { label, value, error, handleChange, ...otherProps } = props;
  const endpoint = otherProps.endpoint;
  const renderOption = otherProps.renderOption;
  const { data: data } = useFetch(["get", endpoint]);
  const options = useMemo(() => {
    if (data?.data) {
      return data?.data.map((e) =>
        renderOption ? renderOption(e) : { label: e.name, value: e.id }
      );
    }
    return [];
  }, [data, renderOption]);

  return (
    <CheckBox
      {...otherProps}
      label={label}
      value={value}
      handleChange={handleChange}
      options={options}
      error={error}
    />
  );
});

export default CheckboxQuery;
