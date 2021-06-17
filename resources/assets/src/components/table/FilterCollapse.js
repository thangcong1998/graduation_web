import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { FlatForms } from "../form/Form";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Popover from "../popover";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import Button from "../../components/button/ButtonSolashi";
import { useTranslation } from "react-i18next";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const FilterCollapse = React.memo((props) => {
  const classes = useStyles();
  const {
    inputs,
    loading,
    handleChangeParams,
    initialParams,
    handleChangeFilterFields,
    reset,
    setHide,
  } = props;
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) =>
      handleChangeParams((pre) => ({ ...pre, ...values, page: 1 })),
  });
  useEffect(() => {
    const formikKeys = Object.keys(formik.values);
    const inputKeys = inputs.map((input) => input.field);
    for (let key of formikKeys) {
      if (!inputKeys.includes(key)) formik.setFieldValue(key, null);
    }
  }, [inputs]);

  const handleReset = () => {
    formik.setValues({});
    handleChangeParams((pre) =>
      initialParams
        ? {
            ...initialParams,
            tab: pre?.tab,
          }
        : {
            per_page: pre?.per_page,
            page: 1,
            tab: pre?.tab,
          }
    );
  };

  const FieldCheck = useMemo(() => {
    return (
      <div className={classes.root}>
        <div style={{ marginBottom: 10 }}>
          <Button variant="contained" onClick={() => reset()}>
            {t("button.default")}
          </Button>
        </div>
        <Grid container>
          {inputs?.map((field, index) => (
            <Grid item xs={4} key={index}>
              <FormControlLabel
                key={index}
                value={field.display}
                control={<Checkbox color="primary" checked={field.display} />}
                label={field.label}
                onChange={(event) => {
                  formik.setFieldValue(field?.field, null);
                  handleChangeFilterFields(field);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }, [inputs]);

  const Content = useMemo(() => {
    return (
      <Paper elevation={1} className={classes.filter}>
        <FlatForms
          formik={formik}
          inputs={inputs.map((e) =>
            e.display == true ? e : { ...e, gridStyle: { display: "none" } }
          )}
        />
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFilter}
            startIcon={<SearchIcon />}
            onClick={formik.handleSubmit}
            disabled={loading}
            loading={loading}
          >
            {t("button.filter")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnMargin}
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            disabled={loading}
            loading={loading}
          >
            {t("button.reset")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnMargin}
            onClick={() => setHide((pre) => !pre)}
            startIcon={<VisibilityOffIcon />}
            disabled={loading}
            loading={loading}
          >
            {t("button.hide")}
          </Button>
          <Popover
            content={FieldCheck}
            children={
              <Button
                variant="contained"
                color="primary"
                className={classes.btnMargin}
                startIcon={<ViewColumnIcon />}
                disabled={loading}
                loading={loading}
              >
                {t("button.advance")}
              </Button>
            }
          ></Popover>
        </div>
      </Paper>
    );
  }, [formik, inputs]);

  return <React.Fragment>{Content}</React.Fragment>;
});
const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  filter: {
    // width: 380,
    border: "1px solid #000",
    maxHeight: 550,
    padding: "15px 18px",
  },
  buttons: {
    display: "flex",
  },
  buttonFilter: {
    color: "#fff",
  },
  btnMargin: {
    padding: "6px 16px",
    marginLeft: 10,
  },
  root: {
    width: 500,
    padding: 10,
  },
}));
export default FilterCollapse;
