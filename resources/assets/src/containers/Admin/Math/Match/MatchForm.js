import React from "react";
import { Paper, Button, Grid, TextField, Radio,
    Table, TableRow, TableHead, TableBody, TableContainer, TableCell } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import {useAPI} from "../../../../api/api";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import Autocomplete from "../../../../components/form/Autocomplete";
import * as Yup from "yup";

export default function MatchForm() {
    const {t, i18n} = useTranslation();
    const params = useParams();
    const history = useHistory();
    const api = useAPI();
    const formik = useFormik({
        initialValues: {
            sport_id: null,
            discipline_id: null,
            event_id: null,
            stage_id: null,
            name: null,
            competition_type: 1
        },

        onSubmit: async (values) => {
            let formData = new FormData();
            // formData.append("position", JSON.stringify(arrayData));
            formData.append("competition_type", values?.competition_type ? values?.competition_type : "");
            formData.append("venue_id", values?.event_id ? values?.event_id : "");
            formData.append("name", values?.name ? values?.name : "");
            formData.append("event_member", JSON.stringify(values?.event_id));
            formData.append("_method", "PUT");
            try {
                let res = await api.fetcher("post", "/admin/stage", formData);
                if (res) {
                    history.goBack();
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            event_id: Yup.string()
                .required(
                    t("sport_discipline_screen.event") + " " + t("errors.required")
                )
                .trim()
                .nullable(),
            discipline_id: Yup.string()
                .required(
                    t("sport_discipline_screen.sport_discipline") +
                    " " +
                    t("errors.required")
                )
                .trim()
                .nullable(),
            sport_id: Yup.string()
                .required(
                    t("sport_discipline_screen.sport") +
                    " " +
                    t("errors.required")
                )
                .trim()
                .nullable(),
            stage_id: Yup.string()
                .required(
                    t("match_screen.stage") +
                    " " +
                    t("errors.required")
                )
                .trim()
                .nullable(),
            name: Yup.string()
                .required(
                    t("stage_screen.name") +
                    " " +
                    t("errors.required")
                )
                .max(
                    255,
                    t("stage_screen.name") +
                    t("errors.max.before") +
                    " 255 " +
                    t("errors.max.after")
                )
                .trim()
                .nullable(),
        }),
    });
    return (
        <Paper style={{ padding: 20}}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={"admin/sport"}
                        queryField={
                            i18n.language == "vi" ? "name_like" : "english_name_like"
                        }
                        labelField={i18n.language == "vi" ? "name" : "english_name"}
                        valueField={"id"}
                        label={t("sport_discipline_screen.sport")}
                        value={formik.values?.sport_id}
                        handleChange={(e) => {
                            formik.setFieldValue("sport_id", e);
                            formik.setFieldValue("discipline_id", null);
                            formik.setFieldValue("event_id", null);
                        }}
                        error={
                            api.error?.sport_id ||
                            (formik.touched.sport_id && formik.errors?.sport_id)
                        }
                        helpText={
                            api.error?.team_id ||
                            (formik.touched.sport_id && formik.errors?.sport_id)
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={
                            formik.values?.sport_id
                                ? "admin/sportDiscipline?sport_id_equal=" +
                                formik.values?.sport_id?.id
                                : ""
                        }
                        queryField={
                            i18n.language == "vi" ? "name_like" : "english_name_like"
                        }
                        labelField={i18n.language == "vi" ? "name" : "english_name"}
                        valueField={"id"}
                        label={t("sport_discipline_screen.sport_discipline")}
                        value={formik.values?.discipline_id}
                        handleChange={(e) => {
                            formik.setFieldValue("discipline_id", e);
                            formik.setFieldValue("event_id", null);
                        }}
                        error={
                            api.error?.discipline_id ||
                            (formik.touched.discipline_id && formik.errors?.discipline_id)
                        }
                        helpText={
                            api.error?.team_id ||
                            (formik.touched.discipline_id && formik.errors?.discipline_id)
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={
                            formik.values?.discipline_id
                                ? "admin/sportDisciplineEvent?sport_discipline_id_equal=" +
                                formik.values?.discipline_id?.id
                                : ""
                        }
                        queryField={
                            i18n.language == "vi" ? "name_like" : "english_name_like"
                        }
                        labelField={i18n.language == "vi" ? "name" : "english_name"}
                        valueField={"id"}
                        label={t("sport_discipline_screen.event")}
                        value={formik.values?.event_id}
                        handleChange={(e) => formik.setFieldValue("event_id", e)}
                        error={
                            api.error?.event_id ||
                            (formik.touched.event_id && formik.errors?.event_id)
                        }
                        helpText={
                            api.error?.team_id ||
                            (formik.touched.event_id && formik.errors?.event_id)
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={
                            formik.values?.event_id
                                ? "admin/stage?event_id_equal=" +
                                formik.values?.event_id?.id
                                : ""
                        }
                        queryField={
                            "name_like"
                        }
                        labelField={"name"}
                        valueField={"id"}
                        label={t("match_screen.stage")}
                        value={formik.values?.stage_id}
                        handleChange={(e) => formik.setFieldValue("stage_id", e)}
                        error={
                            api.error?.stage_id ||
                            (formik.touched.stage_id && formik.errors?.stage_id)
                        }
                        helpText={
                            api.error?.stage_id ||
                            (formik.touched.stage_id && formik.errors?.stage_id)
                        }
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}
