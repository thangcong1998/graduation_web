import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { useAPI, useFetch } from "../../../api/api";
import ClientTable from "../../../components/choosePeopleEvent/ClientTable";
import PaperContainer from "../../../components/PaperContainer";
import DrawerTeam from "./DrawerTeam";
import Drawer from "../../../components/drawer/Drawer";
import { Button, makeStyles, Grid, Typography } from "@material-ui/core";
import Autocomplete from "../../../components/form/Autocomplete";
import TextInput from "../../../components/form/TextInput";
import { CheckSex } from "../../../common/constants";
import { useFormik } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
  },
}));

export default function ListAthletesForm(props) {
  const api = useAPI();
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [team, setTeam] = useState([]);
  const [eventId, setEventId] = useState({});
  const params = useParams();
  function onDeleteTeam(ids) {
    if (typeof ids == "object") {
      setTeam((pre) => pre?.filter((e) => !ids?.includes(e?.id)));
    } else {
      setTeam((pre) => pre?.filter((e) => e.id !== e?.ids));
    }
  }
  const { data: data, loading: loading, revalidate: refetch } = useFetch(
    params?.id ? ["get", `admin/teamEvent/` + params?.id] : null
  );

  const formik = useFormik({
    initialValues: {
      team: null,
      name: null,
      sport_id: null,
      discipline_id: null,
      event_id: null,
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("team_id", formik.values?.team?.id);
      formData.append("event_id", formik.values?.event_id?.id);
      formData.append("name", formik?.values?.name);
      formData.append("team", JSON.stringify(team.map((e) => e?.id)));
      params?.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params?.id ? "admin/teamEvent/" + params?.id : "admin/teamEvent",
          formData
        );
        if (res) {
          history.goBack();
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      team: Yup.object()
        .required(t("event_team_screen.team") + " " + t("errors.required"))

        .nullable(),
      event_id: Yup.object()
        .required(
          t("sport_discipline_screen.event") + " " + t("errors.required")
        )
        .nullable(),
      discipline_id: Yup.object()
        .required(
          t("sport_discipline_screen.sport_discipline") +
            " " +
            t("errors.required")
        )
        .nullable(),
      sport_id: Yup.object()
        .required(
          t("sport_discipline_screen.sport") + " " + t("errors.required")
        )
        .nullable(),
      name: Yup.string()
        .required(t("event_team_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("event_team_screen.name") +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable(),
    }),
  });

  const teamColumns = [
    {
      field: "accreditation_number",
      title: t("staff_screen.accreditation_number"),
      display: true,
    },
    {
      field: "given_name",
      title: t("member_screen.given_name"),
      cellStyle: {
        overflowWrap: "anywhere",
      },
      sorting: false,
    },
    {
      field: "family_name",
      title: t("member_screen.family_name"),
      cellStyle: {
        overflowWrap: "anywhere",
      },
      sorting: false,
    },
    {
      field: "sex",
      title: t("member_screen.sex"),
      display: true,
    },
  ];

  useEffect(() => {
    if (data) {
      formik.setValues({
        ...formik.values,
        name: data?.name,
        team: data?.team,
        sport_id: data?.event?.sport_discipline?.sport,
        discipline_id: data?.event?.sport_discipline,
        event_id: data?.event,
      });
      setTeam(data?.event_team_competitor);
    }
  }, [data]);
  useEffect(() => {
    if (formik.values.event_id) {
      setEventId(formik.values.event_id);
    }
  }, [formik.values.event_id]);

  const TeamTable = useMemo(
    () => (
      <ClientTable
        loading={loading}
        data={team?.map((e) => ({
          ...e,
          sex: e?.sex == 1 || e?.sex == 2 ? CheckSex(e?.sex, t) : e?.sex,
        }))}
        onDelete={onDeleteTeam}
        showCheck={true}
        columns={teamColumns}
        title={
          <div>
            <Drawer
              anchor="right"
              className={classes.paper}
              content={
                <DrawerTeam
                  sport_id={formik.values?.sport_id?.id}
                  members={team}
                  setMembers={setTeam}
                  teamId={formik?.values?.team?.id}
                />
              }
            >
              <Button variant="contained" color="primary">
                {t("training_schedule_screen.choose_member")}
              </Button>
            </Drawer>
          </div>
        }
      />
    ),
    [team, formik?.values?.team, formik.values?.sport_id]
  );

  return (
    <PaperContainer>
      <div>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Autocomplete
              label={t("button.choose_team")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] == "en" ? "english_name" : "name"}
              endpoint="/admin/team"
              handleChange={(e) => {
                formik.setFieldValue("team", e);
                formik.setFieldValue("team_id", e?.id);
              }}
              value={formik?.values?.team}
              error={
                api.error?.team || (formik.touched.team && formik.errors.team)
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("ListAthletes_screen.name") + "*"}
              value={formik.values?.name}
              handleChange={(e) => formik.setFieldValue("name", e)}
              error={
                api.error?.name || (formik.touched.name && formik.errors.name)
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 1 }}>
          <Grid item xs={4}>
            <Autocomplete
              endpoint={"admin/sport"}
              queryField={"name"}
              labelField={i18n.languages[0] == "en" ? "english_name" : "name"}
              valueField={"id"}
              label={t("sport_screen.sport")}
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
              queryField={"name"}
              labelField={i18n.languages[0] == "en" ? "english_name" : "name"}
              valueField={"id"}
              label={t("sport_screen.sport_discipline")}
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
              params={{ competition_type_equal: 2 }}
              queryField={"name"}
              labelField={i18n.languages[0] == "en" ? "english_name" : "name"}
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
        </Grid>
        <div style={{ marginTop: 10 }}>{TeamTable}</div>
        {team?.length > eventId?.maximum_team_size ? (
          <Typography style={{ marginTop: 15, color: "red" }}>
            {t("errors.over_member_registration")}
          </Typography>
        ) : (
          <div>
            {team?.length > 0 && !params?.id && (
              <Button
                disabled={api?.loading == false ? false : true}
                variant="contained"
                color="primary"
                style={{ marginTop: 10 }}
                onClick={formik.handleSubmit}
              >
                {t("button.save")}
              </Button>
            )}
            {params?.id && (
              <Button
                disabled={api?.loading == false ? false : true}
                variant="contained"
                color="primary"
                style={{ marginTop: 10 }}
                onClick={formik.handleSubmit}
              >
                {t("button.save")}
              </Button>
            )}
          </div>
        )}
      </div>
    </PaperContainer>
  );
}
