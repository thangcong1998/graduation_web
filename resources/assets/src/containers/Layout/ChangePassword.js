import React, { useMemo, useState } from "react";
import { useAPI } from "../../api/api";
import Forms from "../../components/form/Form";
import { useFormik } from "formik";
import { Button, makeStyles } from "@material-ui/core";
import * as Yup from "yup";
import loading from "../../assets/image/25.gif";
import {loadingStyle} from '../../common/constants';
import {useTranslation} from "react-i18next";

export default function (props) {
  const classes = useStyles();
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        const res = await api.fetcher("post", "changePassword", {
          old_password: values?.old_password,
          new_password: values?.new_password,
        });
        await props?.close();
      } catch (e) {
        formik.setErrors(e?.data?.errors);
      }
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      old_password: Yup.string().required(t("change_password_screen.old_password") + " " + t("errors.required"))
          .max(
              32,
              t("change_password_screen.old_password") +
              t("errors.max.before") +
              " 32 " +
              t("errors.max.after")
          )
      ,
      new_password: Yup.string()
        .required(t("change_password_screen.new_password") + " " + t("errors.required"))
          .max(
              32,
              t("change_password_screen.new_password") +
              t("errors.max.before") +
              " 32 " +
              t("errors.max.after")
          )
          .min(
              6,
              t("change_password_screen.new_password") +
              t("errors.min.before") +
              " 6 " +
              t("errors.min.after")
          )
          .trim()
      ,
      renew_password: Yup.string()
        .required(t("change_password_screen.renew_password") + " " + t("errors.required"))
          .max(
              32,
              t("change_password_screen.renew_password") +
              t("errors.max.before") +
              " 32 " +
              t("errors.max.after")
          )
        .oneOf([Yup.ref("new_password")], t("errors.renew_password")),
    }),
  });

  const inputs = useMemo(
    () => [
      [
        {
          label: t("change_password_screen.old_password"),
          value: formik.values?.old_password,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("old_password", e),
          type: "password",
          error: formik?.errors?.old_password,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: t("change_password_screen.new_password"),
          value: formik.values?.new_password,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("new_password", e),
          type: "password",
          error: formik?.errors?.new_password,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: t("change_password_screen.renew_password"),
          value: formik.values?.renew_password,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("renew_password", e),
          error: formik?.errors?.renew_password,
          type: "password",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  return (
    <div className={api.loading ? classes.loading : classes.action}>
      <Forms inputs={inputs} />
      <Button color="primary" onClick={formik.handleSubmit} variant={'contained'}>
        {t("button.update")}
      </Button>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle,
}));
