import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FlatForms } from "../form/Form";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, CircularProgress } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Popover from "../popover";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import Button from "../../components/button/ButtonSolashi";
import { useTranslation } from "react-i18next";

const Filter = React.memo((props) => {
  const classes = useStyles();
  const { inputs, loading, handleChangeParams, initialParams } = props;
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
  const content = () => {
    return (
      <div className={classes.filter}>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonFilter}
            startIcon={<FilterListIcon />}
            onClick={formik.handleSubmit}
            disabled={loading}
            loading={loading}
          >
            {t("button.filter")}
          </Button>
          <Button
            className={classes.buttonReset}
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            disabled={loading}
            loading={loading}
          >
            {t("button.reset")}
          </Button>
        </div>

        <FlatForms formik={formik} inputs={inputs} />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Popover
        content={content()}
        children={
          <IconButton title={t("title.filter")}>
            <SearchIcon />
          </IconButton>
        }
      ></Popover>
    </React.Fragment>
  );
});
const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  filter: {
    width: 380,
    maxHeight: 550,
    padding: "15px 18px",
  },
  buttons: {
    display: "flex",
    marginBottom: 20,
  },
  buttonFilter: {
    color: "#fff",
  },
  buttonReset: {
    padding: "6px 16px",
    marginLeft: 10,
  },
}));
export default Filter;
