import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import basecolor from "../common/color.json";

const useStyles = makeStyles((theme) => ({}));

export default function (props) {
  const classes = useStyles();
  const { badgeContent, color, content, anchorOrigin } = props;
  const _color = () => {
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
  return (
    <span
      style={{
        display: "inline-flex",
        position: "relative",
        flexShrink: 0,
        verticalAlign: "middle",
        overflowWrap: "anywhere",
      }}
    >
      {content}
      <span
        style={{
          color: "#FFF",
          background: _color(),
          height: "20px",
          display: "flex",
          padding: "0 6px",
          zIndex: 1,
          position: "absolute",
          flexWrap: "wrap",
          fontSize: "0.875rem",
          minWidth: "20px",
          boxSizing: "border-box",
          transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          alignItems: "center",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          lineHeight: 1,
          alignContent: "center",
          borderRadius: "10px",
          flexDirection: "row",
          justifyContent: "center",
          top: 0,
          right: 0,
          transform: "scale(1) translate(130%, 0%)",
          transformOrigin: "100% 0%",
        }}
      >
        {badgeContent}
      </span>
    </span>
  );
}
