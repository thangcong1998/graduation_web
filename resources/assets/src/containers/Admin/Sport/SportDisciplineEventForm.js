import React, { useCallback, useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useLocation, useParams } from "react-router-dom";
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
  FormControl,
  Grid,
  IconButton,
  TextField,
  InputLabel,
  InputAdornment,
  Input,
  makeStyles,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import {
  round_type,
  event_distinguish_player_method,
  sub_criterias_type,
  event_type,
  sport_discipline_event_type,
  competition_type,
} from "../../../common/constants";
import ClearIcon from "@material-ui/icons/Clear";
import { useDialog } from "../../../components/Dialog";
import EditIcon from "@material-ui/icons/Edit";
import PaperContainer from "../../../components/PaperContainer";

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  subCriterias: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d0d0d0",
    padding: "3px 4px",
    borderRadius: 5,
    justifyContent: "space-between",
  },
  fontbold: {
    fontWeight: "bold",
  },
}));

const SubCriteriaForm = (props) => {
  const { setSubCriterias, subCriterias, row, index, handleClose } = props;
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const formik = useFormik({
    initialValues: {
      id: row?.id ? row?.id : undefined,
      name: row ? row.name : null,
      type: row ? row.type : null,
      priority_order: row ? row.priority_order : null,
    },
    onSubmit: (values) => {
      if (row) {
        if (
          subCriterias.some((e) => e.name == values?.name) &&
          row?.name != values?.name
        ) {
          setErrors((pre) => ({ ...pre, name: t("errors.unique_name") }));
        } else {
          let arr = [...subCriterias];
          arr[index] = values;
          setSubCriterias(
            arr.sort((a, b) => a.priority_order - b.priority_order)
          );
          handleClose();
        }
      } else {
        if (subCriterias.some((e) => e.name == values?.name)) {
          setErrors((pre) => ({ ...pre, name: t("errors.unique_name") }));
        } else {
          let sub_criteria = {
            name: values?.name,
            type: values?.type,
            priority_order: values?.priority_order,
          };
          let arr = [...subCriterias];
          arr.push(sub_criteria);
          setSubCriterias(
            arr.sort((a, b) => a.priority_order - b.priority_order)
          );
          handleClose();
        }
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(t("sub_criteria.name") + " " + t("errors.required"))
        .max(
          255,
          t("sub_criteria.name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      type: Yup.string()
        .required(t("sub_criteria.type") + " " + t("errors.required"))
        .nullable()
        .trim(),
      priority_order: Yup.number()
        .required(t("sub_criteria.priority_order") + " " + t("errors.required"))
        .max(
          10,
          t("sub_criteria.priority_order") + t("errors.lessThan") + " 10"
        )
        .min(1, t("sub_criteria.priority_order") + t("errors.moreThan") + " 1")
        .nullable(),
    }),
  });

  const autoName = (type) => {
    switch (type) {
      case sub_criterias_type.WIN_MATCH:
        return "Trận thắng";
      case sub_criterias_type.SCORE:
        return "Điểm trận đấu";
      case sub_criterias_type.DIFFERENCE:
        return "Hiệu số điểm thắng thua cả vòng";
      case sub_criterias_type.GOAL:
        return "Số điểm thắng cả vòng";
      case sub_criterias_type.OTHER:
        return "";
      default:
        break;
    }
  };

  const inputs = useMemo(
    () => [
      [
        {
          field: "type",
          label: i18n.t("sub_criteria.type") + " *",
          value: formik.values?.type,
          error: formik.touched.type && formik.errors?.type,
          handleChange: (e) => {
            formik.setFieldValue("type", e);
            formik.setFieldValue("name", autoName(e));
          },
          type: "select",
          options: [
            {
              value: null,
              label: "---",
            },
            {
              label: t("sub_criteria.win_match"),
              value: sub_criterias_type.WIN_MATCH,
              disabled: row
                ? subCriterias.some(
                    (e) => e.type == sub_criterias_type.WIN_MATCH
                  ) && row.type != sub_criterias_type.WIN_MATCH
                : subCriterias.some(
                    (e) => e.type == sub_criterias_type.WIN_MATCH
                  ),
            },
            {
              label: t("sub_criteria.score"),
              value: sub_criterias_type.SCORE,
              disabled: row
                ? subCriterias.some(
                    (e) => e.type == sub_criterias_type.SCORE
                  ) && row.type != sub_criterias_type.SCORE
                : subCriterias.some((e) => e.type == sub_criterias_type.SCORE),
            },
            {
              label: t("sub_criteria.difference"),
              value: sub_criterias_type.DIFFERENCE,
              disabled: row
                ? subCriterias.some(
                    (e) => e.type == sub_criterias_type.DIFFERENCE
                  ) && row.type != sub_criterias_type.DIFFERENCE
                : subCriterias.some(
                    (e) => e.type == sub_criterias_type.DIFFERENCE
                  ),
            },
            {
              label: t("sub_criteria.goal"),
              value: sub_criterias_type.GOAL,
              disabled: row
                ? subCriterias.some((e) => e.type == sub_criterias_type.GOAL) &&
                  row.type != sub_criterias_type.GOAL
                : subCriterias.some((e) => e.type == sub_criterias_type.GOAL),
            },
            {
              label: t("sub_criteria.other"),
              value: sub_criterias_type.OTHER,
            },
          ],
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "name",
          label: i18n.t("sub_criteria.name") + " *",
          value: formik.values?.name,
          error: (formik.touched.name && formik.errors?.name) || errors?.name,
          handleChange: (e) => formik.setFieldValue("name", e),
          disabled: formik.values?.type != sub_criterias_type.OTHER,
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "priority_order",
          label: i18n.t("sub_criteria.priority_order") + " *",
          value: formik.values?.priority_order,
          error: formik.touched.priority_order && formik.errors?.priority_order,
          handleChange: (e) => formik.setFieldValue("priority_order", e),
          type: "number",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  return (
    <form>
      <Forms inputs={inputs} />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={formik.handleSubmit}
      >
        {row ? t("button.update") : t("button.add")}
      </Button>
    </form>
  );
};

export default function (props) {
  const { close, refetch } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const api = useAPI();
  const history = useHistory();
  const location = useLocation();
  const [files, setFiles] = useState();
  const [round, setRound] = useState([]);
  const [set, setSet] = useState([]);
  const [statistic, setStatistic] = useState([]);
  const row = location?.state?.row;
  const sport = location?.state?.sport;
  const params = useParams();
  const { data: data, loading: loading } = useFetch([
    "get",
    params?.id && "admin/sportDisciplineEvent/" + params?.id,
  ]);
  const sportDiscipline = location?.state?.sportDiscipline;
  const [rules, setRules] = useState([]);
  const [subCriterias, setSubCriterias] = useState([]);
  const { dialog, handleClose } = useDialog();
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
      competitor: "0",
      is_winner_classification_round: 0,
      round: round,
      round_type: round_type.NO_ROUND,
      name_set: null,
      event_distinguish_player_method: null,
      max_competitor_count: "0",
      maximum_team_size: "0",
      type: 3,
      match_type: 1,
      is_decathlon_heptathlon: 0,
    },
    onSubmit: async (values) => {
      try {
        let formData = new FormData();
        formData.append(
          "english_name",
          formik.values?.english_name ? formik.values?.english_name : ""
        );
        formData.append(
          "sport_discipline_id",
          values?.sport_discipline ? values.sport_discipline.id : ""
        );
        formData.append("name", formik.values?.name ? formik.values?.name : "");
        formData.append("competitor_male", formik.values?.competitor_male);
        formData.append("competitor_female", formik.values?.competitor_female);
        formData.append(
          "competition_type",
          formik.values?.competition_type ? formik.values?.competition_type : ""
        );
        formData.append(
          "round_type",
          values?.round_type ? values.round_type : round_type.NO_ROUND
        );
        formData.append(
          "competitor",
          formik.values?.competitor ? formik.values?.competitor : ""
        );
        formData.append("uniform", values?.uniform ? values?.uniform : "");
        formData.append(
          "has_goalkeeper",
          values?.has_goalkeeper ? values?.has_goalkeeper : ""
        );
        formData.append("match_type", values?.match_type);
        formData.append("files", files);
        formData.append(
          "sport_discipline_event_id",
          values?.sport_discipline_event_id
            ? values?.sport_discipline_event_id
            : ""
        );
        // round
        formData.append("round", JSON.stringify(round));
        formData.append(
          "round_id",
          JSON.stringify(
            round?.map((e, index) => e?.id).filter((rd) => rd != null)
          )
        );
        // set
        formData.append("set", JSON.stringify(set));
        formData.append(
          "set_id",
          JSON.stringify(
            set?.map((e, index) => e?.id).filter((rd) => rd != null)
          )
        );
        formData.append("statistic", JSON.stringify(statistic));
        formData.append(
          "statistic_id",
          JSON.stringify(
            statistic?.map((e) => e?.id).filter((rd) => rd != null)
          )
        );
        formData.append(
          "maximum_team_size",
          formik.values?.maximum_team_size
            ? formik.values?.maximum_team_size
            : ""
        );
        formData.append(
          "max_competitor_count",
          formik.values?.max_competitor_count
            ? formik.values?.max_competitor_count
            : ""
        );
        formData.append(
          "match_type",
          formik.values?.match_type ? formik.values?.match_type : ""
        );
        formData.append("type", formik.values?.type ? formik.values?.type : "");
        // formData.append("maximum_team_size", formik.values?.maximum_team_size);
        if (formik.values?.event_distinguish_player_method) {
          formData.append(
            "event_distinguish_player_method",
            formik.values?.event_distinguish_player_method
          );
          if (
            formik.values?.event_distinguish_player_method ==
            event_distinguish_player_method.CUSTOM
          ) {
            formData.append("rules", JSON.stringify(rules));
          }
        }
        //sub criterias
        formData.append("sub_criterias", JSON.stringify(subCriterias));

        formData.append(
          "is_decathlon_heptathlon",
          formik.values?.is_decathlon_heptathlon
        );
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
          t("sport_screen.sport_discipline_event") + " " + t("errors.required")
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
        .required(t("sport_screen.english_name") + " " + t("errors.required"))
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
          t("sport_screen.sport_discipline") + " " + t("errors.required")
        )
        .nullable(),
      // icon:
      //   !files &&
      //   Yup.object()
      //     .required(t("sport_screen.icon") + " " + t("errors.required"))
      //     .nullable(),
      max_competitor_count: Yup.string()
        .when("competition_type", {
          is: (v) => v == competition_type.TEAM,
          then: Yup.string()
            .required(
              t("sport_discipline_event_screen.max_team_competitor") +
                " " +
                t("errors.required")
            )
            .max(
              3,
              t("sport_discipline_event_screen.max_team_competitor") +
                " " +
                t("errors.max.before") +
                "3 " +
                t("errors.max.after")
            )
            .matches(
              /^[0-9]*$/,
              t("sport_discipline_event_screen.max_team_competitor") +
                " " +
                t("errors.number")
            )
            .nullable(),
          otherwise: Yup.string()
            .required(
              t("sport_discipline_event_screen.maximum_competior") +
                " " +
                t("errors.required")
            )
            .max(
              3,
              t("sport_discipline_event_screen.maximum_competior") +
                " " +
                t("errors.max.before") +
                "3 " +
                t("errors.max.after")
            )
            .matches(
              /^[0-9]*$/,
              t("sport_discipline_event_screen.maximum_competior") +
                " " +
                t("errors.number")
            )
            .nullable(),
        })
        .nullable()
        .trim(),
      maximum_team_size: Yup.string()
        .when("competition_type", {
          is: (v) => v == competition_type.TEAM,
          then: Yup.string()
            .required(
              t("sport_discipline_event_screen.maximum_team_size") +
                " " +
                t("errors.required")
            )
            .max(
              3,
              t("sport_discipline_event_screen.maximum_team_size") +
                " " +
                t("errors.max.before") +
                "3 " +
                t("errors.max.after")
            )
            .matches(
              /^[0-9]*$/,
              t("sport_discipline_event_screen.maximum_team_size") +
                " " +
                t("errors.number")
            )
            .nullable(),
          otherwise: Yup.string().nullable(),
        })
        .nullable()
        .trim(),

      competitor_male: Yup.string()
        .when(["type", "competition_type"], {
          is: (type, competition_type) => type && competition_type,
          then: Yup.string()
            .required(
              t("sport_discipline_event_screen.max_male_athletes") +
                " " +
                t("errors.required")
            )
            .max(
              3,
              t("sport_discipline_event_screen.max_male_athletes") +
                " " +
                t("errors.max.before") +
                "3 " +
                t("errors.max.after")
            )
            .matches(
              /^[0-9]*$/,
              t("sport_discipline_event_screen.max_male_athletes") +
                " " +
                t("errors.number")
            )
            .nullable(),
          otherwise: Yup.string().nullable(),
        })
        .nullable()
        .trim(),
      competitor: Yup.string()
        .when("competition_type", {
          is: (v) => v == competition_type.TEAM,
          then: Yup.string()
            .required(
              t("sport_discipline_event_screen.playing_athletes") +
                " " +
                t("errors.required")
            )
            .max(
              3,
              t("sport_discipline_event_screen.playing_athletes") +
                " " +
                t("errors.max.before") +
                "3 " +
                t("errors.max.after")
            )
            .matches(
              /^[0-9]*$/,
              t("sport_discipline_event_screen.playing_athletes") +
                " " +
                t("errors.number")
            )
            .nullable(),
          otherwise: Yup.string().nullable(),
        })
        .trim(),

      competitor_female: Yup.string()
        .when(["type", "competition_type"], {
          is: (type, competition_type) => type && competition_type,
          then: Yup.string()
            .required(
              t("sport_discipline_event_screen.max_female_athletes") +
                " " +
                t("errors.required")
            )
            .max(
              3,
              t("sport_discipline_event_screen.max_female_athletes") +
                " " +
                t("errors.max.before") +
                "3 " +
                t("errors.max.after")
            )
            .matches(
              /^[0-9]*$/,
              t("sport_discipline_event_screen.max_female_athletes") +
                " " +
                t("errors.number")
            )
            .nullable(),
          otherwise: Yup.string().nullable(),
        })
        .nullable()
        .trim(),
      round_type: Yup.string()
        .required(
          t("sport_discipline_event_screen.round_type") +
            " " +
            t("errors.required")
        )
        .nullable(),
    }),
  });

  useEffect(() => {
    if (formik.values.sport == null && formik.values.sport_discipline != null) {
      formik.setFieldValue("sport_discipline", null);
    }
  }, formik.values.sport);
  useEffect(() => {
    if (files) {
      formik.setFieldValue("icon", true);
    }
  }, [files]);
  useEffect(() => {
    if (row) setFiles(row?.icon);
  }, []);

  useEffect(() => {
    if (row) {
      if (data && loading == false) {
        formik.setValues({
          ...data,
          sport_discipline_event_id: data?.id,
          sport: data?.sport_discipline?.sport,
          sport_discipline: data?.sport_discipline,
        });
        if (data?.event_distinguish_player_method) {
          formik.setFieldValue(
            "event_distinguish_player_method",
            data?.event_distinguish_player_method?.method_id
          );
          if (
            data?.event_distinguish_player_method?.method_id ==
            event_distinguish_player_method.CUSTOM
          ) {
            setRules(JSON.parse(data?.event_distinguish_player_method?.rules));
          }
        }
        setRound(data?.event_rounds);
        setSet(data?.event_set);
        setSubCriterias(data?.sub_criterias);
        setFiles(data?.icon);
      } else {
        formik.setFieldValue(
          "competitor_male",
          row?.competitor_male.toString()
        );
        formik.setFieldValue(
          "competitor_female",
          row?.competitor_female.toString()
        );
        formik.setFieldValue("competitor", row?.competitor?.toString());
        formik.setFieldValue("sport_discipline_event_id", row.id);
        formik.setFieldValue("competition_type", row.competition_type);
        formik.setFieldValue("uniform", row.uniform);
        formik.setFieldValue("has_goalkeeper", row.has_goalkeeper);
        formik.setFieldValue("id", row.id);
        formik.setFieldValue("match_type", row.match_type);

        if (row?.event_distinguish_player_method) {
          formik.setFieldValue(
            "event_distinguish_player_method",
            row?.event_distinguish_player_method?.method_id
          );
          if (
            row?.event_distinguish_player_method?.method_id ==
            event_distinguish_player_method.CUSTOM
          ) {
            setRules(JSON.parse(row?.event_distinguish_player_method?.rules));
          }
        }
        setRound(row?.event_rounds);
        setSet(row?.event_set);
      }
      setRound(row?.event_rounds);
      setSet(row?.event_set);
      setStatistic(row?.event_statistic);
    } else {
      if (data) {
        formik.setValues({
          ...data,
          sport_discipline_event_id: data?.id,
          sport: data?.sport_discipline?.sport,
          sport_discipline: data?.sport_discipline,
        });
        if (data?.event_distinguish_player_method) {
          formik.setFieldValue(
            "event_distinguish_player_method",
            data?.event_distinguish_player_method?.method_id
          );
          if (
            data?.event_distinguish_player_method?.method_id ==
            event_distinguish_player_method.CUSTOM
          ) {
            setRules(JSON.parse(data?.event_distinguish_player_method?.rules));
          }
        }
        setRound(data?.event_rounds);
        setSet(data?.event_set);
        setSubCriterias(data?.sub_criterias);
        setFiles(data?.icon);
      }
    }
  }, [row, data]);

  const inputs = useMemo(
    () => [
      [
        {
          field: "sport",
          label: i18n.t("sport_screen.sport") + " *",
          value: formik.values?.sport,
          endpoint: "/admin/sport",
          labelField: i18n.languages[0] === "vi" ? "name" : "english_name",
          queryField:
            i18n.languages[0] === "vi" ? "name_like" : "english_name_like",
          error:
            api.error?.sport || (formik.touched.sport && formik.errors?.sport),
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
            ? "/admin/sportDiscipline?sport_id_equal=" + formik.values.sport.id
            : null,
          labelField: i18n.languages[0] === "vi" ? "name" : "english_name",
          queryField:
            i18n.languages[0] === "vi" ? "name_like" : "english_name_like",
          error:
            api.error?.sport_discipline ||
            (formik.touched.sport_discipline &&
              formik.errors?.sport_discipline),
          handleChange: (e) => formik.setFieldValue("sport_discipline", e),
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
            (formik.touched.name && formik.errors?.name) || api.error?.name,
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
            (formik.touched.english_name && formik.errors.english_name) ||
            api.error?.english_name,
          handleChange: (e) => formik.setFieldValue("english_name", e),
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
            {
              label: i18n.t("sport_screen.individual"),
              value: competition_type.INDIVIDUAL,
            },
            {
              label: i18n.t("sport_screen.team"),
              value: competition_type.TEAM,
            },
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
          component: () => (
            <FormControlLabel
              style={{
                alignItems: "flex-start",
                marginLeft: 0,
                marginBottom: 15,
              }}
              value={formik.values?.is_decathlon_heptathlon}
              control={
                <Checkbox
                  style={{ padding: 0 }}
                  color="primary"
                  checked={formik.values?.is_decathlon_heptathlon}
                />
              }
              label={
                <span style={{ overflowWrap: "anywhere" }}>
                  {t("sport_discipline_event_screen.is_decathlon_heptathlon")}
                </span>
              }
              onChange={(event) => {
                if (formik.values?.is_decathlon_heptathlon) {
                  formik.setFieldValue("is_decathlon_heptathlon", 0);
                } else {
                  formik.setFieldValue("is_decathlon_heptathlon", 1);
                }
              }}
            />
          ),
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: t("sport_discipline_event_screen.match_type"),
          field: "match_type",
          value: formik.values.match_type,
          handleChange: (e) => {
            formik.setFieldValue("match_type", e);
          },
          error:
            api.error?.match_type ||
            (formik.touched.match_type && formik.errors?.match_type),
          type: "radio",
          options: [
            { label: i18n.t("sport_discipline_event_screen.1vs1"), value: 1 },
            { label: i18n.t("sport_discipline_event_screen.1vsn"), value: 2 },
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
          field: "type",
          value: formik.values.type,
          handleChange: (e) => {
            formik.setFieldValue("type", e);
          },
          error:
            api.error?.type || (formik.touched.type && formik.errors?.type),
          type: "radio",
          options: [
            {
              label: t("sport_discipline_event_screen.men's_event"),
              value: sport_discipline_event_type.MEN_EVENT,
            },
            {
              label: t("sport_discipline_event_screen.women's_sevent"),
              value: sport_discipline_event_type.WOMEN_EVENT,
            },
            {
              label: t("sport_discipline_event_screen.mixed_event"),
              value: sport_discipline_event_type.MIX_EVENT,
            },
          ],
          formLabelProps: {
            style: {
              color: "#000000",
              fontWeight: "bold",
            },
          },
          grid: { xs: 12, sm: 12, md: 12 },
        },
        formik.values.competition_type == event_type.TEAM &&
          formik.values.type == sport_discipline_event_type.MIX_EVENT && {
            field: "competitor_male",
            label: i18n.t("sport_discipline_event_screen.competitor_male"),
            value: formik.values?.competitor_male,
            required: true,
            error:
              api.error?.competitor_male ||
              (formik.touched.competitor_male && formik.errors.competitor_male),
            handleChange: (e) => formik.setFieldValue("competitor_male", e),
            type: "number",
            variant: "outlined",
            grid: { xs: 12, sm: 6, md: 6 },
          },
        formik.values.competition_type == event_type.TEAM &&
          formik.values.type == sport_discipline_event_type.MIX_EVENT && {
            field: "competitor_female",
            label: i18n.t("sport_discipline_event_screen.competitor_female"),
            value: formik.values?.competitor_female,
            required: true,
            error:
              api.error?.competitor_female ||
              (formik.touched.competitor_female &&
                formik.errors.competitor_female),
            handleChange: (e) => formik.setFieldValue("competitor_female", e),
            type: "number",
            variant: "outlined",
            grid: { xs: 12, sm: 6, md: 6 },
          },
        formik.values?.competition_type == competition_type.TEAM && {
          field: "maximum_team_size",
          label: i18n.t("sport_discipline_event_screen.maximum_team_size"),
          value: formik.values?.maximum_team_size,
          required: true,
          error:
            api.error?.maximum_team_size ||
            (formik.touched.maximum_team_size &&
              formik.errors.maximum_team_size),
          handleChange: (e) => formik.setFieldValue("maximum_team_size", e),
          type: "number",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "max_competitor_count",
          label:
            formik.values?.competition_type == competition_type.TEAM
              ? i18n.t("sport_discipline_event_screen.max_team_competitor")
              : i18n.t("sport_discipline_event_screen.maximum_competior"),
          value: formik.values?.max_competitor_count,
          required: true,
          error:
            api.error?.max_competitor_count ||
            (formik.touched.max_competitor_count &&
              formik.errors.max_competitor_count),
          handleChange: (e) => formik.setFieldValue("max_competitor_count", e),
          type: "number",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        formik.values?.competition_type == competition_type.TEAM && {
          field: "competitor",
          label: i18n.t("sport_discipline_event_screen.competitor"),
          value: formik.values?.competitor,
          required: true,
          error:
            api.error?.competitor ||
            (formik.touched.competitor && formik.errors.competitor),
          handleChange: (e) => formik.setFieldValue("competitor", e),
          type: "number",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
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
            formik.setFieldValue("has_goalkeeper", e == true ? 2 : 1);
          },
          inputVariant: "outlined",
          type: "switch",
          grid: { xs: 12, sm: 6, md: 6 },
          error:
            api.error?.has_goalkeeper ||
            (formik.touched.has_goalkeeper && formik.errors?.has_goalkeeper),
        },
        {
          field: "round_type",
          label: t("sport_discipline_event_screen.round_type"),
          value: formik.values?.round_type,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("round_type", e);
            e == round_type.HAS_ROUND &&
              setSet(row?.event_set ? row?.event_set : []);
            e == round_type.HAS_SET &&
              setRound(row?.event_rounds ? row?.event_rounds : []);
          },
          options: [
            {
              value: round_type.HAS_ROUND,
              label: "hiệp",
            },
            {
              value: round_type.HAS_SET,
              label: "set",
            },
            {
              value: round_type.NO_ROUND,
              label: t("sport_discipline_event_screen.no_round"),
            },
          ],
          inputVariant: "outlined",
          type: "radio",
          grid: { xs: 12, sm: 12, md: 12 },
          formLabelProps: {
            style: {
              color: "#000000",
              fontWeight: "bold",
            },
          },
          error:
            api.error?.round_type ||
            (formik.touched.round_type && formik.errors?.round_type),
        },
        formik?.values?.round_type == round_type.HAS_SET && {
          component: () => {
            return (
              <Grid>
                <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {t("sport_discipline_event_screen.add_set")}
                  <IconButton variant="outlined" onClick={() => addSet()}>
                    <AddCircleOutlineIcon
                      size="small"
                      style={{
                        fontSize: 25,
                      }}
                    />
                  </IconButton>
                </div>
              </Grid>
            );
          },
          grid: { xs: 12, sm: 6, md: 6 },
        },
        formik?.values?.round_type == round_type.HAS_ROUND && {
          grid: { xs: 12, sm: 12, md: 12 },
          component: () => {
            return (
              <Grid>
                <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {t("sport_discipline_event_screen.add_round")}
                  <IconButton variant="outlined" onClick={() => addRound()}>
                    <AddCircleOutlineIcon
                      size="small"
                      style={{
                        fontSize: 25,
                      }}
                    />
                  </IconButton>
                </div>
              </Grid>
            );
          },
        },
      ],
    ],
    [formik.values, api]
  );

  const addRound = (name) => {
    setRound((pre) => [
      ...pre,
      {
        is_winner_classification_round: 0,
        name: name,
      },
    ]);
  };

  const addSet = (name) => {
    setSet((pre) => [
      ...pre,
      {
        name: name,
      },
    ]);
  };

  const deleteSet = (index) => {
    const _set = set.filter((e, rdIndex) => rdIndex != index);
    setSet(_set);
  };

  const deleteRound = (index) => {
    const _round = round.filter((e, rdIndex) => rdIndex != index);
    setRound(_round);
  };

  const checkedFinalRound = (event, index) => {
    setRound((pre) => [
      ...pre.map((pr, mIndex) => {
        if (mIndex == index) {
          return {
            ...pr,
            is_winner_classification_round:
              event.target.checked == true ? 1 : 0,
          };
        }
        return pr;
      }),
    ]);
    formik.setFieldValue(
      "is_winner_classification_round",
      event.target.checked == true ? 1 : 0
    );
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
    formik.setFieldValue("name_round", value);
  };

  const changeNameSet = (value, rd, index) => {
    setSet((pre) => [
      ...pre.map((pr, mIndex) => {
        if (mIndex == index) {
          return { ...pr, name: value };
        }
        return { ...pr };
      }),
    ]);
    formik.setFieldValue("name_set", value);
  };

  function _handleKeyDown(event) {
    const _rules = [...rules];
    if (event.key == "Enter") {
      let rule = event.target.value;
      if (rule.trim() != "") {
        if (!_rules.some((e) => e == rule.trim())) {
          _rules.push(rule.trim());
        }
        event.target.value = "";
      }
    }
    setRules(_rules);
  }
  const _Rules = useMemo(
    () =>
      rules?.map((r, index) => (
        <span
          style={{
            padding: 5,
            border: "1px solid #d0d0d0",
            borderRadius: 2,
            marginRight: 4,
            marginLeft: 4,
            marginTop: 5,
          }}
          key={index}
        >
          {r}
          <IconButton
            size={"small"}
            color="secondary"
            onClick={() => {
              setRules((pre) => pre.filter((e) => e != r));
            }}
          >
            <ClearIcon />
          </IconButton>
        </span>
      )),
    [rules]
  );

  const addSubCriteria = async (row, index) => {
    await dialog({
      title: row ? t("sub_criteria.add") : t("sub_criteria.update"),
      content: (
        <SubCriteriaForm
          setSubCriterias={setSubCriterias}
          subCriterias={subCriterias}
          handleClose={handleClose}
          row={row}
          index={index}
        />
      ),
    });
  };

  const deleteSubCriteria = (index) => {
    setSubCriterias((pre) => pre.filter((e, i) => i != index));
  };
  const _SubCriteria = useMemo(() => {
    return (
      <React.Fragment>
        {subCriterias?.map((sc, index) => (
          <Grid item md={4} xs={4} sm={4}>
            <div className={classes.subCriterias} key={index}>
              <div style={{ marginRight: 8 }}>
                <span>{sc.name}</span> <br />
                <span className={classes.fontbold}>
                  {t("sub_criteria.priority_order")}:
                </span>
                {sc.priority_order}
              </div>
              <span>
                <IconButton
                  size={"small"}
                  onClick={() => addSubCriteria(sc, index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size={"small"}
                  onClick={() => deleteSubCriteria(index)}
                >
                  <ClearIcon />
                </IconButton>
              </span>
            </div>
          </Grid>
        ))}
      </React.Fragment>
    );
  }, [subCriterias]);

  const addStatistic = () => {
    setStatistic((pre) => [
      ...pre,
      {
        name: null,
      },
    ]);
  };

  const changeNameStatistic = (value, index) => {
    setStatistic((pre) => [
      ...pre?.map((e, stIndex) => {
        if (stIndex == index) {
          return { ...e, name: value };
        }
        return e;
      }),
    ]);
  };

  const deleteStatistic = (index) => {
    const _statistic = statistic.filter((e, rdIndex) => rdIndex != index);
    setStatistic(_statistic);
  };

  const Round = useMemo(() => {
    return (
      <Grid container style={{ marginBottom: 5 }} spacing={1}>
        {round?.map((rd, index) => {
          return (
            <Grid item xs={4} style={{ padding: 4, display: "flex" }}>
              <TextField
                size="small"
                variant="outlined"
                style={{ width: "100%", marginRight: 3 }}
                value={rd?.name}
                error={api?.error?.[`round.${index}.name`]?.[0]}
                helperText={api?.error?.[`round.${index}.name`]?.[0]}
                onChange={(e) => changeNameRound(e.target?.value, rd, index)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Switch
                        checked={rd.is_winner_classification_round}
                        onChange={(e) => checkedFinalRound(e, index)}
                        name="checkedB"
                        color="primary"
                      />
                      {t("sport_discipline_event_screen.penalty")}
                      <IconButton
                        variant="outlined"
                        style={{
                          padding: 3,
                        }}
                        onClick={() => deleteRound(index)}
                      >
                        <HighlightOffOutlinedIcon
                          size="small"
                          style={{
                            fontSize: 25,
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [round]);
  const Set = useMemo(() => {
    return (
      <Grid container style={{ marginBottom: 5 }} spacing={1}>
        {set?.map((rd, index) => {
          return (
            <Grid item xs={4} style={{ padding: 4, display: "flex" }}>
              <TextField
                size="small"
                variant="outlined"
                style={{ width: "100%", marginRight: 3 }}
                value={rd?.name}
                error={api?.error?.[`set.${index}.name`]?.[0]}
                helperText={api?.error?.[`set.${index}.name`]?.[0]}
                onChange={(e) => changeNameSet(e.target?.value, rd, index)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        variant="outlined"
                        style={{
                          padding: 3,
                        }}
                        onClick={() => deleteSet(index)}
                      >
                        <HighlightOffOutlinedIcon
                          size="small"
                          style={{
                            fontSize: 25,
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [set]);

  const player_menthod = useMemo(
    () => [
      [
        {
          field: "event_distinguish_player_method",
          label: t(
            "sport_discipline_event_screen.event_distinguish_player_method"
          ),
          value: formik.values?.event_distinguish_player_method,
          handleChange: (e) => {
            formik.setFieldValue("event_distinguish_player_method", e);
          },
          options: [
            {
              value: event_distinguish_player_method.UNIFORM,
              label: t("event_distinguish_player_method.uniform"),
            },
            {
              value: event_distinguish_player_method.PEEP,
              label: t("event_distinguish_player_method.peep"),
            },
            {
              value: event_distinguish_player_method.CUSTOM,
              label: t("event_distinguish_player_method.custom"),
            },
            {
              value: event_distinguish_player_method.NO_NEED,
              label: t("event_distinguish_player_method.no_need"),
            },
          ],
          inputVariant: "outlined",
          type: "radio",
          grid: { xs: 12, sm: 12, md: 12 },
          error:
            api.error?.round_type ||
            (formik.touched.round_type && formik.errors?.round_type),
          formLabelProps: {
            style: {
              color: "#000000",
              fontWeight: "bold",
            },
          },
        },
      ],
    ],
    [formik, api]
  );

  const _Statistic = useMemo(() => {
    return (
      <Grid container style={{ marginBottom: 5 }} spacing={1}>
        {statistic?.map((rd, index) => {
          return (
            <Grid item xs={4} style={{ padding: 4, display: "flex" }}>
              <TextField
                size="small"
                variant="outlined"
                style={{ width: "100%", marginRight: 3 }}
                value={rd?.name}
                error={api?.error?.[`set.${index}.name`]?.[0]}
                helperText={api?.error?.[`set.${index}.name`]?.[0]}
                onChange={(e) => changeNameStatistic(e.target?.value, index)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        variant="outlined"
                        style={{
                          padding: 3,
                        }}
                        onClick={() => deleteStatistic(index)}
                      >
                        <HighlightOffOutlinedIcon
                          size="small"
                          style={{
                            fontSize: 25,
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [statistic]);

  return (
    <PaperContainer>
      <div>
        <Forms inputs={inputs} />
        {formik?.values?.round_type == round_type.HAS_ROUND && Round}
        {formik?.values?.round_type == round_type.HAS_SET && Set}

        <Forms inputs={player_menthod} />
        {formik.values?.event_distinguish_player_method ==
          event_distinguish_player_method.CUSTOM && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 15,
            }}
          >
            <FormControl>
              <InputLabel htmlFor="rules">
                {t("event_distinguish_player_method.rule")}
              </InputLabel>
              <Input id="rules" onKeyDown={_handleKeyDown} />
            </FormControl>
            {_Rules}
          </div>
        )}
        <div style={{ maxWidth: 300 }}>
          <UploadOnePicture
            files={files}
            setFiles={setFiles}
            title={i18n.t("upload.message")}
            error={
              api.error?.icon || (formik.touched.icon && formik.errors.icon)
            }
            height={"300px"}
            // width={"300px"}
          />
        </div>
        <Grid>
          <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
            {t("sport_discipline_event_screen.add_statistic")}
            <IconButton variant="outlined" onClick={() => addStatistic()}>
              <AddCircleOutlineIcon
                size="small"
                style={{
                  fontSize: 25,
                }}
              />
            </IconButton>
          </div>
        </Grid>
        {_Statistic}
      </div>
      <div>
        <span className={classes.label}>{t("sub_criteria.sub_criteria")}</span>
        <IconButton onClick={() => addSubCriteria()}>
          <AddCircleOutlineIcon />
        </IconButton>
        <Grid container spacing={3}>
          {_SubCriteria}
        </Grid>
      </div>

      <div style={{ marginTop: 15 }}>
        {params?.id ? (
          <ButtonUpdate
            variant="contained"
            loading={api.loading}
            // text={i18n.t("sport_screen.user")}
            onClick={formik.handleSubmit}
          />
        ) : (
          <ButtonAdd
            variant="contained"
            loading={api.loading}
            text={i18n.t("sport_screen.sport_discipline_event")}
            onClick={formik.handleSubmit}
          />
        )}
      </div>
    </PaperContainer>
  );
}
