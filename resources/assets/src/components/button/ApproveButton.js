import Button from "./ButtonSolashi";
import React from "react";
// import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  ApproveButton: {
    color: "#ffffff",
    background: "#13d605",
    "&:hover": {
      color: "#ffffff",
      background: "#18930f",
    },
  },
}));

export default function ApproveButton(props) {
  const { onClick, ...otherProps } = props;
  const classes = useStyle();
  const { t } = useTranslation();
  return (
    <Button
      className={classes.ApproveButton}
      variant="contained"
      onClick={() => onClick()}
      //   startIcon={}
      {...otherProps}
    />
  );
}
