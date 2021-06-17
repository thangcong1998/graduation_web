import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PaperContainer from "../../../components/PaperContainer";
import moment from "moment";
import { UNIT } from "../../../common/constants";

export default function (props) {
    const formData = new FormData();
    const { t, i18n } = useTranslation();

    const formik = useFormik({
        initialValues: {
            event: null,
            country: null,
            taker_name: null,
            take_place: null,
            take_time: null,
            description: null,
            result_record: null,
            unit: null,
            sport: null,
            sport_discipline: null,
            is_seagame: 2,
        },
        onSubmit: async (values) => {
            try {
                formData.append(
                    "event_id",
                    values?.event ? values?.event?.id : ""
                );
                formData.append(
                    "country_id",
                    values?.country ? values?.country?.id : ""
                );
                formData.append("is_seagame", 2);
                formData.append(
                    "take_place",
                    values?.take_place ? values?.take_place : ""
                );
                formData.append(
                    "taker_name",
                    values?.taker_name ? values?.taker_name : ""
                );
                formData.append(
                    "take_time",
                    values?.take_time ? values?.take_time : ""
                );
                formData.append(
                    "description",
                    values?.description ? values?.description : ""
                );
                formData.append(
                    "result_record",
                    values?.result_record ? values?.result_record : ""
                );
                formData.append("unit", values?.unit ? values?.unit : "");
                formData.append("id", values?.id ? values?.id : "");
                params.id
                    ? formData.append("_method", "PUT")
                    : formData.append("_method", "POST");
                let res = await api.fetcher(
                    "post",
                    params.id
                        ? "admin/congressRecord/" + params.id
                        : "admin/congressRecord",
                    formData
                );
                if (res) {
                    history.push("/congressRecord");
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            event: Yup.object()
                .required(t("record_screen.event") + " " + t("errors.required"))
                .nullable(),
            sport_discipline: Yup.object()
                .required(
                    t("sport_screen.sport_discipline") +
                        " " +
                        t("errors.required")
                )
                .nullable(),
            sport: Yup.object()
                .required(t("sport_screen.sport") + " " + t("errors.required"))
                .nullable(),
            country: Yup.object()
                .required(
                    t("record_screen.country") + " " + t("errors.required")
                )
                .nullable(),
            taker_name: Yup.string()
                .required(
                    t("record_screen.taker_name") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("record_screen.taker_name") +
                        " " +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .nullable(),
            take_place: Yup.string()
                .required(
                    t("record_screen.take_place") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("record_screen.take_place") +
                        " " +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .nullable(),
            result_record: Yup.string()
                .required(
                    t("record_screen.result_record") +
                        " " +
                        t("errors.required")
                )
                .matches(
                    /^[0-9]+$/,
                    t("record_screen.result_record") + " " + t("errors.number")
                )
                .trim()
                .max(
                    10,
                    t("record_screen.result_record") +
                        " " +
                        t("errors.max.before") +
                        " 10 " +
                        t("errors.max.after")
                )
                .nullable(),
            unit: Yup.string()
                .required(t("record_screen.unit") + " " + t("errors.required"))
                .nullable(),
            take_time: Yup.date()
                .required(
                    t("record_screen.take_time") + " " + t("errors.required")
                )
                .max(
                    new Date(),
                    t("record_screen.take_time") +
                        " " +
                        t("errors.max_date_today")
                )
                .typeError(
                    t("record_screen.take_time") +
                        " " +
                        t("errors.invalid_format")
                )
                .nullable(),
            description: Yup.string()
                .max(
                    255,
                    t("record_screen.description") +
                        " " +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .nullable(),
        }),
    });

    const api = useAPI();
    const params = useParams();
    const history = useHistory();
    const { data: data } = useFetch([
        params?.id ? "get" : null,
        params?.id ? "admin/congressRecord/" + params.id : null,
    ]);

    useEffect(() => {
        if (data) {
            formik.setFieldValue("sport", data?.event.sport_discipline.sport);
            formik.setFieldValue(
                "sport_discipline",
                data?.event.sport_discipline
            );
            formik.setFieldValue("event", data?.event);
            formik.setFieldValue("country", data?.country);
            formik.setFieldValue("taker_name", data?.taker_name);
            formik.setFieldValue("take_place", data?.take_place);
            formik.setFieldValue("take_time", data?.take_time);
            formik.setFieldValue("result_record", data?.result_record);
            formik.setFieldValue("unit", data?.unit);
            formik.setFieldValue("description", data?.description);
            formik.setFieldValue("id", data?.id);
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
                    labelField:
                        i18n.languages[0] === "vi" ? "name" : "english_name",
                    queryField:
                        i18n.languages[0] === "vi"
                            ? "name_like"
                            : "english_name_like",
                    error:
                        api.error?.sport ||
                        (formik.touched.sport && formik.errors?.sport),
                    handleChange: (e) => {
                        formik.setFieldValue("sport", e);
                        formik.setFieldValue("sport_discipline", null);
                        formik.setFieldValue("event", null);
                    },
                    type: "autocomplete",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "sport_discipline",
                    label: i18n.t("sport_screen.sport_discipline") + " *",
                    value: formik.values?.sport_discipline,
                    endpoint: formik.values.sport
                        ? "/admin/sportDiscipline?sport_id_equal=" +
                          formik.values.sport.id
                        : null,
                    labelField:
                        i18n.languages[0] === "vi" ? "name" : "english_name",
                    queryField:
                        i18n.languages[0] === "vi"
                            ? "name_like"
                            : "english_name_like",
                    error:
                        api.error?.sport_discipline ||
                        (formik.touched.sport_discipline &&
                            formik.errors?.sport_discipline),
                    handleChange: (e) => {
                        formik.setFieldValue("sport_discipline", e);
                        formik.setFieldValue("event", null);
                    },
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
                    labelField:
                        i18n.languages[0] === "vi" ? "name" : "english_name",
                    queryField:
                        i18n.languages[0] === "vi"
                            ? "name_like"
                            : "english_name_like",
                    error:
                        api.error?.event_id ||
                        (formik.touched.event && formik.errors?.event),
                    handleChange: (e) => formik.setFieldValue("event", e),
                    type: "autocomplete",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "taker_name",
                    label: t("record_screen.taker_name") + " *",
                    value: formik.values?.taker_name,
                    error:
                        api.error?.taker_name ||
                        (formik.touched.taker_name &&
                            formik?.errors?.taker_name),
                    handleChange: (e) => formik.setFieldValue("taker_name", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "result_record",
                    label: t("record_screen.result_record") + " *",
                    value: formik.values?.result_record,
                    error:
                        api.error?.result_record ||
                        (formik.touched.result_record &&
                            formik?.errors?.result_record),
                    handleChange: (e) =>
                        formik.setFieldValue("result_record", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "unit",
                    label: t("record_screen.unit") + " *",
                    error:
                        formik.touched.unit && formik.errors.unit
                            ? formik.touched.unit && formik.errors.unit
                            : api.error?.unit,
                    value: formik.values?.unit,
                    handleChange: (e) => {
                        formik.setFieldValue("unit", e);
                    },
                    type: "select",
                    size: "medium",
                    options: [
                        {
                            label: t("record_screen.hour"),
                            value: UNIT.HOUR,
                        },
                        {
                            label: t("record_screen.minute"),
                            value: UNIT.MINUTE,
                        },
                        {
                            label: t("record_screen.seconds"),
                            value: UNIT.SECONDS,
                        },
                        {
                            label: t("record_screen.kilometer"),
                            value: UNIT.KILOMETER,
                        },
                        {
                            label: t("record_screen.meter"),
                            value: UNIT.METER,
                        },
                        {
                            label: t("record_screen.centimeter"),
                            value: UNIT.CENTIMETER,
                        },
                        {
                            label: t("record_screen.match"),
                            value: UNIT.MATCH,
                        },
                        {
                            label: t("record_screen.goal"),
                            value: UNIT.GOAL,
                        },
                        {
                            label: t("record_screen.point"),
                            value: UNIT.POINT,
                        },
                    ],
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },

                {
                    field: "country",
                    label: t("record_screen.country") + " *",
                    endpoint: "admin/country",
                    queryField: "name",
                    valueField: "id",
                    value: formik.values?.country,
                    error:
                        api.error?.country ||
                        (formik.touched.country && formik.errors?.country),
                    handleChange: (value) => {
                        formik.setFieldValue("country", value);
                    },
                    type: "autocomplete",
                    grid: { xs: 12, sm: 6, md: 6 },
                    size: "medium",
                },
                {
                    field: "take_time",
                    label: t("record_screen.take_time") + " *",
                    value: formik.values?.take_time,
                    maxDate: new Date(),
                    error:
                        api.error?.take_time ||
                        (formik.touched.take_time && formik.errors?.take_time),
                    handleChange: (e) =>
                        formik.setFieldValue(
                            "take_time",
                            moment(e).format("YYYY-MM-DD")
                        ),
                    type: "date",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "take_place",
                    label: t("record_screen.take_place") + " *",
                    value: formik.values?.take_place,
                    error:
                        api.error?.take_place ||
                        (formik.touched.take_place &&
                            formik?.errors?.take_place),
                    handleChange: (e) => formik.setFieldValue("take_place", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "description",
                    label: t("record_screen.description"),
                    value: formik.values?.description,
                    error:
                        api.error?.description ||
                        (formik.touched.description &&
                            formik?.errors?.description),
                    handleChange: (e) => formik.setFieldValue("description", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 12, md: 12 },
                },
            ],
        ],
        [formik]
    );

    return (
        <PaperContainer>
            <div style={{ padding: 15 }}>
                <Forms inputs={inputs} />
            </div>
            {params?.id ? (
                <Button
                    style={{ marginTop: 15 }}
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
                    style={{ marginTop: 15 }}
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
