import React, { useState, useEffect, useCallback } from "react";
import {
  IconButton,
  makeStyles,
  Paper,
  Typography,
  Grid,
  FormHelperText,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextInput from "../../../components/form/TextInput";
import EventUniformColor from "./EventUniformColor.js";
import { useTranslation } from "react-i18next";

export default function TeamLine1vsn(props) {
  const { t, i18n } = useTranslation();
  const { match, field, setField, array, setArray, errors } = props;
  const classes = useStyle();
  const [arrPosition, setArrPosition] = useState([]);
  const N = match?.stage?.event?.competitor;
  const arrNew = Array.from({ length: N }, (v, k) => k).map((k) => null);

  useEffect(() => {
    if (match) {
      let temp = [];
      match?.match_event_teams.map((value) => {
        let team = {
          event_team_id: value.event_team.id,
          team_name: value.event_team.name,
          flag_url: value.event_team.team.country.flag_url,
          status: true,
          line_id: value?.member[0]?.line_id ? value?.member[0]?.line_id : null,
          event_team_competitor: value.event_team.event_team_competitor,
          official: [...arrNew],
          match_event_team_id: value.id,
          event_team_name: value.event_team.name,
          uniforms: value.event_team.uniforms,
          event_uniform_color_id: value.member[0]?.event_uniform_color_id
            ? value.member[0]?.event_uniform_color_id
            : null,
        };

        if (
          match?.stage?.event?.competitor ==
          value.event_team.event_team_competitor?.length
        ) {
          team.event_team_competitor = null;
          value?.event_team.event_team_competitor?.map((e) => {
            team.official.push(e);
            team.official = team.official?.filter((el) => el != null);
          });
        }
        let arr2 = [];
        if (value?.member[0]?.id) {
          value?.member?.map((item) => {
            arr2.push(item.competitor);
            team.official = arr2;
            team.event_team_competitor = team.event_team_competitor?.filter(
              (e) => e.id != item.competitor_id
            );
          });
        }
        temp.push(team);
      });
      setArray(temp);
    }
    if (field) {
      setArrPosition(field?.position_field);
    }
  }, [match, field]);
  const changeStatusCollapse = (index) => {
    let temp = [...array];
    temp[index].status = !temp[index].status;
    setArray(temp);
  };
  const changeLine = (index, e) => {
    let temp = [...array];
    temp[index] = { ...array[index] };
    temp[index].line_id = e;
    setArray(temp);
  };
  const checkLine = (id, line_id) => {
    const isChoose = array?.find((e) => e?.line_id == line_id);
    if (!isChoose) {
      return true;
    } else {
      if (isChoose.event_team_id == id) {
        return true;
      }
      return false;
    }
  };

  const handleOnDragEnd = useCallback(
    (drop) => {
      const destinationId = drop?.destination?.droppableId;
      const sourceId = drop.source.droppableId;
      const competitor_id = drop.draggableId;
      const index_team = drop.type;

      let temp = [...array];
      if (drop.destination && destinationId != sourceId) {
        temp.map((value, index) => {
          let item = value?.event_team_competitor?.find(
            (e) => e.id == competitor_id
          );
          if (index == index_team) {
            value.official.map((element, i) => {
              if (destinationId == `drop_a_${i}` && competitor_id == item.id) {
                if (
                  value.official[i] != null &&
                  value.official[i] != undefined
                ) {
                  value.event_team_competitor.push(value.official[i]);
                }
                value.official[i] = item;
                value.event_team_competitor = value.event_team_competitor.filter(
                  (ele) => ele.id != item.id
                );
              }
              if (
                sourceId == `drop_a_${i}` &&
                value.official[i] != null &&
                value.official[i] != undefined
              ) {
                value.event_team_competitor.push(value.official[i]);
                value.official[i] = null;
              }
            });
          }
        });
      }
      setArray(temp);
    },
    [array]
  );

  const changeInput = (index, i, e) => {
    let temp = [...array];
    temp[index] = { ...array[index] };
    temp[index].official.map((el, ind) => {
      if (ind == i) {
        el.registration_number = e;
      }
    });
    setArray(temp);
  };
  return (
    <Paper style={{ marginBottom: 15 }}>
      {array.length > 0 &&
        array.map((value, index) => {
          return (
            <div style={{ width: "100%", padding: 20 }}>
              <div style={{ width: "100%", display: "flex", marginBottom: 10 }}>
                <div style={{ width: "50%", display: "flex" }}>
                  <img
                    style={{
                      marginRight: 10,
                    }}
                    height={45}
                    width={60}
                    src={
                      process.env.MIX_REACT_APP_STORAGE_URL +
                      "/" +
                      value?.flag_url
                    }
                  />
                  <h2 className={classes.h2}>{value?.team_name}</h2>
                </div>

                {match?.stage?.event?.is_line == 2 ? (
                  <FormControl style={{ width: "30%", marginLeft: 12 }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      style={{ paddingLeft: 15 }}
                    >
                      Line
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      variant="outlined"
                      onChange={(e) => changeLine(index, e.target.value)}
                      label="Line"
                      value={`${value?.line_id}`}
                    >
                      <MenuItem value={null}>---</MenuItem>
                      {arrPosition
                        ?.filter((e) => checkLine(value?.event_team_id, e?.id))
                        ?.map((e, i) => {
                          return <MenuItem value={e?.id}>{e?.name}</MenuItem>;
                        })}
                    </Select>
                  </FormControl>
                ) : null}
                <IconButton
                  style={{ with: "20%", height: "50%" }}
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: value?.status,
                  })}
                  onClick={() => changeStatusCollapse(index)}
                  aria-expanded={value?.status}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>
              <Collapse in={value?.status} timeout="auto" unmountOnExit>
                <div style={{ width: "100%" }}>
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={6} xs={12}>
                        <TableContainer>
                          <Table>
                            <TableHead className={classes.head}>
                              <TableRow>
                                <TableCell
                                  style={{ width: "10%" }}
                                  className={classes.cell}
                                >
                                  <i> {t("team_line_screen.ordinal_number")}</i>
                                </TableCell>
                                <TableCell
                                  style={{ width: "60%" }}
                                  className={classes.cell}
                                >
                                  <i>
                                    {t("team_line_screen.official_athlete")}
                                  </i>
                                </TableCell>
                                {match?.stage?.event
                                  ?.event_distinguish_player_method
                                  ?.method_id == 2 ? (
                                  <TableCell
                                    style={{ width: "30%" }}
                                    className={classes.cell}
                                  >
                                    <i>
                                      {t(
                                        "team_line_screen.registration_number"
                                      )}
                                    </i>
                                  </TableCell>
                                ) : null}
                              </TableRow>
                            </TableHead>
                            {value?.official?.map((item, i) => {
                              return (
                                <TableBody className={classes.body}>
                                  <TableRow className={classes.row}>
                                    <TableCell
                                      style={{ width: "10%" }}
                                      style={{ fontSize: "1.25rem" }}
                                    >
                                      {i + 1}
                                    </TableCell>
                                    <TableCell style={{ width: "60%" }}>
                                      <Droppable
                                        droppableId={`drop_a_${i}`}
                                        type={`${index}`}
                                        isCombineEnabled={true}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                          >
                                            {item ? (
                                              <Draggable
                                                draggableId={`${item?.id}`}
                                                key={item?.id}
                                                index={i}
                                              >
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <Typography
                                                      className={classes.text}
                                                    >
                                                      {item?.given_name +
                                                        " " +
                                                        item?.family_name}
                                                    </Typography>
                                                  </div>
                                                )}
                                              </Draggable>
                                            ) : (
                                              <Typography
                                                className={classes.box}
                                              ></Typography>
                                            )}
                                          </div>
                                        )}
                                      </Droppable>
                                    </TableCell>
                                    {match?.stage?.event
                                      ?.event_distinguish_player_method
                                      ?.method_id == 2 ? (
                                      <TableCell style={{ width: "30%" }}>
                                        <TextInput
                                          type="number"
                                          variant="outlined"
                                          value={item?.registration_number}
                                          onInput={(e) => {
                                            e.target.value = Math.max(
                                              0,
                                              parseInt(e.target.value)
                                            )
                                              .toString()
                                              .slice(0, 5);
                                          }}
                                          handleChange={(e) =>
                                            changeInput(index, i, e)
                                          }
                                          error={errors?.registration_number_is_require?.find(
                                            (e) => e == item?.id
                                          )}
                                          helperText={""}
                                        />
                                        {errors?.registration_number_is_require?.map(
                                          (el) => {
                                            if (el == item.id) {
                                              return (
                                                <FormHelperText
                                                  style={{
                                                    margin: "4px 14px 0 14px",
                                                  }}
                                                  error={true}
                                                >
                                                  {t(
                                                    "member_registration.registration_number"
                                                  ) +
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
                                    ) : null}
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <TableContainer>
                          <Table>
                            <TableHead className={classes.head}>
                              <TableRow>
                                <TableCell
                                  style={{ width: "10%" }}
                                  className={classes.cell}
                                >
                                  <i>{t("team_line_screen.ordinal_number")}</i>
                                </TableCell>
                                <TableCell
                                  style={{ width: "60%" }}
                                  className={classes.cell}
                                >
                                  <i>
                                    {t("team_line_screen.preparatory_athlete")}
                                  </i>
                                </TableCell>
                                {match?.stage?.event
                                  ?.event_distinguish_player_method
                                  ?.method_id == 2 ? (
                                  <TableCell
                                    style={{ width: "30%" }}
                                    className={classes.cell}
                                  >
                                    <i>
                                      {t(
                                        "team_line_screen.registration_number"
                                      )}
                                    </i>
                                  </TableCell>
                                ) : null}
                              </TableRow>
                            </TableHead>
                            {value?.event_team_competitor?.map((item, i) => {
                              return (
                                <TableBody className={classes.body}>
                                  <TableRow className={classes.row}>
                                    <TableCell
                                      style={{ width: "10%" }}
                                      style={{ fontSize: "1.25rem" }}
                                    >
                                      {i + 1}
                                    </TableCell>
                                    <TableCell style={{ width: "60%" }}>
                                      <Droppable
                                        droppableId={`drop_b_${i}`}
                                        type={`${index}`}
                                      >
                                        {(provided) => (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                          >
                                            <Draggable
                                              draggableId={`${item?.id}`}
                                              key={item?.id}
                                              index={i}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                >
                                                  <Typography
                                                    className={classes.text}
                                                  >
                                                    {item?.given_name +
                                                      " " +
                                                      item?.family_name}
                                                  </Typography>
                                                </div>
                                              )}
                                            </Draggable>

                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </TableCell>
                                    {match?.stage?.event
                                      ?.event_distinguish_player_method
                                      ?.method_id == 2 ? (
                                      <TableCell style={{ width: "30%" }}>
                                        <TextInput
                                          type="number"
                                          variant="outlined"
                                          value={item?.registration_number}
                                          disabled={true}
                                        />
                                      </TableCell>
                                    ) : null}
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </DragDropContext>
                </div>
              </Collapse>
            </div>
          );
        })}
      {match?.stage?.event?.event_distinguish_player_method?.method_id == 1 ? (
        <EventUniformColor array={array} setArray={setArray} errors={errors} />
      ) : null}
    </Paper>
  );
}
const useStyle = makeStyles((theme) => ({
  h2: {
    color: "#4caf50",
    fontSize: "1.75rem",
    fontFamily: "math",
    margin: 0,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  box: {
    fontSize: "1.25rem",
    textAlign: "center",
    borderRadius: 5,
    padding: 20,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#64dd17",
    },
    backgroundColor: "#e8f5e9",
  },
  text: {
    fontSize: "1.25rem",
    textAlign: "center",
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#e8f5e9",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#64dd17",
    },
  },
  head: {
    backgroundColor: "#43a047",
  },
  cell: {
    color: "white",
    fontSize: "1.25rem",
    fontFamily: "math",
    padding: 10,
  },
  row: {},
  body: {
    backgroundColor: "#c8e6c9",
  },
  icon_button: {
    padding: 3,
    float: "right",
  },
}));
