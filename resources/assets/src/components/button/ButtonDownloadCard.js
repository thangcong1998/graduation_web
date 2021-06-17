import React from "react";
import { Button, SvgIcon } from "@material-ui/core";
import loadingBtn from "../../assets/loading-btn.svg";
import Card from "../../assets/icons/card-white.svg";

export default function(props) {
    const { loading, startIcon, ...otherProps } = props;

    return (
        <Button
            startIcon={loading ? <img src={loadingBtn} /> : <img src={Card} />}
            disabled={loading}
            {...otherProps}
        />
    );
}
