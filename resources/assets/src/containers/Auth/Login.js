import React, { useEffect, useContext } from "react";
import mascot from "../../assets/mascot.png";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import {
    TextField,
    Button,
    Grid,
    Container,
    Card,
    FormGroup
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAPI, useFetch } from "../../api/api";
import { AuthContext } from "../AuthProvider";
import { useHistory, Link, useLocation } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Login.css";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import slide1 from "./slide3.jpg";
import slide2 from "./test2.jpg";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import FormHelperText from "@material-ui/core/FormHelperText";
import Loading from "../../components/Loading";

const useStyle = makeStyles(theme => ({
    container: {
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(104.14deg, #FFEFBA, #FFFFFF);",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        minHeight: "585px"
    },
    CarouselWrapper: {
        position: "fixed",
        width: "100%",
        height: "100%",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#9e9e9e",
        [theme.breakpoints.up("lg")]: {
            height: "100%",
            width: "100%",
            padding: "0px calc(5% - 420px/2 + 270px)"
        },
        [theme.breakpoints.down("lg")]: {
            height: "100%",
            width: "100%",
            padding: "0px calc(5% - 420px/2 + 200px)"
        },
        [theme.breakpoints.down("md")]: {
            height: "100%",
            width: "100%",
            padding: "0px calc(5% - 420px/2 + 200px)"
        },
        [theme.breakpoints.down("sm")]: {
            height: "100%",
            width: "100%",
            padding: "10px"
        },
        [theme.breakpoints.down("xs")]: {
            justifyContent: "center"
        }
    },
    contentLeft: {
        // paddingLeft: 76,
        "& img": {
            maxHeight: "90vh"
        },
        [theme.breakpoints.down("md")]: {
            "& img": {
                maxHeight: "50vh"
            }
        },
        [theme.breakpoints.down("xs")]: {
            "& img": {
                // maxHeight: "30%",
            },
            display: "none"
        }
    },
    contentRight: {
        padding: 10,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        width: 400,
        height: "85%",
        maxHeight: 550,
        position: "absolute",
        display: "flex",
        flexFlow: "column",
        [theme.breakpoints.up("lg")]: {},
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            height: "100%",
            borderRadius: 0,
            justifyContent: "center"
        }
    },
    label: {
        fontSize: "15px",
        fontFamily: "Arial",
        fontWeight: 400
    },
    input: {
        display: "flex",
        flexFlow: "column",
        marginBottom: 20
    },
    button: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 30,
        "& a": {
            textDecoration: "none",
            // color: "#2196F3",
            color: "#040404",
            "&:hover": {
                textDecoration: "underline"
            }
        },
        "& button": {
            background: "#F2994A",
            color: "#ffffff",
            [theme.breakpoints.up("lg")]: {
                width: 200,
                height: 50
            }
        }
    }
}));
export function FormForgotPassword(props) {
    const classes = useStyle();
    const { t } = useTranslation();
    const { updateAdmin, updateUser } = useContext(AuthContext);
    const api = useAPI();
    const formik = useFormik({
        initialValues: {
            user_name: ""
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            user_name: Yup.string().required(
                t("login_admin_screen.user_name") + " " + t("errors.required")
            )
        }),
        onSubmit: async values => {
            try {
                const res = await api.fetcher(
                    "post",
                    "/forgotPassword",
                    values
                );
                if (res.user.user_type == 1) {
                    const perm = await api.fetcher("get", "/permissions");
                }
                if (res.user.user_type == 2) {
                    const perm = await api.fetcher("get", "/permissions");
                }
            } catch (e) {}
        }
    });
    return (
        <form style={{ padding: 10 }}>
            <Grid className={classes.input} style={{ marginTop: 57 }}>
                <TextField
                    id="standard-basic"
                    value={formik.values?.user_name}
                    onChange={e =>
                        formik.setFieldValue("user_name", e.target.value)
                    }
                    error={
                        (formik.errors?.user_name &&
                            formik.touched.user_name) ||
                        api.error?.user_name
                    }
                    helperText={
                        (formik.touched.user_name &&
                            formik.errors?.user_name) ||
                        api.error?.user_name
                    }
                    placeholder={t("login_admin_screen.type_usename")}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutlineOutlinedIcon
                                    style={{ fontSize: 25 }}
                                    color="action"
                                />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid className={classes.button}>
                <Button
                    onClick={formik.handleSubmit}
                    style={{
                        marginBottom: 10,
                        width: "100%",
                        borderRadius: 25
                    }}
                >
                    {t("login_admin_screen.password_retrieval")}
                </Button>
            </Grid>
        </form>
    );
}

