import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

export default function Team1vsn(props) {
  const { match } = props;

  const classes = useStyle();
  return (
    <div style={{ display: "flex", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {match?.match_event_teams?.map((item, index) => {
          return (
            <div className={classes.div}>
              <div className={classes.team}>
                <img
                  style={{
                    marginRight: 10,
                    marginTop: 3,
                  }}
                  height={35}
                  width={50}
                  src={
                    process.env.MIX_REACT_APP_STORAGE_URL +
                    "/" +
                    item?.event_team?.team?.country?.flag_url
                  }
                />
                <Typography className={classes.team_name}>
                  {item.event_team.name}
                </Typography>
              </div>

              {item?.event_team?.event_team_competitor.map((value, i) => {
                return (
                  <Typography className={classes.member_name}>
                    {value?.given_name + " " + value?.family_name}
                  </Typography>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  div: {
    width: 400,
    borderRight: "1px solid #1716162e",
  },
  team: {
    padding: 7,
    backgroundColor: "#43a047",
    display: "flex",
    justifyContent: "center",
  },
  team_name: {
    fontSize: "1.5rem",
    fontFamily: "math",
    color: "white",
  },
  member_name: {
    textAlign: "center",
    fontSize: "1.2rem",
    backgroundColor: "#e8f5e9",
    padding: 7,
  },
}));
