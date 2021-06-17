import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import { useAPI } from "../../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm, UNIT } from "../../../../common/constants";
import moment from "moment";

const RecordMemberForm = React.memo((props) => {
    const formData = new FormData();
    const { t, i18n } = useTranslation();
    const { perms } = useContext(AuthContext);
    const { row, close, refetch, competitor_id } = props;

    const formik = useFormik({
        initialValues: {
            event: null,
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
            formData.append("event_id", values?.event ? values?.event?.id : "");
            formData.append("is_seagame", 2);
            formData.append(
                "take_place",
                values?.take_place ? values?.take_place : ""
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
            formData.append(
                "competitor_id",
                competitor_id ? competitor_id : row.competitor_id
            );
            formData.append("id", values?.id ? values?.id : "");
            row?.id
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    row?.id
                        ? "admin/recordParticipant/" + row?.id
                        : "admin/recordParticipant",
                    formData
                );
                if (res) {
                    refetch();
                    close();
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
            take_place: Yup.string()
                .required(
                    t("record_screen.take_place") + " " + t("errors.required")
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
    useEffect(() => {
        if (row) {
            formik.setFieldValue("sport", row?.event.sport_discipline.sport);
            formik.setFieldValue(
                "sport_discipline",
                row?.event.sport_discipline
            );
            formik.setFieldValue("event", row?.event);
            formik.setFieldValue("take_place", row?.take_place);
            formik.setFieldValue("take_time", row?.take_time);
            formik.setFieldValue("result_record", row?.result_record);
            formik.setFieldValue("unit", row?.unit);
            formik.setFieldValue("description", row?.description);
            formik.setFieldValue("id", row?.id);
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
                    grid: { xs: 12, sm: 12, md: 12 },
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
                    grid: { xs: 12, sm: 12, md: 12 },
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
                        api.error?.event ||
                        (formik.touched.event && formik.errors?.event),
                    handleChange: (e) => formik.setFieldValue("event", e),
                    type: "autocomplete",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
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
                    grid: { xs: 12, sm: 12, md: 12 },
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
                    ],
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
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
                    grid: { xs: 12, sm: 12, md: 12 },
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
        <div>
            <Forms inputs={inputs} />
            {row?.id ? (
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
        </div>
    );
});
export default RecordMemberForm;
