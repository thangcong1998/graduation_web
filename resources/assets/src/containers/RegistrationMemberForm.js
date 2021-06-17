import React, { useState, useContext, useEffect, useMemo } from "react";
import { Grid, Collapse, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import Autocomplete from "../components/form/Autocomplete";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../api/api";
import * as Yup from "yup";
import TextInput from "../components/form/TextInput";
import DatePicker from "../components/form/Date";
import Radios from "../components/form/Radios";
import TextArea from "../components/form/TextArea";
import UploadOnePicture from "../components/UploadOnePicture";
import ButtonSolashi from "../components/button/ButtonSolashi";
import moment from "moment";
import { AuthContext } from "./AuthProvider";
import { useHistory, useParams } from "react-router-dom";
import ApproveButton from "../components/button/ApproveButton";
import RejectButton from "../components/button/RejectButton";
import Status from "../components/Status";
import { Paper } from "@material-ui/core";
import { checkPerm, CheckSex } from "../common/constants";
import color from "../common/color.json";
import VisibilityIcon from "@material-ui/icons/Visibility";
import barcode from "../assets/image/barcode.png";
import Switch from "../components/form/Switch";

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
  barcode: {
    position: "absolute",
    bottom: 0,
    left: 5,
    width: 90,
    "& img": {
      width: 90,
    },
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
}));

