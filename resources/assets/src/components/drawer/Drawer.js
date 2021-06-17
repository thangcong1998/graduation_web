import React, { useState, useEffect } from "react";
import { makeStyles, SwipeableDrawer, IconButton } from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({});

export default function (props) {
  const { anchor, title, content, children, close, ...otherProps } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (close) {
      handleClose();
    }
  }, [close]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-drawer" : undefined;

  const toggle = {
    ...children,
    props: {
      ...children.props,
      onClick: handleClick,
    },
  };
  return (
    <React.Fragment key={anchor | "left"}>
      {toggle}
      <SwipeableDrawer
        id={id}
        open={open}
        onClose={handleClose}
        anchor={anchor || "left"}
        {...otherProps}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{title}</div>
          <IconButton
            aria-label="close"
            // className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        {typeof content === "function" ? content(handleClose) : content}
      </SwipeableDrawer>
    </React.Fragment>
  );
}
