import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Chip } from "@material-ui/core";
import useDebouncedQuery from "./useDebouncedQuery";
import TextField from "./TextField";
import "./QuerySelect.css";

export default React.memo((props) => {
  const {
    endpoint,
    value,
    onChange,
    onChangeObj,
    labelField,
    valueField,
    queryField = props.labelField,
    renderOption,
    ...otherProps
  } = props;
  console.log({ valueField });
  //get around initial values array problem-----------------
  const [ownVals, setOwnVal] = useState([]);

  //------------------------------------------
  const [query, setQuery] = useState();
  const { items, loading } = useDebouncedQuery(endpoint, query, (items) => {
    setOwnVal([...ownVals, ...items]);
    setQuery();
  });

  const handleChange = (vals) => {
    setOwnVal(vals);
    onChange(vals.map((val) => val[valueField] || val));
  };

  useEffect(() => {
    if (!value) {
      setOwnVal([]);
    } else {
      setOwnVal(ownVals.filter((item) => value.includes(item[valueField])));
      //find missing values
      const set = value.filter(
        (val) =>
          !ownVals.find((ownVal) => (ownVal[valueField] || ownVal) === val)
      );
      console.log({ set });
      if (set.length > 0)
        //get request for missing values
        setQuery({ set });
    }
  }, [value]);

  //--------------------------------------------------------

  return (
    <Autocomplete
      filterOptions={(options) => options}
      openOnFocus
      multiple
      disableCloseOnSelect
      classes={{ paper: "query-select-menu" }}
      size="small"
      loading={loading}
      value={ownVals}
      onChange={(_, val, __) => handleChange(val)}
      options={items}
      renderOption={renderOption}
      getOptionLabel={(option) => option?.[labelField]}
      getOptionSelected={(opt, val) => opt?.[valueField] === val?.[valueField]}
      onClose={() => {
        setQuery();
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...otherProps}
            onChange={(value) => setQuery({ [queryField]: value })}
            InputLabelProps={{ shrink: !!value || query }}
          />
        );
      }}
      renderTags={(values, getTagProps) =>
        values.map((option, index) => (
          <Chip
            variant="outlined"
            label={option[labelField] || option}
            {...getTagProps({ index })}
          />
        ))
      }
      {...otherProps}
    />
  );
});
