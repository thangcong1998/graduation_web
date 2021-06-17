import React, { useEffect, useState } from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";
import Record1vsN from "./Result/1vsN/Record1vsN";
import ScoreKO1vs1 from "./Result/1vs1/ScoreKO1vs1";
import Score1vs1Round from "./Result/1vs1/Score1vs1Round";
import TargetRecord1vsN from "./Result/1vsN/TargetRecord1vsN";
import Score1vsN from "./Result/1vsN/Score1vN";
import Score1vs1new from "./Result/1vs1/Score1vs1new";
import Record1vsNNotRound from "./Result/1vsN/Record1vsNNotRound";
import Score1vsNNotRound from "./Result/1vsN/Score1vsNNotRound";
import Score1vs1SetWin from "./Result/1vs1/Score1vs1Set/Score1vs1SetWin";
import Record1vsNNotRoundTime from "./Result/1vsNTime/Record1vsNNotRoundTime";
import Record1vsNTime from "./Result/1vsNTime/Record1vsNTime";
import {
  event_type,
  match_score_type,
  match_scoring_method,
  round_type,
  match_attendant_type,
} from "../../../common/constants";
import { UNIT } from "../../../common/constants";
import Score1vs1SetWinTeam from "./Result/1vs1/Score1vs1Set/Score1vs1SetWinTeam";
import Score1vs1NoRound from "./Result/1vs1/Score1vs1NoRound/Score1vs1NoRound";
import Score1vs1KoNoRound from "./Result/1vs1/Score1vs1KoNoRound/Score1vs1KoNoRound";
import ManyRoundRecord from "./Result/1vsN/10RoundRecord";
import Score1vs1SetSumRecord from "./Result/1vs1/Score1vs1Set/Score1vs1SetSumRecord";
import Score1vs1Set from "./Result/1vs1/Score1vs1Set/Score1vs1Set";

