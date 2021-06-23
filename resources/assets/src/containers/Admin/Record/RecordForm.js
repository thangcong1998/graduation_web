import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import {Button, InputAdornment, TextField} from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PaperContainer from "../../../components/PaperContainer";
import moment from "moment";
import { UNIT } from "../../../common/constants";
import {MuiPickersUtilsProvider, TimePicker, DateTimePicker, KeyboardTimePicker} from "@material-ui/pickers";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";
import TimeFnsUtils from "@date-io/date-fns";
import MomentUtils from '@date-io/moment';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import InputMask from "react-input-mask";

export default function (props) {
    const formData = new FormData();
    const { t, i18n } = useTranslation();
    const [time, setTime] = useState(new Date());

    const formik = useFormik({
        initialValues: {
            event: null,
            country: null,
            is_asiad: 1,
            is_olympic: 1,
            taker_name: null,
            take_place: null,
            take_time: null,
            description: null,
            result_record: 0,
            result_record_time: null,
            unit: null,
            sport: null,
            sport_discipline: null,
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
                formData.append(
                    "is_graduation",
                    values?.is_graduation ? values?.is_graduation : ""
                );
                formData.append(
                    "is_graduation_31",
                    values?.is_graduation_31 ? values?.is_graduation_31 : ""
                );
                formData.append(
                    "is_asiad",
                    values?.is_asiad ? values?.is_asiad : ""
                );
                formData.append(
                    "is_olympic",
                    values?.is_olympic ? values?.is_olympic : ""
                );
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
                formData.append("result_record_time", values?.result_record_time ? values?.result_record_time : "");
                formData.append("unit", values?.unit ? values?.unit : "");
                formData.append("id", values?.id ? values?.id : "");
                params.id
                    ? formData.append("_method", "PUT")
                    : formData.append("_method", "POST");
                let res = await api.fetcher(
                    "post",
                    params.id ? "admin/record/" + params.id : "admin/record",
                    formData
                );
                if (res) {
                    history.push("/record");
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
            unit: Yup.string()
                .required(t("record_screen.unit") + " " + t("errors.required"))
                .nullable(),
            // result_record: Yup.string()
            //     .required(
            //         t("record_screen.result_record") +
            //             " " +
            //             t("errors.required")
            //     )
            //     .matches(
            //         /^[0-9]+$/,
            //         t("record_screen.result_record") + " " + t("errors.number")
            //     )
            //     .trim()
            //     .max(
            //         10,
            //         t("record_screen.result_record") +
            //             " " +
            //             t("errors.max.before") +
            //             " 10 " +
            //             t("errors.max.after")
            //     )
            //     .nullable(),
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
        params?.id ? "admin/record/" + params.id : null,
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
            formik.setFieldValue("is_graduation", data?.is_graduation);
            formik.setFieldValue("is_graduation_31", data?.is_graduation_31);
            formik.setFieldValue("is_asiad", data?.is_asiad);
            formik.setFieldValue("is_olympic", data?.is_olympic);
            formik.setFieldValue("taker_name", data?.taker_name);
            formik.setFieldValue("take_place", data?.take_place);
            formik.setFieldValue("take_time", data?.take_time);
            formik.setFieldValue("result_record", data?.result_record);
            formik.setFieldValue("result_record_time", data?.result_record_time);
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
                    endpoint: formik.values?.sport
                        ? "/admin/sportDiscipline?sport_id_equal=" +
                          formik.values?.sport?.id
                        : "",
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
                    endpoint: formik.values?.sport_discipline
                        ? "/admin/sportDisciplineEvent?sport_discipline_id_equal=" +
                          formik.values?.sport_discipline?.id
                        : "",
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
                formik.values.unit != UNIT.TIME && {
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
                formik.values?.unit == UNIT.TIME && {
                    // field: "result_record_time",
                    // label: t("record_screen.result_record_time") + "*",
                    // value: formik.values?.result_record_time,
                    // error: api.error?.result_record_time || (formik.touched.result_record_time && formik.errors.result_record_time),
                    // handleChange: (e) =>
                    //     changeTimeRecord(e),
                    // type: "text",
                    // variant: "outlined",
                    // readOnly: false,
                    component: () => {
                        return (
                            <InputMask
                                mask="999:99:99.999"
                                value={formik.values?.result_record_time}
                                onChange={(e) => formik.setFieldValue("result_record_time",e.target.value)}
                                disabled={false}
                                maskChar="_"
                            >
                                {() => <TextField variant={"outlined"} size={"small"} fullWidth label={t("record_screen.result_record_time") + "*"} />}
                            </InputMask>
                        )
                    },
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
                        // {
                        //     label: t("record_screen.hour"),
                        //     value: UNIT.HOUR,
                        // },
                        // {
                        //     label: t("record_screen.minute"),
                        //     value: UNIT.MINUTE,
                        // },
                        // {
                        //     label: t("record_screen.seconds"),
                        //     value: UNIT.SECONDS,
                        // },
                        {
                            label: t("record_screen.time"),
                            value: UNIT.TIME
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
                            label: "Kilogram",
                            value: UNIT.KILOGRAM,
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
                    field: "is_graduation",
                    label: t("record_screen.is_graduation"),
                    value: formik.values?.is_graduation == 2 ? true : false,
                    required: true,
                    handleChange: (e) => {
                        formik.setFieldValue("is_graduation", e == true ? 2 : 1);
                        if (e === true) {
                            formik.setFieldValue("is_asiad", 1) &&
                            formik.setFieldValue("is_olympic", 1) &&
                            formik.setFieldValue("is_graduation_31", 1);
                        }
                    },
                    inputVariant: "outlined",
                    type: "switch",
                    grid: { xs: 12, sm: 3, md: 3 },
                    error:
                        api.error?.is_graduation ||
                        (formik.touched.is_graduation &&
                            formik.errors?.is_graduation),
                },
                {
                    field: "is_graduation_31",
                    label: t("record_screen.is_graduation_31"),
                    value: formik.values?.is_graduation_31 == 2 ? true : false,
                    required: true,
                    handleChange: (e) => {
                        formik.setFieldValue("is_graduation_31", e == true ? 2 : 1);
                        if (e === true) {
                            formik.setFieldValue("is_asiad", 1) &&
                            formik.setFieldValue("is_olympic", 1) &&
                            formik.setFieldValue("is_graduation", 1);
                        }
                    },
                    inputVariant: "outlined",
                    type: "switch",
                    grid: { xs: 12, sm: 3, md: 3 },
                    error:
                        api.error?.is_graduation_31 ||
                        (formik.touched.is_graduation_31 &&
                            formik.errors?.is_graduation_31),
                },
                {
                    field: "is_asiad",
                    label: t("record_screen.is_asiad"),
                    value: formik.values?.is_asiad == 2 ? true : false,
                    required: true,
                    handleChange: (e) => {
                        formik.setFieldValue("is_asiad", e == true ? 2 : 1);
                        if (e === true) {
                            formik.setFieldValue("is_graduation", 1) &&
                            formik.setFieldValue("is_olympic", 1)&&
                            formik.setFieldValue("is_graduation_31", 1);
                        }
                    },
                    inputVariant: "outlined",
                    type: "switch",
                    grid: { xs: 12, sm: 3, md: 3 },
                    error:
                        api.error?.is_asiad ||
                        (formik.touched.is_asiad && formik.errors?.is_asiad),
                },
                {
                    field: "is_olympic",
                    label: t("record_screen.is_olympic"),
                    value: formik.values?.is_olympic == 2 ? true : false,
                    required: true,
                    handleChange: (e) => {
                        formik.setFieldValue("is_olympic", e == true ? 2 : 1);
                        if (e === true) {
                            formik.setFieldValue("is_asiad", 1) &&
                            formik.setFieldValue("is_graduation", 1)&&
                            formik.setFieldValue("is_graduation_31", 1);
                        }
                    },
                    inputVariant: "outlined",
                    type: "switch",
                    grid: { xs: 12, sm: 3, md: 3 },
                    error:
                        api.error?.is_olympic ||
                        (formik.touched.is_olympic &&
                            formik.errors?.is_olympic),
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
