import React from "react";
import { makeStyles } from "@material-ui/core";
import basecolor from "../common/color.json";

const useStyle = makeStyles((theme) => ({
  root: {
    minHeight: 100,
    padding: "20px 6px",
    height: "100%",
    display: "flex",
  },
  content: {
    display: "flex",
    color: "#FFF",
    paddingLeft: "10px",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    fontWeight: 600,
    fontSize: "24px",
  },
  label: {
    fontSize: "14px",
    color: "#FFF",
    fontWeight: 500,
  },
  icon: {
    display: "flex",
    alignItems: "center",
    borderRight: "1px solid #FFFFFF",
    color: "#FFF",
    padding: "0px 20px",
  },
}));
const _color = (color) => {
  if (color === "primary") {
    return basecolor.primary;
  }
  if (color === "secondary") {
    return basecolor.secondary;
  }
  if (color === "success") {
    return basecolor.success;
  }
  if (color === "error") {
    return basecolor.error;
  }
  if (color === "warning") {
    return basecolor.warning;
  }
  return color;
};
export default function (props) {
  const { label, content, leftColor, rightColor, icon, borderRadius } = props;
  const classes = useStyle();
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right, " + leftColor + ", " + rightColor + ")",
        borderRadius: borderRadius ? borderRadius : "5px",
      }}
      className={classes.root}
      {...props}
    >
      <div className={classes.icon}>{icon}</div>
      <div className={classes.content}>
        <div className={classes.text}>{content}</div>
        <div className={classes.label}>{label}</div>
      </div>
    </div>
  );
}
