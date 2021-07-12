import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  Grid,
  Collapse,
  IconButton,
  ButtonGroup,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import Autocomplete from "../../../components/form/Autocomplete";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../../../api/api";
import * as Yup from "yup";
import TextInput from "../../../components/form/TextInput";
import DatePicker from "../../../components/form/Date";
import Radios from "../../../components/form/Radios";
import TextArea from "../../../components/form/TextArea";
import UploadOnePicture from "../../../components/UploadOnePicture";
import moment from "moment";
import { AuthContext } from "./../../AuthProvider";
import { useHistory, useParams } from "react-router-dom";
import { Paper } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { checkPerm, CheckSex } from "../../../common/constants";
import Events from "./Events";

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
  heightNormal: {
    width: "25%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function RefereeForm(props) {
  const { perms } = useContext(AuthContext);
  const [valueTab, setValueTab] = useState(1);
  const [sport, setSport] = useState(null);
  const classes = useStyle();
  const { t, i18n } = useTranslation();
  const api = useAPI();
  const [profileImg, setProfileImg] = useState();
  const [personalIdCard, setPersonalIdCard] = useState();
  const [fileScan, setFileScan] = useState();
  const [doping, setDoping] = useState();
  const { admin, user } = useContext(AuthContext);
  const params = useParams();
  const { data: profile, loading: loading, revalidate: refetch } = useFetch(
    params?.id
      ? [
          "get",
          admin
            ? "/admin/referee/" + params?.id
            : "/team/referee/" + params?.id,
        ]
      : null
  );
  const _sport = useMemo(() => ({ id_equal: sport?.id }), [sport]);
  const { data: sports, loading: sportLoading } = useFetch([
    "get",
    "admin/getSport",
    _sport,
  ]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (profile) {
      formik.setValues(profile);
      if (profile?.profile_url) {
        setProfileImg(profile?.profile_url);
      }
      if (profile?.personal_id_card_url) {
        setPersonalIdCard(profile?.personal_id_card_url);
      }
      setEvents(profile?.sport_discipline_events);
    }
  }, [profile]);

  const history = useHistory();

  const registerSchema = Yup.object().shape({
    country_of_birth: Yup.object()
      .required(
        t("member_registration.country_of_birth") + " " + t("errors.required")
      )
      .nullable(),
    nationality: Yup.object()
      .required(
        t("member_registration.nationality") + " " + t("errors.required")
      )
      .nullable(),
    // accreditation_number: Yup.string()
    //   .required(
    //     t("referee_screen.accreditation_number") + " " + t("errors.required")
    //   )
    //   .length(
    //     10,
    //     t("referee_screen.accreditation_number") + " " + t("errors.length_10")
    //   )
    //   .trim()
    //   .nullable(),
    given_name: Yup.string()
      .required(
        t("member_registration.given_name") + " " + t("errors.required")
      )
      .max(
        255,
        t("member_registration.given_name") +
          " " +
          t("errors.max.before") +
          " 255 " +
          t("errors.max.after")
      )
      .trim()
      .nullable(),
    family_name: Yup.string()
      .required(
        t("member_registration.family_name") + " " + t("errors.required")
      )
      .max(
        255,
        t("member_registration.family_name") +
          " " +
          t("errors.max.before") +
          " 255 " +
          t("errors.max.after")
      )
      .trim()
      .nullable(),
    passport_no: Yup.string()
      .when("personal_id_card_no", {
        is: (v) => v == null,
        then: Yup.string()
          .required(
            t("member_registration.passport_no") + " " + t("errors.required")
          )
          .max(
            12,
            t("member_registration.passport_no") +
              " " +
              t("errors.max.before") +
              " 12 " +
              t("errors.max.after")
          )
          .nullable(),
        otherwise: Yup.string()
          .max(
            12,
            t("member_registration.passport_no") +
              " " +
              t("errors.max.before") +
              " 12 " +
              t("errors.max.after")
          )
          .nullable(),
      })
      .nullable(),
    passport_expire_date: Yup.date()
      .when("personal_id_card_no", {
        is: (v) => v == null,
        then: Yup.date()
          .required(
            t("member_registration.passport_expire_date") +
              " " +
              t("errors.required")
          )
          .typeError(t("errors.invalid_format"))
          .nullable(),
        otherwise: Yup.date().typeError(t("errors.invalid_format")).nullable(),
      })
      .nullable(),

    personal_id_card_no: Yup.string()
      .matches(
        /^[0-9]+$/,
        t("member_registration.personal_id_card_no") + " " + t("errors.number")
      )
      .max(
        12,
        t("member_registration.personal_id_card_no") +
          " " +
          t("errors.max.before") +
          " 12 " +
          t("errors.max.after")
      )
      .nullable(),

    personal_id_card_issue_date: Yup.date()
      .when("personal_id_card_no", {
        is: (v) => v != null,
        then: Yup.date()
          .required(
            t("member_registration.personal_id_card_issue_date") +
              " " +
              t("errors.required")
          )
          .typeError(t("errors.invalid_format"))
          .nullable(),
        otherwise: Yup.date().typeError(t("errors.invalid_format")).nullable(),
      })
      .nullable(),

    personal_id_card_issue_department: Yup.string()
      .when("personal_id_card_no", {
        is: (v) => v != null,
        then: Yup.string()
          .required(
            t("member_registration.personal_id_card_issue_department") +
              " " +
              t("errors.required")
          )
          .max(
            255,
            t("member_registration.personal_id_card_issue_department") +
              " " +
              t("errors.max.before") +
              " 255 " +
              t("errors.max.after")
          )
          .nullable(),
        otherwise: Yup.string()
          .max(
            255,
            t("member_registration.personal_id_card_issue_department") +
              " " +
              t("errors.max.before") +
              " 255 " +
              t("errors.max.after")
          )
          .nullable(),
      })
      .nullable(),
    sex: Yup.string()
      .required(t("member_registration.sex") + " " + t("errors.required"))
      .nullable(),
    dob: Yup.date()
      .required(t("member_registration.dob") + " " + t("errors.required"))
      .max(new Date(), t("errors.maxDate"))
      .typeError(t("errors.invalid_format"))
      .nullable(),
    profile_url:
      !profileImg &&
      Yup.object()
        .required(
          t("member_registration.profile_url") + " " + t("errors.required")
        )
        .nullable(),
    // sport: Yup.object()
    //     .required(t("referee_screen.sport") + " " + t("errors.required"))
    //     .nullable()
  });
  const formik = useFormik({
    initialValues: {
      // card_template: null,
      function: null,
      given_name: null,
      family_name: null,
      passport_no: null,
      passport_expire_date: null,
      personal_id_card_no: null,
      personal_id_card_issue_date: null,
      personal_id_card_issue_department: null,
      sex: null,
      dob: null,
      permanent_address: null,
      sport: null,
      sport_discipline: null,
      profile_url: null,
      personal_id_card: null,
      country_of_birth: null,
      nationality: null,
      team: null,
      accreditation_number: null,
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      try {
        if (user) {
          formData.append("approval_status", 1);
        }
        if (params) {
          formData.append("id", params?.id);
        }
        if (profileImg) {
          formData.append("profile_url", profileImg);
        }
        if (personalIdCard) {
          formData.append("personal_id_card", personalIdCard);
        }
        if (fileScan) {
          formData.append("file_scan", fileScan);
        }
        if (doping) {
          formData.append("doping_url", doping);
        }
        Object.keys(values).forEach((key) => {
          if (values?.[key]) {
            switch (key) {
              case "sport":
                if (values?.sport) {
                  // formData.append("sport_id", values?.sport?.id);
                } else {
                  formData.append("sport_id", "");
                }
                break;
              case "sport_discipline":
                if (values?.sport_discipline) {
                  formData.append(
                    "sport_discipline_id",
                    values?.sport_discipline?.id
                  );
                } else {
                  formData.append("sport_discipline_id", "");
                }
                break;
              case "country_of_birth":
                formData.append(
                  "country_of_birth_id",
                  values?.country_of_birth?.id
                );
                break;
              case "nationality":
                formData.append("nationality_id", values?.nationality?.id);
                break;
              case "team":
                formData.append("team_id", values?.team?.id);
                break;
              case "profile_url":
                formData.append("profile_url", profileImg);
                break;
              case "personal_id_card":
                formData.append("personal_id_card", personalIdCard);
                break;
              default:
                formData.append(key, values?.[key]);
                break;
            }
          } else {
            formData.append(key, "");
          }
        });
        formData.append("events", JSON.stringify(events.map((e) => e.id)));
        formData.append("_method", params?.id ? "put" : "post");
        if (admin) {
          let res = await api.fetcher(
            "post",
            params?.id ? "/admin/referee/" + params?.id : "/admin/referee",
            formData
          );
          if (res) {
            history.goBack();
          }
        }
      } catch (e) {
        // formik.setErrors(e);
      }
    },
    validationSchema: registerSchema,
  });

  useEffect(() => {
    if (user) {
      formik.setFieldValue("team", user?.team);
    }
  }, []);

  useEffect(() => {
    if (profileImg) {
      formik.setFieldValue("profile_url", profileImg);
    }
  }, [profileImg]);
  console.log(formik?.errors);
  const Information = (
    <div>
      {/* <Grid className={classes.group}>
        <div className={classes.title}>
          1. {t("referee_screen.accreditation_number")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={12} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("referee_screen.accreditation_number") + " *"}
              value={formik.values?.accreditation_number}
              handleChange={(e) =>
                formik.setFieldValue("accreditation_number", e)
              }
              error={
                api.error?.accreditation_number ||
                (formik.touched.accreditation_number &&
                  formik.errors.accreditation_number)
              }
            />
          </Grid>
        </Grid>
      </Grid> */}
      <Grid className={classes.group}>
        <div className={classes.title}>
          1. {t("member_registration.group3")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={6} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.given_name") + " *"}
              value={formik.values?.given_name}
              handleChange={(e) => formik.setFieldValue("given_name", e)}
              error={
                api.error?.given_name ||
                (formik.touched.given_name && formik.errors.given_name)
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.family_name") + " *"}
              value={formik.values?.family_name}
              handleChange={(e) => formik.setFieldValue("family_name", e)}
              error={
                api.error?.family_name ||
                (formik.touched.family_name && formik.errors.family_name)
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  4. Passport no/Số hộ chiếu*/}
        <div className={classes.title}>
          2. {t("member_registration.group4")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={6} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.passport_no") + " *"}
              value={formik.values?.passport_no}
              handleChange={(e) => formik.setFieldValue("passport_no", e)}
              error={
                api.error?.passport_no ||
                (formik.touched.passport_no && formik.errors.passport_no)
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DatePicker
              size={"small"}
              variant={"outlined"}
              label={
                t("member_registration.passport_expire_date") + "(dd/mm/yyyy) *"
              }
              value={formik.values?.passport_expire_date}
              handleChange={(e) => {
                if (e) {
                  formik.setFieldValue(
                    "passport_expire_date",
                    moment(e).format("YYYY-MM-DD")
                  );
                } else {
                  formik.setFieldValue("passport_expire_date", null);
                }
              }}
              error={
                api.error?.passport_expire_date ||
                (formik.touched.passport_expire_date &&
                  formik.errors.passport_expire_date)
              }
              minDate={moment(new Date()).format("YYYY-MM-DD")}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  5. Personal Identtity Card No. (Vietnam only)/Số chứng minh thư hoặc thẻ căn cước (CMT/CC)*/}
        <div className={classes.title}>
          3. {t("member_registration.group5")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={4} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.personal_id_card_no")}
              value={formik.values?.personal_id_card_no}
              handleChange={(e) =>
                formik.setFieldValue("personal_id_card_no", e)
              }
              error={
                api.error?.personal_id_card_no ||
                (formik.touched.personal_id_card_no &&
                  formik.errors.personal_id_card_no)
              }
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <DatePicker
              size={"small"}
              variant={"outlined"}
              label={
                t("member_registration.personal_id_card_issue_date") +
                "(dd/mm/yyyy)"
              }
              value={formik.values?.personal_id_card_issue_date}
              handleChange={(e) => {
                if (e) {
                  formik.setFieldValue(
                    "personal_id_card_issue_date",
                    moment(e).format("YYYY-MM-DD")
                  );
                } else {
                  formik.setFieldValue("personal_id_card_issue_date", null);
                }
              }}
              error={
                api.error?.personal_id_card_issue_date ||
                (formik.touched.personal_id_card_issue_date &&
                  formik.errors.personal_id_card_issue_date)
              }
              maxDate={moment(new Date()).format("YYYY-MM-DD")}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.personal_id_card_issue_department")}
              value={formik.values?.personal_id_card_issue_department}
              handleChange={(e) =>
                formik.setFieldValue("personal_id_card_issue_department", e)
              }
              error={
                api.error?.personal_id_card_issue_department ||
                (formik.touched.personal_id_card_issue_department &&
                  formik.errors.personal_id_card_issue_department)
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item className={classes.group} md={6} xs={12}>
          {/*  6. Date of birth/Ngày sinh*/}
          <div className={classes.title}>
            4. {t("member_registration.group9") + "(DD/MM/YYYY) *"}
          </div>
          <DatePicker
            size={"small"}
            variant={"outlined"}
            label={t("member_registration.dob")}
            value={formik.values?.dob}
            maxDate={moment(new Date())
              .subtract(1, "days")
              .format("YYYY-MM-DD")}
            handleChange={(e) => {
              if (e) {
                formik.setFieldValue("dob", moment(e).format("YYYY-MM-DD"));
              } else {
                formik.setFieldValue("dob", null);
              }
            }}
            error={api.error?.dob || (formik.touched.dob && formik.errors.dob)}
          />
        </Grid>
        <Grid item className={classes.group} md={6} xs={12}>
          {/*  7. sex/Giới tính*/}
          <div className={classes.title}>
            5. {t("member_registration.group6") + " *"}
          </div>
          <Grid justify="flex-start" container spacing={1}>
            <Radios
              value={formik.values.sex}
              handleChange={(e) => formik.setFieldValue("sex", e)}
              flexDirection={"row"}
              options={[
                {
                  label: t("sex.female"),
                  value: 1,
                },
                {
                  label: t("sex.male"),
                  value: 2,
                },
              ]}
              error={
                api.error?.sex || (formik.touched.sex && formik.errors.sex)
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid justify="center" container spacing={1}>
        <Grid item className={classes.group} md={6} xs={12}>
          {/*  10. Category of birth/Nơi sinh*/}
          <div className={classes.title}>
            6. {t("member_registration.group10") + " *"}
          </div>
          <Autocomplete
            label={t("member_registration.country_of_birth")}
            queryField={"name_like"}
            labelField={"name"}
            endpoint="/admin/country"
            handleChange={(e) => formik.setFieldValue("country_of_birth", e)}
            value={formik.values.country_of_birth}
            error={
              api.error?.country_id_of_birth ||
              (formik.touched.country_of_birth &&
                formik.errors.country_of_birth)
            }
          />
        </Grid>
        <Grid item className={classes.group} md={6} xs={12}>
          {/*  11. Nationality/Quốc tịch*/}
          <div className={classes.title}>
            7. {t("member_registration.group11") + " *"}
          </div>
          <Autocomplete
            label={t("member_registration.nationality")}
            queryField={"name_like"}
            labelField={"name"}
            endpoint="/admin/country"
            handleChange={(e) => formik.setFieldValue("nationality", e)}
            value={formik.values.nationality}
            error={
              api.error?.nationality_id ||
              (formik.touched.nationality && formik.errors.nationality)
            }
          />
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  13. Permanent Address/Địa chỉ thường trú*/}
        <div className={classes.title}>
          8. {t("member_registration.group13")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={12} xs={12}>
            <TextArea
              type={"textarea"}
              rows={3}
              variant={"outlined"}
              label={t("member_registration.permanent_address")}
              value={formik.values?.permanent_address}
              handleChange={(e) => formik.setFieldValue("permanent_address", e)}
              error={
                api.error?.permanent_address ||
                (formik.touched.permanent_address &&
                  formik.errors.permanent_address)
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid justify="center" container spacing={1}>
        <Grid item md={12} xs={12} className={classes.group}>
          {/*  15. Register People Picture */}
          <div className={classes.title}>
            9. {t("member_registration.group15") + " *"}
          </div>
          <Grid className={classes.note}>
            {t("member_registration.profile_url_note")}
          </Grid>
          <Grid style={{ width: 300, height: 400 }}>
            <UploadOnePicture
              files={profileImg}
              setFiles={setProfileImg}
              title={i18n.t("drag_drop.default")}
              height={"400px"}
              width={"300px"}
              error={
                api.error?.profile ||
                (formik.touched.profile_url && formik.errors.profile_url)
              }
            />
          </Grid>
        </Grid>
        {/*  16. Photo copy of valid passport */}
        {/* <Grid item md={6} xs={12} className={classes.group}>
          <div className={classes.title}>
            9. {t("member_registration.group16")}
          </div>
          <Grid className={classes.note}>
            {t("member_registration.profile_url_note")}
          </Grid>
          <Grid style={{ width: 300, height: 400 }}>
            <UploadOnePicture
              files={personalIdCard}
              setFiles={setPersonalIdCard}
              title={i18n.t("drag_drop.default")}
              height={"400px"}
              width={"300px"}
              error={
                api.error?.personal_id_card ||
                (formik.touched.personal_id_card &&
                  formik.errors.personal_id_card)
              }
            />
          </Grid>
        </Grid> */}
      </Grid>
    </div>
  );
  return (
    <Paper className={classes.container}>
      <Tabs
        value={valueTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(ev, val) => {
          setValueTab(val);
        }}
        style={{ marginBottom: 10 }}
      >
        <Tab value={1} label={t("title.information")} />
        <Tab value={2} label={t("referee_screen.events")} />
      </Tabs>
      <TabPanel value={valueTab} index={1}>
        {Information}
      </TabPanel>
      <TabPanel value={valueTab} index={2}>
        <Events
          sports={sports}
          loading={sportLoading}
          events={events}
          changeEvent={(e) => setEvents(e)}
          sport={sport}
          handleChangeSport={setSport}
        />
      </TabPanel>
      <ButtonGroup>
        {params?.id
          ? checkPerm(perms, "referee_management_edit") && (
              <Button
                onClick={formik.handleSubmit}
                variant="contained"
                color="primary"
                size="large"
              >
                {t("referee_screen.update")}
              </Button>
            )
          : checkPerm(perms, "referee_management_add") && (
              <Button
                onClick={formik.handleSubmit}
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                size="large"
              >
                {t("referee_screen.save")}
              </Button>
            )}
      </ButtonGroup>
    </Paper>
  );
}
