import React, {
  useState,
  Suspense,
  useEffect,
  useMemo,
  useContext,
} from "react";
import Header from "./Header";
import SideBar from "../../components/SideBar";
import { Switch, Route, useLocation, useParams } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/styles";
import AppLoading from "../../components/Loading";
import { Paper, SvgIcon } from "@material-ui/core";
import { AuthContext } from "../AuthProvider";
import { AdminRoutes } from "../../routes/AdminRoutes";
import { useTranslation } from "react-i18next";
import Breadcrumb from "./Breadcrumb";
import HomeIcon from "@material-ui/icons/Home";
import DialogProvider from "../../components/Dialog";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonIcon from "@material-ui/icons/Person";
import Athlete from "../../assets/icons/athlete.svg";
import QueryBuilderOutlinedIcon from "@material-ui/icons/QueryBuilderOutlined";
import Whistle from "../../assets/icons/whistle.svg";
import AdminCogs from "../../assets/icons/admin.svg";
import match from "../../assets/icons/versus.svg";
import record from "../../assets/icons/trophy-cup-silhouette.svg";
import LocationCityOutlinedIcon from "@material-ui/icons/LocationCityOutlined";
import { sidebardWidth } from "../../common/constants";
import EventIcon from "@material-ui/icons/Event";
import medal from "../../assets/icons/medal-svgrepo-com.svg";
import report from "../../assets/icons/report.svg";

