import React, { useState, useContext, useEffect } from "react";
import {
    Drawer,
    IconButton,
    List,
    Divider,
    Collapse,
    SvgIcon,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useLocation, useHistory, Link } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import { AuthContext } from "../containers/AuthProvider";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { ReactComponent as Circle } from "../assets/icons/circle.svg";
import { ReactComponent as Dot } from "../assets/icons/dot.svg";
import { checkPerm } from "../common/constants";
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { sidebardWidth } from "../common/constants";

const SideBar = React.memo((props) => {
    const classes = useStyle();
    const { sidebarList } = props;
    const theme = useTheme();
    const handleDrawerClose = () => {};
    const location = useLocation();
    const history = useHistory();
    const [open, setOpen] = useState();
    const [open2, setOpen2] = useState();
    const { perms } = useContext(AuthContext);
    function CheckPerm(permRoute) {
        if (!permRoute) return true;
        if (Array.isArray(permRoute)) {
            for (let e in permRoute) {
                if (perms?.map((c) => c.name).includes(permRoute[e])) {
                    return true;
                }
            }
            return false;
        } else {
            return perms?.map((e) => e.name).includes(permRoute);
        }
    }
    const handleOpen = (e) => {
        if (open == e?.label) {
            setOpen("");
        } else {
            props.setOpen(true);
            setOpen(e?.label);
        }
    };
    const handleOpen2 = (e) => {
        if (open2 == e?.label) {
            setOpen2("");
        } else {
            props.setOpen(true);
            setOpen2(e?.label);
        }
    };

    useEffect(() => {
        if (!props.open) {
            setOpen("");
        }
    }, [props.open]);
    useEffect(() => {
        if (!props.open2) {
            setOpen2("");
        }
    }, [props.open2]);

    const active = (path) => {
        if (path) {
            const pathname = location.pathname.split("/");
            const p = path.split("/");
            if (pathname[1] === p[1]) {
                return true;
            }
        }
        return false;
    };

    const activePath = (path) => {
        if (path) {
            const pathname = location.pathname.split("/");
            const p = path.split("/");
            for (let i = 1; i < p.length; i++) {
                if (p[i] !== pathname[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    // console.log(sidebarList);
    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: props.open,
                [classes.drawerClose]: !props.open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: props.open,
                    [classes.drawerClose]: !props.open,
                }),
            }}
        >
            <div className={classes.toolbar} style={{ marginTop: 15 }}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                        <ChevronRightIcon />
                    ) : (
                        <ChevronLeftIcon />
                    )}
                </IconButton>
            </div>
            <Divider />

            {sidebarList.map((c, index) =>
                CheckPerm(c.perm) ? (
                    <div key={index}>
                        <List key={index}>
                            {c?.path ? (
                                <Link to={c?.path}>
                                    <ListItem
                                        button={true}
                                        className={
                                            c.path
                                                ? active(c.path)
                                                    ? classes.active
                                                    : classes.unactive
                                                : classes.category
                                        }
                                        // onClick={() =>
                                        //   c.path ? history.push(c.path) : handleOpen(c)
                                        // }
                                    >
                                        {c?.icon && (
                                            <ListItemIcon
                                                className={classes.categoryIcon}
                                            >
                                                {c.icon}
                                            </ListItemIcon>
                                        )}
                                        <ListItemText
                                            style={{
                                                textTransform: "uppercase",
                                            }}
                                            primary={props.open ? c.label : ""}
                                        />
                                    </ListItem>
                                </Link>
                            ) : (
                                <ListItem
                                    button={true}
                                    className={classes.category}
                                    onClick={() => {
                                        handleOpen(c);
                                        for (let i of c?.children) {
                                            if (i?.children) {
                                                for (let t of i?.children) {
                                                    if (CheckPerm(t.perm)) {
                                                        handleOpen2(i);
                                                        history.push(t.path);
                                                        return 1;
                                                    }
                                                }
                                            } else {
                                                if (CheckPerm(i.perm)) {
                                                    history.push(i.path);
                                                    return 1;
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {c?.icon && (
                                        <ListItemIcon
                                            className={classes.categoryIcon}
                                        >
                                            {c.icon}
                                        </ListItemIcon>
                                    )}
                                    <ListItemText
                                        style={{ textTransform: "uppercase" }}
                                        primary={props.open ? c.label : ""}
                                    />
                                </ListItem>
                            )}

                            <Collapse
                                in={open == c.label}
                                timeout="auto"
                                unmountOnExit
                            >
                                {c?.children?.map((e, index1) =>
                                    CheckPerm(e.perm) ? (
                                        <List key={index1}>
                                            {e?.path ? (
                                                <Link to={e?.path}>
                                                    <ListItem
                                                        button
                                                        key={index1}
                                                        title={e.label}
                                                        // onClick={() =>
                                                        //   e.path ? history.push(e.path) : handleOpen2(e)
                                                        // }
                                                        className={`${
                                                            classes.item
                                                        } ${
                                                            activePath(e?.path)
                                                                ? classes.active
                                                                : classes.unactive
                                                        }`}
                                                    >
                                                        {/* <ListItemIcon>{e.icon}</ListItemIcon> */}
                                                        <FiberManualRecordOutlinedIcon />
                                                        <ListItemText
                                                            primary={
                                                                props.open
                                                                    ? e.label
                                                                    : ""
                                                            }
                                                        />
                                                    </ListItem>
                                                </Link>
                                            ) : (
                                                <ListItem
                                                    button
                                                    key={index1}
                                                    title={e.label}
                                                    onClick={() =>
                                                        handleOpen2(e)
                                                    }
                                                    className={`${
                                                        classes.item
                                                    } ${
                                                        active(e?.path)
                                                            ? classes.active
                                                            : classes.unactive
                                                    }`}
                                                >
                                                    {/* <ListItemIcon>{e.icon}</ListItemIcon> */}
                                                    <SvgIcon>
                                                        <FiberManualRecordOutlinedIcon />
                                                    </SvgIcon>
                                                    <ListItemText
                                                        primary={
                                                            props.open
                                                                ? e.label
                                                                : ""
                                                        }
                                                    />
                                                </ListItem>
                                            )}
                                            <Collapse
                                                in={open2 == e.label}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                {e?.children?.map((d, index2) =>
                                                    CheckPerm(d.perm) ? (
                                                        <Link
                                                            to={d?.path}
                                                            key={index2}
                                                        >
                                                            <ListItem
                                                                button
                                                                title={d.label}
                                                                className={`${
                                                                    classes.itemLv2
                                                                } ${
                                                                    activePath(
                                                                        d.path
                                                                    )
                                                                        ? classes.active
                                                                        : classes.unactive
                                                                }`}
                                                                onClick={() =>
                                                                    d.path
                                                                        ? history.push(
                                                                              d.path
                                                                          )
                                                                        : handleOpen2(
                                                                              d
                                                                          )
                                                                }
                                                            >
                                                                {/* <ListItemIcon style={{ minWidth: 30 }}>
                                {d.icon}
                              </ListItemIcon> */}
                                                                <FiberManualRecordIcon />
                                                                <ListItemText
                                                                    primary={
                                                                        d.label
                                                                    }
                                                                />
                                                            </ListItem>
                                                        </Link>
                                                    ) : (
                                                        ""
                                                    )
                                                )}
                                            </Collapse>
                                        </List>
                                    ) : (
                                        ""
                                    )
                                )}
                            </Collapse>
                        </List>
                        <Divider />
                    </div>
                ) : (
                    ""
                )
            )}
        </Drawer>
    );
});
const drawerWidth = sidebardWidth;
const useStyle = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        fontSize: "1rem",
        "& svg": {
            color: "#1166e4",
        },
        "& a": {
            color: "#000",
            textDecoration: "none",
        },
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: 0,
        [theme.breakpoints.up("sm")]: {
            width: 0,
        },
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    active: {
        minHeight: 48,
        background: "#F3F5FF",
    },
    unactive: {
        minHeight: 48,
        background: "#fff",
    },
    category: {
        minHeight: 50,
        textTransform: "uppercase",
    },
    categoryIcon: {
        color: "#000",
        minWidth: 40,
    },
    item: {
        paddingLeft: 30,
        "& svg": {
            color: "#e0481ade",
        },
    },
    itemLv2: {
        paddingLeft: 50,
        "& svg": {
            color: "#07b41591",
        },
    },
}));
export default SideBar;