export default function Result({ round, setRound, match, status }) {
  const [matchType, setMatchType] = useState();
  console.log({ match });
  useEffect(() => {
    if (match) {
      // if(match?.stage?.stage_type == 2 && match?.stage?.match_attendant_type == 2 && match?.stage?.match_score_type == 1) {
      if (
        match?.stage?.event?.match_type == 2 &&
        (match?.stage?.match_scoring_method ==
          match_scoring_method.SUM_RECORD ||
          match?.stage?.match_scoring_method ==
            match_scoring_method.BEST_RECORD) &&
        match?.stage?.round_type != round_type.NO_ROUND &&
        match?.stage?.unit != UNIT.TIME &&
        match?.stage?.event_rounds?.length < 10
      ) {
        setMatchType(3);
      }
      if (
        match?.stage?.event?.match_type == 2 &&
        match?.stage?.match_scoring_method == match_scoring_method.SUM_RECORD &&
        match?.stage?.round_type != round_type.NO_ROUND &&
        match?.stage?.unit == UNIT.TIME
      ) {
        setMatchType(9);
      }
      // if(match?.stage?.stage_type == 2 && match?.stage?.match_attendant_type == 2 && match?.stage?.match_score_type == 2) {
      if (
        match?.stage?.event?.match_type == 2 &&
        match?.stage?.match_scoring_method ==
          match_scoring_method.BEST_TARGET_RECORD &&
        match?.stage?.unit != UNIT.TIME
      ) {
        setMatchType(4);
      }
      // if(match?.stage?.stage_type == 1 && match?.stage?.match_attendant_type == 2 && match?.stage?.match_score_type == 3) {
      if (
        match?.stage?.event?.match_type == 2 &&
        match?.stage?.match_scoring_method == match_scoring_method.SUM_SCORE &&
        match?.stage?.round_type != round_type.NO_ROUND &&
        match?.stage?.unit != UNIT.TIME
      ) {
        setMatchType(5);
      }
      if (
        match?.stage?.event?.match_type == 2 &&
        match?.stage?.match_scoring_method ==
          match_scoring_method.BEST_RECORD &&
        match?.stage?.round_type == round_type.NO_ROUND &&
        match?.stage?.unit != UNIT.TIME
      ) {
        setMatchType(6);
      }
      if (
        match?.stage?.event?.match_type == 2 &&
        match?.stage?.match_scoring_method ==
          match_scoring_method.BEST_RECORD &&
        match?.stage?.round_type == round_type.NO_ROUND &&
        match?.stage?.unit == UNIT.TIME
      ) {
        setMatchType(8);
      }
      if (
        match?.stage?.event?.match_type == 2 &&
        (match?.stage?.match_scoring_method == match_scoring_method.SUM_SCORE ||
          match?.stage?.match_scoring_method == match_scoring_method.AVERAGE ||
          match?.stage?.match_scoring_method ==
            match_scoring_method.AVERAGE_BETWEEN) &&
        match?.stage?.round_type == round_type.NO_ROUND &&
        match?.stage?.unit != UNIT.TIME
      ) {
        setMatchType(7);
      }
      if (
        match?.stage?.event?.match_type == 2 &&
        match?.stage?.match_scoring_method == match_scoring_method.SUM_RECORD &&
        match?.stage?.round_type != round_type.NO_ROUND &&
        match?.stage?.unit != UNIT.TIME &&
        match?.stage?.event_rounds?.length >= 10
      ) {
        setMatchType(10);
      }
    }
  }, [match]);

  return (
    <Paper style={{ backgroundColor: "#f3f3f3", padding: 10, width: "100%" }}>
      {/*{tab === 1 && (*/}
      {/*    <Score1vs1 round={round} setRound={setRound} />*/}
      {/*)}*/}
      {/*{tab === 2 && (*/}
      {/*    <ScoreKO1vs1 round={round} setRound={setRound} />*/}
      {/*)}*/}
      {matchType === 3 && (
        <Record1vsN
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 4 && (
        <TargetRecord1vsN
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 5 && (
        <Score1vsN
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 6 && (
        <Record1vsNNotRound
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 7 && (
        <Score1vsNNotRound
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 8 && (
        <Record1vsNNotRoundTime
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 9 && (
        <Record1vsNTime
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {matchType === 10 && (
        <ManyRoundRecord
          round={round}
          setRound={setRound}
          match={match}
          status={status}
        />
      )}
      {match?.stage?.event?.match_type == 1 &&
        match.stage?.match_scoring_method == match_scoring_method.WIN_LOSE &&
        match?.stage?.round_type == round_type.NO_ROUND && (
          <Score1vs1NoRound match={match} />
        )}
      {match?.stage?.event?.match_type == 1 &&
        match_attendant_type._1VS1 &&
        match.stage.match_score_type == match_score_type.RECORD &&
        match.stage?.match_scoring_method == match_scoring_method.SUM_RECORD &&
        match?.stage?.round_type == round_type.HAS_ROUND && (
          <Score1vs1new round={round} setRound={setRound} />
        )}

      {match?.stage?.event?.match_type == 1 &&
        match?.stage.match_score_type == match_score_type.SCORE_KO &&
        match?.stage?.match_scoring_method ==
          match_scoring_method.SUM_SCORE && (
          <ScoreKO1vs1 round={round} setRound={setRound} />
        )}
      {match?.stage?.event?.match_type == 1 &&
        match.stage.match_score_type == match_score_type.RECORD &&
        match.stage?.match_scoring_method == match_scoring_method.ROUND_WIN &&
        match?.stage?.round_type == round_type.HAS_ROUND && (
          <Score1vs1Round round={round} setRound={setRound} match={match} />
        )}
      {match?.stage?.event?.match_type == 1 &&
        match?.stage?.round_type == round_type.HAS_SET && (
          <Score1vs1Set match={match} />
        )}

      {match?.stage?.event?.match_type == 1 &&
        match?.stage?.round_type == round_type.NO_ROUND &&
        match.stage?.match_scoring_method ==
          match_scoring_method.SUM_SCORE_KO && (
          <Score1vs1KoNoRound round={round} setRound={setRound} />
        )}
    </Paper>
  );
}
