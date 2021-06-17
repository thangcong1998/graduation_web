import React from "react";
import {
    Paper, Button, Grid, TextField, Radio,
    Table, TableRow, TableHead, TableBody, TableContainer, TableCell
} from "@material-ui/core";
import Autocomplete from "../../../../components/form/Autocomplete";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import { useParams, useHistory } from "react-router-dom";
import {useAPI} from "../../../../api/api";
import * as Yup from "yup";

export default function StageForm() {
    const {t, i18n} = useTranslation();
    const params = useParams();
    const history = useHistory();
    const api = useAPI();
    const formik = useFormik({
        initialValues: {
            sport_id: null,
            discipline_id: null,
            event_id: null,
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
    const rows =
        {
            first_name: "Nguyen Van",
            given_name: "",
            sex: "Nam",
            passport_no: 2001000000,
            country: "Viet nam",
            team: "Doan the thao "
        };
    const test = [1,2,3,4,5,6,7,8,9,10,11,12];
    return (
        <Paper style={{ padding: 20}}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={"Tên vòng đấu"}
                        size={"small"}
                        value={formik.values?.name}
                        onChange={(e) => formik.setFieldValue("name", e.target.value)}
                        variant={"outlined"}
                        error={api.error?.name ||
                        (formik.touched.name && formik.errors?.name)}
                        helperText={api.error?.name ||
                        (formik.touched.name && formik.errors?.name)}
                    />
                </Grid>
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                <Grid item xs={12}>
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0}}>Hình thức thi đấu</p>
                </Grid>
                <Grid item xs={4}>
                    <Radio
                        checked={formik.values?.competition_type == 1 ? true: false}
                        onChange={(e) => formik.setFieldValue("competition_type", e.target.value)}
                        value="1"
                        color="primary"
                        size="small"
                    />
                    Hình thức thi đấu vòng tròn
                </Grid>
                <Grid item xs={4}>
                    <Radio
                        checked={formik.values?.competition_type == 2 ? true: false}
                        onChange={(e) => formik.setFieldValue("competition_type", e.target.value)}
                        value="2"
                        color="primary"
                        size="small"
                    />
                    Hình thức thi đấu loại trực tiếp.
                </Grid>
                <Grid item xs={4}>
                    <Radio
                        checked={formik.values?.competition_type == 3 ? true: false}
                        onChange={(e) => formik.setFieldValue("competition_type", e.target.value)}
                        value="3"
                        color="primary"
                        size="small"
                    />
                    Hình thức hỗn hợp
                </Grid>
                <Grid item xs={12}>
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0}}>Thành viên tham gia</p>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold"}}>Tên</TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold"}}>Họ</TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold"}}>Quốc tịch</TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold"}}>Giới tính</TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold"}}>Passport</TableCell>
                                    <TableCell align={"left"} style={{ fontWeight: "bold"}}>Đoàn tham dự</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {test.map((row, index) => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {rows.first_name}
                                        </TableCell>
                                        <TableCell align="left">{rows.given_name}{index}</TableCell>
                                        <TableCell align="left">{rows.country}</TableCell>
                                        <TableCell align="left">{rows.sex}</TableCell>
                                        <TableCell align="left">{rows.passport_no + index}</TableCell>
                                        <TableCell align={"left"}>{rows.team}{index}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Button variant={"contained"} color={"primary"} onClick={formik.handleSubmit}>Lưu</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}
