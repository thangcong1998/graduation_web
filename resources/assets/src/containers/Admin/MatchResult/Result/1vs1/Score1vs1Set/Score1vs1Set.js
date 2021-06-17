import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { useAPI } from "../../../../../../api/api";
import {
  match_score_type,
  match_scoring_method,
  event_type,
  CheckQualification,
  round_result_type,
} from "../../../../../../common/constants";
import Score1vs1SetSumRecord from "./Score1vs1SetSumRecord";
import Score1vs1SetWin from "./Score1vs1SetWin";
import Score1vs1SetWinTeam from "./Score1vs1SetWinTeam";
import Score1vs1SetRecurve from "./Score1vs1SetRecurve";

export default function Score1vs1Set({ match }) {
  const api = useAPI();
  const { t } = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [member1, setMember1] = useState([]);
  const [member2, setMember2] = useState([]);
  const [tab, setTab] = useState(0);
  const [_round, _setRound] = useState([]);

  const [matchPointA, setMatchPointA] = useState();
  const [matchPointB, setMatchPointB] = useState();

  const [qualificationA, setQualificationA] = useState();
  const [qualificationB, setQualificationB] = useState();

  const [setPointA, setSetPointA] = useState();
  const [setPointB, setSetPointB] = useState();

  useEffect(() => {
    if (match) {
      setMember1(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors[0]
          : match?.match_event_teams[0]
      );
      setMember2(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors[1]
          : match?.match_event_teams[1]
      );
      setMatchPointA(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors[0]?.match_point
          : match?.match_event_teams[0]?.matchPoint
      );
      setMatchPointB(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors[1]?.match_point
          : match?.match_event_teams[1]?.matchPoint
      );
      setQualificationA(
        match?.match_individual_competitors?.length > 0
          ? //individual
            match?.stage_qualification_competitor?.find(
              (e) =>
                e?.participant_id ==
                match?.match_individual_competitors[0]?.competitor_id
            )?.qualification_type == 1
            ? // qualified to stage
              match?.stage_qualification_competitor?.find(
                (e) =>
                  e?.participant_id ==
                  match?.match_individual_competitors[0]?.competitor_id
              )?.qualified_to_stage_id
            : // qualification_type
              match?.stage_qualification_competitor?.find(
                (e) =>
                  (e?.participant_id == e?.participant_id) ==
                  match?.match_individual_competitors[0]?.competitor_id
              )?.qualification_type
          : //event _team
          match?.stage_qualification_competitor?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[0]?.event_team_id
            )?.qualification_type == 1
          ? // qualified to stage
            match?.stage_qualification_competitor?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[0]?.event_team_id
            )?.qualified_to_stage_id
          : //qualification type
            match?.stage_qualification_competitor?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[0]?.event_team_id
            )?.qualification_type
      );
      setQualificationB(
        match?.match_individual_competitors?.length > 0
          ? //individual
            match?.stage_qualification_competitor?.find(
              (e) =>
                e?.participant_id ==
                match?.match_individual_competitors[1]?.competitor_id
            )?.qualification_type == 1
            ? // qualified to stage
              match?.stage_qualification_competitor?.find(
                (e) =>
                  e?.participant_id ==
                  match?.match_individual_competitors[1]?.competitor_id
              )?.qualified_to_stage_id
            : // qualification_type
              match?.stage_qualification_competitor?.find(
                (e) =>
                  e?.event_team_id == match?.match_event_teams[1]?.event_team_id
              )?.qualification_type
          : //event _team
          match?.stage_qualification_competitor?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[1]?.event_team_id
            )?.qualification_type == 1
          ? // qualified to stage
            match?.stage_qualification_competitor?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[1]?.event_team_id
            )?.qualified_to_stage_id
          : // qualification_type
            match?.stage_qualification_competitor?.find(
              (e) =>
                e?.event_team_id == match?.match_event_teams[1]?.event_team_id
            )?.qualification_type
      );
    }
  }, [match]);

  useEffect(() => {
    if (match) {
      if (match?.match_individual_competitors?.length > 0) {
        let set = [];
        for (let i = 0; i < match?.stage?.match_game_num; i++) {
          set.push({
            gameScore: 0,
            result: match?.match_individual_competitors?.map((res) => ({
              ...res,
              resultScore: 0,
            })),
          });
        }
        let res = [];
        res = match?.match_set?.filter((el) => {
          return match?.stage?.event_sets?.find((element) => {
            return element?.id == el?.event_set_id;
          });
        });

        if (match?.match_set.length > 0) {
          _setRound(
            res?.map((e) => ({
              ...e,
              totalScoreA: e?.match_set_result
                ?.filter(
                  (i) =>
                    i?.competitor_id ==
                    match?.match_individual_competitors[0]?.competitor_id
                )
                ?.map((re) => {
                  return re?.score;
                })
                ?.reduce(function (a, b) {
                  return a + b;
                }),
              totalScoreB: e?.match_set_result
                ?.filter(
                  (i) =>
                    i?.competitor_id ==
                    match?.match_individual_competitors[1]?.competitor_id
                )
                ?.map((re) => {
                  return re?.score;
                })
                ?.reduce(function (a, b) {
                  return a + b;
                }),
              match_individual_competitors: match?.match_individual_competitors?.map(
                (i) => {
                  return {
                    ...i,
                    setPoint:
                      e?.match_set_result?.find(
                        (re) => re?.competitor_id == i?.competitor_id
                      )?.set_point >= 0
                        ? e?.match_set_result?.find(
                            (re) => re?.competitor_id == i?.competitor_id
                          )?.set_point
                        : null,
                  };
                }
              ),
              game_result: set?.map((s, gameIndex) => ({
                result: match?.match_individual_competitors?.map((res) => ({
                  match_individual_competitor_id: res?.id,
                  competitor_id: res?.competitor_id,
                  resultScore: e?.match_set_game_result?.find(
                    (re) =>
                      re?.competitor_id == res?.competitor_id &&
                      re?.set_game_no == gameIndex
                  )?.score,
                  set_game_no: gameIndex,
                })),
              })),
            }))
          );
        } else {
          let set = [];
          for (let i = 0; i < match?.stage?.match_game_num; i++) {
            set.push({
              gameScore: 0,
              result: match?.match_individual_competitors?.map((res) => ({
                ...res,
                match_individual_competitor_id: res?.id,
                resultScore: 0,
              })),
            });
          }
          _setRound(
            match?.stage?.event_sets?.map((e) => ({
              ...e,
              event_set_id: e?.id,
              match_individual_competitors: match?.match_individual_competitors?.map(
                (i) => {
                  return { ...i, setPoint: 0 };
                }
              ),
              totalScoreA: 0,
              totalScoreB: 0,
              match_invididual_win: null,
              game_result: set,
            }))
          );
        }
      }
      if (match?.match_event_teams?.length > 0) {
        let set = [];
        for (let i = 0; i < match?.stage?.match_game_num; i++) {
          set.push({
            gameScore: 0,
            result: match?.match_event_teams?.map((res) => ({
              ...res,
              resultScore: 0,
            })),
          });
        }
        let res = [];
        res = match?.match_set?.filter((el) => {
          return match?.stage?.event_sets?.find((element) => {
            return element?.id == el?.event_set_id;
          });
        });
        if (match?.match_set.length > 0) {
          _setRound(
            res?.map((e) => ({
              ...e,
              totalScoreA: e?.match_set_result
                ?.filter(
                  (i) =>
                    i?.event_team_id ==
                    match?.match_event_teams[0]?.event_team_id
                )
                ?.map((re) => {
                  return re?.score;
                })
                ?.reduce(function (a, b) {
                  return a + b;
                }),
              totalScoreB: e?.match_set_result
                ?.filter(
                  (i) =>
                    i?.event_team_id ==
                    match?.match_event_teams[1]?.event_team_id
                )
                ?.map((re) => {
                  return re?.score;
                })
                ?.reduce(function (a, b) {
                  return a + b;
                }),
              match_event_teams: match?.match_event_teams?.map((i) => {
                return {
                  ...i,
                  setPoint:
                    e?.match_set_result?.find(
                      (re) => re?.event_team_id == i?.event_team_id
                    )?.set_point >= 0
                      ? e?.match_set_result?.find(
                          (re) => re?.event_team_id == i?.event_team_id
                        )?.set_point
                      : null,
                };
              }),
              game_result: set?.map((s, gameIndex) => ({
                result: match?.match_event_teams?.map((r) => ({
                  event_team_id: r?.event_team_id,
                  match_event_team_id: r?.event_team_id,
                  resultScore: e?.match_set_game_result?.find(
                    (re) =>
                      re?.event_team_id == r?.event_team_id &&
                      re?.set_game_no == gameIndex
                  )?.score,
                  set_game_no: gameIndex,
                })),
              })),
            }))
          );
        } else {
          let set = [];
          for (let i = 0; i < match?.stage?.match_game_num; i++) {
            set.push({
              gameScore: 0,
              result: match?.match_event_team?.map((res) => ({
                ...res,
                match_event_team_id: res?.id,
                resultScore: 0,
              })),
            });
          }
          _setRound(
            match?.stage?.event_sets?.map((e) => ({
              ...e,
              event_set_id: e?.id,
              match_event_teams: match?.match_event_teams?.map((i) => {
                return { ...i, setPoint: 0 };
              }),
              totalScoreA: 0,
              totalScoreB: 0,
              match_event_team_win: 0,
              game_result: set,
            }))
          );
        }
      }
    }
  }, [match]);

  const changeScoreGame = (value, reIndex, gaIndex, index) => {
    _setRound((pre) => [
      ...pre.map((e, rIndex) => {
        if (rIndex == index) {
          return {
            ...e,
            game_result: e?.game_result?.map((gam, gIndex) => {
              if (gIndex == gaIndex) {
                return {
                  ...gam,
                  result: gam?.result?.map((re, resIndex) => {
                    if (resIndex == reIndex) {
                      return { ...re, resultScore: value ? value : 0 };
                    }
                    return re;
                  }),
                };
              }
              return gam;
            }),
          };
        }
        return e;
      }),
    ]);
  };

  const matchPoint = match?.stage?.match_points?.map((e) => ({
    value: e?.points == 0 ? "0" : e?.points,
    label: e?.point_name,
  }));

  const qualification = match?.stage?.stage_qualification_settings?.map((e) => {
    if (e?.qualification_type == 1) {
      return {
        value: e?.qualified_to_stage_id,
        label:
          CheckQualification(e?.qualification_type, t) +
          " " +
          `${e?.qualification_type == 1 ? e?.qualified_to_stage?.name : ""}`,
      };
    } else {
      return {
        value: e?.qualification_type == 0 ? "0" : e?.qualification_type,
        label:
          CheckQualification(e?.qualification_type, t) +
          " " +
          `${e?.qualification_type == 1 ? e?.qualified_to_stage?.name : ""}`,
      };
    }
  });

  const checkQualification = (e, value) => {
    setQualificationA(value);
  };
  const checkQualificationB = (e, value) => {
    setQualificationB(value);
  };

  const changeResultPoints = (e, value) => {
    setMatchPointA(value);
  };
  const changeResultPointsB = (e, value) => {
    setMatchPointB(value);
  };

  const changeSetPoint = (value, index, comIndex) => {
    _setRound((pre) => [
      ...pre?.map((pr, setIndex) => {
        if (setIndex == index) {
          return {
            ...pr,
            match_individual_competitors: pr?.match_individual_competitors?.map(
              (i, cpIndex) => {
                if (cpIndex == comIndex) {
                  return {
                    ...i,
                    setPoint: value,
                  };
                }
                return i;
              }
            ),
            match_event_teams: pr?.match_event_teams?.map((i, cpIndex) => {
              if (cpIndex == comIndex) {
                return {
                  ...i,
                  setPoint: value,
                };
              }
              return i;
            }),
          };
        }
        return pr;
      }),
    ]);
  };

  const changeTab = (e, newValue) => {
    setTab(newValue);
  };

  const score = _round?.[tab]?.game_result?.map((e, index) => {
    const abc = e?.result?.reduce((a, b) => {
      if (parseInt(a.resultScore) > parseInt(b.resultScore)) {
        return a;
      }
      if (parseInt(a.resultScore) < parseInt(b.resultScore)) {
        return b;
      }
      return 0;
    });
    return match?.match_individual_competitors?.length > 0
      ? abc?.competitor_id
      : abc?.event_team_id;
  });
  const scoreGameA =
    match?.match_individual_competitors?.length > 0
      ? score?.filter((e) => e == member1?.competitor_id)?.length
      : score?.filter((e) => e == member1?.event_team_id)?.length;
  const scoreGameB =
    match?.match_individual_competitors?.length > 0
      ? score?.filter((e) => e == member2?.competitor_id)?.length
      : score?.filter((e) => e == member2?.event_team_id)?.length;

  var mf = 1;
  var m = 0;
  var item;
  for (var i = 0; i < score?.length; i++) {
    for (var j = i; j < score?.length; j++) {
      if (score[i] == score[j]) m++;
      if (mf < m) {
        mf = m;
        item = score[i];
      }
    }
    m = 0;
  }

  useEffect(() => {
    if (item) {
      _setRound((pre) => [
        ...pre?.map((e, index) => {
          if (index == tab) {
            if (match?.match_individual_competitors?.length > 0) {
              return { ...e, match_invididual_win: item ? item : null };
            } else {
              return { ...e, match_event_team_win: item ? item : null };
            }
          }
          return e;
        }),
      ]);
    }
  }, [item]);

  const scoreA =
    match?.match_individual_competitors?.length > 0
      ? _round?.filter((e) => e?.match_invididual_win == member1?.competitor_id)
          .length
      : _round?.filter((e) => e?.match_event_team_win == member1?.event_team_id)
          .length;

  const scoreB =
    match?.match_individual_competitors?.length > 0
      ? _round?.filter((e) => e?.match_invididual_win == member2?.competitor_id)
          .length
      : _round?.filter((e) => e?.match_event_team_win == member2?.event_team_id)
          .length;
  /// sum record
  const totalScoreA =
    match?.match_individual_competitors?.length > 0
      ? _round?.[tab]?.game_result
          ?.map((e) => {
            return parseInt(
              e?.result?.find((i) => i?.competitor_id == member1?.competitor_id)
                ?.resultScore
            );
          })
          ?.reduce(function (a, b) {
            return a + b;
          })
      : _round?.[tab]?.game_result
          ?.map((e) => {
            return parseInt(
              e?.result?.find((i) => i?.event_team_id == member1?.event_team_id)
                ?.resultScore
            );
          })
          ?.reduce(function (a, b) {
            return a + b;
          });

  const finalResultScoreA = _round
    ?.map((e) => {
      return parseInt(e?.totalScoreA);
    })
    ?.reduce(function (a, b) {
      return a + b;
    }, 0);

  const totalScoreB =
    match?.match_individual_competitors?.length > 0
      ? _round?.[tab]?.game_result
          ?.map((e) => {
            return parseInt(
              e?.result?.find((i) => i?.competitor_id == member2?.competitor_id)
                ?.resultScore
            );
          })
          ?.reduce(function (a, b) {
            return a + b;
          })
      : _round?.[tab]?.game_result
          ?.map((e) => {
            return parseInt(
              e?.result?.find((i) => i?.event_team_id == member2?.event_team_id)
                ?.resultScore
            );
          })
          ?.reduce(function (a, b) {
            return a + b;
          });

  const finalResultScoreB = _round
    ?.map((e) => {
      return parseInt(e?.totalScoreB);
    })
    ?.reduce(function (a, b) {
      return a + b;
    }, 0);

  useEffect(() => {
    if (match) {
      _setRound((pre) => [
        ...pre?.map((e, index) => {
          if (index == tab) {
            return {
              ...e,
              match_individual_competitors: e?.match_individual_competitors?.map(
                (i) => {
                  return {
                    ...i,
                    totalScore:
                      i?.competitor_id == member1?.competitor_id
                        ? totalScoreA
                        : totalScoreB,
                  };
                }
              ),
              match_event_teams: e?.match_event_teams?.map((i) => {
                return {
                  ...i,
                  totalScore:
                    i?.event_team_id == member1?.event_team_id
                      ? totalScoreA
                      : totalScoreB,
                };
              }),
              totalScoreA: totalScoreA ? totalScoreA : 0,
              totalScoreB: totalScoreB ? totalScoreB : 0,
            };
          }
          return e;
        }),
      ]);
    }
  }, [totalScoreA, totalScoreB, setPointA, setPointB]);

  const [matchIndividualWin, setMatchIndividualWin] = useState();
  const [matchEventTeamWin, setMatchEventTeamWin] = useState();

  useEffect(() => {
    if (
      match?.stage?.match_scoring_method == match_scoring_method.SUM_RECORD &&
      match?.stage?.recurve != true
    ) {
      if (finalResultScoreA > finalResultScoreB) {
        match?.match_individual_competitors?.length > 0
          ? setMatchIndividualWin(member1?.competitor_id)
          : setMatchEventTeamWin(member1?.event_team_id);
      }
      if (finalResultScoreA < finalResultScoreB) {
        match?.match_individual_competitors?.length > 0
          ? setMatchIndividualWin(member2?.competitor_id)
          : setMatchEventTeamWin(member2?.event_team_id);
      }
    }
  }, [finalResultScoreA, finalResultScoreB]);

  // case round win

  const scoreFinalResultA =
    match?.match_individual_competitors?.length > 0
      ? _round
          ?.map((e) => {
            return e?.match_individual_competitors?.find(
              (i) => i?.competitor_id == member1?.competitor_id
            )?.setPoint;
          })
          ?.map((x) => {
            if (x == null) {
              return 0;
            }
            return x;
          })
          ?.reduce(function (a, b) {
            return a + b;
          }, 0)
      : _round
          ?.map((e) => {
            return e?.match_event_teams?.find(
              (i) => i?.event_team_id == member1?.event_team_id
            )?.setPoint;
          })
          ?.map((x) => {
            if (x == null) {
              return 0;
            }
            return x;
          })
          ?.reduce(function (a, b) {
            return a + b;
          }, 0);

  const scoreFinalResultB =
    match?.match_individual_competitors?.length > 0
      ? _round
          ?.map((e) => {
            return e?.match_individual_competitors?.find(
              (i) => i?.competitor_id == member2?.competitor_id
            )?.setPoint;
          })
          ?.map((x) => {
            if (x == null) {
              return 0;
            }
            return x;
          })
          ?.reduce(function (a, b) {
            return a + b;
          }, 0)
      : _round
          ?.map((e) => {
            return e?.match_event_teams?.find(
              (i) => i?.event_team_id == member2?.event_team_id
            )?.setPoint;
          })
          ?.map((x) => {
            if (x == null) {
              return 0;
            }
            return x;
          })
          ?.reduce(function (a, b) {
            return a + b;
          }, 0);

  const saveMatchesSet = async () => {
    try {
      let res = await api.fetcher("post", "admin/matches1vs1Set", {
        set: JSON.stringify(_round),
        competition_type: match?.stage?.event?.competition_type,
        match_id: params?.id,
        member1: member1,
        member2: member2,
        matchPointA: matchPointA,
        matchPointB: matchPointB,
        scoreA:
          (match?.stage?.match_scoring_method ==
            match_scoring_method.ROUND_WIN &&
            scoreA) ||
          (match?.stage?.round_result_type == round_result_type.RECORD
            ? finalResultScoreA
            : 0) ||
          (match?.stage?.round_result_type == round_result_type.ROUND_POINT &&
            scoreFinalResultA),
        scoreB:
          (match?.stage?.match_scoring_method ==
            match_scoring_method.ROUND_WIN &&
            scoreB) ||
          (match?.stage?.round_result_type == round_result_type.RECORD
            ? finalResultScoreB
            : 0) ||
          (match?.stage?.round_result_type == round_result_type.ROUND_POINT &&
            scoreFinalResultB),
        // diem thua
        lose_scoreA:
          (match?.stage?.match_scoring_method ==
            match_scoring_method.ROUND_WIN &&
            scoreB) ||
          (match?.stage?.round_result_type == round_result_type.RECORD
            ? finalResultScoreB
            : 0) ||
          (match?.stage?.round_result_type == round_result_type.ROUND_POINT
            ? scoreFinalResultB
            : 0),
        lose_scoreB:
          (match?.stage?.match_scoring_method ==
            match_scoring_method.ROUND_WIN &&
            scoreA) ||
          (match?.stage?.round_result_type == round_result_type.RECORD
            ? finalResultScoreA
            : 0) ||
          (match?.stage?.round_result_type == round_result_type.ROUND_POINT &&
            scoreFinalResultA),
        matchIndividualWin: matchIndividualWin ? matchIndividualWin : null,
        matchEventTeamWin: matchEventTeamWin ? matchEventTeamWin : null,
        qualificationA: qualificationA ? qualificationA : 0,
        qualificationB: qualificationB ? qualificationB : 0,
        stage_id: match?.stage_id,
        qualified_to_stage_id: match?.stage?.stage_qualification_settings,
      });
      let updateMedalTable = await api.fetcher("get", "admin/medalRankings", {
        stage_id: match?.stage_id,
      });
      // if (res) {
      //   history.goBack();
      // }
    } catch (e) {}
  };

  return (
    <div>
      {match?.stage?.match_scoring_method == match_scoring_method.ROUND_WIN &&
        match?.stage?.event?.competition_type == event_type.INDIVIDUAL && (
          <Score1vs1SetWin
            match={match}
            _round={_round}
            tab={tab}
            changeTab={changeTab}
            changeScoreGame={changeScoreGame}
            member1={member1}
            member2={member2}
            changeResultPoints={changeResultPoints}
            changeResultPointsB={changeResultPointsB}
            qualification={qualification}
            qualificationA={qualificationA}
            qualificationB={qualificationB}
            saveMatchesSet={saveMatchesSet}
            checkQualification={checkQualification}
            checkQualificationB={checkQualificationB}
            scoreA={scoreA}
            scoreB={scoreB}
            api={api}
            saveMatchesSet={saveMatchesSet}
            matchPoint={matchPoint}
            totalScoreA={scoreGameA}
            totalScoreB={scoreGameB}
            matchPointA={matchPointA}
            matchPointB={matchPointB}
          />
        )}
      {match?.stage?.match_scoring_method == match_scoring_method.ROUND_WIN &&
        match?.stage?.event?.competition_type == event_type.TEAM && (
          <Score1vs1SetWinTeam
            match={match}
            _round={_round}
            tab={tab}
            changeTab={changeTab}
            changeScoreGame={changeScoreGame}
            member1={member1}
            member2={member2}
            changeResultPoints={changeResultPoints}
            changeResultPointsB={changeResultPointsB}
            qualification={qualification}
            qualificationA={qualificationA}
            qualificationB={qualificationB}
            saveMatchesSet={saveMatchesSet}
            checkQualification={checkQualification}
            checkQualificationB={checkQualificationB}
            scoreA={scoreA}
            scoreB={scoreB}
            api={api}
            saveMatchesSet={saveMatchesSet}
            matchPoint={matchPoint}
            totalScoreA={scoreGameA}
            totalScoreB={scoreGameB}
            matchPointA={matchPointA}
            matchPointB={matchPointB}
          />
        )}
      {match?.stage?.round_result_type == round_result_type.RECORD && (
        // match?.stage?.event?.competition_type == event_type.TEAM &&
        <Score1vs1SetSumRecord
          match={match}
          _round={_round}
          tab={tab}
          changeTab={changeTab}
          changeScoreGame={changeScoreGame}
          member1={member1}
          member2={member2}
          changeResultPoints={changeResultPoints}
          changeResultPointsB={changeResultPointsB}
          qualification={qualification}
          qualificationA={qualificationA}
          qualificationB={qualificationB}
          saveMatchesSet={saveMatchesSet}
          checkQualification={checkQualification}
          checkQualificationB={checkQualificationB}
          scoreA={finalResultScoreA}
          scoreB={finalResultScoreB}
          totalScoreA={totalScoreA}
          totalScoreB={totalScoreB}
          api={api}
          saveMatchesSet={saveMatchesSet}
          matchPoint={matchPoint}
          matchPointA={matchPointA}
          matchPointB={matchPointB}
        />
      )}
      {match?.stage?.round_result_type == round_result_type.ROUND_POINT && (
        <Score1vs1SetRecurve
          match={match}
          _round={_round}
          tab={tab}
          changeTab={changeTab}
          changeScoreGame={changeScoreGame}
          member1={member1}
          member2={member2}
          changeResultPoints={changeResultPoints}
          changeResultPointsB={changeResultPointsB}
          qualification={qualification}
          qualificationA={qualificationA}
          qualificationB={qualificationB}
          saveMatchesSet={saveMatchesSet}
          checkQualification={checkQualification}
          checkQualificationB={checkQualificationB}
          scoreA={scoreFinalResultA}
          scoreB={scoreFinalResultB}
          api={api}
          saveMatchesSet={saveMatchesSet}
          matchPoint={matchPoint}
          totalScoreA={totalScoreA}
          totalScoreB={totalScoreB}
          setPointA={setPointA}
          setPointB={setPointB}
          changeSetPoint={changeSetPoint}
          matchPointA={matchPointA}
          matchPointB={matchPointB}
        />
      )}
    </div>
  );
}
