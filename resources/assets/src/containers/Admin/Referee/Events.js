import React, { useState, useMemo } from "react";
import { Grid, Box, Typography, Button, IconButton } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import CheckBox from "../../../components/form/CheckBox";
import Autocomplete from "../../../components/form/Autocomplete";
import { useFormik } from "formik";
import DataTable from "../../../components/table/DataTable";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyle = makeStyles((theme) => ({
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    sport_disciplines: {
        fontWeight: "600",
        borderBottom: "1px solid #000",
    },
    active: {
        color: "#f50057",
    },
}));

export default function Events(props) {
    const { events, changeEvent } = props;
    const classes = useStyle();
    const { t, i18n } = useTranslation();
    const curLang = i18n.languages[0];
    const [sportTab, setSportTab] = useState(0);

    const formik = useFormik({
        initialValues: {},
        onSubmit: (values) => {
            const check = events.find((e) => e.id == values?.event?.id);
            if (values?.event && !check) {
                changeEvent([...events, values?.event]);
            }
        },
    });
    const columns = useMemo(
        () => [
            {
                field: "sport",
                title: t("sport_screen.sport"),
                display: true,
                render: (row) =>
                    curLang == "vi"
                        ? row?.sport_discipline?.sport?.name
                        : row?.sport_discipline?.sport?.english_name,
            },
            {
                field: "sport_discipline",
                title: t("sport_screen.sport_discipline"),
                display: true,
                render: (row) =>
                    curLang == "vi"
                        ? row?.sport_discipline?.name
                        : row?.sport_discipline?.english_name,
            },
            {
                field: curLang == "vi" ? "name" : "english_name",
                title: t("referee_screen.event"),
                display: true,
            },
        ],
        [curLang]
    );
    function deleteEvent(row) {
        changeEvent(events?.filter((e) => e?.id != row?.id));
    }
    return (
        <Grid container spacing={1} style={{ paddingBottom: 10 }}>
            <Grid item md={3} xs={3}>
                <Autocomplete
                    endpoint={"admin/sport"}
                    queryField={
                        curLang == "vi" ? "name_like" : "english_name_like"
                    }
                    labelField={curLang == "vi" ? "name" : "english_name"}
                    value={formik.values?.sport}
                    label={t("referee_screen.sport")}
                    handleChange={(e) => {
                        formik.setFieldValue("sport", e);
                        formik.setFieldValue("sportDiscipline", null);
                        formik.setFieldValue("event", null);
                    }}
                />
            </Grid>
            <Grid item md={3} xs={3}>
                <Autocomplete
                    endpoint={formik.values?.sport && "admin/sportDiscipline"}
                    queryField={
                        curLang == "vi" ? "name_like" : "english_name_like"
                    }
                    labelField={curLang == "vi" ? "name" : "english_name"}
                    params={{ sport_id_equal: formik.values?.sport?.id }}
                    value={formik.values?.sportDiscipline}
                    label={t("sport_screen.sport_discipline")}
                    handleChange={(e) => {
                        formik.setFieldValue("sportDiscipline", e);
                        formik.setFieldValue("event", null);
                    }}
                />
            </Grid>
            <Grid item md={3} xs={3}>
                <Autocomplete
                    endpoint={
                        formik.values?.sportDiscipline &&
                        "admin/sportDisciplineEvent"
                    }
                    queryField={
                        curLang == "vi" ? "name_like" : "english_name_like"
                    }
                    params={{
                        sport_discipline_id_equal:
                            formik.values?.sportDiscipline?.id,
                    }}
                    labelField={curLang == "vi" ? "name" : "english_name"}
                    value={formik.values?.event}
                    label={t("referee_screen.event")}
                    handleChange={(e) => {
                        formik.setFieldValue("event", e);
                    }}
                />
            </Grid>
            <Grid item md={3} xs={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit}
                >
                    {t("referee_screen.add_event")}
                </Button>
            </Grid>
            <DataTable
                data={events}
                columns={columns}
                actionColumn={{
                    render: (row) => (
                        <IconButton onClick={() => deleteEvent(row)}>
                            <DeleteIcon />
                        </IconButton>
                    ),
                }}
            />
        </Grid>
    );
}
