import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import basecolor from "../common/color.json";

export default function (props) {
  const { color, text, textColor, icon, position } = props;
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
  const content = () => {
    if (icon) {
      if (position === "end") {
        return text + icon;
      }
      return icon + text;
    }
    return text;
  };
  return (
    <Paper
      style={{
        background: _color(),
        color: textColor ? textColor : "#FFFFFF",
        padding: 10,
        fontWeight: 600,
        fontSize: "1rem",
      }}
    >
      {content()}
    </Paper>
  );
}
