import React, { useState, useEffect } from "react";
import {
  Paper,
  makeStyles,
  withStyles,
  FormHelperText,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useTranslation } from "react-i18next";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Team1vsn from "./Team1vsn.js";
import TeamLine1vsn from "./TeamLine1vsn.js";
import TextInput from "../../../components/form/TextInput";
import InputBase from "@material-ui/core/InputBase";
import { useAPI } from "../../../api/api";

export default function Member1vsn(props) {
  const classes = useStyle();
  const {
    match,
    competitors,
    setCompetitors,
    field,
    setField,
    array,
    setArray,
    errors,
  } = props;
  const { t, i18n } = useTranslation();
  const [arrPosition, setArrPosition] = useState([]);
  const api = useAPI();

  useEffect(() => {
    if (match) {
      setCompetitors(match?.match_individual_competitors);
    }
    if (field) {
      setArrPosition(field?.position_field);
    }
  }, [match, field]);

  const changeLine = (index, e) => {
    let temp = [...competitors];
    temp[index] = { ...competitors[index] };
    temp[index].line_id = e;
    setCompetitors(temp);
  };

  const changeInput = (index, e) => {
    let temp = [...competitors];
    temp[index] = { ...competitors[index] };
    temp[index].competitor.method_id =
      match?.stage?.event?.event_distinguish_player_method?.method_id;
    temp[index].competitor.registration_number = e;
    setCompetitors(temp);
  };
  const checkLine = (id, line_id) => {
    const isChoose = competitors.find((e) => e.line_id == line_id);
    const member = competitors.find((item) => item.competitor_id == id);
    if (!isChoose) {
      return true;
    } else {
      if (isChoose.competitor_id == id) {
        return true;
      }
      return false;
    }
  };

  return (
    <div>
      {match?.stage?.event?.competition_type == 2 ? (
        <TeamLine1vsn
          match={match}
          field={field}
          setField={setField}
          array={array}
          setArray={setArray}
          errors={errors}
        />
      ) : (
        <TableContainer
          style={{ borderRadius: 4, marginBottom: 10 }}
          component={Paper}
          elevation={0}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.rowHeader}>
                <TableCell
                  className={classes.tableHeader}
                  style={{
                    width: "10%",
                  }}
                >
                  {t("team_line_screen.ordinal_number")}
                </TableCell>

                <TableCell
                  className={classes.tableHeader}
                  style={{
                    width: "30%",
                  }}
                >
                  {t("card_type.member")}
                </TableCell>
                {match?.stage?.event?.event_distinguish_player_method
                  ?.method_id == 2 ? (
                  <TableCell
                    className={classes.tableHeader}
                    style={{ width: "30%" }}
                  >
                    {t("member_registration.registration_number")}
                  </TableCell>
                ) : null}

                {match?.stage?.event?.is_line == 2 ? (
                  <TableCell
                    className={classes.tableHeader}
                    style={{
                      width: "30%",
                    }}
                  >
                    Line
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {competitors?.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={`${classes.row} ${
                      index % 2 == 0 ? classes.row2 : classes.row1
                    }`}
                  >
                    <TableCell className={classes.name}>{index + 1}</TableCell>
                    <TableCell className={classes.name}>
                      <img
                        style={{
                          float: "left",
                          marginRight: 10,
                        }}
                        height={35}
                        width={50}
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          item?.competitor?.team?.country?.flag_url
                        }
                      />

                      {item?.competitor?.given_name +
                        " " +
                        item?.competitor?.family_name}
                    </TableCell>
                    {match?.stage?.event?.event_distinguish_player_method
                      ?.method_id == 2 ? (
                      <TableCell className={classes.name}>
                        <TextInput
                          type="number"
                          variant="outlined"
                          value={item?.competitor?.registration_number}
                          onInput={(e) => {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 5);
                          }}
                          handleChange={(e) => changeInput(index, e)}
                          error={errors?.registration_number_is_require?.find(
                            (e) => e == item?.competitor_id
                          )}
                          helperText={""}
                        />
                        {errors?.registration_number_is_require?.map((el) => {
                          if (el == item.competitor_id) {
                            return (
                              <FormHelperText
                                style={{ margin: "4px 14px 0 14px" }}
                                error={true}
                              >
                                {t("member_registration.registration_number") +
                                  " " +
                                  t("errors.required")}
                              </FormHelperText>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </TableCell>
                    ) : null}
                    {match?.stage?.event?.is_line == 2 ? (
                      <TableCell>
                        <FormControl style={{ width: "100%" }}>
                          <Select
                            input={<Input />}
                            variant="outlined"
                            onChange={(e) => changeLine(index, e.target.value)}
                            value={`${item.line_id}`}
                          >
                            <MenuItem value={null}>---</MenuItem>
                            {arrPosition
                              ?.filter((e) =>
                                checkLine(item.competitor_id, e?.id)
                              )
                              ?.map((e, i) => {
                                return (
                                  <MenuItem value={e?.id}>{e?.name}</MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  rowHeader: {
    backgroundColor: "#43a047",
  },
  row: {
    width: "100%",
    "&:hover": {
      background: " #c8e6c9",
    },
  },
  empty: {
    width: "100%",
    textAlign: "center",
    fontSize: "1rem",
  },
  row1: {},
  row2: {
    backgroundColor: "#e8f5e9",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
    fontFamily: "initial",
  },
  tableRe: {
    fontSize: 20,
    color: "white",
    fontFamily: "initial",
    lineHeight: 0.8,
  },
  cell: {
    fontSize: 18,
    cursor: "pointer",
  },
  team: {
    textAlign: "center",
    backgroundColor: "#43a047",
    color: "white",
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 4,
    fontSize: 28,
    fontFamily: "initial",
    fontWeight: 600,
  },

  member: {
    textAlign: "center",
    backgroundColor: "#e8f5e9",
    padding: 6,
    margin: 6,
    borderRadius: 5,
    fontSize: 20,
  },
  card: {
    padding: 20,
    backgroundColor: "#c8e6c9",
  },
  name: {
    fontSize: "1.2rem",
  },
  typo: {
    fontFamily: "initial",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 5,
  },
  headRow: {
    textAlign: "center",
    fontSize: "1.25rem",
    fontWeight: "bold",
    fontFamily: "emoji",
    color: "#1b5e20",
  },
}));
const Input = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    border: "1px solid #0000003b",
    fontSize: 16,
    padding: "11px 14px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      border: "2px solid #80bdff",
    },
  },
}))(InputBase);
