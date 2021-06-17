import React, { useMemo } from "react";
import Popover from "../popover";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import {
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";

const FieldCheck = ({ columns }) => {
  const classes = useStyle();
  const { t } = useTranslation();
  const FieldCheckCols = useMemo(() => {
    return (
      <div className={classes.root}>
        <div>
          <Button variant="contained" onClick={() => columns.defaultColumns()}>
            {t("button.default")}
          </Button>
        </div>
        <Grid container>
          {columns?.columnChecked.map((column, index) => (
            <Grid item xs={4} key={index}>
              <FormControlLabel
                key={index}
                value={column.display}
                control={<Checkbox color="primary" checked={column.display} />}
                label={column.title}
                onChange={(event) => columns.handleChangeColumns(column)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }, [columns?.columnChecked]);

  return (
    <Popover
      content={FieldCheckCols}
      children={
        <IconButton title="">
          <ViewColumnIcon />
        </IconButton>
      }
    ></Popover>
  );
};
const useStyle = makeStyles((themem) => ({
  root: {
    width: 500,
    padding: 10,
  },
}));
export default FieldCheck;
