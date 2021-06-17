import React, { useEffect, useState, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAPI } from "../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";

export default React.memo(props => {
    const {
        endpoint,
        queryField,
        valueField,
        labelField,
        value,
        handleChange,
        label,
        error,
        required,
        params,
        ...otherProps
    } = props;
    const [query, setQuery] = useState();
    const [res, setRes] = useState();
    const api = useAPI();
    const { t, i18n } = useTranslation();
    const [timeout, setTime] = useState(null);

    useEffect(() => {
        clearTimeout(timeout);
        setTime(
            setTimeout(() => {
                setRes(
                    endpoint
                        ? api.fetcher(
                              "get",
                              endpoint,
                              JSON.stringify({ ...query, ...params })
                          )
                        : null
                );
            }, 200)
        );
    }, [query, endpoint, params]);

    useEffect(() => {
        const _val = value ? { ...value } : null;
        if (_val) {
            if (handleChange) handleChange(_val);
        }
    }, [i18n.languages[0]]);

    const options = endpoint ? api?.data?.data || [] : [];

    return (
        <Autocomplete
            size={"small"}
            includeInputInList={true}
            openOnFocus={true}
            loading={api?.loading}
            loadingText={t("message.loading")}
            noOptionsText={t("message.not_found")}
            value={value || null}
            options={options}
            getOptionSelected={(o, v) => o?.id == v?.id}
            getOptionLabel={option =>
                option?.[labelField ? labelField : queryField]
            }
            renderOption={(option, state) => {
                return (
                    <div style={{ padding: 5 }}>
                        {option?.[labelField ? labelField : queryField]
                            ? option?.[labelField ? labelField : queryField]
                            : null}
                    </div>
                );
            }}
            onChange={(event, value, reason) => {
                handleChange(value);
            }}
            onClose={() => {
                setQuery();
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    variant={
                        otherProps.variant ? otherProps.variant : "outlined"
                    }
                    label={label}
                    onChange={event =>
                        setQuery({ [queryField]: event.target.value })
                    }
                    error={!!error}
                    required={required}
                    helperText={error}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {api?.loading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        )
                    }}
                />
            )}
            {...otherProps}
        />
    );
});
