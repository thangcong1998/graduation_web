import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import UploadOnePicture from "../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";
import Paper from "@material-ui/core/Paper";
import { useHistory, useParams } from "react-router-dom";
import ButtonSolashi from "../../../components/button/ButtonSolashi";

const Setting = React.memo((props) => {
  const formData = new FormData();
  const { t } = useTranslation();
  const history = useHistory();
  const { row, close, refetch } = props;
  const fetcher = useFetch(['get', 'admin/setting'], {
    onSuccess: res => formik.setValues(mapResData(res, inputs))
  });
  const res = fetcher.data;
  const api = useAPI();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      host:'',
      port:'',
        start_date: '',
        end_date: ''
    },
    onSubmit: async (values) => {

      try {
        await api.fetcher(
          "put",
          "admin/setting/"+res.id,
          values
        );
        if (res) {
          refetch();
          history.push("/setting")
        }
      } catch (e) {}
    },validationSchema: Yup.object().shape({
      // Validate form field

      email: Yup.string()
        .required(t("setting.email") + " " + t("errors.required"))
        .max(
          255,
          t("setting.email") +
          t("errors.max.before") +
          " 255 " +
          t("errors.max.after")
        )
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
          t("setting.email") + " " + t("errors.invalid_format")
        )
        .trim()
        .nullable(),
      password: Yup.string()
        .max(
          20,
          t("setting.password") + " "+
          t("errors.max.before") +
          " 20 " +
          t("errors.max.after")
        )

        .trim()
        .nullable(),
      host: Yup.string()
        .max(
          255,
          t("setting.host") +
          " " +
          t("errors.max.before") +
          " 255 " +
          t("errors.max.after")
        )
        .required(t("setting.host") + " " + t("errors.required"))
        .trim()
        .nullable(),
      port: Yup.string()
        .max(
          10,
          t("setting.port") +
          " " +
          t("errors.max.before") +
          " 10 " +
          t("errors.max.after")
        )
        .required(t("setting.port") + " " + t("errors.required"))
        .trim()
        .nullable(),
    }),
  });




  const inputs = useMemo(
    () => [
      [
        {
          field: "email",
          label: t("setting.email") + " *",
          value: formik.values?.email,
          error:
            (formik.touched.email && formik.errors?.email) || api.error?.email,
          handleChange: (e) => formik.setFieldValue("email", e),
          type: "text",
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          label: t("setting.password"),
          value: formik.values?.password,
          variant: "outlined",
          handleChange: (e) => formik.setFieldValue("password", e),
          error: formik?.errors?.password || api?.error?.password,
          type: "password",
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          field: "host",
          label: "Host" + " *",
          value: formik.values?.host,
          error:
            (formik.touched.host && formik.errors?.host) || api.error?.host,
          handleChange: (e) => formik.setFieldValue("host", e),
          type: "text",
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          field: "port",
          label: "Port" + " *",
          value: formik.values?.port,
          error:
            (formik.touched.port && formik.errors?.port) || api.error?.port,
          handleChange: (e) => formik.setFieldValue("port", e),
          type: "number",
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 12, md: 6 },
        },
          {
              field: "start_date",
              label: t("setting.start_date") + " *",
              value: formik.values?.start_date,
              error:
                  (formik.touched.start_date && formik.errors?.start_date) || api.error?.start_date,
              handleChange: (e) => formik.setFieldValue("start_date", e),
              type: "date",
              variant: "outlined",
              readOnly: false,
              grid: { xs: 12, sm: 12, md: 6 },
          },
          {
              field: "end_date",
              label: t("setting.end_date") + " *",
              value: formik.values?.end_date,
              error:
                  (formik.touched.end_date && formik.errors?.end_date) || api.error?.end_date,
              handleChange: (e) => formik.setFieldValue("end_date", e),
              type: "date",
              variant: "outlined",
              readOnly: false,
              grid: { xs: 12, sm: 12, md: 6 },
          },
      ],
    ],
    [formik]
  );
  return (
    <React.Fragment>
      <Paper style={{ padding: "5px 10px 10px 10px" }}>
        <Forms inputs={inputs} />
        <ButtonSolashi
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          loading={formik.isSubmitting}
          onClick={formik.handleSubmit}
        >
          {t("button.update")}
        </ButtonSolashi>
        {/*<Button*/}
        {/*  variant="contained"*/}
        {/*  color="primary"*/}
        {/*  size="large"*/}
        {/*  startIcon={<SaveIcon />}*/}
        {/*  onClick={formik.handleSubmit}*/}
        {/*  disableElevation*/}
        {/*>*/}
        {/*  {t("button.update")}*/}
        {/*</Button>*/}
      </Paper>

    </React.Fragment>
  );
});
function mapResData(data, forms) {
  const fields = forms
    .reduce((a, c) => [...a, ...c], [])
    .map(form => form.field);
  let result = {};
  Object.keys(data)
    .filter(key => fields.includes(key))
    .forEach(key => {
      result = Object.assign(result, { [key]: data[key] });
    });
  return result;
}
export default Setting;