export default function RegistrationMember(props) {
  const { perms } = useContext(AuthContext);
  const classes = useStyle();
  const { t, i18n } = useTranslation();
  const api = useAPI();
  const [profileImg, setProfileImg] = useState();
  const [personalIdCard, setPersonalIdCard] = useState();
  const [fileScan, setFileScan] = useState();
  const [doping, setDoping] = useState();
  const { admin, user } = useContext(AuthContext);
  const params = useParams();
  const [pre, setPre] = useState(false);
  const { data: profile, loading: loading, revalidate: refetch } = useFetch(
    params?.id
      ? [
          "get",
          admin
            ? "/admin/participant/" + params?.id
            : "/team/participant/" + params?.id,
        ]
      : null
  );
  useEffect(() => {
    if (profile) {
      formik.setValues(profile);
      if (profile?.profile_url) {
        setProfileImg(profile?.profile_url);
      }
      if (profile?.personal_id_card_url) {
        setPersonalIdCard(profile?.personal_id_card_url);
      }
      setOldReg(profile?.files);
      if (profile?.file_scan) {
        setFileScan(profile?.file_scan);
      }
      if (profile?.doping_url) {
        setDoping(profile?.doping_url);
      }
    }
  }, [profile]);

  const history = useHistory();

  const [regForm, setRegForm] = useState([]);
  const [oldReg, setOldReg] = useState([]);

  const registerSchema = Yup.object().shape({
    organization: Yup.object()
      .required(
        t("member_registration.organization") + " " + t("errors.required")
      )
      .nullable(),
    function: Yup.object()
      .required(t("member_registration.function") + " " + t("errors.required"))
      .nullable(),
    responsible_organization: Yup.string()
      .required(
        t("member_registration.responsible_organization") +
          " " +
          t("errors.required")
      )
      .max(
        255,
        t("member_registration.responsible_organization") +
          " " +
          t("errors.max.before") +
          " 255 " +
          t("errors.max.after")
      )
      .trim()
      .nullable(),
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
        otherwise: Yup.date().typeError(t("errors.invalid_format")),
      })
      .nullable(),

    personal_id_card_no: Yup.string()
      .matches(
        /^[0-9]+$/,
        t("member_registration.passport_no") + " " + t("errors.number")
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
        otherwise: Yup.date().typeError(t("errors.invalid_format")),
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
        otherwise: Yup.string().max(
          255,
          t("member_registration.personal_id_card_issue_department") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        ),
      })
      .nullable(),
    sex: Yup.string()
      .required(t("member_registration.sex") + " " + t("errors.required"))
      .nullable(),
    height: Yup.string()
      .matches(
        /^[0-9]+$/,
        t("member_registration.height") + " " + t("errors.number")
      )
      .required(t("member_registration.height") + " " + t("errors.required"))
      .max(
        3,
        t("member_registration.height") +
          " " +
          t("errors.max.before") +
          " 3 " +
          t("errors.max.after")
      )
      .trim()
      .nullable(),
    weight: Yup.string()
      .matches(
        /^[0-9]+$/,
        t("member_registration.weight") + " " + t("errors.number")
      )
      .required(t("member_registration.weight") + " " + t("errors.required"))
      .max(
        3,
        t("member_registration.weight") +
          " " +
          t("errors.max.before") +
          " 3 " +
          t("errors.max.after")
      )
      .trim()
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
    team: Yup.object()
      .required(t("member_registration.team") + " " + t("errors.required"))
      .nullable(),
  });
  const formik = useFormik({
    initialValues: {
      // card_template: null,
      organization: null,
      function: null,
      responsible_organization: null,
      given_name: null,
      family_name: null,
      passport_no: null,
      passport_expire_date: null,
      personal_id_card_no: null,
      personal_id_card_issue_date: null,
      personal_id_card_issue_department: null,
      sex: null,
      height: null,
      weight: null,
      dob: null,
      permanent_address: null,
      sport: null,
      sport_discipline: null,
      profile_url: null,
      personal_id_card: null,
      country_of_birth: null,
      nationality: null,
      team: null,
      is_competitor: 1,
      is_referee: 1,
    },
    onSubmit: async (values, setFormik) => {
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
              case "organization":
                // formData.append("organization_id", values?.organization?.id);
                break;
              case "function":
              // formData.append("function_id", values?.function.id);
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
              case "file_scan":
                formData.append("file_scan", fileScan);
                break;
              case "doping_url":
                formData.append("doping_url", doping);
                break;
              default:
                formData.append(key, values?.[key]);
                break;
            }
          } else {
            formData.append(key, "");
          }
        });
        formData.append(
          "is_referee",
          values?.is_referee ? values?.is_referee : ""
        );
        formData.append(
          "is_competitor",
          values?.is_competitor ? values?.is_competitor : ""
        );
        formData.append("_method", params?.id ? "put" : "post");
        if (admin) {
          let res = await api.fetcher(
            "post",
            params?.id
              ? "/admin/participant/" + params?.id
              : "/admin/participant",
            formData
          );
          if (res) {
            history.goBack();
          }
        }
        if (user) {
          if (values?.downloadApplication) {
            formData.delete("_method");
            formData.append("_method", "post");
            let res = await api.fetcher(
              "post",
              `/team/downloadApplication/${params?.id}`,
              formData,
              { responseType: "blob" }
            );
            if (res) {
              formik.setFieldValue("downloadApplication", undefined);
              formData.delete("_method");
              const url = window.URL.createObjectURL(new Blob([res]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "ApplicaitonForm.pdf");
              document.body.appendChild(link);
              link.click();
            }
          } else {
            let res = await api.fetcher(
              "post",
              params?.id
                ? "/team/participant/" + params?.id
                : "/team/participant",
              formData
            );
            if (res) {
              history.goBack();
            }
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
  const awaitApproval = async () => {
    user && (await formik.setFieldValue("approval_status", 1));
    formik.handleSubmit();
  };
  const approve = async () => {
    await formik.setFieldValue("approval_status", 2);
    formik.handleSubmit();
  };

  const reject = async () => {
    await formik.setFieldValue("approval_status", 3);
    formik.handleSubmit();
  };

  const generateCard = async () => {
    try {
      await formik.setFieldValue("approval_status", 2);
      await formik.setFieldValue("render", 1);
      formik.handleSubmit();
    } catch (e) {}
  };

  const downloadFileScan = async () => {
    try {
      let res = await api.fetcher(
        "get",
        `/admin/downloadFileScan/${params?.id}?file_scan=true`,
        {},
        { responseType: "blob" }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        const fileScanDowndload = fileScan.split(".");
        link.setAttribute(
          "download",
          fileScanDowndload[fileScanDowndload.length - 1] == "pdf"
            ? "FileScan.pdf"
            : "FileScan.png"
        );
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };
  const downloadDoping = async (cardNo) => {
    try {
      let res = await api.fetcher(
        "get",
        `/admin/downloadDoping/${params?.id}`,
        {},
        { responseType: "blob" }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", cardNo + ".pdf");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };
  const downloadApplication = async () => {
    await formik.setFieldValue("downloadApplication", true);
    formik.handleSubmit();
  };
  const { data: cardDisplay } = useFetch(["get", "admin/displayCard/1"]);
  function Front() {
    return (
      <div
        style={{
          backgroundImage: `url(${
            process.env.MIX_REACT_APP_STORAGE_URL +
            "/" +
            cardDisplay?.background_url
          })`,
          paddingLeft: 17,
          position: "relative",
        }}
        className={`${classes.cardContainer}`}
      >
        {/* front top */}
        <Grid
          style={{
            paddingTop: 17,
            paddingBottom: 22,
          }}
          container
          justify="space-between"
        >
          <div className={classes.leftFront}>
            {profileImg ? (
              <img
                className={classes.avata}
                src={
                  typeof profileImg === "object"
                    ? profileImg?.preview
                    : process.env.MIX_REACT_APP_STORAGE_URL + "/" + profileImg
                }
                alt="avata"
              />
            ) : (
              <img
                className={classes.avata}
                src={
                  process.env.MIX_REACT_APP_PUBLIC_URL +
                  "/assets/images/noavata.png"
                }
                alt="avata"
              />
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ height: 121.3 }}>
              <img
                className={classes.frontLogo}
                src={
                  process.env.MIX_REACT_APP_STORAGE_URL +
                  "/" +
                  cardDisplay?.front_icon_url
                }
                alt="front-icon"
              />
            </div>
            <div
              style={{
                height: 40.43,
                backgroundColor: formik.values?.card_template?.background_color,
                color: formik.values?.card_template?.text_color,
                fontSize: 25,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {formik.values?.card_template?.text}
            </div>
          </div>
        </Grid>
        {/* Front middle */}
        <Grid className={classes.frontMiddle}>
          <div>
            {formik.values?.given_name} {formik.values?.family_name}
          </div>
          <div>{formik.values?.function?.english_name}</div>
          <div>{formik.values?.responsible_organization}</div>
          <div>{formik.values?.team?.english_name} </div>
        </Grid>
        {/* Front bottom */}
        <Grid className={classes.listIcon}>
          <div>
            {formik.values?.function?.area_relation?.map((e) => (
              <span>
                <img
                  className={classes.icon}
                  src={
                    process.env.MIX_REACT_APP_STORAGE_URL + "/" + e?.icon_url
                  }
                />
              </span>
            ))}
          </div>
          <div>
            {formik.values?.function?.zone_relation?.map((e) => (
              <span>
                <img
                  className={classes.icon}
                  src={
                    process.env.MIX_REACT_APP_STORAGE_URL + "/" + e?.icon_url
                  }
                />
              </span>
            ))}
          </div>
          <div>
            {formik.values?.function?.vehicle_relation?.map((e) => (
              <span>
                <img
                  className={classes.icon}
                  src={
                    process.env.MIX_REACT_APP_STORAGE_URL + "/" + e?.icon_url
                  }
                />
              </span>
            ))}
          </div>
        </Grid>
        <Grid>
          <div className={classes.barcode}>
            <img src={barcode} />
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              {formik.values?.card_no}
            </p>
          </div>
        </Grid>
      </div>
    );
  }
  function Back() {
    return (
      <div
        style={{
          backgroundImage: `url(${
            process.env.MIX_REACT_APP_STORAGE_URL +
            "/" +
            cardDisplay?.background_url
          })`,
          paddingTop: 10.5,
          position: "relative",
        }}
        className={`${classes.cardContainer}`}
      >
        <Grid className={classes.backTop} container>
          <div className={classes.backAvata}>
            {profileImg ? (
              <img
                src={
                  typeof profileImg === "object"
                    ? profileImg?.preview
                    : process.env.MIX_REACT_APP_STORAGE_URL + "/" + profileImg
                }
                alt="avata"
              />
            ) : (
              <img
                src={
                  process.env.MIX_REACT_APP_PUBLIC_URL +
                  "/assets/images/noavata.png"
                }
                alt="avata"
              />
            )}
          </div>
          <div className={classes.info}>
            <div style={{ fontWeight: "bolder", fontSize: 9 }}>
              {formik.values?.given_name} {formik.values?.family_name}
            </div>
            <table>
              <tr>
                <td>Nationality</td>
                <td>: {formik.values?.nationality?.name}</td>
              </tr>
              <tr>
                <td>D.O.B</td>
                <td>
                  :{" "}
                  {formik.values?.dob &&
                    moment(formik.values?.dob).format("DD/MM/YYYY")}
                </td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>: {CheckSex(formik.values?.sex, t)}</td>
              </tr>
              <tr>
                <td>Passport No/ID No</td>
                <td>
                  :{" "}
                  {formik.values?.passport_no
                    ? formik.values?.passport_no
                    : formik.values?.personal_id_card}
                </td>
              </tr>
            </table>
          </div>
          <div>
            <img
              style={{
                height: 68,
              }}
              src={
                process.env.MIX_REACT_APP_STORAGE_URL +
                "/" +
                cardDisplay?.back_icon_url
              }
            />
          </div>
        </Grid>
        <Grid className={classes.condition}>{cardDisplay?.condition_text}</Grid>
      </div>
    );
  }

  return (
    <Paper className={classes.container}>
      <Grid style={{ marginBottom: 10 }}>
        {profile?.approval_status === 1 && (
          <Status
            color={"warning"}
            text={t("member_registration.status.processing")}
          />
        )}
        {profile?.approval_status === 2 && (
          <Status
            color={"success"}
            text={t("member_registration.status.approved")}
          />
        )}
        {profile?.approval_status === 3 && (
          <Status
            color={"secondary"}
            text={t("member_registration.status.rejected")}
          />
        )}
      </Grid>
      <Grid className={classes.group}>
        {/* 1. Select Category and Responsible Organization for Job Function Selection/Chọn chức năng, vai trò trong tổ chức*/}
        <div className={classes.title}>
          1. {t("member_registration.group1")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              label={t("member_registration.organization") + " *"}
              queryField={"abbreviation_like"}
              labelField={"abbreviation"}
              endpoint="/admin/organization"
              handleChange={(e) => {
                formik.setFieldValue("organization", e);
                formik.setFieldValue("organization_id", e?.id);
                formik.setFieldValue("function", null);
                formik.setFieldValue("card_template", null);
              }}
              value={formik.values.organization}
              error={
                api.error?.organization_id ||
                (formik.touched.organization && formik.errors.organization)
              }
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Autocomplete
              label={t("member_registration.function") + " *"}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] === "en" ? "english_name" : "name"}
              endpoint={
                formik.values.organization
                  ? "/admin/function" +
                    "?organization_id_equal=" +
                    formik.values.organization?.id
                  : null
              }
              handleChange={(e) => {
                formik.setFieldValue("function", e);
                formik.setFieldValue("function_id", e?.id);
                formik.setFieldValue("card_template_id", e?.card_template_id);
                formik.setFieldValue("card_template", e?.card_template);
              }}
              params={{}}
              value={formik.values.function}
              error={
                api.error?.function_id ||
                (formik.touched.function && formik.errors.function)
              }
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Autocomplete
              freeSolo
              label={t("member_registration.card_template")}
              queryField="name_like"
              labelField="name"
              endpoint={null}
              // handleChange={(e) => {
              //   formik.setFieldValue("card_template", e);
              // }}
              value={formik.values.card_template}
              error={
                api.error?.card_template_id ||
                (formik.touched.card_template && formik.errors.card_template)
              }
              disabled={true}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  2. Responsible Organization/Tổ chức chịu trách nhiệm*/}
        <div className={classes.title}>
          2. {t("member_registration.group2")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={12} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.responsible_organization") + " *"}
              value={formik.values?.responsible_organization}
              handleChange={(e) =>
                formik.setFieldValue("responsible_organization", e)
              }
              error={
                api.error?.responsible_organization ||
                (formik.touched.responsible_organization &&
                  formik.errors.responsible_organization)
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  3. Full name as in passport/others travel document/Tên ghi trong hộ chiếu hoặc chứng minh thư*/}
        <div className={classes.title}>
          3. {t("member_registration.group3")}
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
          4. {t("member_registration.group4")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={6} xs={12}>
            <TextInput
              variant={"outlined"}
              label={t("member_registration.passport_no")}
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
                t("member_registration.passport_expire_date") + "(dd/mm/yyyy)"
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
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  5. Personal Identtity Card No. (Vietnam only)/Số chứng minh thư hoặc thẻ căn cước (CMT/CC)*/}
        <div className={classes.title}>
          5. {t("member_registration.group5")}
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
      <Grid className={classes.group}>
        <Grid item className={classes.group} md={4} xs={12}>
          {/*  6. Date of birth/Ngày sinh*/}
          <div className={classes.title}>
            6. {t("member_registration.group9") + "(DD/MM/YYYY) *"}
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
      </Grid>
      <Grid className={classes.group}>
        {/*  7. sex/Giới tính*/}
        <div className={classes.title}>
          7. {t("member_registration.group6") + " *"}
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
            error={api.error?.sex || (formik.touched.sex && formik.errors.sex)}
          />
        </Grid>
      </Grid>
      <Grid justify="center" container spacing={1}>
        <Grid item className={classes.group} md={6} xs={12}>
          {/*  8. Height/Chiều cao*/}
          <div className={classes.title}>
            8. {t("member_registration.group7") + "(cm) *"}
          </div>
          <TextInput
            variant={"outlined"}
            label={t("member_registration.height")}
            value={formik.values?.height}
            handleChange={(e) => formik.setFieldValue("height", e)}
            error={
              api.error?.height ||
              (formik.touched.height && formik.errors.height)
            }
          />
        </Grid>
        <Grid item className={classes.group} md={6} xs={12}>
          {/*  9. Weight/Cân nặng*/}
          <div className={classes.title}>
            9. {t("member_registration.group8") + "(kg) *"}
          </div>
          <TextInput
            variant={"outlined"}
            label={t("member_registration.weight")}
            value={formik.values?.weight}
            handleChange={(e) => formik.setFieldValue("weight", e)}
            error={
              api.error?.weight ||
              (formik.touched.weight && formik.errors.weight)
            }
          />
        </Grid>
      </Grid>
      <Grid justify="center" container spacing={1}>
        <Grid item className={classes.group} md={4} xs={12}>
          {/*  10. Category of birth/Nơi sinh*/}
          <div className={classes.title}>
            10. {t("member_registration.group10") + " *"}
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
        <Grid item className={classes.group} md={4} xs={12}>
          {/*  11. Nationality/Quốc tịch*/}
          <div className={classes.title}>
            11. {t("member_registration.group11") + " *"}
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
        <Grid item className={classes.group} md={4} xs={12}>
          {/*  12. NOC/Đoàn*/}
          <div className={classes.title}>
            12. {t("member_registration.group12") + " *"}
          </div>
          <Autocomplete
            disabled={user ? true : false}
            label={t("member_registration.team")}
            params={{ perm: true }}
            queryField={"name_like"}
            labelField={i18n.language == "vi" ? "name" : "english_name"}
            endpoint="/admin/team"
            handleChange={(e) => formik.setFieldValue("team", e)}
            value={formik.values.team}
            error={
              api.error?.team_id || (formik.touched.team && formik.errors.team)
            }
          />
        </Grid>
      </Grid>
      <Grid className={classes.group}>
        {/*  13. Permanent Address/Địa chỉ thường trú*/}
        <div className={classes.title}>
          13. {t("member_registration.group13")}
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
      <Grid className={classes.group}>
        {/*  14. Sport/Discipline/Môn thể thao:*/}
        <div className={classes.title}>
          14. {t("member_registration.group14")}
        </div>
        <Grid justify="center" container spacing={1}>
          <Grid item md={6} xs={12}>
            <Autocomplete
              label={t("member_registration.sport")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] === "en" ? "english_name" : "name"}
              endpoint="/admin/sport"
              handleChange={(e) => {
                formik.setFieldValue("sport", e);
                formik.setFieldValue("sport_id", e?.id);
                if (formik.values?.sport_discipline) {
                  formik.setFieldValue("sport_discipline", null);
                  formik.setFieldValue("sport_discipline_id", null);
                }
              }}
              value={formik.values.sport}
              error={
                api.error?.sport_id ||
                (formik.touched.sport && formik.errors.sport)
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Autocomplete
              disabled={!formik.values?.sport}
              label={t("member_registration.sport_discipline")}
              queryField={
                i18n.languages[0] === "en" ? "english_name_like" : "name_like"
              }
              labelField={i18n.languages[0] === "en" ? "english_name" : "name"}
              endpoint={
                "/admin/sportDiscipline?sport_id_equal=" +
                formik.values?.sport?.id
              }
              handleChange={(e) => {
                formik.setFieldValue("sport_discipline", e);
                if (e == null) {
                  formik.setFieldValue("sport_discipline_id", null);
                }
              }}
              value={formik.values?.sport_discipline}
              error={
                api.error?.sport_discipline_id ||
                (formik.touched.sport_discipline &&
                  formik.errors.sport_discipline)
              }
            />
          </Grid>
        </Grid>
        <div className={classes.note}>
          {t("member_registration.sport_note")}
        </div>
      </Grid>
      <Grid justify="center" container spacing={1}>
        <Grid item md={6} xs={12} className={classes.group}>
          {/*  15. Register People Picture */}
          <div className={classes.title}>
            15. {t("member_registration.group15") + " *"}
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
        <Grid item md={6} xs={12} className={classes.group}>
          {/*  16. Photo copy of valid passport */}
          <div className={classes.title}>
            16. {t("member_registration.group16")}
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
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        {/* {user && (
                    <Grid item md={6} xs={12} className={classes.group}>
                        <div className={classes.title}>
                            17. {t("member_registration.file_scan")}
                        </div>
                        <Grid style={{ width: 300, height: 400 }}>
                            <UploadOnePicture
                                files={fileScan}
                                setFiles={setFileScan}
                                accept={[".pdf"]}
                                title={i18n.t("drag_drop.default")}
                                height={400}
                                width={300}
                                readOnly={!user ? true : false}
                            />
                        </Grid>
                    </Grid>
                )} */}
        {/* {user && params?.id && (
                    <Grid item md={6} xs={12} className={classes.group}>
                        <div className={classes.title}>
                            {t("member_registration.doping")}
                        </div>
                        <Grid className={classes.note}>
                            {t("member_registration.profile_url_note")}
                        </Grid>
                        <Grid style={{ width: 300, height: 400 }}>
                            <UploadOnePicture
                                accept={"application/pdf"}
                                files={doping}
                                setFiles={setDoping}
                                title={i18n.t("drag_drop.default")}
                                height={400}
                                width={300}
                                readOnly={!user ? true : false}
                            />
                        </Grid>
                    </Grid>
                )} */}
        {admin && params?.id && (
          <Grid container spacing={1}>
            {/* <Grid item md={6} xs={12} className={classes.group}>
                            <div className={classes.title}>
                                17. {t("member_registration.file_scan")}
                            </div>
                            <Grid style={{ width: 300, height: 400 }}>
                                <Grid
                                    onClick={fileScan ? downloadFileScan : null}
                                >
                                    <UploadOnePicture
                                        files={fileScan}
                                        setFiles={setFileScan}
                                        title={
                                            fileScan
                                                ? i18n.t("drag_drop.default")
                                                : t(
                                                      "member_registration.no_file_scan"
                                                  )
                                        }
                                        height={"400px"}
                                        width={"auto"}
                                        readOnly={!user ? true : false}
                                    />
                                </Grid>
                            </Grid>
                        </Grid> */}
            {/* <Grid item md={6} xs={12} className={classes.group}>
                            <div className={classes.title}>
                                {t("member_registration.doping")}
                            </div>
                            <Grid className={classes.note}>
                                {t("member_registration.profile_url_note")}
                            </Grid>
                            <Grid style={{ width: 300, height: 400 }}>
                                <Grid
                                    onClick={() =>
                                        doping
                                            ? downloadDoping(
                                                  formik?.values?.card_no
                                              )
                                            : null
                                    }
                                >
                                    <UploadOnePicture
                                        accept={"application/pdf"}
                                        files={doping}
                                        setFiles={setDoping}
                                        title={
                                            doping
                                                ? i18n.t("drag_drop.default")
                                                : t(
                                                      "member_registration.no_doping"
                                                  )
                                        }
                                        height={"400px"}
                                        width={"auto"}
                                        readOnly={!user ? true : false}
                                    />
                                </Grid>
                            </Grid>
                        </Grid> */}
          </Grid>
        )}

        {/* {params?.id && formik?.values?.approval_status === 2 && (
                    <Grid item className={classes.group} md={6} xs={12}>
                        <div className={classes.title}>
                            18. {t("member_registration.printed_status")}
                        </div>
                        <Grid justify="flex-start" container spacing={1}>
                            <Radios
                                value={formik.values.printed_status}
                                handleChange={(e) => {
                                    formik.setFieldValue("printed_status", e);
                                    if (e == 1) {
                                        formik.setFieldValue(
                                            "received_status",
                                            1
                                        );
                                    }
                                }}
                                flexDirection={"row"}
                                options={[
                                    {
                                        label: t("print.NotPrintedYet"),
                                        value: 1,
                                    },
                                    {
                                        label: t("print.printed"),
                                        value: 2,
                                    },
                                ]}
                                error={
                                    api.error?.printed_status ||
                                    (formik.touched.printed_status &&
                                        formik.errors.printed_status)
                                }
                            />
                        </Grid>
                    </Grid>
                )} */}
        {/* {params?.id && formik?.values?.approval_status === 2 && (
                    <Grid item className={classes.group} md={6} xs={12}>
                        <div className={classes.title}>
                            19. {t("member_registration.received_status")}
                        </div>
                        <Grid justify="flex-start" container spacing={1}>
                            <Radios
                                value={formik.values.received_status}
                                handleChange={(e) => {
                                    formik.setFieldValue("received_status", e);
                                    if (e == 2) {
                                        formik.setFieldValue(
                                            "printed_status",
                                            2
                                        );
                                    }
                                }}
                                flexDirection={"row"}
                                options={[
                                    {
                                        label: t("receive.NotReceivedYet"),
                                        value: 1,
                                    },
                                    {
                                        label: t("receive.received"),
                                        value: 2,
                                    },
                                ]}
                                error={
                                    api.error?.received_status ||
                                    (formik.touched.received_status &&
                                        formik.errors.received_status)
                                }
                            />
                        </Grid>
                    </Grid>
                )} */}

        <Grid container>
          {!profile && (
            <ButtonSolashi
              onClick={formik.handleSubmit}
              variant="contained"
              color="primary"
            >
              {t("member_registration.registration")}
            </ButtonSolashi>
          )}
          {(profile?.approval_status == 1 || profile?.approval_status == 2) &&
          admin &&
          checkPerm(perms, "register_management_edit") ? (
            <ButtonSolashi
              onClick={() => awaitApproval()}
              variant="contained"
              color="primary"
            >
              {t("member_registration.save")}
            </ButtonSolashi>
          ) : (
            (profile?.approval_status == 1 || profile?.approval_status == 2) &&
            user &&
            checkPerm(perms, "register_management_edit") && (
              <>
                <ButtonSolashi
                  onClick={() => awaitApproval()}
                  variant="contained"
                  color="primary"
                  loading={api.loading}
                >
                  {t("member_registration.save")}
                </ButtonSolashi>
                <ButtonSolashi
                  onClick={() => downloadApplication()}
                  variant="contained"
                  color="primary"
                  loading={api.loading}
                >
                  {t("member_registration.download_application")}
                </ButtonSolashi>
              </>
            )
          )}
          {profile?.approval_status == 3 &&
          admin &&
          checkPerm(perms, "register_management_edit") ? (
            <ButtonSolashi
              onClick={() => awaitApproval()}
              variant="contained"
              color="primary"
            >
              {t("member_registration.save")}
            </ButtonSolashi>
          ) : (
            profile?.approval_status == 3 &&
            user &&
            checkPerm(perms, "register_management_edit") && (
              <ButtonSolashi
                onClick={() => awaitApproval()}
                variant="contained"
                color="primary"
              >
                {t("member_registration.save")}
              </ButtonSolashi>
            )
          )}
          {admin && profile?.approval_status == 1 && (
            <>
              <ApproveButton onClick={() => approve()} variant="contained">
                {t("member_registration.approve")}
              </ApproveButton>
              <RejectButton onClick={() => reject()} variant="contained">
                {t("member_registration.reject")}
              </RejectButton>
            </>
          )}
          {/* {admin && profile?.approval_status == 2 && (
            <ButtonSolashi
              onClick={() => generateCard()}
              variant="contained"
              style={{ backgroundColor: color.success, color: "#fff" }}
              loading={api.loading}
            >
              {t("member_registration.render")}
            </ButtonSolashi>
          )} */}
          {/* {user && profile?.approval_status == 1 && (
            <ButtonSolashi
              onClick={() => downloadApplication()}
              variant="contained"
              style={{ backgroundColor: color.success, color: "#fff" }}
              loading={api.loading}
            >
              {t("member_registration.download_application")}
            </ButtonSolashi>
          )} */}
        </Grid>
      </Grid>
    </Paper>
  );
}
