import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { Fragment } from "react";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">
        {children || <div style={{ color: "white" }}>empty</div>}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const useStyles = makeStyles({
  root: {
    "& .MuiDialogContent-root": {
      padding: "12px 24px",
    },
  },
});
export default React.memo(({ children, title, content, ...otherProps }) => {
  const [open, setOpen] = useState(false);
  const onClose = otherProps.onClose || (() => setOpen(false));
  const classes = useStyles();
  let childClone = children
    ? {
        ...children,
        props: {
          ...children.props,
          onClick: () => {
            setOpen(true);
          },
        },
      }
    : null;

  return (
    <Fragment>
      {childClone}
      <Dialog
        transitionDuration={100}
        open={open}
        onClose={onClose}
        fullWidth={true}
        PaperProps={{ classes }}
        {...otherProps}
      >
        <DialogTitle onClose={onClose}>{title}</DialogTitle>
        <MuiDialogContent>{content(onClose)}</MuiDialogContent>
      </Dialog>
    </Fragment>
  );
});
