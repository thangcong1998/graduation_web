import React, { useEffect, useState } from "react";
import { Dialog, Grid } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import CancelIcon from "@material-ui/icons/Cancel";
export default function ShowImageHandMake({
    open,
    setOpen,
    position,
    setPosition,
    array
}) {
    const [startList, setStartList] = useState(0);
    const [endList, setEndList] = useState(4);
    useEffect(() => {
        if (array.length < 5) {
            setStartList(0);
            setEndList(array.length - 1);
        } else {
            if (position < 5) {
                setStartList(0);
                setEndList(4);
            } else {
                let index = Math.floor(position / 5);
                setStartList(index * 5);
                if (array.length - 1 < index * 5 + 4) {
                    setEndList(array.length - 1);
                } else {
                    setEndList(index * 5 + 4);
                }
            }
        }
    }, [position, array]);

    const NextImage = () => {
        setPosition(position + 1);
    };
    const BackImage = () => {
        setPosition(position - 1);
    };
    const NextListImage = () => {
        setStartList(endList + 1);
        if (array.length - 1 <= endList + 4) {
            setEndList(array.length - 1);
        } else {
            setEndList(endList + 5);
        }
    };
    const BackListImage = () => {
        if (startList - 5 === 0) {
            setStartList(0);
            setEndList(4);
        } else {
            setStartList(startList - 5);
            setEndList(endList - 5);
        }
    };
    const changePositionPress = e => {
        if (e.keyCode === 39) {
            if (position === array.length - 1) {
                setPosition(position);
            } else {
                setPosition(position + 1);
            }
        }
        if (e.keyCode === 37) {
            if (position === 0) {
                setPosition(0);
            } else {
                setPosition(position - 1);
            }
        }
    };
    return (
        <div onKeyDown={e => changePositionPress(e)}>
            <Dialog
                onClose={() => setOpen(false)}
                // aria-labelledby="simple-dialog-title"
                open={open}
                maxWidth={"100%"}
                PaperComponent={"div"}
                style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.9)" }}
            >
                <div
                    style={{
                        height: "100%",
                        textAlign: "center",
                        overflow: "hidden",
                        width: "100%"
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            position: "fixed",
                            bottom: 50,
                            left: 10,
                            right: 10,
                            top: 40,
                            height: "80%",
                            width: "100%"
                        }}
                    >
                        <Grid container spacing={3} style={{ height: "100%" }}>
                            <Grid item xs={1}>
                                {position !== 0 && (
                                    <KeyboardArrowLeftIcon
                                        style={{
                                            height: "100%",
                                            paddingTop: "50%",
                                            color: "white"
                                        }}
                                        onClick={() => BackImage()}
                                        fontSize={"large"}
                                    />
                                )}
                            </Grid>
                            <Grid
                                item
                                xs={10}
                                style={{
                                    textAlign: "center",
                                    height: "100%",
                                    width: "100%"
                                }}
                            >
                                <img
                                    alt=""
                                    src={
                                        array[position]?.id
                                            ? process.env
                                                  .MIX_REACT_APP_STORAGE_URL +
                                              "/" +
                                              array[position]?.path
                                            : array[position]?.preview
                                    }
                                    style={{
                                        verticalAlign: "middle",
                                        height: "100%",
                                        maxWidth: "auto"
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <CancelIcon
                                    style={{
                                        color: "white",
                                        position: "fixed",
                                        top: 10,
                                        right: 10
                                    }}
                                    onClick={() => setOpen(false)}
                                    fontSize={"large"}
                                />
                                {position !== array.length - 1 && (
                                    <KeyboardArrowRightIcon
                                        style={{
                                            height: "100%",
                                            paddingTop: "50%",
                                            color: "white",
                                            marginLeft: 10
                                        }}
                                        onClick={() => NextImage()}
                                        fontSize={"large"}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </div>
                    <div
                        style={{
                            textAlign: "center",
                            position: "fixed",
                            bottom: 15,
                            left: 0,
                            right: 0
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={1}>
                                {startList !== 0 && (
                                    <KeyboardArrowLeftIcon
                                        style={{
                                            height: "100%",
                                            paddingTop: "50%",
                                            color: "white"
                                        }}
                                        onClick={() => BackListImage()}
                                        fontSize={"large"}
                                    />
                                )}
                            </Grid>
                            <Grid
                                item
                                xs={10}
                                style={{
                                    width: "100%",
                                    display: "inline-block",
                                    textAlign: "center"
                                }}
                            >
                                <ul
                                    style={{
                                        justifyContent: "center",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        width: "100%"
                                    }}
                                >
                                    {array.map((value, index) => {
                                        if (
                                            index >= startList &&
                                            index <= endList
                                        ) {
                                            return (
                                                <li
                                                    style={{
                                                        width: 100,
                                                        height: 80,
                                                        borderRadius: 10,
                                                        margin: 10,
                                                        backgroundColor:
                                                            "#000000"
                                                    }}
                                                >
                                                    <img
                                                        alt=""
                                                        style={
                                                            position == index
                                                                ? {
                                                                      maxWidth:
                                                                          "100%",
                                                                      height:
                                                                          "100%",
                                                                      borderRadius: 10
                                                                  }
                                                                : {
                                                                      maxWidth:
                                                                          "100%",
                                                                      height:
                                                                          "100%",
                                                                      opacity: 0.5,
                                                                      borderRadius: 10
                                                                  }
                                                        }
                                                        onClick={() =>
                                                            setPosition(index)
                                                        }
                                                        src={
                                                            value?.id
                                                                ? process.env
                                                                      .MIX_REACT_APP_STORAGE_URL +
                                                                  "/" +
                                                                  value?.path
                                                                : value?.preview
                                                        }
                                                    />
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            </Grid>
                            <Grid item xs={1}>
                                {endList !== array.length - 1 && (
                                    <KeyboardArrowRightIcon
                                        style={{
                                            height: "100%",
                                            paddingTop: "50%",
                                            color: "white"
                                        }}
                                        onClick={() => NextListImage()}
                                        fontSize={"large"}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
