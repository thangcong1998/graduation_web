import React, { useState, useContext, useEffect, useMemo } from "react";
import { Grid, ButtonGroup, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import Autocomplete from "../../../components/form/Autocomplete";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../../../api/api";
import * as Yup from "yup";
import TextInput from "../../../components/form/TextInput";
import { AuthContext } from "./../../AuthProvider";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Paper } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const useStyle = makeStyles((theme) => ({
  container: {
    padding: 10,
  },
  preview: {
    border: "1px solid #000",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  group: {
    marginBottom: 20,
  },
  note: {
    padding: 5,
    color: "#959191",
  },
  cardContainer: {
    border: "1px solid #000000",
    width: 300,
    height: 410,
    backgroundSize: "300px 410px",
  },
  leftFront: {
    width: 156.87,
  },
  avata: {
    width: 121.3,
    height: 161.5,
  },
  frontLogo: {
    height: 121.3,
  },
  frontMiddle: {
    fontSize: 15,
  },
  frontBottom: {},
  listIcon: {
    textAlign: "right",
  },
  icon: {
    height: 17,
    marginLeft: 3,
    border: "1px solid #000",
  },
  backAvata: {
    width: 60.5,
    height: 80.5,
    "& img": {
      width: 60.5,
      height: 80.5,
    },
  },
  backTop: {
    height: 89,
    paddingLeft: 17,
  },
  info: {
    width: 157.7,
    marginLeft: 5,
    fontSize: 9,
  },
  condition: {
    height: 37.5,
    fontSize: 7,
    borderBottom: "1px solid #CCC",
    borderTop: "1px solid #CCC",
    verticalAlign: "top",
    textAlign: "left",
    padding: "2px 1px",
    margin: "1px 5px",
  },
}));

export default function RegistrationMember(props) {
  const { row, close, refetch } = props;
  const { perms } = useContext(AuthContext);
  const classes = useStyle();
  const { t, i18n } = useTranslation();
  const api = useAPI();
  const { admin, user } = useContext(AuthContext);
  const history = useHistory();
  const params = useParams();
  const { data: data } = useFetch([
    params?.id ? "get" : null,
    params?.id ? "admin/functions_referee/" + params.id : null,
  ]);
  const formik = useFormik({
    initialValues: {
      name: data ? data?.name : null,
      english_name: data ? data?.english_name : null,
      event_id: data ? data?.event : null,
      sport: data ? data?.event?.sport_discipline.sport : null,
      sport_discipline: data ? data?.event?.sport_discipline : null,
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      try {
        formData.append("name", formik.values?.name ? formik.values?.name : "");
        formData.append(
          "english_name",
          formik.values.english_name ? formik.values.english_name : ""
        );
        formData.append(
          "event_id",
          formik.values.event_id?.id ? formik.values.event_id?.id : ""
        );
        formData.append("_method", params?.id ? "put" : "post");
        if (admin) {
          let res = await api.fetcher(
            "post",
            params?.id
              ? "/admin/functions_referee/" + params?.id
              : "/admin/functions_referee",
            formData
          );
          if (res) {
            history.goBack();
          }
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      name: Yup.string()
        .required(
          t("function_referee_screen.name") + " " + t("errors.required")
        )
        .trim()
        .nullable(),
      english_name: Yup.string()
        .required(
          t("function_referee_screen.english_name") + " " + t("errors.required")
        )
        .trim()
        .nullable(),
      event_id: Yup.object()
        .required(
          t("sport_discipline_screen.event") + " " + t("errors.required")
        )
        .nullable(),
      sport_discipline: Yup.object()
        .required(
          t("sport_discipline_screen.sport_discipline") +
            " " +
            t("errors.required")
        )
        .nullable(),
      sport: Yup.object()
        .required(
          t("sport_discipline_screen.sport") + " " + t("errors.required")
        )
        .nullable(),
    }),
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        name: data?.name,
        english_name: data?.english_name,
        event_id: data?.event,
        sport: data?.event?.sport_discipline.sport,
        sport_discipline: data?.event?.sport_discipline,
      });
    }
  }, [data]);

  return (
    <Paper className={classes.container}>
      <Grid className={classes.group}>
        <Grid
          container
          className={classes.group}
          direction="column"
          spacing={1}
        >
          <Grid item md={12} xs={12}>
            <TextInput
              required={true}
              variant={"outlined"}
              label={t("function_referee_screen.name")}
              value={formik.values?.name}
              handleChange={(e) => formik.setFieldValue("name", e)}
              error={
                api.error?.name || (formik.touched.name && formik.errors.name)
              }
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextInput
              required={true}
              variant={"outlined"}
              label={t("function_referee_screen.english_name")}
              value={formik.values?.english_name}
              handleChange={(e) => formik.setFieldValue("english_name", e)}
              error={
                api.error?.english_name ||
                (formik.touched.english_name && formik.errors.english_name)
              }
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <Autocomplete
              required={true}
              label={t("member_registration.sport")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages == "en" ? "english_name" : "name"}
              endpoint="/admin/sport"
              handleChange={(e) => {
                formik.setFieldValue("sport", e);
                formik.setFieldValue("sport_id", e?.id);
                if (formik.values?.sport_discipline) {
                  formik.setFieldValue("sport_discipline", null);
                  formik.setFieldValue("sport_discipline_id", null);
                }
              }}
              value={formik.values.sport}
              error={
                api.error?.sport_id ||
                (formik.touched.sport && formik.errors.sport)
              }
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Autocomplete
              required={true}
              disabled={!formik.values?.sport}
              label={t("member_registration.sport_discipline")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] === "en" ? "english_name" : "name"}
              endpoint={
                "/admin/sportDiscipline?sport_id_equal=" +
                formik.values?.sport?.id
              }
              handleChange={(e) => {
                formik.setFieldValue("sport_discipline", e);
                if (e == null) {
                  formik.setFieldValue("sport_discipline_id", null);
                  formik.setFieldValue("sport_discipline_event", null);
                }
              }}
              value={formik.values?.sport_discipline}
              error={
                api.error?.sport_discipline_id ||
                (formik.touched.sport_discipline &&
                  formik.errors.sport_discipline)
              }
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Autocomplete
              required={true}
              disabled={!formik.values?.sport_discipline}
              label={t("function_referee_screen.event")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] === "en" ? "english_name" : "name"}
              endpoint={
                "/admin/sportDisciplineEvent?sport_discipline_id_equal=" +
                formik.values?.sport_discipline?.id
              }
              handleChange={(e) => {
                formik.setFieldValue("event_id", e);
                if (e == null) {
                  formik.setFieldValue("sport_discipline_event_id", null);
                }
              }}
              value={formik.values?.event_id}
              error={
                api.error?.sport_discipline_event_id ||
                (formik.touched.event_id && formik.errors.event_id)
              }
            />
          </Grid>
        </Grid>
      </Grid>

      <ButtonGroup>
        {!params?.id ? (
          <Button
            onClick={formik.handleSubmit}
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            size="large"
          >
            {t("referee_screen.save")}
          </Button>
        ) : (
          <Button
            onClick={formik.handleSubmit}
            variant="contained"
            color="primary"
            size="large"
          >
            {t("referee_screen.update")}
          </Button>
        )}
      </ButtonGroup>
    </Paper>
  );
}
