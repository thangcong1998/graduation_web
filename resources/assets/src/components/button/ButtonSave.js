import Button from "./ButtonSolashi";
import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";

export default function ButtonSave(props) {
  const { text, onClick, ...otherProps } = props;
  const { t } = useTranslation();
  return (
    <Button
      style={{
        color: "#ffffff",
      }}
      color="primary"
      variant="contained"
      onClick={() => onClick()}
      //   startIcon={<SystemUpdateAltRoundedIcon />}
      {...otherProps}
    >
      <SaveIcon />
      {t("button.save")}
    </Button>
  );
}