export function FormLogin(props) {
    const classes = useStyle();
    const { t } = useTranslation();
    const {
        updateAdminToken,
        updateAdmin,
        updatePermission,
        admin
    } = useContext(AuthContext);
    const api = useAPI();
    const formik = useFormik({
        initialValues: {
            user_name: "",
            password: ""
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            user_name: Yup.string().required(
                t("login_admin_screen.user_name") + " " + t("errors.required")
            ),
            password: Yup.string().required(
                t("login_admin_screen.password") + " " + t("errors.required")
            )
        }),
        onSubmit: async values => {
            try {
                const res = await api.fetcher("post", "/login", values);
                await updateAdminToken(res.token);
                const perm = await api.fetcher("get", "/permissions");
                await updatePermission(perm);
                await updateAdmin(res.user);
            } catch (e) {}
        }
    });
    return (
        <form style={{ padding: 10 }}>
            <Grid className={classes.input}>
                <Input
                    className="input1"
                    value={formik.values?.user_name}
                    onChange={e =>
                        formik.setFieldValue("user_name", e.target.value)
                    }
                    error={
                        (formik.errors?.user_name &&
                            formik.touched.user_name) ||
                        api.error?.user_name
                    }
                    helperText={
                        (formik.touched.user_name &&
                            formik.errors?.user_name) ||
                        api.error?.user_name
                    }
                    id="input-with-icon-adornment"
                    placeholder={t("login_admin_screen.type_usename")}
                    startAdornment={
                        <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon
                                style={{ fontSize: 25 }}
                                color="action"
                            />
                        </InputAdornment>
                    }
                />
                <FormHelperText error={true}>
                    {(formik.touched.user_name && formik.errors?.user_name) ||
                        api.error?.user_name}
                </FormHelperText>
            </Grid>
            <Grid className={classes.input}>
                <Input
                    className="input1"
                    type="password"
                    value={formik.values?.password}
                    onChange={e =>
                        formik.setFieldValue("password", e.target.value)
                    }
                    error={
                        (formik.errors?.password && formik.touched.password) ||
                        api.error?.password
                    }
                    id="input-with-icon-adornment"
                    placeholder={t("login_admin_screen.type_password")}
                    startAdornment={
                        <InputAdornment position="start">
                            <LockOutlinedIcon
                                style={{ fontSize: 25 }}
                                color="action"
                            />
                        </InputAdornment>
                    }
                />
                <FormHelperText error={true}>
                    {(formik.touched.password && formik.errors?.password) ||
                        api.error?.password}
                </FormHelperText>
            </Grid>
            <Grid className={classes.button}>
                <Button
                    variant="contained"
                    type="submit"
                    onClick={formik.handleSubmit}
                    style={{
                        marginBottom: 10,
                        width: "100%",
                        borderRadius: 25
                    }}
                >
                    <span style={{ fontWeight: 600 }}>
                        {t("login_admin_screen.login")}
                    </span>
                </Button>
                <Link to={"/forgotPassword"}>
                    {t("login_admin_screen.forgot_password")}
                </Link>
            </Grid>
        </form>
    );
}
export default function Login(props) {
    const classes = useStyle();
    let location = useLocation();
    const { t, i18n } = useTranslation();
    const { admin } = useContext(AuthContext);
    const history = useHistory();
    useEffect(() => {
        if (admin) {
            history.push("");
        }
    });
    const { data: data } = useFetch(["get", "admin/displaySetting"]);

    return (
        <div
            style={{
                padding: 0,
                maxWidth: "100vw",
                height: "100%"
            }}
        >
            <div className={classes.container}>
                <Card className={classes.content}>
                    <div className={classes.contentRight}>
                        <div
                            style={{
                                marginBottom: 15,
                                textAlign: "center"
                            }}
                        >
                            <img
                                style={{ maxWidth: 317, height: 200 }}
                                src={
                                    process.env.MIX_REACT_APP_STORAGE_URL +
                                    "/" +
                                    data?.logo_url
                                }
                            />
                        </div>
                        <div>
                            {location?.pathname == "/forgotPassword" && (
                                <FormForgotPassword />
                            )}
                            {location?.pathname !== "/forgotPassword" && (
                                <FormLogin />
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
