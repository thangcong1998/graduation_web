import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
  useContext,
} from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import i18n from "../../../i18n/i18n";
import {
  Button,
  makeStyles,
  FormControl,
  FormLabel,
  IconButton,
  Collapse,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  stage_type,
  match_score_type,
  qualification_type,
  measurement_unit,
  match_scoring_method,
  round_type,
  rank_type,
  UNIT,
  round_result_type,
} from "../../../common/constants";
import color from "../../../common/color.json";
import PaperContainer from "../../../components/PaperContainer";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import Autocomplete from "../../../components/form/Autocomplete";
import ButtonSolashi from "../../../components/button/ButtonSolashi";
import Radios from "../../../components/form/Radios";
import Dialog from "../../../components/DialogMui";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { SpaOutlined } from "@material-ui/icons";
import { AuthContext } from "../../AuthProvider";

const useStyles = makeStyles((theme) => ({
  badges: {
    display: "flex",
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  badge: {
    padding: 10,
    marginRight: 10,
    marginTop: 10,
    cursor: "pointer",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    textTransform: "capitalize",
    "&:hover": {
      border: `1px solid ${color.primary}`,
    },
  },
  active: {
    color: color.primary,
    border: `1px solid ${color.primary}`,
  },
  unActive: {
    border: "1px solid #bdbdbd",
    background: color.disabled,
    color: "#adadad",
  },
  qualified: {
    minWidth: 240,
    marginRight: 10,
    marginTop: 10,
  },
  matchPoint: {
    border: "1px solid #000",
    marginRight: 5,
    padding: 10,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    "& .btn_match_point": {
      width: 0,
      display: "flex",
      visibility: "hidden",
      opacity: 0,
    },
    "&:hover": {
      "& .btn_match_point": {
        width: 68,
        visibility: "visible",
        opacity: 1,
      },
    },
  },
  btnMP: {
    marginLeft: 5,
    cursor: "pointer",
  },
  setting: {
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "#032e84",
  },
}));

const MatchPointForm = memo((props) => {
  const { close, matchPoint, setMatchPoints, index } = props;

  const { t } = useTranslation();
  useEffect(() => {
    if (matchPoint) {
      formik.setValues(matchPoint);
    }
  }, [matchPoint]);

  const formik = useFormik({
    initialValues: {
      point_name: null,
      points: null,
    },
    validationSchema: Yup.object().shape({
      point_name: Yup.string()
        .required(
          t("stages_screen.match_point.point_name") + " " + t("errors.required")
        )
        .max(
          255,
          t("stages_screen.match_point.point_name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      points: Yup.number()
        .required(
          t("stages_screen.match_point.points") + " " + t("errors.required")
        )
        .max(
          10,
          t("stages_screen.match_point.points") +
            " " +
            t("errors.lessThan") +
            " 10 "
        )
        .min(
          -10,
          t("stages_screen.match_point.points") +
            " " +
            t("errors.moreThan") +
            " -10 "
        )
        .nullable(),
    }),
    onSubmit: (values) => {
      if (matchPoint) {
        setMatchPoints((pre) =>
          pre.map((e, i) => {
            if (i == index) {
              return values;
            }
            return e;
          })
        );
      } else {
        setMatchPoints((pre) => [...pre, values]);
      }
      close();
    },
  });
  const inputs = useMemo(
    () => [
      [
        {
          field: "point_name",
          label: t("stages_screen.match_point.point_name"),
          required: true,
          value: formik.values?.point_name,
          handleChange: (e) => formik.setFieldValue("point_name", e),
          error: formik.touched.point_name && formik.errors?.point_name,
          variant: "standard",
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: "points",
          field: "points",
          label: t("stages_screen.match_point.points"),
          required: true,
          value: formik.values?.points,
          handleChange: (e) => formik.setFieldValue("points", e),
          error: formik.touched.points && formik.errors?.points,
          variant: "standard",
          type: "number",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );

  return (
    <div style={{ maxWidth: 400, minWidth: 350 }}>
      <form>
        <Forms inputs={inputs} />
        <Button
          type={"submit"}
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          style={{ marginTop: 5 }}
        >
          {matchPoint ? t("button.update") : t("button.add")}
        </Button>
      </form>
    </div>
  );
});

const RoundPointForm = memo((props) => {
  const { close, roundPoint, setRoundPoints, index } = props;

  const { t } = useTranslation();
  useEffect(() => {
    if (roundPoint) {
      formik.setValues(roundPoint);
    }
  }, [roundPoint]);

  const formik = useFormik({
    initialValues: {
      point_name: null,
      points: null,
    },
    validationSchema: Yup.object().shape({
      point_name: Yup.string()
        .required(
          t("stages_screen.round_point.point_name") + " " + t("errors.required")
        )
        .max(
          255,
          t("stages_screen.round_point.point_name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      points: Yup.number()
        .required(
          t("stages_screen.round_point.points") + " " + t("errors.required")
        )
        .max(
          10,
          t("stages_screen.round_point.points") +
            " " +
            t("errors.lessThan") +
            " 10 "
        )
        .min(
          -10,
          t("stages_screen.round_point.points") +
            " " +
            t("errors.moreThan") +
            " -10 "
        )
        .nullable(),
    }),
    onSubmit: (values) => {
      if (roundPoint) {
        setRoundPoints((pre) =>
          pre.map((e, i) => {
            if (i == index) {
              return values;
            }
            return e;
          })
        );
      } else {
        setRoundPoints((pre) => [...pre, values]);
      }
      close();
    },
  });
  const inputs = useMemo(
    () => [
      [
        {
          field: "point_name",
          label: t("stages_screen.round_point.point_name"),
          required: true,
          value: formik.values?.point_name,
          handleChange: (e) => formik.setFieldValue("point_name", e),
          error: formik.touched.point_name && formik.errors?.point_name,
          variant: "standard",
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: "points",
          field: "points",
          label: t("stages_screen.round_point.points"),
          required: true,
          value: formik.values?.points,
          handleChange: (e) => formik.setFieldValue("points", e),
          error: formik.touched.points && formik.errors?.points,
          variant: "standard",
          type: "number",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );

  return (
    <div style={{ maxWidth: 400, minWidth: 350 }}>
      <form>
        <Forms inputs={inputs} />
        <Button
          type={"submit"}
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          style={{ marginTop: 5 }}
        >
          {roundPoint ? t("button.update") : t("button.add")}
        </Button>
      </form>
    </div>
  );
});

export default function (props) {
  const { stage, refetch } = props;
  const { t, i18n } = useTranslation();
  const api = useAPI();
  const history = useHistory();
  const location = useLocation();
  const disciplineEvent = location?.state?.event;
  const params = useParams();
  const [rounds, setRounds] = useState([]);
  const [sets, setSets] = useState([]);
  const [activeRounds, setActiveRounds] = useState([]);
  const [activeSets, setActiveSets] = useState([]);
  const listAward = [2, 3, 4];
  const [awards, setAwards] = useState([]);
  const classes = useStyles();
  const [event, setEvent] = useState(null);
  const lang = i18n.language;
  const [matchPoints, setMatchPoints] = useState([]);
  const [roundPoints, setRoundPoints] = useState([]);
  const [checkCollapse, setCheckCollapse] = useState({
    stage: true,
    match: true,
  });
  const { setUrlParam } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      name: null,
      english_name: null,
      event_id: null,
      match_score_type: null,
      stage_type: null,
      sport: disciplineEvent ? disciplineEvent?.sport_discipline?.sport : null,
      sport_discipline: disciplineEvent
        ? disciplineEvent?.sport_discipline
        : null,
      sport_discipline_event: disciplineEvent ? disciplineEvent : null,
      match_turn_num: 1,
      unit: UNIT.POINT,
      match_scoring_method: null,
      sort_type: 1,
      round_type: null,
      rank_type: rank_type.MATCH_POINT,
      match_game_num: 1,
      round_result_type: null,
    },
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          params?.id ? "put" : "post",
          params?.id ? "/admin/stage/" + params?.id : "/admin/stage",
          {
            name: values?.name,
            english_name: values?.english_name,
            event_id: values?.sport_discipline_event.id,
            stage_type: values?.stage_type,
            match_score_type: values?.match_score_type,
            active_rounds: activeRounds.sort((a, b) => a - b),
            active_sets: activeSets.sort((a, b) => a - b),
            match_game_num: formik.values?.match_game_num,
            match_turn_num: values?.match_turn_num,
            awards: [...awards],
            unit: values?.unit ? values?.unit : UNIT.POINT,
            match_scoring_method: values?.match_scoring_method,
            new_match_points:
              values?.stage_type == stage_type.KNOCK_OUT ||
              values?.rank_type != rank_type.MATCH_POINT
                ? []
                : matchPoints.filter((e) => !e?.id),
            old_match_points:
              values?.stage_type == stage_type.KNOCK_OUT ||
              values?.rank_type != rank_type.MATCH_POINT
                ? []
                : matchPoints.filter((e) => e?.id != null),
            new_round_points:
              values?.round_result_type != round_result_type.ROUND_POINT
                ? []
                : roundPoints.filter((e) => !e?.id),
            old_round_points:
              values?.round_result_type != round_result_type.ROUND_POINT
                ? []
                : roundPoints.filter((e) => e?.id != null),
            rank_type:
              values?.stage_type == stage_type.KNOCK_OUT
                ? null
                : values?.rank_type,
            sort_type: values?.sort_type,
            round_type: values?.round_type,
            qualified_to: qualifiedToStage,
            round_result_type: values?.round_result_type,
          }
        );
        if (res) {
          if (params?.id) {
            refetch();
          } else {
            history.goBack();
          }
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(t("stages_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("stages_screen.name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      english_name: Yup.string()
        .required(t("stages_screen.english_name") + " " + t("errors.required"))
        .max(
          255,
          t("stages_screen.english_name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      stage_type: Yup.string()
        .required(
          t("stages_screen.stage_type.title") + " " + t("errors.required")
        )
        .nullable()
        .trim(),
      match_score_type: Yup.string()
        .when("round_type", {
          is: (rt) => rt != round_type.NO_ROUND,
          then: Yup.string()
            .required(
              t("stages_screen.match_score_type.title") +
                " " +
                t("errors.required")
            )
            .nullable(),
        })
        .nullable(),
      match_scoring_method: Yup.string()
        .required(
          t("stages_screen.match_scoring_method.title") +
            " " +
            t("errors.required")
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
      sport_discipline_event: Yup.object()
        .required(
          t("sport_screen.sport_discipline_event") + " " + t("errors.required")
        )
        .nullable(),
      match_turn_num: Yup.number()
        .required(
          t("stages_screen.match_turn_num") + " " + t("errors.required")
        )
        .max(
          20,
          t("stages_screen.match_turn_num") +
            " " +
            t("errors.max.before") +
            " 20 "
        )
        .min(
          1,
          t("stages_screen.match_turn_num") +
            " " +
            t("errors.min.before") +
            " 1 "
        )
        .nullable(),
      rank_type: Yup.string()
        .when("stage_type", {
          is: (st) => st == stage_type.QUALIFIED_USED_TABLE,
          then: Yup.string()
            .required(
              t("stages_screen.rank_type.title") + " " + t("errors.required")
            )
            .nullable(),
        })
        .nullable(),
      round_result_type: Yup.string()
        .when("round_type", {
          is: (rt) => rt != round_type.NO_ROUND,
          then: Yup.string()
            .required(
              t("stages_screen.round_result_type.title") +
                " " +
                t("errors.required")
            )
            .nullable(),
        })
        .nullable(),
    }),
  });
  useEffect(() => {
    setUrlParam((pre) => ({
      ...pre,
      sub_id: params?.sub_id,
    }));
    if (location?.state?.event) {
      const _event = location.state.event;
      formik.setFieldValue("sport", _event?.sport_discipline?.sport);
      formik.setFieldValue("sport_discipline", _event?.sport_discipline);
      formik.setFieldValue("sport_discipline_event", _event);
      formik.setFieldValue("round_type", _event?.round_type);
      setRounds(_event?.event_rounds);
      setSets(_event?.event_set);
      setEvent(_event);
    }
    if (stage) {
      formik.setValues({
        ...stage,
      });
      formik.setFieldValue("sport", stage?.event?.sport_discipline?.sport);
      formik.setFieldValue("sport_discipline", stage?.event?.sport_discipline);
      setRounds(stage?.event?.event_rounds);
      setSets(stage?.event?.event_set);
      formik.setFieldValue("sport_discipline_event", stage?.event);
      setEvent(stage?.event);
      setActiveRounds(stage?.event_rounds.map((e) => e.id));
      setActiveSets(stage?.event_sets.map((e) => e.id));
      setAwards(
        stage?.stage_qualification_settings
          .filter((e) => e.qualification_type != qualification_type.QUALIFIED)
          .map((e) => e.qualification_type)
      );
      setMatchPoints(stage?.match_points);
      setRoundPoints(stage?.round_points);
      const next_stage = stage?.stage_qualification_settings
        .filter((e) => e.qualification_type == qualification_type.QUALIFIED)
        .map((e) => e?.qualified_to_stage_id);
      if (next_stage) {
        setQualifiedToStage(next_stage);
      }
    }
  }, [stage]);

  useEffect(() => {
    formik.setFieldValue("round_type", event?.round_type);
    if (!stage) {
      if (
        event?.round_type == round_type.HAS_SET ||
        event?.round_type == round_type.HAS_ROUND
      ) {
        formik.setFieldValue("match_score_type", match_score_type.RECORD);
      }
    }
  }, [event]);
  const inputs = useMemo(
    () => [
      [
        {
          field: "sport",
          label: i18n.t("sport_screen.sport"),
          required: true,
          value: formik.values?.sport,
          endpoint: "admin/sport",
          queryField:
            i18n.languages[0] == "vi" ? "name_like" : "english_name_like",
          labelField: i18n.languages[0] == "vi" ? "name" : "english_name",
          error:
            (formik.touched.sport && formik.errors?.sport) || api.error?.sport,
          handleChange: (e) => {
            formik.setFieldValue("sport", e);
            formik.setFieldValue("sport_discipline", null);
            formik.setFieldValue("sport_discipline_event", null);
            setRounds([]);
            setSets([]);
            setEvent(null);
          },
          display: params?.id && false,
          type: "autocomplete",
          variant: "outlined",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "sport_discipline",
          label: i18n.t("sport_screen.sport_discipline"),
          required: true,
          value: formik.values?.sport_discipline,
          display: params?.id && false,
          endpoint: formik.values?.sport
            ? "admin/sportDiscipline?sport_id_equal=" + formik.values?.sport?.id
            : null,
          queryField:
            i18n.languages[0] == "vi" ? "name_like" : "english_name_like",
          labelField: i18n.languages[0] == "vi" ? "name" : "english_name",
          error:
            (formik.touched.sport_discipline &&
              formik.errors?.sport_discipline) ||
            api.error?.sport_discipline,
          handleChange: (e) => {
            formik.setFieldValue("sport_discipline", e);
            formik.setFieldValue("sport_discipline_event", null);
            setRounds([]);
            setSets([]);
            setEvent(null);
          },
          type: "autocomplete",
          variant: "outlined",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "sport_discipline_event",
          label: i18n.t("sport_screen.sport_discipline_event"),
          required: true,
          value: formik.values?.sport_discipline_event,
          display: params?.id && false,
          endpoint: formik.values?.sport_discipline
            ? "admin/sportDisciplineEvent?sport_discipline_id_equal=" +
              formik.values?.sport_discipline?.id
            : null,
          queryField:
            i18n.languages[0] == "vi" ? "name_like" : "english_name_like",
          labelField: i18n.languages[0] == "vi" ? "name" : "english_name",
          error:
            (formik.touched.sport_discipline_event &&
              formik.errors?.sport_discipline_event) ||
            api.error?.event_id,
          handleChange: (e) => {
            formik.setFieldValue("sport_discipline_event", e);
            setRounds(e?.event_rounds);
            setSets(e?.event_set);
            setEvent(e);
          },
          type: "autocomplete",
          variant: "outlined",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "name",
          label: i18n.t("stages_screen.name"),
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
          label: i18n.t("stages_screen.english_name"),
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
          label: i18n.t("stages_screen.stage_type.title"),
          field: "stage_type",
          required: true,
          value: formik.values.stage_type,
          handleChange: (e) => {
            formik.setFieldValue("stage_type", e);
            // formik.setFieldValue("match_score_type", null);
          },
          error:
            api.error?.stage_type ||
            (formik.touched.stage_type && formik.errors?.stage_type),
          type: "radio",
          options: [
            {
              label: i18n.t("stages_screen.stage_type.qualified_used_table"),
              value: stage_type.QUALIFIED_USED_TABLE,
            },
            {
              label: i18n.t("stages_screen.stage_type.knock_out"),
              value: stage_type.KNOCK_OUT,
            },
            {
              label: i18n.t("stages_screen.stage_type.round_robin_tournament"),
              value: stage_type.ROUND_ROBIN,
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
      ],
    ],
    [formik, api]
  );

  const activeRound = useCallback(
    (round) => {
      setActiveSets([]);
      if (activeRounds.some((e) => e == round?.id)) {
        setActiveRounds((pre) => pre.filter((e) => e != round?.id));
      } else {
        setActiveRounds((pre) => [...pre, round?.id]);
      }
    },
    [activeRounds, rounds]
  );

  const activeSet = useCallback(
    (set) => {
      setActiveRounds([]);
      if (activeSets.some((e) => e == set?.id)) {
        setActiveSets((pre) => pre.filter((e) => e != set?.id));
      } else {
        setActiveSets((pre) => [...pre, set?.id]);
      }
    },
    [activeSets, sets]
  );

  const activeAward = useCallback(
    (award) => {
      if (awards.some((e) => e == award)) {
        setAwards((pre) => pre.filter((e) => e != award));
      } else {
        setAwards((pre) => [...pre, award]);
      }
    },
    [awards]
  );
  const checkActiveRound = (id) => activeRounds.some((rId) => rId == id);
  const checkActiveSet = (id) => activeSets.some((rId) => rId == id);
  const checkActiveAdward = (type) => awards.some((aType) => aType == type);
  const _event = useMemo(() => {
    if (event) {
      return { event_id_equal: event?.id };
    }
    return null;
  }, [event]);

  const { data: nextStages } = useFetch(
    _event && ["get", "/admin/stage", _event]
  );

  const [qualifiedToStage, setQualifiedToStage] = useState([]);

  const QualifiedTo = useMemo(() => {
    const updateQualifiedToSate = (id) => {
      if (checkQualifiedTo(id)) {
        setQualifiedToStage((pre) => pre.filter((e) => e != id));
      } else {
        setQualifiedToStage((pre) => [...pre, id]);
      }
    };

    const checkQualifiedTo = (stageId) =>
      qualifiedToStage.some((e) => e == stageId);

    return (
      <div className={classes.badges}>
        {nextStages?.data
          ?.filter((e) => e.id != params?.id)
          .map((e, i) => (
            <div
              key={i}
              className={`${classes.badge} ${
                checkQualifiedTo(e?.id) ? classes.active : classes.unActive
              }`}
              onClick={() => updateQualifiedToSate(e?.id)}
            >
              <span>
                {i18n.languages[0] == "vi" ? e?.name : e?.english_name}
              </span>
              {checkQualifiedTo(e?.id) && <CheckCircleRoundedIcon />}
            </div>
          ))}
      </div>
    );
  }, [_event, nextStages, qualifiedToStage]);

  function handDeleteMatchPoint(index) {
    setMatchPoints((pre) => pre.filter((e, i) => i != index));
  }

  const MatchPoint = ({ matchPoint, index }) => {
    return (
      <div key={index} className={classes.matchPoint}>
        {`${matchPoint.point_name}: ${matchPoint.points}`}
        <div className={`btn_match_point ${classes.btnMP}`}>
          <Dialog
            title={t("stages_screen.match_point.edit_title")}
            content={(close) => (
              <MatchPointForm
                close={close}
                matchPoint={matchPoint}
                setMatchPoints={setMatchPoints}
                index={index}
              />
            )}
            fullWidth={false}
          >
            <IconButton style={{ padding: 5 }} title={t("button.edit")}>
              <EditOutlinedIcon style={{ color: color.success }} />
            </IconButton>
          </Dialog>
          <IconButton
            style={{ padding: 5 }}
            title={t("button.delete")}
            onClick={() => handDeleteMatchPoint(index)}
          >
            <HighlightOffIcon style={{ color: color.error }} />
          </IconButton>
        </div>
      </div>
    );
  };

  function handDeleteRoundPoint(index) {
    setRoundPoints((pre) => pre.filter((e, i) => i != index));
  }
  const RoundPoint = ({ roundPoint, index }) => {
    return (
      <div key={index} className={classes.matchPoint}>
        {`${roundPoint.point_name}: ${roundPoint.points}`}
        <div className={`btn_match_point ${classes.btnMP}`}>
          <Dialog
            title={t("stages_screen.round_point.edit_title")}
            content={(close) => (
              <RoundPointForm
                close={close}
                roundPoint={roundPoint}
                setRoundPoints={setRoundPoints}
                index={index}
              />
            )}
            fullWidth={false}
          >
            <IconButton style={{ padding: 5 }} title={t("button.edit")}>
              <EditOutlinedIcon style={{ color: color.success }} />
            </IconButton>
          </Dialog>
          <IconButton
            style={{ padding: 5 }}
            title={t("button.delete")}
            onClick={() => handDeleteRoundPoint(index)}
          >
            <HighlightOffIcon style={{ color: color.error }} />
          </IconButton>
        </div>
      </div>
    );
  };

  const matchSettingInputs = useMemo(
    () => [
      [
        {
          field: "round_type",
          label: i18n.t("stages_screen.round_type.title"),
          value: formik.values?.round_type,
          required: true,
          error:
            (formik.touched.round_type && formik.errors?.round_type) ||
            api.error?.round_type,
          handleChange: (e) => {
            formik.setFieldValue("round_type", e);
            setActiveSets([]);
            setActiveRounds([]);
          },
          type: "radio",
          options: [
            {
              hide:
                formik.values?.sport_discipline_event?.round_type !=
                round_type.HAS_ROUND,
              label: i18n.t("stages_screen.round_type.has_round"),
              value: round_type.HAS_ROUND,
            },
            {
              hide:
                formik.values?.sport_discipline_event?.round_type !=
                round_type.HAS_SET,
              label: i18n.t("stages_screen.round_type.has_set"),
              value: round_type.HAS_SET,
            },
            {
              hide:
                formik.values?.sport_discipline_event?.round_type !=
                round_type.NO_ROUND,
              label: i18n.t("stages_screen.round_type.no_round"),
              value: round_type.NO_ROUND,
            },
          ],
          formLabelProps: {
            style: {
              color: "#000000",
              fontWeight: "bold",
            },
          },
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          component: () => (
            <div>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  style={{
                    color: "rgb(0, 0, 0)",
                    fontWeight: "bold",
                  }}
                >
                  {t("stages_screen.round")}
                </FormLabel>
                <div className={classes.badges}>
                  {rounds?.map((round, i) => (
                    <div
                      key={i}
                      className={`${classes.badge} ${
                        checkActiveRound(round?.id)
                          ? classes.active
                          : classes.unActive
                      }`}
                      onClick={() => activeRound(round)}
                    >
                      <span>{round.name}</span>
                      {checkActiveRound(round?.id) && (
                        <CheckCircleRoundedIcon />
                      )}
                    </div>
                  ))}
                </div>
              </FormControl>
            </div>
          ),
          display:
            formik.values?.round_type == round_type.HAS_ROUND &&
            rounds.length > 0,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          component: () => (
            <div>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  style={{
                    color: "rgb(0, 0, 0)",
                    fontWeight: "bold",
                  }}
                >
                  {t("stages_screen.set")}
                </FormLabel>
                <div className={classes.badges}>
                  {sets?.map((set, i) => (
                    <div
                      key={i}
                      className={`${classes.badge} ${
                        checkActiveSet(set?.id)
                          ? classes.active
                          : classes.unActive
                      }`}
                      onClick={() => activeSet(set)}
                    >
                      <span>{set.name}</span>
                      {checkActiveSet(set?.id) && <CheckCircleRoundedIcon />}
                    </div>
                  ))}
                </div>
              </FormControl>
            </div>
          ),
          display:
            formik.values?.round_type == round_type.HAS_SET && sets.length > 0,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik, api, sets, rounds]
  );

  const roundSettingInputs = useMemo(
    () => [
      [
        {
          label: i18n.t("stages_screen.match_score_type.title"),
          field: "match_score_type",
          required: true,
          value: formik.values.match_score_type,
          handleChange: (e) => {
            formik.setFieldValue("match_score_type", e);
            formik.setFieldValue("match_scoring_method", null);
          },
          error:
            api.error?.match_score_type ||
            (formik.touched.match_score_type &&
              formik.errors?.match_score_type),
          type: "radio",
          options: [
            {
              label: i18n.t("stages_screen.match_score_type.record"),
              value: match_score_type.RECORD,
            },
            {
              hide: true,
              label: i18n.t("stages_screen.match_score_type.target_record"),
              value: match_score_type.TARGET_RECORD,
            },
            {
              hide: formik.values?.round_type != round_type.HAS_ROUND,
              label: i18n.t("stages_screen.match_score_type.score"),
              value: match_score_type.SCORE,
            },
            {
              hide: formik.values?.round_type != round_type.HAS_ROUND,
              label: i18n.t("stages_screen.match_score_type.score_ko"),
              value: match_score_type.SCORE_KO,
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
          field: "match_game_num",
          label: i18n.t("stages_screen.match_game_num"),
          value: formik.values?.match_game_num,
          display: true,
          error:
            (formik.touched.match_game_num && formik.errors?.match_game_num) ||
            api.error?.match_game_num,
          handleChange: (e) => {
            formik.setFieldValue("match_game_num", e);
          },
          display: formik.values?.round_type == round_type.HAS_SET,
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          label: i18n.t("stages_screen.round_result_type.title"),
          field: "round_result_type",
          required: true,
          value: formik.values.round_result_type,
          handleChange: (e) => {
            formik.setFieldValue("round_result_type", e);
            formik.setFieldValue("match_scoring_method", null);
          },
          error:
            api.error?.round_result_type ||
            (formik.touched.round_result_type &&
              formik.errors?.round_result_type),
          type: "radio",
          options: [
            {
              hide: formik.values?.match_score_type != match_score_type.RECORD,
              label: i18n.t("stages_screen.round_result_type.record"),
              value: round_result_type.RECORD,
            },
            {
              hide:
                formik.values?.match_score_type != match_score_type.SCORE &&
                formik.values?.match_score_type != match_score_type.SCORE_KO,
              label: i18n.t("stages_screen.round_result_type.referee_point"),
              value: round_result_type.REFEREE_POINT,
            },
            {
              hide:
                formik.values?.round_type != round_type.HAS_SET ||
                formik.values?.match_score_type != match_score_type.RECORD,
              label: i18n.t("stages_screen.round_result_type.round_ponit"),
              value: round_result_type.ROUND_POINT,
            },
            {
              hide: formik.values?.match_score_type != match_score_type.RECORD,
              label: i18n.t("stages_screen.round_result_type.round_win"),
              value: round_result_type.ROUND_WIN,
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
        //round point
        {
          component: () => (
            <div>
              <div>
                <Dialog
                  title={t("stages_screen.round_point.add_title")}
                  content={(close) => (
                    <RoundPointForm
                      close={close}
                      setRoundPoints={setRoundPoints}
                    />
                  )}
                  fullWidth={false}
                >
                  <Button color="primary" variant="outlined">
                    {t("stages_screen.round_point.add_title")}
                  </Button>
                </Dialog>
              </div>
              <div style={{ display: "flex", marginTop: 5 }}>
                {roundPoints.map((rp, rpI) => (
                  <RoundPoint roundPoint={rp} index={rpI} key={rpI} />
                ))}
              </div>
            </div>
          ),
          display:
            formik?.values.round_result_type == round_result_type.ROUND_POINT,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik, api]
  );

  const matchResult = useMemo(
    () => [
      [
        {
          label: i18n.t("stages_screen.match_scoring_method.title"),
          field: "match_scoring_method",
          required: true,
          value: formik.values.match_scoring_method,
          handleChange: (e) => {
            formik.setFieldValue("match_scoring_method", e);
          },
          error:
            api.error?.match_scoring_method ||
            (formik.touched.match_scoring_method &&
              formik.errors?.match_scoring_method),
          type: "radio",
          options: [
            {
              hide:
                formik.values?.round_result_type !=
                  round_result_type.ROUND_WIN ||
                formik.values?.round_type == round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.round_win"),
              value: match_scoring_method.ROUND_WIN,
            },
            {
              hide:
                (formik.values?.match_score_type == match_score_type.RECORD ||
                  formik.values?.match_score_type ==
                    match_score_type.TARGET_RECORD) &&
                formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.sum_score"),
              value: match_scoring_method.SUM_SCORE,
            },
            {
              hide: formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.sum_score_ko"),
              value: match_scoring_method.SUM_SCORE_KO,
            },
            {
              hide:
                (formik.values?.match_score_type == match_score_type.RECORD ||
                  formik.values?.match_score_type ==
                    match_score_type.TARGET_RECORD) &&
                formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.average"),
              value: match_scoring_method.AVERAGE,
            },
            {
              hide: formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t(
                "stages_screen.match_scoring_method.average_between"
              ),
              value: match_scoring_method.AVERAGE_BETWEEN,
            },
            {
              hide:
                (formik.values?.match_score_type == match_score_type.SCORE ||
                  formik.values?.match_score_type ==
                    match_score_type.SCORE_KO ||
                  formik.values?.match_score_type ==
                    match_score_type.TARGET_RECORD ||
                  formik.values?.round_result_type ==
                    round_result_type.ROUND_WIN) &&
                formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.sum_record"),
              value: match_scoring_method.SUM_RECORD,
            },
            {
              hide:
                (formik.values?.match_score_type == match_score_type.SCORE ||
                  formik.values?.match_score_type ==
                    match_score_type.SCORE_KO ||
                  formik.values.round_result_type ==
                    round_result_type.ROUND_WIN ||
                  formik.values?.round_type == round_type.HAS_SET) &&
                formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.best_record"),
              value: match_scoring_method.BEST_RECORD,
            },
            {
              hide: formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t(
                "stages_screen.match_scoring_method.best_target_record"
              ),
              value: match_scoring_method.BEST_TARGET_RECORD,
            },
            {
              hide: formik.values?.round_type != round_type.NO_ROUND,
              label: i18n.t("stages_screen.match_scoring_method.win_lose"),
              value: match_scoring_method.WIN_LOSE,
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
          field: "match_turn_num",
          name: "number turn",
          display:
            formik.values?.match_scoring_method ==
            match_scoring_method.BEST_TARGET_RECORD,
          label: i18n.t("stages_screen.match_turn_num"),
          required: true,
          value: formik.values?.match_turn_num,
          error:
            (formik.touched.match_turn_num && formik.errors?.match_turn_num) ||
            api.error?.match_turn_num,
          handleChange: (e) => formik.setFieldValue("match_turn_num", e),
          type: "number",
          variant: "outlined",
          grid: { xs: 6, sm: 6, md: 6 },
        },
        {
          field: "unit",
          label: i18n.t("stages_screen.unit"),
          value: formik.values?.unit,
          display:
            formik.values?.match_scoring_method ==
              match_scoring_method.BEST_TARGET_RECORD ||
            formik.values?.match_scoring_method ==
              match_scoring_method.BEST_RECORD ||
            formik.values?.match_scoring_method ==
              match_scoring_method.SUM_RECORD,
          error:
            (formik.touched.unit && formik.errors?.unit) || api.error?.unit,
          handleChange: (e) => formik.setFieldValue("unit", e),
          type: "select",
          options: [
            {
              value: null,
              label: "---",
            },
            {
              value: measurement_unit.TIME,
              label: t("measurement_unit.time.full_name"),
            },
            {
              value: measurement_unit.KILOMETER,
              label: t("measurement_unit.kilometer.full_name"),
            },
            {
              value: measurement_unit.METER,
              label: t("measurement_unit.meter.full_name"),
            },
            {
              value: measurement_unit.CENTIMETER,
              label: t("measurement_unit.centimeter.full_name"),
            },
            {
              value: measurement_unit.KILOGRAM,
              label: t("measurement_unit.kilogram.full_name"),
            },
            {
              value: measurement_unit.POINT,
              label: t("measurement_unit.point.full_name"),
            },
          ],
          display:
            formik.values?.match_scoring_method ==
              match_scoring_method.BEST_RECORD ||
            formik.values?.match_scoring_method ==
              match_scoring_method.SUM_RECORD ||
            formik.values?.match_scoring_method ==
              match_scoring_method.BEST_TARGET_RECORD,
          variant: "outlined",
          grid: { xs: 6, sm: 6, md: 6 },
        },
      ],
    ],
    [formik, api]
  );
  return (
    <PaperContainer>
      {/* stage setting */}
      <div>
        <span>
          <span className={classes.setting}>
            {t("stages_screen.stage_setting")}
          </span>
        </span>
        <IconButton
          onClick={() =>
            setCheckCollapse((pre) => ({ ...pre, stage: !pre?.stage }))
          }
        >
          {checkCollapse?.stage ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Collapse in={checkCollapse?.stage}>
          <div>
            <Forms inputs={inputs} />
          </div>
          {/* next stage */}
          {nextStages?.data?.find((e) => e?.id != params?.id) && (
            <div style={{ marginBottom: 10 }}>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  style={{
                    color: "rgb(0, 0, 0)",
                    fontWeight: "bold",
                  }}
                >
                  {t("stages_screen.qualified_to.title")}
                </FormLabel>
                {QualifiedTo}
              </FormControl>
            </div>
          )}
          {/* adward */}
          {(formik.values?.stage_type == stage_type.KNOCK_OUT ||
            formik.values?.stage_type == stage_type.ROUND_ROBIN) && (
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                style={{
                  color: "rgb(0, 0, 0)",
                  fontWeight: "bold",
                }}
              >
                {t("stages_screen.award")}
              </FormLabel>
              <div className={classes.badges}>
                {listAward
                  ?.map((e) => {
                    if (e == qualification_type.QUALIFIED) {
                      return {
                        name: t("award.qualified"),
                        type: qualification_type.QUALIFIED,
                      };
                    }
                    if (e == qualification_type.HCV) {
                      return {
                        name: t("award.hcv"),
                        type: qualification_type.HCV,
                      };
                    }
                    if (e == qualification_type.HCB) {
                      return {
                        name: t("award.hcb"),
                        type: qualification_type.HCB,
                      };
                    }
                    if (e == qualification_type.HCD) {
                      return {
                        name: t("award.hcd"),
                        type: qualification_type.HCD,
                      };
                    }
                  })
                  .map((award, i) => (
                    <div
                      key={i}
                      className={`${classes.badge} ${
                        checkActiveAdward(award.type)
                          ? classes.active
                          : classes.unActive
                      }`}
                      onClick={() => activeAward(award.type)}
                    >
                      <span>{award.name}</span>
                      {checkActiveAdward(award.type) && (
                        <CheckCircleRoundedIcon />
                      )}
                    </div>
                  ))}
              </div>
            </FormControl>
          )}
        </Collapse>
      </div>
      {/* match */}
      <div>
        <span className={classes.setting}>
          {t("stages_screen.match_setting")}
        </span>
        <IconButton
          onClick={() =>
            setCheckCollapse((pre) => ({ ...pre, match: !pre?.match }))
          }
        >
          {checkCollapse?.match ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Collapse in={checkCollapse?.match}>
          <div>
            <Forms inputs={matchSettingInputs} />
          </div>
          <div>
            {(formik.values?.round_type == round_type.HAS_ROUND ||
              formik.values?.round_type == round_type.HAS_SET) && (
              <Forms inputs={roundSettingInputs} />
            )}
          </div>
          <div>
            <Forms inputs={matchResult} />
          </div>
          <div style={{ marginBottom: 10 }}>
            {(formik.values?.stage_type == stage_type.QUALIFIED_USED_TABLE ||
              formik.values?.stage_type == stage_type.ROUND_ROBIN) && (
              <div
                style={{
                  marginTop: 10,
                }}
              >
                <div>
                  <Radios
                    label={t("stages_screen.rank_type.title")}
                    value={formik.values?.rank_type}
                    error={
                      formik.touched?.rank_type && formik.errors?.rank_type
                    }
                    handleChange={(e) => formik.setFieldValue("rank_type", e)}
                    formLabelProps={{
                      style: {
                        color: "#000000",
                        fontWeight: "bold",
                      },
                    }}
                    options={[
                      {
                        value: rank_type.MATCH_POINT,
                        label: t("stages_screen.rank_type.match_point"),
                      },
                      {
                        value: rank_type.RECORD,
                        label: t("stages_screen.rank_type.record"),
                      },
                    ]}
                  />
                </div>
                {formik.values?.rank_type == 1 && (
                  <>
                    <div>
                      <Dialog
                        title={t("stages_screen.match_point.add_title")}
                        content={(close) => (
                          <MatchPointForm
                            close={close}
                            setMatchPoints={setMatchPoints}
                          />
                        )}
                        fullWidth={false}
                      >
                        <Button color="primary" variant="outlined">
                          {t("stages_screen.match_point.add_title")}
                        </Button>
                      </Dialog>
                    </div>
                    <div style={{ display: "flex", marginTop: 5 }}>
                      {matchPoints.map((mp, mpI) => (
                        <MatchPoint matchPoint={mp} index={mpI} key={mpI} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <Radios
                label={t("stages_screen.sort_type.title")}
                value={formik.values?.sort_type}
                // error={}
                handleChange={(e) => formik.setFieldValue("sort_type", e)}
                formLabelProps={{
                  style: {
                    color: "#000000",
                    fontWeight: "bold",
                  },
                }}
                options={[
                  {
                    value: 1,
                    label: t("stages_screen.sort_type.asc"),
                  },
                  {
                    value: 2,
                    label: t("stages_screen.sort_type.desc"),
                  },
                ]}
              />
            </div>
          </div>
        </Collapse>
      </div>

      {params?.id ? (
        <ButtonSolashi
          variant="contained"
          color="primary"
          loading={api.loading}
          onClick={formik.handleSubmit}
        >
          {i18n.t("button.update")}
        </ButtonSolashi>
      ) : (
        <ButtonSolashi
          variant="contained"
          color="primary"
          loading={api.loading}
          onClick={formik.handleSubmit}
          startIcon={<SaveIcon />}
        >
          {i18n.t("button.add")}
        </ButtonSolashi>
      )}
    </PaperContainer>
  );
}
