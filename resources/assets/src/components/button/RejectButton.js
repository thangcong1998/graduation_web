import Button from "./ButtonSolashi";
import React from "react";
// import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  ApproveButton: {
    color: "#ffffff",
  },
}));

export default function RejectButton(props) {
  const { onClick, ...otherProps } = props;
  const classes = useStyle();
  const { t } = useTranslation();
  return (
    <Button
      className={classes.ApproveButton}
      variant="contained"
      color="secondary"
      onClick={() => onClick()}
      //   startIcon={}
      {...otherProps}
    />
  );
}
