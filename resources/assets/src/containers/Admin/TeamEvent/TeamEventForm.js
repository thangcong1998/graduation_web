import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Paper,
  TableRow,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableCell,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import Autocomplete from "../../../components/form/Autocomplete";
import * as Yup from "yup";
import { useParams, useHistory } from "react-router-dom";
import { useAPI } from "../../../api/api";
import { useFetch } from "../../../api/api";
import { useTranslation } from "react-i18next";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Filter from "../../../components/table/Filter";
import MemberInput from "./MemberInput";

export default function TeamEventForm() {
  const { t, i18n } = useTranslation();
  const params = useParams();

  const history = useHistory();
  const api = useAPI();
  const [dataSearch, setDataSearch] = useState({
    team_id_equal: 1000,
    per_page: 10000,
  });
  const formData = new FormData();
  const [searchPerson, setSearchPerson] = useState();
  const [arrayMember, setArrayMember] = useState([]);
  const [teamId, setTeamId] = useState();
  const [sportId, setSportId] = useState();
  const [disciplineId, setDisciplineId] = useState();
  const [eventId, setEventId] = useState();
  const [person, setPerson] = useState([]);
  const [check, setCheck] = useState(false);
  const [totalValue, setTotalValue] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [startList, setStartList] = useState(0);
  const [endList, setEndList] = useState(totalValue - 1);
  useEffect(() => {
    setPage(Math.ceil((endList + 1) / totalValue));
    setTotalPage(Math.ceil(person.length));
  }, [person, endList, startList, totalValue]);
  useEffect(() => {
    setStartList(0);
    if (person.length <= totalValue) {
      setEndList(person.length - 1);
    } else {
      setEndList(totalValue - 1);
    }
  }, [totalValue, person.length]);

  const formik = useFormik({
    initialValues: {
      team_id: null,
      sport_id: null,
      discipline_id: null,
      event_id: null,
      name: null,
    },
    onSubmit: async (values) => {
      formData.append("team_id", values?.team_id ? values?.team_id?.id : "");
      formData.append("event_id", values?.event_id ? values?.event_id?.id : "");
      formData.append("name", values?.name ? values?.name : "");
      formData.append("member", arrayMember ? JSON.stringify(arrayMember) : "");
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
      // Validate form field
      team_id: Yup.object()
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
      sport_id: Yup.string()
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

  const NextListImage = () => {
    setStartList(endList + 1);
    if (person.length - 1 <= endList + (totalValue - 1)) {
      setEndList(person.length - 1);
    } else {
      setEndList(endList + totalValue);
    }
  };
  const BackListImage = () => {
    if (startList - totalValue === 0) {
      setStartList(0);
      setEndList(totalValue - 1);
    } else {
      setStartList(startList - totalValue);
      setEndList(startList - 1);
    }
  };
  const { data: dataMember, loading: loading2 } = useFetch([
    "get",
    "admin/participant",
    dataSearch,
  ]);
  const { data: data, loading: loading } = useFetch([
    "get",
    params?.id ? "admin/teamEvent/" + params?.id : null,
  ]);
  useEffect(() => {
    if (data) {
      let tempArray = [...arrayMember];
      formik.setFieldValue("name", data.name);
      formik.setFieldValue("team_id", data.team);
      formik.setFieldValue("event_id", data.event);
      formik.setFieldValue("discipline_id", data.event?.sport_discipline);
      formik.setFieldValue("sport_id", data.event?.sport_discipline.sport);
      data?.event_team_competitor?.map((value) => {
        tempArray.push(value.id);
      });
      setArrayMember(tempArray);
    }
  }, [data]);
  useEffect(() => {
    let temp = { ...dataSearch };
    if (formik.values?.team_id) {
      temp.team_id_equal = formik.values?.team_id?.id;
      setDataSearch(temp);
    }
  }, [formik.values?.team_id, data]);
  useEffect(() => {
    if (dataMember) {
      let temp = { ...dataMember };
      temp.data = [...dataMember.data];
      setPerson(temp.data);
    }
  }, [dataMember, data]);
  useEffect(() => {
    let tempCheck = true;
    let array = [];
    let count = 0;
    person.map((value, index) => {
      if (index >= startList && index <= endList) {
        array.push(value.id);
      }
    });
    arrayMember.map((value, index) => {
      if (array.includes(value)) {
        count = count + 1;
      }
    });
    if (count === endList - startList + 1) {
      tempCheck = true;
    } else {
      tempCheck = false;
    }
    setCheck(tempCheck);
  }, [arrayMember, person, startList, endList, data]);
  function onCheckMembers(e) {
    let temp = [...arrayMember];
    if (arrayMember.includes(e)) {
      temp.splice(arrayMember.indexOf(e), 1);
    } else {
      temp.push(e);
    }
    setArrayMember(temp);
  }
  const checkAll = () => {
    let temp = [...arrayMember];
    person.map((value, index) => {
      if (index >= startList && index <= endList) {
        if (check == true) {
          temp.splice(arrayMember.indexOf(value.id), 1);
        } else {
          if (!arrayMember.includes(value.id)) {
            temp.push(value.id);
          }
        }
      }
    });
    setCheck(!check);
    setArrayMember(temp);
  };

  const ChangeTotalValue = (e) => {
    setTotalValue(e.target.value);
  };

  const { columns: memberColumns, filterInputs: memberFilter } = MemberInput();

  return (
    <Card style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            required={true}
            endpoint={"admin/team"}
            queryField={"name_like"}
            labelField={"name"}
            label={t("member_registration.team")}
            value={formik.values?.team_id}
            handleChange={(e) => formik.setFieldValue("team_id", e)}
            error={formik.touched.team_id && formik.errors.team_id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            required={true}
            label={t("event_team_screen.name")}
            variant={"outlined"}
            value={formik.values?.name}
            size={"small"}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
            fullWidth
            error={formik.touched.name && formik.errors.name}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Autocomplete
            endpoint={"admin/sport"}
            queryField={"name"}
            labelField={"name"}
            valueField={"id"}
            label={t("sport_discipline_screen.event")}
            value={formik.values?.sport_id}
            handleChange={(e) => formik.setFieldValue("sport_id", e)}
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
            labelField={"name"}
            valueField={"id"}
            label={t("sport_discipline_screen.sport_discipline")}
            value={formik.values?.discipline_id}
            handleChange={(e) => formik.setFieldValue("discipline_id", e)}
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
            queryField={"name"}
            labelField={"name"}
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ textAlign: "right" }}>
            <Filter
              handleChangeParams={setDataSearch}
              inputs={memberFilter}
              loading={loading2}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          {
            <TableContainer component={Paper}>
              <Table aria-label="simple table" style={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <FormControlLabel
                        style={{ marginRight: 20 }}
                        control={
                          <Checkbox
                            color={"primary"}
                            checked={check}
                            onChange={() => checkAll()}
                          />
                        }
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {t("event_team_screen.name")}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {t("member_screen.sex")}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {t("member_screen.organization")}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {t("member_screen.function")}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {t("member_screen.team")}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {t("member_screen.sport")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {person.length !== 0
                    ? person.map((value, index) => {
                        return index >= startList && index <= endList ? (
                          <TableRow onClick={() => onCheckMembers(value.id)}>
                            <TableCell align="left">
                              <FormControlLabel
                                style={{
                                  marginRight: 20,
                                }}
                                value={value.id}
                                control={
                                  <Checkbox
                                    color={"primary"}
                                    checked={arrayMember.includes(value.id)}
                                    onChange={() => onCheckMembers(value.id)}
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {value?.family_name} {value?.given_name}
                            </TableCell>
                            <TableCell align="left">
                              {value?.sex == 1
                                ? t("sex.male")
                                : t("sex.female")}
                            </TableCell>
                            <TableCell align="left">
                              {i18n.language == "vi"
                                ? value.organization?.name
                                : value?.organization?.english_name}
                            </TableCell>
                            <TableCell align="left">
                              {i18n.language == "vi"
                                ? value.function?.name
                                : value?.function?.english_name}
                            </TableCell>
                            <TableCell align="left">
                              {i18n.language == "vi"
                                ? value.team?.name
                                : value?.team?.english_name}
                            </TableCell>
                            <TableCell align={"left"}>
                              {i18n.language == "vi"
                                ? value?.sport?.name
                                : value?.sport?.english_name}
                            </TableCell>
                          </TableRow>
                        ) : null;
                      })
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ padding: "0px 20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <p>
              {t("pagination.display")}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={totalValue}
                onChange={(e) => ChangeTotalValue(e)}
                style={{ paddingLeft: 10 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </p>
          </Grid>
          <Grid item xs={2} style={{ marginTop: 5 }}>
            <p>
              {startList + 1} - {endList + 1}
            </p>
          </Grid>
          <Grid item xs={2} style={{ marginTop: 5 }}>
            <p>
              {t("pagination.total")} : {totalPage}
            </p>
          </Grid>
          <Grid item xs={6}>
            <div style={{ display: "flex", float: "right" }}>
              <IconButton
                onClick={() => BackListImage()}
                disabled={startList < 1 ? true : false}
              >
                <ChevronLeftIcon />
              </IconButton>
              <div
                style={{
                  backgroundColor: "#2196f3",
                  borderRadius: "50%",
                  color: "white",
                  height: "30px",
                  width: "30px",
                  position: "relative",
                  margin: "10px",
                  display: "table",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "table-cell",
                    verticalAlign: "middle",
                  }}
                >
                  {page}
                </span>
              </div>
              <IconButton
                onClick={() => NextListImage()}
                disabled={endList == person.length - 1 ? true : false}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <div style={{ marginTop: 10 }}>
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={formik.handleSubmit}
        >
          {t("button.save")}
        </Button>
      </div>
    </Card>
  );
}
