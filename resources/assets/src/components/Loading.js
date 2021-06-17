import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LoadingGif from "../assets/loading-bar-250px.gif";
import CircularProgress from "@material-ui/core/CircularProgress";

//-------------------------------------

const Loading = React.memo((props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
});

const useStyles = makeStyles({
  container: {
    minHeight: 800,
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
