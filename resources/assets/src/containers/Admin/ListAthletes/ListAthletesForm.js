import React, { useEffect, useMemo, useState } from "react";
import { useAPI, useFetch } from "../../../api/api";
import ClientTable from "../../../components/choosePeopleEvent/ClientTable";
import PaperContainer from "../../../components/PaperContainer";
import Drawer from "../../../components/drawer/Drawer";
import { useTranslation } from "react-i18next";
import { Button, makeStyles, Grid } from "@material-ui/core";
import DrawerMember from "./DrawerMember";
import { useHistory, useLocation, useParams } from "react-router";
import Autocomplete from "../../../components/form/Autocomplete";
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
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/competition_individual",
  ]);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [members, setMembers] = useState([]);
  const [closeDrawer, setCloseDrawer] = useState(false);
  const api = useAPI();
  const params = useParams();
  const formik = useFormik({
    initialValues: {
      team: null,
      sport_id: null,
      discipline_id: null,
      event_id: null,
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("team_id", formik.values?.team?.id);
      formData.append("event_id", formik.values?.event_id?.id);
      formData.append("team", JSON.stringify(members.map((e) => e?.id)));
      params?.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params?.id
            ? "admin/competition_individual/" + params?.id
            : "admin/competition_individual",
          formData
        );
        if (res) {
          history.goBack();
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      // Validate form field
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
    }),
  });
  const sport_id_equal = formik.values?.sport_id?.id;

  function onDeleteMembers(ids) {
    if (typeof ids == "object") {
      setMembers((pre) => pre?.filter((e) => !ids?.includes(e?.id)));
    } else {
      setMembers((pre) => pre?.filter((e) => e.id !== e?.ids));
    }
  }
  const memberColumns = [
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

  const MemberTable = useMemo(() => (
    <ClientTable
      loading={loading}
      data={members?.map((e) => ({
        ...e,
        team: e?.team,
      }))}
      onDelete={onDeleteMembers}
      showCheck={true}
      columns={memberColumns}
      title={
        <div>
          {formik.values?.event_id && (
            <Drawer
              close={closeDrawer}
              anchor="right"
              classes={classes.paper}
              content={
                <DrawerMember
                  sport_id_equal={sport_id_equal}
                  members={members}
                  setMembers={setMembers}
                  teamId={formik?.values?.team?.id}
                />
              }
            >
              <Button variant="contained" color="primary">
                {t("training_schedule_screen.choose_member")}
              </Button>
            </Drawer>
          )}
        </div>
      }
    />
  ));

  return (
    <PaperContainer>
      <div>
        <Grid container spacing={1}>
          <Grid item md={12} xs={12}>
            <Autocomplete
              label={t("button.choose_team")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] == "en" ? "english_name" : "name"}
              required={true}
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
        </Grid>
        <Grid container spacing={1} style={{ marginTop: 10 }}>
          <Grid item xs={4}>
            <Autocomplete
              required={true}
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
              required={true}
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
              required={true}
              endpoint={
                formik.values?.discipline_id
                  ? "admin/sportDisciplineEvent?sport_discipline_id_equal=" +
                    formik.values?.discipline_id?.id
                  : ""
              }
              params={{ competition_type_equal: 1 }}
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
      </div>
      <div style={{ marginTop: 10 }}>{MemberTable}</div>
      {members?.length > 0 && (
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
    </PaperContainer>
  );
}
