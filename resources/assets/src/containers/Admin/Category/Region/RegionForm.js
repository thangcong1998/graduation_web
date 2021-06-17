import React, { useMemo, useEffect, useState, useContext } from "react";
import { Paper, Button } from "@material-ui/core";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { useFetch, useAPI } from "../../../../api/api";
import Moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import autocomplete from "../../../../components/form/Autocomplete";
// import loading from "../../../assets/image/25.gif";
import { loadingStyle } from "../../../../common/constants";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";
import SaveIcon from "@material-ui/icons/Save";

const AdministrativeDivisionForm = React.memo((props) => {
  const classes = useStyle();
  const { close, refetch } = props;
  const row = props?.row;
  const api = useAPI();
  const { perms } = useContext(AuthContext);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: row
      ? {
          level: row?.level,
          name: row?.name,
          parent: row?.parent,
          parentTop: row?.parent?.parent,
        }
      : {
          name: "",
          level: "",
          parent: "",
          parentTop: "",
        },
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          row ? "put" : "post",
          row ? "/admin/regions/" + row.id : "/admin/regions",
          {
            level: values?.level,
            name: values?.name,
            parent_id: values?.parent?.id,
            region_id: row?.id ? row?.id : "",
          }
        );
        if (res) {
          refetch();
          close();
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      name: Yup.string()
        .required(
          t("administrative_division_screen.name") + " " + t("errors.required")
        )
        .min(
          6,
          t("administrative_division_screen.name") +
            " " +
            t("errors.min.before") +
            " 6 " +
            t("errors.min.after")
        )
        .max(
          255,
          t("administrative_division_screen.name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      level: Yup.string()
        .required(
          t("administrative_division_screen.level") + " " + t("errors.required")
        )
        .nullable(),
      parent: Yup.object().when("level", {
        is: (v) => v != 1,
        then: Yup.object()
          .required(
            t("administrative_division_screen.district") +
              " " +
              t("errors.required")
          )
          .nullable(),
        otherwise: Yup.object().nullable(),
      }),
      parentTop: Yup.object().when("level", {
        is: (v) => v == 3,
        then: Yup.object()
          .required(
            t("administrative_division_screen.province") +
              " " +
              t("errors.required")
          )
          .nullable(),
        otherwise: Yup.object().nullable(),
      }),
    }),
  });
  const inputs = useMemo(
    () => [
      [
        {
          field: "level",
          label: t("administrative_division_screen.level"),
          inputVariant: "outlined",
          type: "select",
          options: [
            {
              label: t("administrative_division_screen.select_level"),
              value: "",
            },
            {
              label: t("administrative_division_screen.province"),
              value: "1",
            },
            {
              label: t("administrative_division_screen.district"),
              value: "2",
            },
            {
              label: t("administrative_division_screen.wards"),
              value: "3",
            },
          ],
          disabled: row?.id ? true : false,
          value: formik.values?.level,
          error: formik.errors?.level,
          handleChange: (value) => formik.setFieldValue("level", value),
          grid: { xs: 12, sm: 12, md: 12 },
        },
        formik.values?.level == 2
          ? {
              field: "parent",
              label: t("administrative_division_screen.province"),
              value: formik.values?.parent,
              error: formik.touched.parent && formik.errors?.parent,
              endpoint: "admin/regions" + "?" + "level=1" + "&&per_page=100",
              queryField: "name",
              valueField: "id",
              handleChange: (e) => {
                formik.setFieldValue("parent", e);
              },
              type: "autocomplete",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
        // edit
        formik.values?.level == 3 && row?.id !== undefined
          ? {
              field: "parentTop",
              label: t("administrative_division_screen.province"),
              value: formik.values?.parentTop,
              error: formik.touched.parentTop && formik.errors?.parentTop,
              endpoint: "admin/regions" + "?" + "level=1" + "&&per_page=100",
              queryField: "name",
              valueField: "id",
              handleChange: (e) => {
                formik.setFieldValue("parentTop", e);
                formik.setFieldValue("parent", null);
              },
              type: "autocomplete",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
        // add
        formik.values?.level == 3 && row?.id === undefined
          ? {
              field: "parentTop",
              label: t("administrative_division_screen.province"),
              value: formik.values?.parentTop,
              error: formik.touched.parentTop && formik.errors?.parentTop,
              endpoint: "admin/regions" + "?" + "level=1" + "&&per_page=100",
              queryField: "name",
              valueField: "id",
              handleChange: (e) => {
                formik.setFieldValue("parentTop", e);
                formik.setFieldValue("parent", null);
              },
              type: "autocomplete",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
        formik.values?.level == 3 && formik.values?.parentTop !== undefined
          ? {
              field: "parent",
              label: t("administrative_division_screen.district"),
              value: formik.values?.parent,
              error: formik.touched.parent && formik.errors?.parent,
              endpoint:
                "admin/regions" +
                "?" +
                "level=2" +
                "&&parent_id_equal=" +
                formik.values?.parentTop?.id +
                "&&per_page=100",
              queryField: "name",
              valueField: "id",
              handleChange: (e) => {
                formik.setFieldValue("parent", e);
              },
              type: "autocomplete",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
        formik.values?.level == 3 && formik.values?.parentTop === undefined
          ? {
              field: "parent",
              label: t("administrative_division_screen.district"),
              value: formik.values?.parent,
              error: formik.touched.parent && formik.errors?.parent,
              endpoint:
                "admin/regions" +
                "?" +
                "level=2" +
                "&&parent_id_equal=" +
                formik.values?.parent?.parent_id +
                "&&per_page=100",
              queryField: "name",
              valueField: "id",
              handleChange: (e) => {
                formik.setFieldValue("parent", e);
              },
              type: "autocomplete",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
        formik.values?.level
          ? {
              field: "name",
              label: t("administrative_division_screen.name"),
              value: formik.values?.name,
              error:
                (formik.touched.name && formik.errors?.name) || api.error?.name,
              handleChange: (e) => formik.setFieldValue("name", e),
              type: "text",
              variant: "outlined",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
      ],
    ],
    [formik]
  );

  return (
    <div elevation={5} className={api.loading ? classes.loading : classes.root}>
      {/* <h2>Thêm Đơn Vị Hành Chính</h2> */}
      <Forms inputs={inputs} />
      <div className={classes.action}>
          {checkPerm(perms, "region_edit") ?
              (
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={formik.handleSubmit}
                      className={classes.submitBtn}
                      disabled={api.loading}
                      startIcon={api.loading ? <CircularProgress /> : <SaveIcon />}
                  >
                      {row ? t("button.update") : t("button.add")}
                  </Button>
              ) : null}
      </div>
    </div>
  );
});
const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle,
}));
export default AdministrativeDivisionForm;
