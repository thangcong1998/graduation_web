import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { AuthContext } from "../AuthProvider";
import Popover from "../../components/popover";
import PersonIcon from "@material-ui/icons/Person";
import InfoIcon from "@material-ui/icons/Info";
import LockIcon from "@material-ui/icons/Lock";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useDialog } from "../../components/Dialog";
import { useHistory, Link } from "react-router-dom";
import color from "../../common/color.json";
import ChangePassword from "./ChangePassword";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import vietnam from "../../assets/vietnam.svg";
import uk from "../../assets/united-kingdom.svg";
import { SvgIcon } from "@material-ui/core";
import { useAPI, useFetch } from "../../api/api";
import headerImage from "../../../src/assets/image/background-header2.png";

const drawerWidth = 260;
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        backgroundColor: color.primary,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: "100%",
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    leftBar: {
        display: "flex",
        alignItems: "center"
    },
    breadcrumbs: {
        paddingLeft: 30
    },
    menuButton: {
        marginRight: 36
    },
    icon: {
        justifyContent: "flex-end"
    },
    rightBar: {
        display: "flex",
        "& svg": {
            fontSize: "2rem",
            width: "2rem",
            height: "2rem"
        }
    },
    showHeader: {
        [theme.breakpoints.down("sm")]: {
            display: "none !important"
        },
        [theme.breakpoints.up("md")]: {
            display: "none"
        },
        [theme.breakpoints.up("lg")]: {
            display: "block"
        }
    }
}));

export function ChangeLang(props) {
    const { langList, activeLang } = props;
    const { t, i18n } = useTranslation();
    const al = langList.find(e => e.name == activeLang);
    const api = useAPI();
    const history = useHistory();
    const change = async (handleClose, lang) => {
        i18n.changeLanguage(lang.name);
        handleClose();
        try {
            let res = await api.fetcher("get", "changeLang", {
                lang: i18n.languages[0]
            });
        } catch {}
    };
    const Langs = handleClose => (
        <List>
            {langList.map((lang, index) => (
                <ListItem
                    key={index}
                    button={true}
                    onClick={() => change(handleClose, lang)}
                >
                    <ListItemIcon>{lang?.flag}</ListItemIcon>
                    <ListItemText
                        style={{ textTransform: "uppercase" }}
                        primary={lang?.label}
                    />
                </ListItem>
            ))}
        </List>
    );
    return (
        <Popover
            children={
                <IconButton
                    style={{
                        marginTop: 5,
                        width: 80,
                        height: 80,
                        borderRadius: "50%"
                    }}
                >
                    {al?.flag}
                </IconButton>
                // <List>
                //   <ListItem button={true}>
                //     <ListItemIcon style={{ justifyContent: "center" }}>
                //       {al?.flag}
                //     </ListItemIcon>
                //     {/* <ListItemText
                //       style={{ textTransform: "uppercase" }}
                //       primary={al?.name}
                //     /> */}
                //   </ListItem>
                // </List>
            }
            content={handleClose => Langs(handleClose)}
        />
    );
}

export default function Header(props) {
    const { data: data, loading: loading } = useFetch([
        "get",
        "admin/display_setting"
    ]);
    const { crumbs } = props;
    const classes = useStyles();
    const theme = useTheme();
    const handleDrawerToggle = () => {
        props.setOpen(pre => !pre);
    };
    const { dialog, handleClose } = useDialog();
    const { admin, user, clear } = useContext(AuthContext);
    const name = () => {
        if (admin) {
            return admin.name;
        }
        if (user) {
            return user.name;
        }
        return null;
    };
    const history = useHistory();
    const logout = () => {
        clear();
        history.push("/login");
    };
    const { t, i18n } = useTranslation();
    const langList = [
        {
            name: "vi",
            label: "Tiếng Việt",
            flag: <img src={vietnam} width="30px" height="30px" />
        },
        {
            name: "en",
            label: "English",
            flag: <img src={uk} width="30px" height="30px" />
        }
    ];
    const changePassword = async () => {
        await dialog({
            title: t("header.change_password"),
            content: <ChangePassword close={handleClose} />
        });
    };
    const userItems = () => {
        return (
            <List>
                <ListItem button={true} onClick={changePassword}>
                    <ListItemText primary={t("header.change_password")} />
                    <ListItemIcon className={classes.icon}>
                        <LockIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button={true} onClick={() => logout()}>
                    <ListItemText primary={t("header.log_out")} />
                    <ListItemIcon className={classes.icon}>
                        <PowerSettingsNewIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        );
    };
    const [show, setShow] = useState(true);
    useEffect(() => {
        if (window.screen.width > 1000) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [window.screen.width]);
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.open
                })}
            >
                <Toolbar
                    className={classes.toolbar}
                    style={{
                        height: "80px",
                        backgroundImage: `url(${headerImage})`,
                        backgroundSize: "100% 90px",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                    <div className={classes.leftBar}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            edge="start"
                        >
                            {props.open ? (
                                <ArrowBackIcon style={{ color: "black" }} />
                            ) : (
                                <MenuIcon style={{ color: "black" }} />
                            )}
                        </IconButton>
                        {show === true && (
                            <div
                                style={{
                                    fontSize: "1.142rem",
                                    color: "#373737",
                                    textTransform: "uppercase",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    padding: "5px"
                                    // textShadow: '0.5px 0.5px 2px black',
                                }}
                                className={classes.showHeader}
                            >
                                <b></b>
                                {data && (
                                    <img
                                        src={
                                            process.env
                                                .MIX_REACT_APP_STORAGE_URL +
                                            "/" +
                                            data?.logo_url
                                        }
                                        height={"80px"}
                                        width={"auto"}
                                        style={{ margin: "13px 10px 0px 0px" }}
                                    />
                                )}
                                <p
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: 600
                                    }}
                                >
                                    {i18n.language == "vi" ? (
                                        t("header.content")
                                    ) : (
                                        <span>
                                            <span>{t("header.content1")}</span>
                                            <span
                                                style={{
                                                    fontSize: "1rem",
                                                    position: "absolute",
                                                    top: "22px"
                                                }}
                                            >
                                                {t("header.content2")}
                                            </span>
                                            <span style={{ marginLeft: 30 }}>
                                                {t("header.content3")}
                                            </span>
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                        {/* <div className={classes.breadcrumbs}>{crumbs()}</div> */}
                    </div>
                    <div className={classes.rightBar}>
                        <ChangeLang
                            langList={langList}
                            activeLang={i18n.languages[0]}
                        />
                        <div
                            style={{
                                borderRight: "#f3f3f3 solid 1px",
                                height: 80
                            }}
                        />
                        <Popover
                            children={
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="end"
                                    style={{ height: 80 }}
                                >
                                    <PersonIcon style={{ color: "black" }} />
                                    <p style={{ color: "black" }}> {name()}</p>
                                </IconButton>
                            }
                            content={userItems()}
                        />
                        {/*<p style={{ fontSize: 18 }}>*/}
                        {/*  {t("header.hello")}: {name()}*/}
                        {/*</p>*/}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
