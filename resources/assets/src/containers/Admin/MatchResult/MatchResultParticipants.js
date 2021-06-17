import React, { useState, useEffect } from "react";
import { Paper, makeStyles, Typography, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import FunctionReferee from "./FunctionReferee";
import Member1vs1 from "./Member1vs1.js";
import Member1vsn from "./Member1vsn.js";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAPI } from "../../../api/api";
import { useFetch } from "../../../api/api";

export default function MatchResultParticipants(props) {
  const classes = useStyle();
  const history = useHistory();
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const { match, field, setField } = props;
  const [competitors, setCompetitors] = useState([]);
  const [referFunc, setReferFunc] = useState([]);
  const [startList, setStartList] = useState([]);
  const [official2, setOfficial2] = useState([]);
  const [official, setOfficial] = useState([]);
  const [array, setArray] = useState([]);
  const [arrRef, setArrRef] = useState([]);
  const [click, setClick] = useState(true);
  const [click2, setClick2] = useState(true);
  const [individuals, setIndividuals] = useState([]);
  const param = useParams();
  const [params, setParams] = useState({
    event_id: null,
    nationality_id_equal: null,
    name: null,
    id: [],
    accreditation_number_like: null,
  });
  const { data: referee } = useFetch(["get", "/admin/referee", params]);

  useEffect(() => {
    if (referee?.data) {
      setArrRef(referee?.data);
    }
  }, [referee?.data, referFunc]);

  useEffect(() => {
    if (match?.match_referee_relations) {
      let tem = [];
      match?.match_referee_relations?.map((item) => {
        if (item?.referee_id) {
          tem.push(item?.referee_id);
        }
      });
      let temParams = { ...params };
      temParams.id = JSON.stringify(tem);
      temParams.event_id = match?.stage?.event_id;
      setParams(temParams);
    }
  }, [match?.match_referee_relations]);
  useEffect(() => {
    if (referFunc) {
      let total = 0;
      referFunc.map((item) => {
        if (item?.referee?.id) {
          total++;
        }
      });
      if (total == referFunc.length) {
        setClick(false);
      } else {
        setClick(true);
      }
    }
    if (match?.stage?.event?.is_line == 2) {
      if (competitors) {
        let countCompetitor = 0;
        competitors.map((item) => {
          if (item?.line_id) {
            countCompetitor++;
          }
        });
        if (countCompetitor == competitors.length) {
          setClick2(false);
        } else {
          setClick2(true);
        }
      }
    } else {
      setClick2(false);
    }
  }, [referFunc, competitors, match]);

  const formik = useFormik({
    initialValues: {
      referFunc: [],
    },

    onSubmit: async (values) => {
      try {
        let res = await api.fetcher("post", "admin/lineCompetitor", {
          match_id: parseInt(param?.id),
          competitor_venue_event_field_id: field?.id,
          method_id: match?.stage?.event?.event_distinguish_player_method
            ?.method_id
            ? match?.stage?.event?.event_distinguish_player_method?.method_id
            : null,
          referFunc: referFunc,
          competitors: competitors,
          start_lists: startList.map((e, index) => ({
            ...e,
            start_list: index == 0 ? official : official2,
          })),
          arrays: array,
          individuals: individuals,
        });
        if (res) {
          history.go(0);
        }
      } catch (e) {}
    },
  });

  return (
    <Paper style={{ backgroundColor: "#f3f3f3", padding: 20, width: "100%" }}>
      <Typography className={classes.typo}>
        <i>{t("match_result_screen.member")}</i>
      </Typography>
      {match?.stage?.event?.match_type == 2 ? (
        <Member1vsn
          field={field}
          setField={setField}
          competitors={competitors}
          setCompetitors={setCompetitors}
          match={match}
          array={array}
          setArray={setArray}
          errors={api?.error}
        />
      ) : (
        <Member1vs1
          startList={startList}
          setStartList={setStartList}
          match={match}
          official={official}
          setOfficial={setOfficial}
          setOfficial2={setOfficial2}
          official2={official2}
          individual={individuals}
          setIndividual={setIndividuals}
          errors={api?.error}
        />
      )}
      <div>
        <FunctionReferee
          referFunc={referFunc}
          setReferFunc={setReferFunc}
          match={match}
          params={params}
          setParams={setParams}
          referee={referee}
          arrRef={arrRef}
          setArrRef={setArrRef}
        />
      </div>
      {click == false && click2 == false ? (
        <Button
          disabled={false}
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
        >
          {t("button.save")}
        </Button>
      ) : (
        <Button
          disabled={true}
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
        >
          {t("button.save")}
        </Button>
      )}
    </Paper>
  );
}

const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  typo: {
    fontFamily: "initial",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 5,
  },
}));
