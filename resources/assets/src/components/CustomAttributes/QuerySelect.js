import React, { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import useDebouncedQuery from "./useDebouncedQuery";
import TextField from "./TextField";

import "./QuerySelect.css";
import { useTranslation } from "react-i18next";

export default React.memo((props) => {
  const {
    endpoint,
    value,
    onChange,
    onChangeObj,
    labelField,
    queryField = props?.queryField ? props.queryField : props.labelField,
    valueField,
    renderOption,
    inputProps,
    ...otherProps
  } = props;

  const [query, setQuery] = useState();
  const [ownVal, setOwnVal] = useState(null);
  const { t } = useTranslation();
  const { items, loading } = useDebouncedQuery(endpoint, query, (items) => {
    setOwnVal(items[0]);
    setQuery();
  });

  useEffect(() => {
    if (typeof value === "object") setOwnVal(value);
    else {
      if (!value) setOwnVal(null);
      if (value && value !== ownVal?.[valueField] && items.length > 0) {
        const checkInFetchedItems = items.find(
          (item) => item[valueField] === value
        );
        if (checkInFetchedItems) setOwnVal(checkInFetchedItems);
        else setQuery({ set: [value] });
      }
    }
  }, [value, ownVal, items]);

  return (
    <Autocomplete
      filterOptions={(arr) => arr}
      classes={{ paper: "query-select-menu" }}
      size="small"
      openOnFocus
      loading={loading}
      loadingText={t("message.loading")}
      noOptionsText={t("message.not_found")}
      renderInput={(params) => {
        return (
          <TextField
            onChange={(value) => setQuery({ [queryField]: value })}
            {...params}
            {...otherProps}
            InputLabelProps={{ shrink: !!value || query }}
            inputProps={{ ...params.inputProps, ...inputProps }}
          />
        );
      }}
      options={items}
      value={ownVal}
      renderOption={renderOption}
      getOptionLabel={(option) => option?.[labelField].toString()}
      onChange={(event, value, reason) => {
        if (onChangeObj) return onChangeObj(value);
        setOwnVal(value);
        onChange(value?.[valueField]);
      }}
      onClose={() => {
        setQuery();
      }}
      {...otherProps}
    />
  );
});
