import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  FormHelperText,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { useTranslation } from "react-i18next";

export default function EventUniformColor(props) {
  const classes = useStyle();
  const { array, setArray, errors } = props;
  const { t, i18n } = useTranslation();
  const changeUniform = (ind, e) => {
    let temp = [...array];
    temp[ind].event_uniform_color_id = e;
    setArray(temp);
  };

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <div className={classes.div}>
        <Table>
          <TableHead className={classes.rowHeader}>
            <TableRow style={{ height: "4rem", width: "100%" }}>
              <TableCell
                style={{ width: "30%" }}
                className={classes.cell_header}
              >
                <i>{t("team_line_screen.team_name")}</i>
              </TableCell>
              <TableCell
                style={{ width: "70%" }}
                className={classes.cell_header}
              >
                <i>{t("team_line_screen.registered_clothes")}</i>
              </TableCell>
            </TableRow>
          </TableHead>
          {array?.map((el, ind) => {
            return (
              <TableBody>
                <TableRow className={classes.row_body}>
                  <TableCell
                    style={{
                      width: "30%",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      color: "#474343de",
                      fontFamily: "math",
                    }}
                    className={classes.cell_body}
                  >
                    {el?.event_team_name}
                  </TableCell>
                  <TableCell
                    style={{ width: "70%" }}
                    className={classes.cell_body}
                  >
                    <FormControl style={{ width: "100%" }}>
                      <Select
                        variant="outlined"
                        onChange={(e) => changeUniform(ind, e.target.value)}
                        value={`${el?.event_uniform_color_id}`}
                      >
                        {el?.uniforms?.map((e, i) => {
                          return (
                            <MenuItem value={e?.id}>
                              <div style={{ display: "flex" }}>
                                <Typography className={classes.text}>
                                  {t("team_line_screen.player_shirt") + ":"}
                                </Typography>
                                <Typography>{e?.player_shirt + ";"}</Typography>
                                <Typography className={classes.text}>
                                  {t("team_line_screen.player_shorts") + ":"}
                                </Typography>
                                <Typography>
                                  {e?.player_shorts + ";"}
                                </Typography>
                                <Typography className={classes.text}>
                                  {t("team_line_screen.goalkeeper_shirt") + ":"}
                                </Typography>
                                <Typography>
                                  {e?.goalkeeper_shirt + ";"}
                                </Typography>
                                <Typography className={classes.text}>
                                  {t("team_line_screen.goalkeeper_shorts") +
                                    ":"}
                                </Typography>
                                <Typography>{e?.goalkeeper_shorts}</Typography>
                              </div>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    {errors?.event_uniform_color_is_require?.map(
                      (element, i) => {
                        if (element == el.event_team_id) {
                          return (
                            <FormHelperText
                              style={{ margin: "4px 14px 0 14px" }}
                              error={true}
                            >
                              {t("team_line_screen.registered_clothes") +
                                " " +
                                t("errors.required")}
                            </FormHelperText>
                          );
                        } else {
                          return null;
                        }
                      }
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            );
          })}
        </Table>
      </div>
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  rowHeader: {
    backgroundColor: "#43a047",
  },
  row_body: {
    backgroundColor: "#e8f5e9",
    width: "100%",
  },
  cell_header: {
    fontSize: "1.25rem",
    color: "white",
    fontFamily: "math",
    border: "1px solid #bdbdbd",
  },
  cell_body: {
    fontSize: "1rem",
    border: "1px solid #bdbdbd",
  },
  div: {
    marginBottom: 20,
  },
  text: {
    fontWeight: "bold",
    color: "#474343de",
  },
}));
