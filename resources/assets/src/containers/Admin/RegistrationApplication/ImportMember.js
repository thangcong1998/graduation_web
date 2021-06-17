import React, { useState, useEffect, Fragment, useContext } from "react";
import {
  ButtonGroup,
  Button,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Card,
  Stepper,
  Step,
  StepConnector,
  StepLabel,
  Tab,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import * as XLSX from "xlsx";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../../../api/api";
import * as Yup from "yup";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CheckIcon from "@material-ui/icons/Check";
import { ErrorMessage, setIn, useFormik } from "formik";
import xlsxThumb from "../../../assets/thumbnail/xlsx-thumbnail.svg";
import { useHistory, useParams } from "react-router-dom";
import UploadFle from "../../../components/form/UploadFile3";
import Moment from "moment";
import SaveIcon from "@material-ui/icons/Save";
import { green } from "@material-ui/core/colors";
import CancelIcon from "@material-ui/icons/Cancel";
import clsx from "clsx";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import noImage from "../../../assets/thumbnail/no_image1.jpg";
import TablePagination from "@material-ui/core/TablePagination";
import { AuthContext } from "../../AuthProvider";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default function ImportMember(props) {
  const { row, close, refetch } = props;
  const classes = useStyle();
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [base64, setBase64] = useState();
  const history = useHistory();
  const [member, setMember] = useState([]);
  const [activeStep, setAcitveStep] = useState(0);
  const [dataMember, setDataMember] = useState([]);
  const steps = ["Upload excel", "Upload image", "Preview"];
  const [loadingApi, setLoadingApi] = useState([]);
  const [success, setSuccess] = useState([]);
  const [showColumn, setShowColumn] = useState(false);
  const [rowSuccess, setRowSuccess] = useState(0);
  const [rowFailed, setRowFailed] = useState(0);
  const [open, setOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [err, setErr] = useState([]);
  const { admin, user, perms } = useContext(AuthContext);
  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const endpoint = "admin";

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [progress, setProgress] = React.useState(0);

  const prevProgress = rowFailed + rowSuccess;

  function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

  useEffect(() => {
    setProgress(((rowFailed + rowSuccess) / member.length) * 100);
  }, [rowFailed, rowSuccess]);

  useEffect(() => {
    let store = async (data, idx) => {
      let formData = new FormData();
      formData.append("given_name", data?.given_name);
      formData.append("family_name", data?.family_name);
      if (data?.passport_no) {
        formData.append(
          "passport_no",
          data?.passport_no ? data.passport_no : ""
        );
      }
      formData.append(
        "personal_id_card_no",
        data?.personal_id_card_no ? data.personal_id_card_no : ""
      );
      formData.append(
        "personal_id_card_issue_department",
        data?.personal_id_card_issue_department
          ? data.personal_id_card_issue_department
          : ""
      );
      formData.append("sex", data?.sex);
      formData.append("weight", data?.weight);
      formData.append("height", data?.height);
      formData.append(
        "responsible_organization",
        data?.responsible_organization
      );
      formData.append("card_template_id", data?.function?.card_template_id);
      formData.append("organization_id", data?.organization?.id);
      formData.append("function_id", data?.function.id);
      if (data?.sport) {
        formData.append("sport_id", data?.sport?.id);
      }
      formData.append("country_of_birth_id", data?.country_of_birth?.id);
      formData.append("nationality_id", data?.nationality?.id);
      formData.append("team_id", data?.team?.id);
      formData.append(
        "permanent_address",
        data?.permanent_address ? data?.permanent_address : ""
      );
      formData.append("profile_url", data?.image ? data.image : "");
      // formData.append("approval_status", 1);
      if (data?.dob) {
        formData.append(
          "dob",
          Moment(data?.dob, "DD-MM-YYYY").format("YYYY-MM-DD")
        );
      }

      if (data?.passport_expire_date) {
        formData.append(
          "passport_expire_date",
          Moment(data?.passport_expire_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        );
      }
      if (data?.personal_id_card_issue_date) {
        formData.append(
          "personal_id_card_issue_date",
          Moment(data?.personal_id_card_issue_date, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          )
        );
      }
      setShowColumn(true);
      if (parseInt(idx) === 0) {
        setLoadingApi((pre) =>
          pre.map((x, index) => (index === parseInt(idx) ? true : true))
        );
      }
      try {
        let res = await api.fetcher(
          "post",
          `${endpoint}/participant`,
          formData
        );
        if (res?.data || res?.message) {
          setRowSuccess((rowSuccess) => rowSuccess + 1);

          setLoadingApi((pre) =>
            pre.map((x, index) => (index === parseInt(idx) ? false : x))
          );
          setSuccess((pre) =>
            pre.map((x, index) => (index === parseInt(idx) ? true : x))
          );
        }
      } catch (e) {
        if (e?.data || e) {
          setErr((pre) =>
            pre?.map((x, index) =>
              index === parseInt(idx) ? e?.data?.errors : x
            )
          );
          setRowFailed((rowFailed) => rowFailed + 1);

          setLoadingApi((pre) =>
            pre.map((x, index) => (index === parseInt(idx) ? false : x))
          );

          setSuccess((pre) =>
            pre.map((x, index) => (index === parseInt(idx) ? false : x))
          );
        }
        return e;
      }
    };
    setDataMember(member?.map((e, index) => ({ store: store })));
  }, [member]);
  const registerSchema = Yup.object({
    member: Yup.array().of(
      Yup.object().shape({
        responsible_organization: Yup.string().required(
          t("member_registration.responsible_organization") +
            " " +
            t("errors.required")
        ),
        organization: Yup.object().required(
          t("member_registration.organization") + " " + t("errors.required")
        ),
        function: Yup.string()
          .required(
            t("member_registration.function") + " " + t("errors.required")
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
          .nullable(),
        passport_no: Yup.string()
          .when("personal_id_card_no", {
            is: (v) => v == null,
            then: Yup.string()
              .required(
                t("member_registration.passport_no") +
                  " " +
                  t("errors.required")
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
            otherwise: null,
          })
          .nullable(),
        passport_expire_date: Yup.string()
          .when("personal_id_card_no", {
            is: (v) => v == null,
            then: Yup.string()
              .required(
                t("member_registration.passport_expire_date") +
                  " " +
                  t("errors.required")
              )
              .nullable(),
            otherwise: null,
          })
          .nullable(),
        personal_id_card_no: Yup.string()
          .max(
            12,
            t("member_registration.passport_no") +
              " " +
              t("errors.max.before") +
              " 12 " +
              t("errors.max.after")
          )
          .nullable(),
        personal_id_card_issue_date: Yup.string()
          .when("personal_id_card_no", {
            is: (v) => v != null,
            then: Yup.string()
              .required(
                t("member_registration.personal_id_card_issue_date") +
                  " " +
                  t("errors.required")
              )
              .nullable(),
            otherwise: null,
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
          .required(
            t("member_registration.height") + " " + t("errors.required")
          )
          .max(
            3,
            t("member_registration.height") +
              " " +
              t("errors.max.before") +
              " 3 " +
              t("errors.max.after")
          )
          .nullable(),
        weight: Yup.string()
          .matches(
            /^[0-9]+$/,
            t("member_registration.weight") + " " + t("errors.number")
          )
          .required(
            t("member_registration.weight") + " " + t("errors.required")
          )
          .max(
            3,
            t("member_registration.weight") +
              " " +
              t("errors.max.before") +
              " 3 " +
              t("errors.max.after")
          )
          .nullable(),
        dob: Yup.string()
          .required(t("member_registration.dob") + " " + t("errors.required"))
          .max(new Date(), t("errors.maxDate"))
          .typeError(t("errors.invalid_format"))
          .nullable(),
        team: Yup.object()
          .required(t("member_registration.team") + "" + t("errors.required"))
          .nullable(),
      })
    ),
  });
  const formik = useFormik({
    initialValues: {
      member: "",
    },
    onSubmit: async (values) => {
      for (let i in dataMember) {
        let a = await dataMember[i].store(values.member[i], i);
      }
    },
    validationSchema: registerSchema,
  });
  const [files, setFiles] = useState();
  useEffect(() => {
    if (files) {
      formik.setFieldValue("icon", true);
    }
  }, [files]);
  useEffect(() => {
    if (row) setFiles(row?.icon);
  }, []);
  useEffect(() => {
    formik.setFieldValue("member", member);
  }, [member]);

  useEffect(() => {
    if (member?.length > 0) {
      let newArr = [];
      let successArr = [];
      let a = member?.forEach((e, index) => {
        newArr.push(false);
        successArr.push(index);
      });
      setLoadingApi([...newArr]);
      setSuccess([...successArr]);
      setErr([...successArr]);
    }
  }, [member]);
  const { data: organization } = useFetch([
    "get",
    "/admin/organization?per_page=300",
  ]);

  const { data: functions } = useFetch(["get", "/admin/function?per_page=300"]);
  const { data: sports } = useFetch(["get", "/admin/sport?per_page=300"]);
  const { data: countries } = useFetch(["get", "/admin/country?per_page=300"]);
  const { data: teams } = useFetch(["get", "/admin/team?per_page=300"]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  function getBase64(file, onLoadCallback) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  useEffect(() => {
    if (newFiles?.length > 0) {
      setTimeout(() => {
        setMember((pre) =>
          pre.map((e) => ({
            ...e,
            image: newFiles.find((x) => x.name === e.profile_img),
          }))
        );
      }, 1000);
    }
  }, [newFiles]);

  function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  }
  const handleImport = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        for (var i = 0; i < data.length; i++) {
          if (data[i].length == "") data.splice(i--, 1);
        }
        /* Update state */
        setMember(
          data
            .filter((z, index) => index > 0)
            .map((e, index) => ({
              // card_template: e[0],
              no: index + 1,
              profile_img: e[19],
              organization: organization?.data.find(
                (x) => x.abbreviation == e[1]
              ),
              function: functions?.data.find((x) => x.english_name === e[2]),
              responsible_organization: e[0],
              given_name: e[3],
              family_name: e[4],
              passport_no: e[5],
              passport_expire_date:
                e[6] && Moment(ExcelDateToJSDate(e[6])).format("DD-MM-YYYY"),
              personal_id_card_no: e[7],
              personal_id_card_issue_date:
                e[8] && Moment(ExcelDateToJSDate(e[8])).format("DD-MM-YYYY"),
              personal_id_card_issue_department: e[9],
              sex: e[10]?.toLowerCase() === "female" ? 1 : 2,
              dob:
                e[11] && Moment(ExcelDateToJSDate(e[11])).format("DD-MM-YYYY"),
              weight: e[12] && parseInt(e[12]),
              height: e[13] && parseInt(e[13]),
              country_of_birth: countries?.data.find((x) => x.name === e[14]),
              nationality: countries?.data.find((x) => x.name === e[15]),
              team: teams?.data.find((x) => x.english_name === e[16]),
              permanent_address: e[17],
              sport: sports?.data.find((x) => x.english_name === e[18]),
            }))
        );
      };
      reader.readAsBinaryString(f);
    }
  };

  const downLoadExcel = async () => {
    try {
      let v = Math.random();
      const link = document.createElement("a");
      admin
        ? (link.href =
            process.env.MIX_REACT_APP_API_URL + "/personalInfoDownloadExcel?v=" + v)
        : (link.href =
            process.env.MIX_REACT_APP_API_URL + "/memberDownloadExcel?v=" + v);
      link.setAttribute("download", "RegisterForm.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (e) {}
  };

  const handleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.name != file.name));
    }
  };

  function handleBack() {
    if (activeStep == 1) {
      setAcitveStep(0);
    }
    if (activeStep == 3) {
      setAcitveStep(1);
    }
  }
  function handleNext() {
    if (activeStep < 2) {
      setAcitveStep(1);
    }
  }
  function handleSkip() {
    setAcitveStep(3);
  }
  const ButtonImport = (
    <div>
      <input
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={(e) => handleImport(e)}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ marginRight: 5 }}
          // style={{ marginBottom: 20 }}
        >
          Upload
        </Button>
        <a style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 5 }}
            endIcon={<CloudDownloadIcon />}
            onClick={() => downLoadExcel()}
          >
            {t("member_registration.example_list")}
          </Button>
        </a>
      </label>
    </div>
  );
  const Step1 = (
    <div>
      {ButtonImport}
      {member.length > 0 && (
        <img className={classes.thumbImg} src={xlsxThumb} />
      )}
    </div>
  );

  const Step2 = (
    <div>
      <div style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <UploadFle
          accept={"image/*"}
          newFiles={newFiles}
          setNewFiles={setNewFiles}
          multiple={true}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );

  const Step3 = (
    <div>
      {member?.length > 0 &&
        formik.errors?.member == undefined &&
        rowFailed + rowSuccess != member.length && (
          <Button
            color="primary"
            variant="contained"
            style={{ marginBottom: 10 }}
            onClick={() => {
              setOpen(true);
              formik.handleSubmit();
            }}
          >
            {t("member_registration.save")}
          </Button>
        )}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        title="dialog"
      >
        <div style={{ height: 200, width: 400, padding: 10 }}>
          {/* <DialogTitle id="alert-dialog-title">
            Import member
            <div></div> */}
          {/* {rowSuccess + rowFailed == member.length
              ? "Done" + (rowSuccess + rowFailed) + "/" + member.length
              : "Processing" + (rowSuccess + rowFailed) + "/" + member.length} */}
          {/* </DialogTitle> */}

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Fragment>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon
                    style={{ color: "green", display: "inline" }}
                  />
                  <span style={{ display: "inline" }}>
                    {rowSuccess + t("process.success")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CancelIcon style={{ color: "red", display: "inline" }} />
                  <span style={{ display: "inline" }}>
                    {rowFailed + t("process.failed")}
                  </span>
                </div>
              </Fragment>
            </DialogContentText>
          </DialogContent>
          <div>
            {rowSuccess + rowFailed == member.length
              ? t("process.successful") +
                ":" +
                " " +
                rowSuccess +
                "/" +
                member.length
              : t("process.processing") +
                ":" +
                " " +
                (rowSuccess + rowFailed) +
                "/" +
                member.length}
          </div>
          <div style={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress ? progress : 0} />
          </div>

          <DialogActions>
            <Button
              onClick={() => {
                err.some((x) => typeof x === "object")
                  ? setOpen(false)
                  : history.goBack();
              }}
              color="primary"
              autoFocus
            >
              Ok
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      <div style={{ display: "flex", overflow: "auto" }}>
        <TableContainer className={classes.LaborsTable}>
          <Table aria-label={"caption table"}>
            <TableBody>
              <TableRow>
                {showColumn && (
                  <TableCell
                    style={{ width: 50 }}
                    className={classes.headerList}
                  >
                    <p>{t("member_registration.processing")}</p>
                  </TableCell>
                )}
                {formik?.errors.member && (
                  <TableCell className={classes.headerList}>
                    <p>{t("member_registration.errors")}</p>
                  </TableCell>
                )}
                <TableCell className={classes.headerList} style={{ width: 50 }}>
                  STT
                </TableCell>
                <TableCell
                  style={{ width: "30%" }}
                  className={classes.headerList}
                  size={"medium"}
                >
                  {t("member_registration.register_people_picture") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.responsible_organization") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.organization") + " *"}{" "}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.function") + " *"}{" "}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.given_name") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.family_name") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group4") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.passport_expire_date") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group5") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.personal_id_card_issue_date") +
                    "(DD/MM/YYYY)"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.personal_id_card_issue_department")}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group6") + " *"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group9")}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group8") + " (kg)"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group7") + " (cm)"}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group10")}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.nationality")}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.team")}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group13")}
                </TableCell>
                <TableCell className={classes.headerList}>
                  {t("member_registration.group14")}
                </TableCell>
              </TableRow>
              {member
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow>
                    {showColumn && (
                      <TableCell className={classes.tableCell}>
                        <div className={classes.wrapper}>
                          {success[row?.no - 1] === true && (
                            <Fab
                              aria-label="save"
                              color="primary"
                              className={buttonClassname}
                            >
                              {success[row?.no - 1] === true && (
                                <CheckIcon style={{ color: "white" }} />
                              )}
                            </Fab>
                          )}
                          {success[row?.no - 1] === false && (
                            <Fab aria-label="save" color="secondary">
                              {success[row?.no - 1] === false && (
                                <CancelIcon style={{ color: "white" }} />
                              )}
                            </Fab>
                          )}
                          {loadingApi[row?.no - 1] && (
                            <CircularProgress
                              size={68}
                              className={classes.fabProgress}
                            />
                          )}
                        </div>
                      </TableCell>
                    )}
                    {formik?.errors.member && (
                      <TableCell className={classes.headerList}>
                        <div className={classes.wrapper}>
                          {formik?.errors.member?.[row?.no - 1] ==
                            undefined && (
                            <Fab
                              aria-label="save"
                              color="primary"
                              className={buttonClassname}
                            >
                              {formik?.errors.member?.[row?.no - 1] ==
                                undefined && (
                                <CheckIcon style={{ color: "white" }} />
                              )}
                            </Fab>
                          )}
                          {formik?.errors?.member?.[row?.no - 1] && (
                            <Fab aria-label="save" color="secondary">
                              <CancelIcon style={{ color: "white" }} />
                            </Fab>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className={classes.tableCell}>
                      {row?.no}
                    </TableCell>
                    <TableCell className={classes.tableCell1}>
                      <img
                        alt=""
                        src={
                          row?.image?.preview ? row?.image?.preview : noImage
                        }
                        style={{ width: "100%" }}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.responsible_organization}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {
                          formik?.errors?.member?.[row?.no - 1]
                            ?.responsible_organization
                        }
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p>{row?.organization?.abbreviation}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.organization}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p>{row?.function?.english_name}</p>
                      <p style={{ color: "red" }}>
                        {formik?.errors?.member?.[row?.no - 1]?.function}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.given_name}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.given_name}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.family_name}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.family_name}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.passport_no}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {success[row?.no - 1] === false
                          ? err[row?.no - 1]?.passport_no ||
                            formik?.errors?.member?.[row?.no - 1]?.passport_no
                          : formik?.errors?.member?.[row?.no - 1]?.passport_no}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.passport_expire_date}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {success[row?.no - 1] === false
                          ? err[row?.no - 1]?.passport_expire_date ||
                            formik?.errors?.member?.[row?.no - 1]
                              ?.passport_expire_date
                          : formik?.errors?.member?.[row?.no - 1]
                              ?.passport_expire_date}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.personal_id_card_no}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {success[row?.no - 1] === false
                          ? err[row?.no - 1]?.personal_id_card_no ||
                            formik?.errors?.member?.[row?.no - 1]
                              ?.personal_id_card_no
                          : formik?.errors?.member?.[row?.no - 1]
                              ?.personal_id_card_no}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.personal_id_card_issue_date}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {
                          formik?.errors?.member?.[row?.no - 1]
                            ?.personal_id_card_issue_date
                        }
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.personal_id_card_issue_department}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {
                          formik?.errors?.member?.[row?.no - 1]
                            ?.personal_id_card_issue_department
                        }
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.sex == 1 ? "female" : "male"}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.sex}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.dob}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {success[row?.no - 1] === false
                          ? err[row?.no - 1]?.dob ||
                            formik?.errors?.member?.[row?.no - 1]?.dob
                          : formik?.errors?.member?.[row?.no - 1]?.dob}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.weight}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.weight}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.height}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.height}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.country_of_birth?.name}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {
                          formik?.errors?.member?.[row?.no - 1]
                            ?.country_of_birth
                        }
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p>{row?.nationality?.name}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.nationality}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p>{row?.team?.english_name}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.team}
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>{row?.permanent_address}</p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {
                          formik?.errors?.member?.[row?.no - 1]
                            ?.permanent_address
                        }
                      </p>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <p style={{ color: "#000" }}>
                        {row?.sport?.english_name}
                      </p>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {formik?.errors?.member?.[row?.no - 1]?.sport}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <TablePagination
        labelRowsPerPage={t("member_screen.rows_per_page")}
        rowsPerPageOptions={[50, 100, 150]}
        component="div"
        count={member.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
  return (
    <React.Fragment>
      <Card style={{ padding: 10 }}>
        <ButtonGroup
          style={{ paddingTop: 20, paddingBottom: 20, marginBottom: 10 }}
        >
          {activeStep === 1 && (
            <Button variant="contained" onClick={handleBack}>
              {t("member_registration.back")}
            </Button>
          )}
          {activeStep === 3 && (
            <Button variant="contained" onClick={handleBack}>
              {t("member_registration.back")}
            </Button>
          )}
          {activeStep === 0 && (
            <Button variant="contained" color="primary" onClick={handleNext}>
              {t("member_registration.next")}
            </Button>
          )}
          {activeStep === 1 && (
            <Button variant="contained" color="primary" onClick={handleSkip}>
              {t("member_registration.next")}
            </Button>
          )}
        </ButtonGroup>
        <div>
          <div>
            <Stepper
              // style={{ justifyContent: "center" }}
              connector={<StepConnector style={{ maxWidth: 200 }} />}
              activeStep={activeStep}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel className={classes.steplabel} {...labelProps}>
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </div>
        </div>
        {activeStep === 0 && Step1}
        {activeStep === 1 && Step2}
        {activeStep === 3 && Step3}
      </Card>

      {/* {Step2} */}
    </React.Fragment>
  );
}
const useStyle = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  LaborsTable: {
    marginTop: 10,
  },
  headerList: {
    fontSize: "1rem",
    fontWeight: "bold",
    border: " 1px solid black",
  },
  tableCell1: {
    fontSize: "1rem",
    fontWeight: 400,
    border: " 1px solid black",
    padding: 5,
  },
  tableCell: {
    fontSize: "1rem",
    fontWeight: 400,
    border: " 1px solid black",
  },
  thumbImg: {
    width: 200,
    minHeight: 200,
    zIndex: 0,
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  steplabel: {
    "& span": {
      fontSize: "1rem",
      "& span": {
        fontSize: 21,
      },
    },
  },
}));
