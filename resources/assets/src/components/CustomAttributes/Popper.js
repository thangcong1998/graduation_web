import React, { useState, useEffect } from "react";
import { Popper, ClickAwayListener } from "@material-ui/core";
export default React.memo(
  ({ children, content, action, setClose, ...other }) => {
    const [anchor, setAnchor] = useState(false);
    useEffect(() => {
      setClose(() => setAnchor);
    }, []);
    const [mouseOverAnchor, setMouseOverAnchor] = useState(false);
    const [mouseOverContent, setMouseOverContent] = useState(false);
    useEffect(() => {
      if (action === "hover") {
        let timeout;
        if (!mouseOverContent && !mouseOverAnchor) {
          timeout = setTimeout(() => setAnchor(), 100);
        }
        return () => clearTimeout(timeout);
      }
    }, [action, mouseOverAnchor, mouseOverContent]);
    const childWithProps = children && {
      ...children,
      props: {
        onClick: (event) => {
          setAnchor(event.currentTarget);
        },
        onMouseOver: (e) => {
          setMouseOverAnchor(true);
          if (action === "hover") setAnchor(e.currentTarget);
        },
        onMouseLeave: () => setMouseOverAnchor(false),
        ...children.props,
      },
    };
    const contentWithProps = {
      ...content,
      props: {
        onMouseOver: () => {
          setMouseOverContent(true);
        },
        onMouseLeave: () => setMouseOverContent(false),
        ...content.props,
      },
    };
    return (
      <>
        <ClickAwayListener onClickAway={() => setAnchor()}>
          <div className="container">
            <Popper
              style={{ zIndex: 1400 }}
              disablePortal
              keepMounted
              open={!!anchor}
              anchorEl={anchor || {}}
              {...other}
            >
              {contentWithProps}
            </Popper>
            {childWithProps}
          </div>
        </ClickAwayListener>
      </>
    );
  }
);
