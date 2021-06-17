import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    Navigation,
    Pagination,
    Controller,
    Thumbs,
    Autoplay
} from "swiper";
import "swiper/swiper-bundle.css";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../api/api";
import { useTranslation } from "react-i18next";
import ShowImageHandMake from "../../../components/ShowImage/ShowImageHandMake";
import Grid from "@material-ui/core/Grid";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Map from "./Map";

SwiperCore.use([Navigation, Pagination, Controller, Thumbs, Autoplay]);

function VenueSwiper() {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const { data: data } = useFetch([
        params?.id ? "get" : null,
        params?.id ? "admin/venue/" + params.id : null
    ]);

    const [openTest, setOpenTest] = useState(false);
    const [position, setPosition] = useState(0);
    const [listImageShow, setListImageShow] = useState([]);

    const { data: sportDiscipline } = useFetch([
        "get",
        "/admin/sportDiscipline"
    ]);

    return (
        <div
            style={{ backgroundColor: "#fff", padding: 20, overflow: "hidden" }}
        >
            {data?.files.length !== 0 && (
                <ShowImageHandMake
                    open={openTest}
                    setOpen={setOpenTest}
                    position={position}
                    setPosition={setPosition}
                    array={listImageShow}
                />
            )}
            {data?.files && data?.files.length == 1 && (
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[0].path
                                    : data?.files[0].preview
                            }
                        />
                    </Grid>
                </Grid>
            )}
            {data?.files && data?.files.length == 2 && (
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[0].path
                                    : data?.files[0].preview
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[1].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[1].path
                                    : data?.files[1].preview
                            }
                        />
                    </Grid>
                </Grid>
            )}
            {data?.files && data?.files.length === 3 && (
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[0].path
                                    : data?.files[0].preview
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[2].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[2].path
                                    : data?.files[2].preview
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
                                    data?.files[1].id
                                        ? process.env
                                              .MIX_REACT_APP_STORAGE_URL +
                                          "/" +
                                          data?.files[1].path
                                        : data?.files[1].preview
                                }
                                onClick={() => {
                                    setOpenTest(true);
                                    setPosition(1);
                                    setListImageShow(data?.files);
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
            {data?.files && data?.files.length > 3 && (
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[0].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[0].path
                                    : data?.files[0].preview
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
                                setListImageShow(data?.files);
                            }}
                            src={
                                data?.files[2].id
                                    ? process.env.MIX_REACT_APP_STORAGE_URL +
                                      "/" +
                                      data?.files[2].path
                                    : data?.files[2].preview
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
                                    data?.files[1].id
                                        ? process.env
                                              .MIX_REACT_APP_STORAGE_URL +
                                          "/" +
                                          data?.files[1].path
                                        : data?.files[1].preview
                                }
                                onClick={() => {
                                    setOpenTest(true);
                                    setPosition(1);
                                    setListImageShow(data?.files);
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
                                +{data?.files.length - 3}
                            </div>
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
                            <h1 className="label">{data?.name}</h1>
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
                                    {data?.address}
                                </p>
                            </i>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4} style={{ height: "100%" }}>
                    <a
                        href={
                            "http://www.google.com/maps/place/" +
                            data?.latitude +
                            "," +
                            data?.longtitude
                        }
                        target="_blank"
                    >
                        {data?.latitude && data?.longtitude && (
                            <Map
                                latitude={data?.latitude}
                                longtitude={data?.longtitude}
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
                    dangerouslySetInnerHTML={{ __html: data?.html }}
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
                        {data?.venue_training_place.length > 0 &&
                            t("venue_screen.practise_flag")}
                    </h2>
                    {data?.venue_training_place.map((item, index) => {
                        console.log(item)
                        return (
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
                                        process.env.MIX_REACT_APP_STORAGE_URL +
                                        "/" +
                                        item.icon
                                    }
                                    height={20}
                                    width={20}
                                    style={{ marginRight: 5, borderRadius: 10 }}
                                />{" "}
                                {i18n?.languages[0] == "vi" ? item?.sport?.name : item?.sport?.english_name}
                                {" "}{"/"}{" "}
                                {i18n?.languages[0] == "vi"
                                    ? item.name
                                    : item?.english_name}{" "}
                            </div>
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
                        {data?.venue_competition_place?.length > 0 &&
                            t("venue_screen.competition_flag")}
                    </h2>
                    {data?.venue_competition_place.map((item, index) => {
                        return (
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
                                        process.env.MIX_REACT_APP_STORAGE_URL +
                                        "/" +
                                        item.icon
                                    }
                                    height={20}
                                    width={20}
                                    style={{ marginRight: 5, borderRadius: 10 }}
                                />{" "}
                                {i18n?.languages[0] == "vi" ? item?.sport?.name : item?.sport?.english_name}
                                {" "}{"/"}{" "}
                                {i18n?.languages[0] == "vi"
                                    ? item.name
                                    : item?.english_name}{" "}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default VenueSwiper;
