import React, { useEffect, useState } from "react";
import ShowImageHandMake from "../../../components/ShowImage/ShowImageHandMake";
import Grid from "@material-ui/core/Grid";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../../api/api";
import "./Scroolbar.css";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import Map from "./Map";

export default function PreviewVenueInForm({
    newFiles,
    oldFiles,
    formik,
    close,
    sport,
    training,
    competition
}) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const [openTest, setOpenTest] = useState(false);
    const [position, setPosition] = useState(0);
    const [listImageShow, setListImageShow] = useState([]);
    const [arrayImage, setArrayImage] = useState([]);
    useEffect(() => {
        if (newFiles.length !== 0 || oldFiles.length !== 0) {
            setArrayImage(newFiles.concat(oldFiles));
        }
    }, [newFiles, oldFiles]);

    const { data: sportDiscipline } = useFetch([
        "get",
        "/admin/sportDiscipline"
    ]);

    return (
        <div style={{ backgroundColor: "#fff", padding: 20, overflow: "auto" }}>
            {arrayImage.length !== 0 && (
                <ShowImageHandMake
                    open={openTest}
                    setOpen={setOpenTest}
                    position={position}
                    setPosition={setPosition}
                    array={listImageShow}
                />
            )}
            {arrayImage && arrayImage.length == 1 && (
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 510,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20,
                                marginBottom: 10
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(0);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[0].path
                                    : arrayImage[0].preview
                            }
                        />
                    </Grid>
                </Grid>
            )}
            {arrayImage && arrayImage.length == 2 && (
                <Grid container spacing={1}>
                    <Grid item xs={6} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 510,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20,
                                marginBottom: 10
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(0);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[0].path
                                    : arrayImage[0].preview
                            }
                        />
                    </Grid>
                    <Grid item xs={6} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 510,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20,
                                marginBottom: 10
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(1);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[1].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[1].path
                                    : arrayImage[1].preview
                            }
                        />
                    </Grid>
                </Grid>
            )}
            {arrayImage && arrayImage.length > 3 && (
                <Grid container spacing={1}>
                    <Grid item xs={8} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 510,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(0);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[0].path
                                    : arrayImage[0].preview
                            }
                        />
                    </Grid>
                    <Grid item xs={4} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 250,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20,
                                marginBottom: 10
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(2);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[2].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[2].path
                                    : arrayImage[2].preview
                            }
                        />
                        <div
                            style={{
                                position: "relative",
                                textAlign: "center",
                                color: "white"
                            }}
                        >
                            <img
                                alt=""
                                style={{
                                    width: "100%",
                                    height: 250,
                                    boxShadow:
                                        " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                    borderRadius: 20,
                                    opacity: 0.5
                                }}
                                src={
                                    arrayImage[1].id
                                        ? process.env
                                              .MIX_REACT_APP_STORAGE_URL +
                                          "/" +
                                          arrayImage[1].path
                                        : arrayImage[1].preview
                                }
                                onClick={() => {
                                    setOpenTest(true);
                                    setPosition(1);
                                    setListImageShow(arrayImage);
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "2.5rem",
                                    color: "#000"
                                }}
                            >
                                +{arrayImage.length - 3}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            )}
            {arrayImage && arrayImage.length === 3 && (
                <Grid container spacing={1}>
                    <Grid item xs={8} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 510,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(0);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[0].path
                                    : arrayImage[0].preview
                            }
                        />
                    </Grid>
                    <Grid item xs={4} style={{ padding: 20 }}>
                        <img
                            alt=""
                            style={{
                                width: "100%",
                                height: 250,
                                boxShadow:
                                    " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                borderRadius: 20,
                                marginBottom: 10
                            }}
                            onClick={() => {
                                setOpenTest(true);
                                setPosition(2);
                                setListImageShow(arrayImage);
                            }}
                            src={
                                arrayImage[2].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      arrayImage[2].path
                                    : arrayImage[2].preview
                            }
                        />
                        <div
                            style={{
                                position: "relative",
                                textAlign: "center",
                                color: "white"
                            }}
                        >
                            <img
                                alt=""
                                style={{
                                    width: "100%",
                                    height: 250,
                                    boxShadow:
                                        " 0 -2px 4px rgba(0, 0, 0, 1), 0 2px 3px rgba(0, 0, 0, 1)",
                                    borderRadius: 20
                                }}
                                src={
                                    arrayImage[1].id
                                        ? process.env
                                              .MIX_REACT_APP_STORAGE_URL +
                                          "/" +
                                          arrayImage[1].path
                                        : arrayImage[1].preview
                                }
                                onClick={() => {
                                    setOpenTest(true);
                                    setPosition(1);
                                    setListImageShow(arrayImage);
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "2.5rem",
                                    color: "#000"
                                }}
                            ></div>
                        </div>
                    </Grid>
                </Grid>
            )}
            <Grid
                container
                style={{
                    padding: "10px 20px 20px 20px",
                    border: "#d6d6d6 solid 1px",
                    borderRadius: "20px",
                    margin: 20
                }}
            >
                <Grid item xs={8}>
                    <div>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            <h1 className="label">{formik?.values?.name}</h1>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            <LocationOnIcon
                                style={{ marginRight: 10, color: "#d50000" }}
                            />
                            <i>
                                <p
                                    className="label"
                                    style={{
                                        padding: 0,
                                        margin: 2,
                                        fontSize: "1rem"
                                    }}
                                >
                                    {formik?.values?.address}
                                </p>
                            </i>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4} style={{ height: "100%" }}>
                    <a
                        href={
                            "http://www.google.com/maps/place/" +
                            formik?.values?.latitude +
                            "," +
                            formik?.values?.longtitude
                        }
                        target="_blank"
                    >
                        {formik?.values?.latitude &&
                            formik?.values?.longtitude && (
                                <Map
                                    latitude={formik?.values?.latitude}
                                    longtitude={formik?.values?.longtitude}
                                />
                            )}
                    </a>
                </Grid>
            </Grid>

            <div>
                <h2
                    className="label"
                    style={{
                        fontSize: "1.75rem",
                        paddingLeft: 20,
                        color: "#2196F3"
                    }}
                >
                    {t("accommodation_screen.introduction")}
                </h2>
                <p
                    style={{ fontSize: "1rem", paddingLeft: 20 }}
                    dangerouslySetInnerHTML={{ __html: formik?.values.html }}
                />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ padding: 20, width: "50%" }}>
                    <h2
                        className="label"
                        style={{
                            fontSize: "1.25rem",
                            paddingLeft: 20,
                            color: "#2196F3"
                        }}
                    >
                        {training.length > 0 && t("venue_screen.practise_flag")}
                    </h2>
                    {sportDiscipline?.data.map((item, index) => {
                        return (
                            training.includes(item.id) && (
                                <div
                                    style={{
                                        padding: "5px 10px",
                                        border: "1px solid #ccc",
                                        borderRadius: 20,
                                        marginBottom: 5,
                                        marginRight: 5
                                    }}
                                >
                                    <img
                                        alt=""
                                        src={
                                            process.env
                                                .MIX_REACT_APP_STORAGE_URL +
                                            "/" +
                                            item.icon
                                        }
                                        height={20}
                                        width={20}
                                        style={{
                                            marginRight: 5,
                                            borderRadius: 10
                                        }}
                                    />{" "}
                                    {i18n?.languages[0] == "vi" ? item?.sport?.name : item?.sport?.english_name}
                                    {" "}{"/"}{" "}
                                    {i18n?.languages[0] == "vi"
                                        ? item.name
                                        : item?.english_name}{" "}
                                </div>
                            )
                        );
                    })}
                </div>
                <div style={{ padding: 20, width: "50%" }}>
                    <h2
                        className="label"
                        style={{
                            fontSize: "1.25rem",
                            paddingLeft: 20,
                            color: "#2196F3"
                        }}
                    >
                        {competition.length > 0 &&
                            t("venue_screen.competition_flag")}
                    </h2>
                    {sportDiscipline?.data.map((item, index) => {
                        return (
                            competition.includes(item.id) && (
                                <div
                                    style={{
                                        padding: "5px 10px",
                                        border: "1px solid #ccc",
                                        borderRadius: 20,
                                        marginBottom: 5,
                                        marginRight: 5
                                    }}
                                >
                                    <img
                                        alt=""
                                        src={
                                            process.env
                                                .MIX_REACT_APP_STORAGE_URL +
                                            "/" +
                                            item.icon
                                        }
                                        height={20}
                                        width={20}
                                        style={{
                                            marginRight: 5,
                                            borderRadius: 10
                                        }}
                                    />
                                    {i18n?.languages[0] == "vi" ? item?.sport?.name : item?.sport?.english_name}
                                    {" "}{"/"}{" "}
                                    {i18n?.languages[0] == "vi"
                                        ? item.name
                                        : item?.english_name}{" "}
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
const useStyles = makeStyles(() => ({
    button: {
        textTransform: "capitalize",
        margin: 10
    },
    div: {
        width: "100%"
    }
}));
