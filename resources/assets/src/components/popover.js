import React, { useEffect, useState } from "react";
import { Popover } from "@material-ui/core";

export default React.memo((props) => {
  const { content, children, close, setClose, ...otherProps } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    if (close) {
      handleClose();
      setClose();
    }
  }, [close]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const anchor = {
    ...children,
    props: {
      ...children.props,
      onClick: handleClick,
    },
  };

  return (
    <React.Fragment>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {typeof content === "function" ? content(handleClose) : content}
      </Popover>
      {anchor}
    </React.Fragment>
  );
});
