import React, { useEffect, useState, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { AuthContext } from "../AuthProvider";

const useStyle = makeStyles((theme) => ({
  pathname: {
    fontSize: "1.142rem",
    color: "#115293",
  },
}));
const Breadcrumb = React.memo((props) => {
  const { crumbs, prefix } = props;
  const classes = useStyle();
  const history = useHistory();
  const handleClick = (path) => {
    history.push(path);
  };
  const { urlParam } = useContext(AuthContext);
  const [paths, setPaths] = useState([]);
  useEffect(() => {
    setPaths(
      crumbs.map((route) => {
        if (route.path.includes(":id")) {
          return {
            name: route.name,
            path: route.path.replace(":id", urlParam?.id),
          };
        }
        if (route.path.includes(":sub_id")) {
          return {
            name: route.name,
            path: route.path.replace(":sub_id", urlParam?.sub_id),
          };
        }
        return {
          name: route.name,
          path: route.path,
        };
      })
    );
  }, [crumbs]);
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      style={{
        color: "#115293",
        marginBottom: 20,
      }}
    >
      {paths.map((e, i) =>
        i + 1 !== paths.length ? (
          <Link
            key={e.name}
            className={classes.pathname}
            style={{
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => handleClick(e.path)}
          >
            {e.name}
          </Link>
        ) : (
          <Typography
            key={e.name}
            className={classes.pathname}
            color="textPrimary"
          >
            {e.name}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
});

export default Breadcrumb;
