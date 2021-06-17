import Button from "./ButtonSolashi";
import React from "react";
import SystemUpdateAltRoundedIcon from "@material-ui/icons/SystemUpdateAltRounded";
import { useTranslation } from "react-i18next";

export default function ButtonUpdate(props) {
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
            // startIcon={<SystemUpdateAltRoundedIcon />}
            {...otherProps}
        >
            {t("button.update")}
        </Button>
    );
}
