import React from "react";
import MultiSelect from "./MultiSelect";

export default function (props) {
  const {
    endpoint,
    queryField,
    labelField,
    value,
    handleChange,
    label,
    error,
    renderOption,
    valueField,
    ...otherProps
  } = props;

  const option = (option, stage) => {
    return (
      <div style={{ padding: 5 }}>
        <div>{option?.name}</div>
        <div>{option?.identification}</div>
      </div>
    );
  };

  return (
    <MultiSelect
      endpoint={endpoint ? endpoint : "/admin/staff"}
      queryField={queryField}
      labelField={labelField}
      valueField={valueField}
      value={value}
      handleChange={handleChange}
      label={label}
      error={error}
      renderOption={option}
      {...otherProps}
    />
  );
}
