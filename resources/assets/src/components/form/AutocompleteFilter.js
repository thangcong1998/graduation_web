import React, { useEffect, useState, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFetch } from "../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";

export default React.memo(props => {
    const {
        endpoint,
        queryField,
        labelField,
        valueField,
        value,
        handleChange,
        label,
        params,
        ...otherProps
    } = props;
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState();
    const [ownVal, setOwnVal] = useState(null);
    const { data: val } = useFetch(value && ["get", endpoint + "/" + value]);
    useEffect(() => {
        if (val) {
            if (endpoint.includes("role")) {
                setOwnVal(val.role);
            } else {
                setOwnVal(val);
            }
        }
    }, []);
    useEffect(() => {
        if (value === undefined) {
            setOwnVal(null);
        }
    }, [value]);
    const { data: data, loading: loading } = useFetch(
        endpoint && ["get", endpoint, JSON.stringify({ ...query, ...params })]
    );
    const display = otherProps?.display;
    useEffect(() => {
        setOwnVal(null);
    }, [display]);
    useEffect(() => {
        const _val = ownVal ? { ...ownVal } : null;
        setOwnVal(_val);
    }, [i18n.languages[0]]);
    const options = data?.data || [];
    return (
        <Autocomplete
            size={"small"}
            includeInputInList={true}
            openOnFocus={true}
            loading={loading}
            loadingText={t("message.loading")}
            noOptionsText={t("message.not_found")}
            value={ownVal}
            options={options}
            getOptionSelected={(o, v) => o?.id == v?.id}
            getOptionLabel={option => option?.[labelField]}
            renderOption={(option, state) => {
                return <div style={{ padding: 5 }}>{option?.[labelField]}</div>;
            }}
            onChange={(event, value, reason) => {
                if (!value) {
                    handleChange(value);
                    setOwnVal(value);
                } else {
                    handleChange(value?.[valueField]);
                    setOwnVal(value);
                }
            }}
            onClose={() => {
                setQuery();
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    variant={otherProps?.variant}
                    label={label}
                    onChange={event =>
                        setQuery({ [queryField]: event.target.value })
                    }
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? (
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
        />
    );
});
