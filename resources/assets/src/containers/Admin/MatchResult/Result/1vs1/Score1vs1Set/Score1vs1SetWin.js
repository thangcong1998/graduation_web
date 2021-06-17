import React from "react";
import Score1vs1SetUI from "./Score1vs1SetUI";
import GameResult from "./GameResult";
import { AppBar } from "@material-ui/core";
import { Tabs, Tab, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export default function Score1vs1SetWin({
  match,
  _round,
  tab,
  changeTab,
  changeScoreGame,
  member1,
  member2,
  matchPoint,
  matchPointA,
  matchPointB,
  qualification,
  qualificationA,
  qualificationB,
  checkQualification,
  checkQualificationB,
  changeResultPoints,
  changeResultPointsB,
  scoreA,
  scoreB,
  api,
  saveMatchesSet,
  totalScoreA,
  totalScoreB,
}) {
  const { t } = useTranslation();
  // console.log({ match });
  return (
    <div>
      <Score1vs1SetUI
        match={match}
        member1={member1}
        member2={member2}
        matchPoint={matchPoint}
        matchPointA={matchPointA}
        matchPointB={matchPointB}
        qualification={qualification}
        qualificationA={qualificationA}
        qualificationB={qualificationB}
        checkQualification={checkQualification}
        checkQualificationB={checkQualificationB}
        changeResultPoints={changeResultPoints}
        changeResultPointsB={changeResultPointsB}
        scoreA={scoreA}
        scoreB={scoreB}
      />
      <AppBar position="static" style={{ backgroundColor: "rgb(76, 175, 80)" }}>
        <Tabs value={tab} onChange={changeTab}>
          {_round?.map((e, index) => {
            return <Tab label={"Set" + (index + 1)} value={index} />;
          })}
        </Tabs>
        <GameResult
          set={_round?.[tab]}
          index={tab}
          changeScoreGame={changeScoreGame}
          member1={member1}
          member2={member2}
          totalScoreA={totalScoreA}
          totalScoreB={totalScoreB}
        />
      </AppBar>
      <Button
        disabled={api?.loading == false ? false : true}
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        onClick={(e) => saveMatchesSet(e)}
      >
        {t("button.save")}
      </Button>
    </div>
  );
}
