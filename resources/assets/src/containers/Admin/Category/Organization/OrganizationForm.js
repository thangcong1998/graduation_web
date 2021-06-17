import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import UploadOnePicture from "../../../../components/UploadOnePicture";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";

export default function (props) {
  const formData = new FormData();
  const { t } = useTranslation();
  const { perms } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      name: null,
      english_name: null,
      abbreviation: null,
      is_holder: 1,
    },
    onSubmit: async (values) => {
      formData.append("name", values?.name ? values?.name : "");
      formData.append(
        "english_name",
        values?.english_name ? values?.english_name : ""
      );
      formData.append(
        "abbreviation",
        values?.abbreviation ? values?.abbreviation : ""
      );
      formData.append(
        "organization_id",
        values?.organization_id ? values?.organization_id : ""
      );
      formData.append("is_holder", values?.is_holder ? values?.is_holder : "");
      params.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params.id ? "admin/organization/" + params.id : "admin/organization",
          formData
        );
        if (res) {
          history.push("/organization");
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      english_name: Yup.string()
        .required(
          t("organization_screen.english_name") + " " + t("errors.required")
        )
        .max(
          255,
          t("organization_screen.english_name") +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      name: Yup.string()
        .required(t("organization_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("organization_screen.name") +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      abbreviation: Yup.string()
        .required(
          t("organization_screen.abbreviation") + " " + t("errors.required")
        )
        .max(
          6,
          t("organization_screen.abbreviation") +
            t("errors.max.before") +
            " 6 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
    }),
  });
  const api = useAPI();
  const params = useParams();
  const history = useHistory();
  const { data: data } = useFetch([
    params?.id ? "get" : null,
    params?.id ? "admin/organization/" + params.id : null,
  ]);
  useEffect(() => {
    if (data) {
      inputs[0]
        .filter((e) => e.field)
        .forEach((e, index) => {
          formik.setFieldValue(e.field, data?.[e.field]);
        });
      formik.setFieldValue("organization_id", data.id);
    }
  }, [data]);
  const inputs = useMemo(
    () => [
      [
        {
          field: "name",
          label: t("organization_screen.name") + " *",
          value: formik.values?.name,
          error:
            api.error?.name || (formik.touched.name && formik.errors?.name),
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "english_name",
          label: t("organization_screen.english_name") + " *",
          value: formik.values?.english_name,
          error:
            api.error?.english_name ||
            (formik.touched.english_name && formik.errors?.english_name),
          handleChange: (e) => formik.setFieldValue("english_name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "abbreviation",
          label: t("organization_screen.abbreviation") + " *",
          value: formik.values?.abbreviation,
          error:
            api.error?.abbreviation ||
            (formik.touched.abbreviation && formik.errors?.abbreviation),
          handleChange: (e) => formik.setFieldValue("abbreviation", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 3 },
        },
        {
          field: "is_holder",
          label: t("organization_screen.is_holder"),
          value: formik.values?.is_holder === 1 ? false : true,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("is_holder", e === true ? 2 : 1);
          },
          inputVariant: "outlined",
          type: "switch",
          grid: { xs: 12, sm: 6, md: 3 },
          error:
            api.error?.is_holder ||
            (formik.touched.is_holder && formik.errors?.is_holder),
        },
      ],
    ],
    [formik]
  );
  return (
    <div>
      <Forms inputs={inputs} />
      {params?.id ? (
        checkPerm(perms, "organization_edit") ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={null}
            onClick={formik.handleSubmit}
            disableElevation
          >
            {t("button.update")}
          </Button>
        ) : (
          <div></div>
        )
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={formik.handleSubmit}
          disableElevation
        >
          {t("button.add")}
        </Button>
      )}
    </div>
  );
}
