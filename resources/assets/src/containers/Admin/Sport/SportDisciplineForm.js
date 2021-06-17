import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import i18n from "../../../i18n/i18n";
import ButtonAdd from "../../../components/button/ButtonAddSolashi";
import ButtonUpdate from "../../../components/button/ButtonUpdateSolashi";
import * as Yup from "yup";
import { adminPrefix } from "../../../routes/AdminRoutes";
import UploadOnePicture from "../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";

export default function (props) {
  const { sport, row, close, refetch } = props;
  const { t } = useTranslation();
  const api = useAPI();
  const history = useHistory();
  const [files, setFiles] = useState();
  const formik = useFormik({
    initialValues: {
      name: row ? row.name : null,
      english_name: row ? row.english_name : null,
      sport: row ? sport : null,
      icon: null,
      note: null,
      application_form: 1,
    },
    onSubmit: async (values) => {
      try {
        let formData = new FormData();
        formData.append(
          "english_name",
          formik.values?.english_name ? formik.values?.english_name : ""
        );
        formData.append("sport_id", values?.sport ? values.sport.id : "");
        formData.append("name", formik.values?.name ? formik.values?.name : "");
        formData.append("note", formik.values?.note ? formik.values?.note : "");
        formData.append("application_form", formik.values?.application_form);
        formData.append("files", files);
        formData.append(
          "sport_discipline_id",
          values?.sport_discipline_id ? values?.sport_discipline_id : ""
        );
        formData.append("_method", row ? "put" : "post");
        let res = await api.fetcher(
          "post",
          row ? "/admin/sportDiscipline/" + row.id : "/admin/sportDiscipline",
          formData
        );
        if (res) {
          close();
          refetch();
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(
          t("sport_screen.sport_discipline") + " " + t("errors.required")
        )
        .max(
          255,
          t("sport_screen.sport_discipline") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      english_name: Yup.string()
        .required(t("sport_screen.english_name") + " " + t("errors.required"))
        .max(
          255,
          t("sport_screen.english_name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      note: Yup.string()
        .required(t("sport_screen.note") + " " + t("errors.required"))
        .max(
          255,
          t("sport_screen.note") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      sport: Yup.object()
        .required(t("sport_screen.sport") + " " + t("errors.required"))
        .nullable(),
      icon:
        !files &&
        Yup.object()
          .required(t("sport_screen.icon") + " " + t("errors.required"))
          .nullable(),
    }),
  });
  useEffect(() => {
    if (files) {
      formik.setFieldValue("icon", true);
    }
  }, [files]);

  useEffect(() => {
    if (row) setFiles(row?.icon);
  }, []);

  useEffect(() => {
    if (row) {
      formik.setFieldValue("sport_discipline_id", row.id);
      formik.setFieldValue("note", row.note);
      formik.setFieldValue("application_form", row.application_form);
    }
  }, [row]);

  const inputs = useMemo(
    () => [
      [
        {
          field: "sport",
          label: i18n.t("sport_screen.sport") + " *",
          value: formik.values?.sport,
          endpoint: "/admin/sport",
          labelField: i18n.languages[0] === "vi" ? "name" : "english_name",
          queryField:
            i18n.languages[0] === "vi" ? "name_like" : "english_name_like",
          error:
            api.error?.sport || (formik.touched.sport && formik.errors?.sport),
          handleChange: (e) => formik.setFieldValue("sport", e),
          type: "autocomplete",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "name",
          label: i18n.t("sport_screen.sport_discipline") + " *",
          value: formik.values?.name,
          error:
            api.error?.name || (formik.touched.name && formik.errors?.name),
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "english_name",
          label: i18n.t("sport_screen.english_name") + " *",
          value: formik.values?.english_name,
          error:
            api.error?.english_name ||
            (formik.touched.english_name && formik.errors.english_name),
          handleChange: (e) => formik.setFieldValue("english_name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "note",
          label: i18n.t("sport_screen.note") + " *",
          value: formik.values?.note,
          error: api.error?.note || (formik.touched.note && formik.errors.note),
          handleChange: (e) => formik.setFieldValue("note", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "application_form",
          label: i18n.t("sport_screen.application_form"),
          value: formik.values?.application_form,
          error:
            api.error?.application_form ||
            (formik.touched.application_form &&
              formik.errors?.application_form),
          handleChange: (e) => formik.setFieldValue("application_form", e),
          type: "radio",
          options: [
            {
              label: t("sport_screen.team_sport"),
              value: 1,
            },
            {
              label: t("sport_screen.individual_sport"),
              value: 2,
            },
          ],
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik, api]
  );

  return (
    <div>
      <Forms inputs={inputs} />
      <UploadOnePicture
        files={files}
        setFiles={setFiles}
        title={i18n.t("upload.message")} // height={"100px"}
        // width={"100px"}
        error={api.errors?.icon || (formik.touched.icon && formik.errors.icon)}
      />
      {row?.id ? (
        <ButtonUpdate
          style={{ marginLeft: 10 }}
          variant="contained"
          loading={api.loading}
          // text={i18n.t("sport_screen.user")}
          onClick={formik.handleSubmit}
        />
      ) : (
        <ButtonAdd
          style={{ marginLeft: 10 }}
          variant="contained"
          loading={api.loading}
          text={i18n.t("sport_screen.sport_discipline")}
          onClick={formik.handleSubmit}
        />
      )}
    </div>
  );
}