const Layout = React.memo((props) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const [path, setPath] = useState("");
  const { adminRoutes } = AdminRoutes();
  const classes = useStyle();
  const { admin, perms } = useContext(AuthContext);
  const params = useParams();
  const { t } = useTranslation();
  function CheckPerm(permRoute) {
    if (!permRoute) return true;
    if (Array.isArray(permRoute)) {
      for (let e in permRoute) {
        if (!perms.map((c) => c.name).includes(permRoute[e])) {
          return false;
        }
      }
      return true;
    } else {
      return perms?.map((e) => e.name).includes(permRoute);
    }
  }

  const routes = useMemo(() => {
    return adminRoutes;
  }, [adminRoutes]);
  useEffect(() => {
    if (location.pathname === "/") setPath("/");
  }, [location.pathname, path]);

  function render(route) {
    const permRoute = route?.perm;
    if (CheckPerm(permRoute)) {
      return (
        <Route
          path={route.path}
          exact
          key={route.path}
          render={(_) => {
            setPath(route.path);
            return (
              <DialogProvider>
                <route.component />
              </DialogProvider>
            );
          }}
        />
      );
    }
  }

  const sidebarAdmin = [
    //home
    {
      label: t("sidebar.parent.home"),
      icon: <HomeIcon />,
      perm: "",
      path: "/",
    },
    //User | Role management
    {
      label: t("sidebar.parent.user_management"),
      icon: <PersonIcon />,
      perm: ["user_all", "role_all"],
      children: [
        {
          path: "/user",
          label: t("sidebar.user"),
          perm: "user_all",
        },
        {
          path: "/role",
          label: t("sidebar.role"),
          perm: "role_all",
        },
      ],
    },
    {
      label: t("sidebar.parent.system_management"),
      icon: <img src={AdminCogs} height="24px" width="24px" />,
      perm: ["audit_all", "setting_edit"],
      children: [
        {
          path: "/audit",
          label: t("sidebar.audit"),
          perm: "audit_all",
        },
        {
          path: "/setting",
          label: t("sidebar.setting"),
          perm: "setting_edit",
        },
        {
          path: "/displaySetting",
          label: t("sidebar.display_setting"),
          perm: "setting_all",
        },
      ],
    },
    {
      label: t("sidebar.parent.congress_setting"),
      icon: <SettingsIcon />,
      perm: [
        "card_template_all",
        "country_all",
        "organization_all",
        "function_all",
        "sport_all",
        "foul_all",
        "function_referee_all",
        "sync_data_all",
        "region_all",
        "all_team",
        "function_referee_all",
      ],
      children: [
        {
          path: "/sport",
          label: t("sidebar.sport"),
          perm: "sport_all",
        },
        {
          path: "/team",
          label: t("sidebar.team"),
          perm: "all_team",
        },
        {
          path: "/country",
          label: t("sidebar.country"),
          perm: "country_all",
        },
        {
          path: "/region",
          label: t("sidebar.region"),
          perm: "region_all",
        },
        {
          path: "/functionReferee",
          label: t("sidebar.function_referee"),
          perm: "function_referee_all",
        },
        {
          path: "/foul",
          label: t("sidebar.foul"),
          perm: "foul_all",
        },
      ],
    },
    //congress component
    {
      label: t("sidebar.parent.congress_component"),
      icon: <LocationCityOutlinedIcon />,
      perm: [
        "register_management_all",
        "referee_management_all",
        "venue_all",
        "list_athletes_all",
      ],
      children: [
        {
          path: "/registration",
          label: t("sidebar.all_registration"),
          perm: "register_management_all",
        },
        {
          path: "/referee",
          label: t("sidebar.referee"),
          perm: "referee_management_all",
        },
        {
          path: "/venue",
          label: t("sidebar.venue"),
          perm: "venue_all",
        },
        {
          path: "",
          label: t("sidebar.register_competition"),
          perm: "list_athletes_all",
          children: [
            {
              path: "/listAthletes",
              label: t("sidebar.register_individual"),
              perm: "list_athletes_all",
            },
            {
              path: "/teamEvent",
              label: t("sidebar.team_event"),
              perm: "list_athletes_all",
            },
          ],
        },
      ],
    },
    {
      label: t("sidebar.parent.record"),
      icon: <img src={record} height="24px" width="24px" />,
      perm: ["record_history_all", "congress_record_all"],
      children: [
        {
          label: t("sidebar.record_history"),
          path: "/record",
          perm: "record_history_all",
        },
        {
          label: t("sidebar.congress_record"),
          path: "/congressRecord",
          perm: "congress_record_all",
        },
      ],
    },
    {
      path: "/scheduleCompetition",
      icon: <EventIcon />,
      label: t("sidebar.competition_schedule"),
      perm: "competition_schedule_all",
    },
    {
      label: t("sidebar.parent.match"),
      icon: <img src={match} height="24px" width="24px" />,
      path: "/matchSchedule",
      perm: "match_result_all",
    },
    // {
    //   label: t("sidebar.parent.medal_table"),
    //   icon: <img src={medal} height="24px" width="24px" />,
    //   path: "/medalTable",
    //   perm: "medal_table_all",
    // },
  ];

  const crumbs = useMemo(() => {
    const paths = location.pathname.split("/");
    const destructPath = [
      "/",
      ...path
        .split("/")
        .slice(1)
        .map((path) => "/" + path)
        .reduce((a, c) => [...a, a.length ? a[a.length - 1] + c : c], []),
    ];
    const crumbNames = routes
      .filter((route) => destructPath.includes(route.path))
      .map((route) => {
        return {
          name: route.name,
          path: route.path,
        };
      });
    const crumbPaths = [
      "/",
      ...paths[1]
        .split("/")
        .slice(1)
        .map((path) => "/" + path)
        .reduce((a, c) => [...a, !a.length ? c : a[a.length - 1] + c], []),
    ];

    return crumbNames.map((crum, index) => ({
      name: crum.name,
      path: crum.path,
    }));
  }, [location.pathname, path, routes, sidebarAdmin]);
  const sidebarList = () => {
    if (admin) {
      return sidebarAdmin;
    }
    return [];
  };

  return (
    <div className={classes.root}>
      <DialogProvider>
        <Header open={open} setOpen={setOpen} />
      </DialogProvider>
      <SideBar sidebarList={sidebarList()} setOpen={setOpen} open={open} />
      <main
        className={`${classes.content} ${
          open ? classes.sidebarOpen : classes.sidebarClose
        }`}
        style={{
          marginTop: 15,
          padding: 24,
        }}
      >
        <Toolbar className={classes.toolbar}></Toolbar>
        <Breadcrumb crumbs={crumbs} prefix={"/"} />
        <Suspense fallback={<AppLoading />}>
          {/* <Paper style={{ padding: "5px 10px 10px 10px" }}> */}
          <Switch>{routes.map((e) => render(e))}</Switch>
          {/* </Paper> */}
        </Suspense>
      </main>
    </div>
  );
});

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    height: 64,
  },
  content: {
    flexGrow: 1,
  },
  sidebarOpen: {
    maxWidth: `calc(100vw - ${sidebardWidth}px)`,
  },
  sidebarClose: {
    maxWidth: `calc(100vw)`,
  },
}));
export default Layout;
