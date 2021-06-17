import React from "react";
import Popper from "../Popper";
import { Paper } from "@material-ui/core";

export default function ({ event, content, label, setClose }) {
  const ContentDefault = <Paper>{event?.title}</Paper>;

  return (
    <Popper
      content={content ? content : ContentDefault}
      setClose={setClose}
      placement="right-start"
    >
      <div
        style={{
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </Popper>
  );
}
