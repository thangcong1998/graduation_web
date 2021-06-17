import React, {
  Fragment,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
//-------------------------------------

const DialogContext = createContext();

const defaultOptions = {
  type: "normal", // other: confirm
  title: "Title",
  description: "",
  confirmationText: "Ok",
  cancellationText: "Cancel",
  dialogProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
};

const DialogProvider = React.memo(({ children }) => {
  const [options, setOptions] = useState({ ...defaultOptions });
  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;

  const dialog = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setOptions({ ...defaultOptions, ...options });
      setResolveReject([resolve, reject]);
    });
  }, []);

  const handleClose = () => {
    setResolveReject([]);
  };

  const handleCancel = useCallback(() => {
    reject();
    handleClose();
  }, [reject, handleClose]);

  const handleConfirm = useCallback(() => {
    resolve();
    handleClose();
  }, [resolve, handleClose]);

  const value = {
    dialog,
    handleClose,
    handleCancel,
    handleConfirm,
  };

  return (
    <Fragment>
      <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
      {options.type === "normal" && (
        <NormalDialog
          open={resolveReject.length === 2}
          options={options}
          onClose={handleClose}
        />
      )}
      {options.type === "confirm" && (
        <ConfirmationDialog
          open={resolveReject.length === 2}
          options={options}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
      {options.type === "alert" && (
        <AlertDialog
          open={resolveReject.length === 2}
          options={options}
          onClose={handleClose}
        />
      )}
    </Fragment>
  );
});

const NormalDialog = React.memo(({ open, options, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { title, content, dialogProps } = options;

  const classes = useStyles();

  return (
    <Dialog
      {...dialogProps}
      fullScreen={
        dialogProps?.fullScreen ? dialogProps?.fullScreen : fullScreen
      }
      open={open}
      onClose={onClose}
    >
      {title && (
        <DialogTitle className={classes.title} disableTypography={true}>
          <div>{title}</div>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent
        dividers
        style={{
          padding: "10px 10px",
          minWidth: 450,
        }}
      >
        {typeof content == "function" ? content() : content}
      </DialogContent>
    </Dialog>
  );
});

const ConfirmationDialog = React.memo(
  ({ open, options, onCancel, onConfirm }) => {
    const {
      title,
      description,
      confirmationText,
      cancellationText,
      dialogProps,
      confirmationButtonProps,
      cancellationButtonProps,
    } = options;

    return (
      <Dialog fullWidth {...dialogProps} open={open} onClose={onCancel}>
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && (
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button {...cancellationButtonProps} onClick={onCancel}>
            {cancellationText}
          </Button>
          <Button
            color="primary"
            {...confirmationButtonProps}
            onClick={onConfirm}
          >
            {confirmationText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

const AlertDialog = React.memo(({ open, options, onClose }) => {
  const {
    title,
    description,
    closeText,
    dialogProps,
    closeButtonProps,
  } = options;

  return (
    <Dialog fullWidth {...dialogProps} open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button color="primary" {...closeButtonProps} onClick={onClose}>
          {closeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const useStyles = makeStyles((theme) => ({
  closeButton: {
    // position: "absolute",
    // right: theme.spacing(1),
    // top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  title: {
    minWidth: 450,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 10px",
    fontWeight: "600",
    fontSize: "1.25rem",
  },
}));

export const useDialog = () => {
  const dialog = useContext(DialogContext);
  return dialog;
};

export default DialogProvider;
