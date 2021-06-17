import React from "react";
import Score1vs1RoundIndividual from "./Score1vs1Individual/Score1vs1RoundIndividual";
import Score1vs1RoundTeam from "./Score1vs1Team/Score1vs1RoundTeam";
import { event_type } from "../../../../../common/constants";

export default function Score1vs1Round({ match, round }) {
  return (
    <React.Fragment>
      {match?.stage?.event?.competition_type == event_type.INDIVIDUAL ? (
        <Score1vs1RoundIndividual match={match} />
      ) : (
        <Score1vs1RoundTeam match={match} />
      )}
    </React.Fragment>
  );
}
