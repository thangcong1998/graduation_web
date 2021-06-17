import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import i18n from "../../../i18n/i18n";
import ButtonAdd from "../../../components/button/ButtonAddSolashi";
import ButtonUpdate from "../../../components/button/ButtonUpdateSolashi";
import * as Yup from "yup";
import { adminPrefix } from "../../../routes/AdminRoutes";
import UploadOnePicture from "../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";
import {
    Button,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

export default function (props) {
    // const { sport, sportDiscipline, row, close, } = props;
    const { t } = useTranslation();
    const api = useAPI();
    const history = useHistory();
    const params = useParams();

    const [files, setFiles] = useState();
    const [round, setRound] = useState([]);
    const { data: event, loading: loading, revalidate: refetch } = useFetch([
        "get",
        params?.id ? "/admin/sportDisciplineEvent/" + params?.id : null,
    ]);
    const formik = useFormik({
        initialValues: {
            name: null,
            english_name: null,
            sport: null,
            sport_discipline: null,
            icon: null,
            competitor_male: "0",
            competitor_female: "0",
            // maximum_team_size: "0",
            competition_type: 1,
            has_goalkeeper: 1,
            uniform: 1,
            name_round: null,
        },
        onSubmit: async (values) => {
            try {
                let formData = new FormData();
                formData.append(
                    "english_name",
                    formik.values?.english_name
                        ? formik.values?.english_name
                        : ""
                );
                formData.append(
                    "sport_discipline_id",
                    values?.sport_discipline ? values.sport_discipline.id : ""
                );
                formData.append(
                    "name",
                    formik.values?.name ? formik.values?.name : ""
                );
                formData.append(
                    "competitor_male",
                    formik.values?.competitor_male
                );
                formData.append(
                    "competitor_female",
                    formik.values?.competitor_female
                );
                formData.append(
                    "competition_type",
                    formik.values?.competition_type
                        ? formik.values?.competition_type
                        : ""
                );
                formData.append(
                    "uniform",
                    values?.uniform ? values?.uniform : ""
                );
                formData.append(
                    "has_goalkeeper",
                    values?.has_goalkeeper ? values?.has_goalkeeper : ""
                );
                formData.append("files", files);
                formData.append(
                    "sport_discipline_event_id",
                    values?.sport_discipline_event_id
                        ? values?.sport_discipline_event_id
                        : ""
                );
                formData.append("round", JSON.stringify(round));
                // formData.append("maximum_team_size", formik.values?.maximum_team_size);
                formData.append("_method", params?.id ? "put" : "post");
                let res = await api.fetcher(
                    "post",
                    params?.id
                        ? "/admin/sportDisciplineEvent/" + params?.id
                        : "/admin/sportDisciplineEvent",
                    formData
                );
                if (res) {
                    history.goBack();
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required(
                    t("sport_screen.sport_discipline_event") +
                        " " +
                        t("errors.required")
                )
                .max(
                    255,
                    t("sport_screen.sport_discipline_event") +
                        " " +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .nullable()
                .trim(),
            english_name: Yup.string()
                .required(
                    t("sport_screen.english_name") + " " + t("errors.required")
                )
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
            sport: Yup.object()
                .required(t("sport_screen.sport") + " " + t("errors.required"))
                .nullable(),
            sport_discipline: Yup.object()
                .required(
                    t("sport_screen.sport_discipline") +
                        " " +
                        t("errors.required")
                )
                .nullable(),
            icon:
                !files &&
                Yup.object()
                    .required(
                        t("sport_screen.icon") + " " + t("errors.required")
                    )
                    .nullable(),
            competitor_male: Yup.string()
                .required(
                    t("sport_discipline_event_screen.competitor_male") +
                        " " +
                        t("errors.required")
                )
                .max(
                    3,
                    t("sport_discipline_event_screen.competitor_male") +
                        " " +
                        t("errors.max.before") +
                        "3 " +
                        t("errors.max.after")
                )
                .matches(
                    /^[0-9]*$/,
                    t("sport_discipline_event_screen.competitor_male") +
                        " " +
                        t("errors.number")
                )
                .nullable()
                .trim(),
            competitor_female: Yup.string()
                .required(
                    t("sport_discipline_event_screen.competitor_female") +
                        " " +
                        t("errors.required")
                )
                .max(
                    3,
                    t("sport_discipline_event_screen.competitor_female") +
                        " " +
                        t("errors.max.before") +
                        "3 " +
                        t("errors.max.after")
                )
                .matches(
                    /^[0-9]*$/,
                    t("sport_discipline_event_screen.competitor_female") +
                        " " +
                        t("errors.number")
                )
                .nullable()
                .trim(),
        }),
    });

    useEffect(() => {
        if (
            formik.values.sport == null &&
            formik.values.sport_discipline != null
        ) {
            formik.setFieldValue("sport_discipline", null);
        }
    }, formik.values.sport);
    useEffect(() => {
        if (files) {
            formik.setFieldValue("icon", true);
        }
    }, [files]);

    useEffect(() => {
        if (event) {
            formik.setValues({
                sport: event?.sport_discipline?.sport,
                sport_discipline: event?.sport_discipline,
                name: event?.name,
                english_name: event?.english_name,
                competition_type: event?.competition_type,
                competitor_male: event?.competitor_male,
                competitor_female: event?.competitor_female,
                has_goalkeeper: event?.has_goalkeeper,
                uniform: event?.uniform,
            });
            setRound(event?.event_rounds);
            setFiles(event?.icon);
        }
    }, [event]);

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
                    handleChange: (e) =>
                        formik.setFieldValue("sport_discipline", e),
                    type: "autocomplete",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "name",
                    label: i18n.t("sport_screen.sport_discipline_event"),
                    required: true,
                    value: formik.values?.name,
                    error:
                        (formik.touched.name && formik.errors?.name) ||
                        api.error?.name,
                    handleChange: (e) => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "english_name",
                    label: i18n.t("sport_screen.english_name"),
                    value: formik.values?.english_name,
                    required: true,
                    error:
                        (formik.touched.english_name &&
                            formik.errors.english_name) ||
                        api.error?.english_name,
                    handleChange: (e) =>
                        formik.setFieldValue("english_name", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "competition_type",
                    value: formik.values.competition_type,
                    handleChange: (e) => {
                        formik.setFieldValue("competition_type", e);
                    },
                    error:
                        api.error?.competition_type ||
                        (formik.touched.competition_type &&
                            formik.errors?.competition_type),
                    type: "radio",
                    options: [
                        { label: i18n.t("sport_screen.individual"), value: 1 },
                        { label: i18n.t("sport_screen.team"), value: 2 },
                    ],
                    formLabelProps: {
                        style: {
                            color: "#000000",
                            fontWeight: "bold",
                        },
                    },
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "competitor_male",
                    label: i18n.t(
                        "sport_discipline_event_screen.competitor_male"
                    ),
                    value: formik.values?.competitor_male,
                    required: true,
                    error:
                        api.error?.competitor_male ||
                        (formik.touched.competitor_male &&
                            formik.errors.competitor_male),
                    handleChange: (e) =>
                        formik.setFieldValue("competitor_male", e),
                    type: "number",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "competitor_female",
                    label: i18n.t(
                        "sport_discipline_event_screen.competitor_female"
                    ),
                    value: formik.values?.competitor_female,
                    required: true,
                    error:
                        api.error?.competitor_female ||
                        (formik.touched.competitor_female &&
                            formik.errors.competitor_female),
                    handleChange: (e) =>
                        formik.setFieldValue("competitor_female", e),
                    type: "number",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "uniform",
                    label: t("sport_discipline_event_screen.uniform"),
                    value: formik.values?.uniform == 2,
                    required: true,
                    handleChange: (e) => {
                        formik.setFieldValue("uniform", e == true ? 2 : 1);
                    },
                    inputVariant: "outlined",
                    type: "switch",
                    grid: { xs: 12, sm: 6, md: 6 },
                    error:
                        api.error?.uniform ||
                        (formik.touched.uniform && formik.errors?.uniform),
                },
                {
                    field: "has_goalkeeper",
                    label: t("sport_discipline_event_screen.has_goalkeeper"),
                    value: formik.values?.has_goalkeeper == 2,
                    required: true,
                    handleChange: (e) => {
                        formik.setFieldValue(
                            "has_goalkeeper",
                            e == true ? 2 : 1
                        );
                    },
                    inputVariant: "outlined",
                    type: "switch",
                    grid: { xs: 12, sm: 6, md: 6 },
                    error:
                        api.error?.has_goalkeeper ||
                        (formik.touched.has_goalkeeper &&
                            formik.errors?.has_goalkeeper),
                },
                // {
                //   field: "maximum_team_size",
                //   label: i18n.t("sport_discipline_event_screen.maximum_team_size"),
                //   value: formik.values?.maximum_team_size,
                //   required: true,
                //   error:
                //     api.error?.maximum_team_size ||
                //     (formik.touched.maximum_team_size &&
                //       formik.errors.maximum_team_size),
                //   handleChange: (e) => formik.setFieldValue("maximum_team_size", e),
                //   type: "number",
                //   variant: "outlined",
                //   grid: { xs: 12, sm: 6, md: 6 },
                // },
            ],
        ],
        [formik, api]
    );

    const addRound = (name) => {
        setRound((pre) => [
            ...pre,
            {
                name: name,
            },
        ]);
    };
    const changeNameRound = (value, rd, index) => {
        setRound((pre) => [
            ...pre.map((pr, mIndex) => {
                if (mIndex == index) {
                    return { ...pr, name: value };
                }
                return { ...pr };
            }),
        ]);
        // formik.setFieldValue("name_round", value);
    };
    return (
        <div>
            <div>
                <Forms inputs={inputs} />
                <UploadOnePicture
                    files={files}
                    setFiles={setFiles}
                    title={i18n.t("upload.message")}
                    error={
                        api.error?.icon ||
                        (formik.touched.icon && formik.errors.icon)
                    }
                    // height={"100px"}
                    // width={"100px"}
                />
                <Grid>
                    <div style={{ fontSize: 20 }}>
                        {t("sport_discipline_event_screen.add_round")}
                        <IconButton
                            variant="outlined"
                            onClick={() => addRound()}
                        >
                            <AddCircleOutlineIcon
                                size="small"
                                style={{
                                    fontSize: 25,
                                }}
                            />
                        </IconButton>
                    </div>
                </Grid>
                <Grid container style={{ marginBottom: 5 }} spacing={1}>
                    {round?.map((rd, index) => {
                        return (
                            <Grid item md={4} style={{ padding: 4 }}>
                                <TextField
                                    style={{ width: "100%" }}
                                    size="small"
                                    variant="outlined"
                                    value={rd?.name}
                                    onChange={(e) =>
                                        changeNameRound(
                                            e.target?.value,
                                            rd,
                                            index
                                        )
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                <div style={{ fontSize: 20 }}>
                    {t("sport_discipline_event_screen.stages")}
                    <IconButton variant="outlined" onClick={() => addRound()}>
                        <AddCircleOutlineIcon
                            size="small"
                            style={{
                                fontSize: 25,
                            }}
                        />
                    </IconButton>
                </div>
                <TableContainer style={{ marginBottom: 5 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {t("sport_discipline_event_screen.no")}
                                </TableCell>
                                <TableCell>{t("stages_screen.name")}</TableCell>
                                <TableCell>
                                    {t("stages_screen.english_name")}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {event?.stages?.map((e, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{e?.name}</TableCell>
                                    <TableCell>{e?.english_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {params?.id ? (
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
                    text={i18n.t("sport_screen.sport_discipline_event")}
                    onClick={formik.handleSubmit}
                />
            )}
        </div>
    );
}
