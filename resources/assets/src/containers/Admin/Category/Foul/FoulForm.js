import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";

export default function (props) {
  const formData = new FormData();
  const { t, i18n } = useTranslation();
  const { perms } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      name: null,
      english_name: null,
      event: null,
      sport: null,
      sport_discipline: null,
      foul_type: 4,
      penalty: null,
    },
    onSubmit: async (values) => {
      formData.append("event_id", values?.event ? values?.event?.id : "");
      formData.append("name", values?.name ? values?.name : "");
      formData.append(
        "english_name",
        values?.english_name ? values?.english_name : ""
      );
      formData.append("foul_type", values?.foul_type ? values?.foul_type : "");
      formData.append("penalty", values?.penalty ? values?.penalty : "");
      params.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params.id ? "admin/foul/" + params.id : "admin/foul",
          formData
        );
        if (res) {
          history.push("/foul");
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      name: Yup.string()
        .required(t("foul_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("foul_screen.name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      english_name: Yup.string()
        .required(t("foul_screen.english_name") + " " + t("errors.required"))
        .max(
          255,
          t("foul_screen.english_name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      event: Yup.object()
        .required(t("record_screen.event") + " " + t("errors.required"))
        .nullable(),
      sport_discipline: Yup.object()
        .required(
          t("sport_screen.sport_discipline") + " " + t("errors.required")
        )
        .nullable(),
      sport: Yup.object()
        .required(t("sport_screen.sport") + " " + t("errors.required"))
        .nullable(),
      penalty: Yup.string()
        .when("foul_type", {
          is: (v) => v == 2 || v == 3,
          then: Yup.string()
            .required(t("foul_screen.penalty") + " " + t("errors.required"))
            .max(
              10,
              t("foul_screen.penalty") +
                " " +
                t("errors.max.before") +
                " 10 " +
                t("errors.max.after")
            )
            .nullable(),
          otherwise: null,
        })
        .nullable(),
    }),
  });
  const [files, setFiles] = useState();
  const api = useAPI();
  const params = useParams();
  const history = useHistory();
  const { data: data } = useFetch([
    params?.id ? "get" : null,
    params?.id ? "admin/foul/" + params.id : null,
  ]);
  useEffect(() => {
    if (data) {
      formik.setFieldValue("sport", data?.event.sport_discipline.sport);
      formik.setFieldValue("sport_discipline", data?.event.sport_discipline);
      formik.setFieldValue("event", data?.event);
      formik.setFieldValue("name", data?.name);
      formik.setFieldValue("english_name", data?.english_name);
      formik.setFieldValue("foul_type", data?.foul_type);
      formik.setFieldValue("penalty", data?.penalty);
    }
  }, [data]);

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
          field: "sport_discipline",
          label: i18n.t("sport_screen.sport_discipline") + " *",
          value: formik.values?.sport_discipline,
          endpoint: formik.values.sport
            ? "/admin/sportDiscipline?sport_id_equal=" + formik.values.sport.id
            : null,
          labelField: i18n.languages[0] === "vi" ? "name" : "english_name",
          queryField:
            i18n.languages[0] === "vi" ? "name_like" : "english_name_like",
          error:
            api.error?.sport_discipline ||
            (formik.touched.sport_discipline &&
              formik.errors?.sport_discipline),
          handleChange: (e) => formik.setFieldValue("sport_discipline", e),
          type: "autocomplete",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "event",
          label: t("record_screen.event") + " *",
          value: formik.values?.event,
          endpoint: formik.values.sport_discipline
            ? "/admin/sportDisciplineEvent?sport_discipline_id_equal=" +
              formik.values.sport_discipline.id
            : null,
          labelField: i18n.languages[0] === "vi" ? "name" : "english_name",
          queryField:
            i18n.languages[0] === "vi" ? "name_like" : "english_name_like",
          error:
            api.error?.event || (formik.touched.event && formik.errors?.event),
          handleChange: (e) => formik.setFieldValue("event", e),
          type: "autocomplete",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "name",
          label: t("foul_screen.name"),
          required: true,
          value: formik.values?.name,
          error:
            (formik.touched.name && formik.errors?.name) || api.error?.name,
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "english_name",
          label: t("foul_screen.english_name"),
          required: true,
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
          field: "foul_type",
          label: t("foul_screen.type"),
          required: true,
          value: formik.values?.foul_type,
          error:
            api.error?.foul_type ||
            (formik.touched.foul_type && formik.errors?.foul_type),
          handleChange: (e) => formik.setFieldValue("foul_type", e),
          type: "radio",
          options: [
            {
              label: t("foul_screen.cancel_result"),
              value: 1,
            },
            {
              label: t("foul_screen.minus_record"),
              value: 2,
            },
            {
              label: t("foul_screen.minus_score"),
              value: 3,
            },
            {
              label: t("foul_screen.save"),
              value: 4,
            },
          ],
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        (formik.values?.foul_type == 2 || formik.values?.foul_type == 3) && {
          field: "penalty",
          label: "Penalty",
          value: formik.values?.penalty,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("penalty", e);
          },
          inputVariant: "outlined",
          type: "number",
          grid: { xs: 12, sm: 12, md: 12 },
          error:
            api.error?.penalty ||
            (formik.touched.penalty && formik.errors?.penalty),
        },
      ],
    ],
    [formik]
  );
  return (
    <PaperContainer>
      <Forms inputs={inputs} />

      {params?.id ? (
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
    </PaperContainer>
  );
}
