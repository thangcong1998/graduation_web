import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
    root: {
        padding: "5px 10px 10px 10px",
    },
}));

export default function (props) {
    const classes = useStyle();
    return (
        <Paper {...props} className={classes.root}>
            {props.children}
        </Paper>
    );
}
