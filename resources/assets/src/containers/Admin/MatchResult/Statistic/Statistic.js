import React, { useEffect, useState } from "react";
import { Paper, Button } from "@material-ui/core";
import Statistic1vs1 from "./Statistic1vs1";
import Statistic1vs1N from "./Statistic1vsN";
import { match_attendant_type, stage_type } from "../../../../common/constants";

export default function Statistic({ match }) {
  return (
    <Paper
      style={{
        backgroundColor: "#f3f3f3",
        padding: 20,
        width: "100%",
      }}
    >
      {match?.stage?.event?.match_type == match_attendant_type._1VS1 && (
        <Statistic1vs1 match={match} />
      )}
      {match?.stage?.event?.match_type == match_attendant_type._1VSN && (
        <Statistic1vs1N match={match} />
      )}
    </Paper>
  );
}
