import React from "react";
import { IconButton } from "@material-ui/core";
import Card from "../../assets/icons/card-green.svg";

export default function(props) {
    const { onClick, ...otherProps } = props;

    return (
        <IconButton
            style={{ color: "#228b22" }}
            title={"download card"}
            onClick={onClick}
            {...otherProps}
        >
            <img src={Card} />
        </IconButton>
    );
}
