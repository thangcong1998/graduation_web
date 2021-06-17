import Button from "./ButtonSolashi";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";

export default function ButtonAdd(props) {
  const { text, onClick,disabled, ...otherProps } = props;
  const { t } = useTranslation();
  return (
    <Button
      style={{
        color: "#ffffff",
      }}
      color="primary"
      variant="contained"
      onClick={() => onClick()}
      startIcon={<AddIcon />}
      {...otherProps}
    >
      {text && t("button.add") + " " + text}
    </Button>
  );
}
