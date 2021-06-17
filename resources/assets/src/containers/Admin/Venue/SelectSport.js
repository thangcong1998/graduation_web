import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";

const SelectSport = React.memo((props) => {
    const { arr, click, setClick } = props;
    const { t } = useTranslation();

    useEffect(() => {
        console.log("arr", arr);
    }, [arr]);

    const classes = useStyles();

    const handleClick = (id) => {
        if (!click.includes(id)) {
            click.push(id);
            setClick([...click]);
        } else {
            let arrClick = [];
            arrClick = click.filter((item) => item !== id);
            setClick(arrClick);
        }
    };

    return (
        <div className={classes.div}>
            {arr?.length != 0 && <Typography>{t("venue_screen.sport") + "*"}</Typography>}
            {arr?.map((item, index) => (
                <Button
                    style={
                        click.includes(item.id)
                            ? { backgroundColor: "#bbdefb" }
                            : { backgroundColor: "white" }
                    }
                    onClick={() => handleClick(item.id)}
                    variant="outlined"
                    key={index}
                    className={classes.button}
                >
                    {item.name}
                </Button>
            ))}
        </div>
    );
});
export default SelectSport;

const useStyles = makeStyles(() => ({
    button: {
        textTransform: "capitalize",
        margin: 10,
    },
    div: {
        width: "100%",
    },
}));
