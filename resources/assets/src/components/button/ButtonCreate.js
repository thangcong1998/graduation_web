import Button from "./ButtonSolashi";
import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";

export default function ButtonCreate(props) {
  const { text, onClick, disabled, ...otherProps } = props;
  const { t } = useTranslation();
  return (
    <Button
      style={{
        color: "#ffffff",
      }}
      color="primary"
      variant="contained"
      onClick={() => onClick()}
      startIcon={<SaveIcon />}
      {...otherProps}
    >
      {text ? t("button.add") + " " + text : t("button.add")}
    </Button>
  );
}
