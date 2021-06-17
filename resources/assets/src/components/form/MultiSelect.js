import React, { useEffect, useState, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAPI, useFetch } from "../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";

export default React.memo((props) => {
  const {
    endpoint,
    queryField,
    valueField,
    labelField,
    value,
    handleChange,
    label,
    error,
    renderOption,
    ...otherProps
  } = props;

  const [query, setQuery] = useState();
  //   const [options, setOptions] = useState();
  const api = useAPI();
  const { t } = useTranslation();
  //   const [timeout, setTime] = useState(null);
  const [ownVal, setOwnVal] = useState([]);
  const [init, setInit] = useState(true);
  let { data: data, revalidate: revalidate } = useFetch(
    ["get", endpoint, JSON.stringify(query)],
    {
      initialData: [],
    }
  );
  useEffect(() => {
    let timeout = setTimeout(async () => {
      if (init && api?.data?.data?.length > 0) return;
      revalidate();
      setInit(false);
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [query, endpoint]);
  const options = data?.data || [];

  useEffect(() => {
    setOwnVal(ownVal?.filter((item) => value.includes(item[valueField])));
  }, [value]);
  useEffect(() => {
    if (!value) {
      setOwnVal([]);
    } else {
      setOwnVal(ownVal.filter((item) => value.includes(item[valueField])));
      //find missing values
      const set = value.filter(
        (val) =>
          !ownVal.find((ownVal) => (ownVal[valueField] || ownVal) === val)
      );
      console.log({ set });
      if (set.length > 0)
        //get request for missing values
        setQuery({ set });
    }
  }, [value]);

  return (
    <Autocomplete
      size={"small"}
      includeInputInList={true}
      openOnFocus={true}
      multiple
      disableCloseOnSelect
      loading={api?.loading}
      loadingText={t("message.loading")}
      noOptionsText={t("message.not_found")}
      value={ownVal || []}
      options={options || []}
      getOptionLabel={(option) => option?.[labelField]}
      getOptionSelected={(opt, val) => opt?.[valueField] === val?.[valueField]}
      renderOption={
        renderOption
          ? renderOption
          : (option, state) => {
              return <div style={{ padding: 5 }}>{option?.[labelField]}</div>;
            }
      }
      onChange={(event, value, reason) => {
        handleChange(value.map((val) => val[valueField] || val));
        setOwnVal(value);
      }}
      onClose={() => {
        setQuery();
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={otherProps.variant ? otherProps.variant : "outlined"}
          label={label}
          onChange={(event) => setQuery({ [queryField]: event.target.value })}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {api?.loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      {...otherProps}
    />
  );
});
