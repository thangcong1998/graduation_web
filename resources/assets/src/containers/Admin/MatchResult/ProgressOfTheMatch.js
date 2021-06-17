import React, { useEffect, useState } from "react";
import { Button, Paper } from "@material-ui/core";
import {
  ChecktypeInProgressMatch,
  progress_match_type,
  CheckUnit,
} from "../../../common/constants";
import { useTranslation } from "react-i18next";
import AddProgressMatch from "./ProgressMatch/AddProgressMatch";
import EditProgrssMatch from "./ProgressMatch/EditProgressMatch";
import { useAPI, useFetch } from "../../../api/api";
import { useParams } from "react-router";
import AddProgressMatch1vsN from "./ProgressMatch/AddProgressMatch1vsN";
import EditProgrssMatch1vsN from "./ProgressMatch/EditProgressMatch1vsN";
import Prm1vs1 from "./ProgressMatch/1vs1";
import Prm1vs1N from "./ProgressMatch/1vs1N";

export default function ProgressOfTheMatch({ match, status }) {
  const { t } = useTranslation();
  const api = useAPI();
  const params = useParams();
  const [array, setArray] = useState([]);
  const [type, setType] = useState();
  const [time, setTime] = useState("00:00:00");
  const [achievements, setAchievements] = useState(
    match?.stage?.unit ? match?.stage?.unit : null
  );
  const [foul, setFoul] = useState();
  const [player, setPlayer] = useState();
  const [player_out, setPlayerOut] = useState();
  const [tns, setTns] = useState();
  const [team, setTeam] = useState();
  const [edit, setEdit] = useState();
  const [ownGoal, setOwnGoal] = useState(false);

  const {
    data: progressMatch,
    loading: loading,
    revalidate: refetch,
  } = useFetch([
    "get",
    "/admin/progressMatch" + `?match_id_equal=${params?.id}`,
  ]);

  useEffect(() => {
    if (progressMatch) {
      if (match?.match_individual_competitors?.length > 0) {
        setArray(
          progressMatch?.data?.map((e) => {
            return {
              ...e,
              player: { competitor: e?.player },
              player_out: { competitor: e?.player_out },
            };
          })
        );
      } else {
        setArray(
          progressMatch?.data?.map((e) => {
            return {
              ...e,
              ownGoal: e?.own_goal,
            };
          })
        );
      }
    }
  }, [progressMatch]);

  const addToArray = async (close) => {
    close();
    let temp = {
      type: "",
      time: "",
      player: "",
      foul: "",
      player_out: "",
      achievements: "",
      tns: "",
      team: "",
      ownGoal: "",
    };
    temp.type = type ? type : null;
    temp.time = time ? time : null;
    temp.player = player ? player : null;
    temp.player_out = player_out ? player_out : null;
    temp.foul = foul ? foul : null;
    temp.achievements = achievements ? achievements : null;
    temp.tns = tns ? tns : null;
    temp.team = team;
    temp.ownGoal = ownGoal;
    setTeam();
    setType();
    setTime();
    setFoul();
    setPlayer();
    setPlayerOut();
    setTns();
    setOwnGoal();
    let tempArray = [...array];
    tempArray.push(temp);
    tempArray.sort(function (a, b) {
      return a.time - b.time;
    });
    setArray(tempArray);
    let res = await api.fetcher("post", "admin/progressOfMatch", {
      ProgressOfTheMatch: temp,
      match_id: params?.id,
    });
    if (res) {
      refetch();
    }
  };
  const changeType = (value) => {
    setType(value);
  };

  const editProMatch = (index) => {
    setEdit(index);
  };

  const doneProMatch = async (index) => {
    setEdit(null);
    const pmId = array
      ?.map((e, pmIndex) => {
        if (pmIndex == index) {
          return { id: e?.id };
        }
      })
      ?.find((i) => i?.id != null);
    let res = await api.fetcher("put", "admin/progressMatch/" + pmId?.id, {
      ProgressOfTheMatch: array,
      match_id: params?.id,
    });
    if (res) {
      refetch();
    }
  };

  const deleteProMatch = async (index) => {
    const _array = array?.filter((e, rdIndex) => rdIndex != index);
    setArray(_array);
    let res = await api.fetcher("post", "admin/deleteProgressMatch", {
      id: _array?.map((e) => {
        return e?.id;
      }),
      match_id: params?.id,
    });
    if (res) {
      refetch();
    }
  };

  const editTns = (index, value) => {
    setArray((pre) => [
      ...pre?.map((e, arIndex) => {
        if (index == arIndex) {
          return { ...e, tns: value };
        }
        return e;
      }),
    ]);
  };

  const editPlayer = (index, value) => {
    setArray((pre) => [
      ...pre?.map((e, arIndex) => {
        if (index == arIndex) {
          return { ...e, player: value };
        }
        return e;
      }),
    ]);
  };

  const editPlayerOut = (index, value) => {
    setArray((pre) => [
      ...pre?.map((e, arIndex) => {
        if (index == arIndex) {
          return { ...e, player_out: value };
        }
        return e;
      }),
    ]);
  };

  const editFoul = (index, value) => {
    setArray((pre) => [
      ...pre?.map((e, arIndex) => {
        if (index == arIndex) {
          return { ...e, foul: value };
        }
      }),
    ]);
  };

  const changeOwnGoal = (e) => {
    setOwnGoal(e.target.checked);
  };
  return (
    <Paper
      style={{
        backgroundColor: "#f3f3f3",
        padding: 20,
        width: "100%",
      }}
    >
      {array.map((value, index) => {
        return (
          <div style={{ marginBottom: 20, paddingRight: 10 }}>
            {match?.match_event_teams?.length > 0 && (
              <Prm1vs1
                value={value}
                editProMatch={editProMatch}
                doneProMatch={doneProMatch}
                deleteProMatch={deleteProMatch}
                ChecktypeInProgressMatch={ChecktypeInProgressMatch}
                CheckUnit={CheckUnit}
                t={t}
                index={index}
                edit={edit}
                progress_match_type={progress_match_type}
                achievements={achievements}
              />
            )}
            {match?.match_individual_competitors?.length > 0 && (
              <Prm1vs1N
                value={value}
                editProMatch={editProMatch}
                doneProMatch={doneProMatch}
                deleteProMatch={deleteProMatch}
                ChecktypeInProgressMatch={ChecktypeInProgressMatch}
                CheckUnit={CheckUnit}
                t={t}
                index={index}
                edit={edit}
                progress_match_type={progress_match_type}
                achievements={achievements}
              />
            )}
            {index == edit && match?.match_event_teams?.length > 0 && (
              <EditProgrssMatch
                t={t}
                ChecktypeInProgressMatch={ChecktypeInProgressMatch}
                value={value}
                progress_match_type={progress_match_type}
                setTns={setTns}
                player={player}
                editTns={editTns}
                index={index}
                type={type}
                match={match}
                editPlayer={editPlayer}
                editPlayerOut={editPlayerOut}
                editFoul={editFoul}
                achievements={achievements}
              />
            )}
            {index == edit &&
              match?.match_individual_competitors?.length > 0 && (
                <EditProgrssMatch1vsN
                  t={t}
                  ChecktypeInProgressMatch={ChecktypeInProgressMatch}
                  value={value}
                  progress_match_type={progress_match_type}
                  setTns={setTns}
                  player={player}
                  editTns={editTns}
                  index={index}
                  type={type}
                  match={match}
                  editPlayer={editPlayer}
                  editPlayerOut={editPlayerOut}
                  editFoul={editFoul}
                  achievements={achievements}
                />
              )}
          </div>
        );
      })}
      {edit == null && (
        <div>
          {match?.match_event_teams?.length > 0 ? (
            <AddProgressMatch
              changeType={changeType}
              addToArray={addToArray}
              setTime={setTime}
              time={time}
              type={type}
              match={match}
              achievements={achievements}
              foul={foul}
              player={player}
              player_out={player_out}
              setPlayer={setPlayer}
              player_out={player_out}
              setPlayerOut={setPlayerOut}
              setFoul={setFoul}
              team={team}
              setTeam={setTeam}
              setTns={setTns}
              tns={tns}
              CheckUnit={CheckUnit}
              close={close}
              ownGoal={ownGoal}
              setOwnGoal={setOwnGoal}
              changeOwnGoal={changeOwnGoal}
            />
          ) : (
            <AddProgressMatch1vsN
              changeType={changeType}
              addToArray={addToArray}
              setTime={setTime}
              time={time}
              type={type}
              match={match}
              achievements={achievements}
              foul={foul}
              player={player}
              player_out={player_out}
              setPlayer={setPlayer}
              player_out={player_out}
              setPlayerOut={setPlayerOut}
              setFoul={setFoul}
              team={team}
              setTeam={setTeam}
              setTns={setTns}
              tns={tns}
              CheckUnit={CheckUnit}
            />
          )}
        </div>
      )}
    </Paper>
  );
}
