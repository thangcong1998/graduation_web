import React, { useState, useEffect, useCallback } from "react";
import {
  makeStyles,
  Typography,
  Card,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  FormHelperText,
} from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Individual1vs1 from "./Individual1vs1.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { useTranslation } from "react-i18next";
import TextInput from "../../../components/form/TextInput";

export default function Member1vs1(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyle();
  const {
    match,
    startList,
    setStartList,
    official,
    setOfficial,
    official2,
    setOfficial2,
    individual,
    setIndividual,
    errors,
  } = props;
  const [arrMatch, setArrMatch] = useState([]);
  const [arrMatch2, setArrMatch2] = useState([]);

  const N = match?.stage?.event?.competitor;
  const arrNew = Array.from({ length: N }, (v, k) => k).map((k) => null);

  useEffect(() => {
    if (match) {
      let array_start = [];
      match?.match_event_teams?.map((value) => {
        let temp = {
          match_event_team_id: value.id,
          event_team_id: value.event_team_id,
          event_team_name: value.event_team.name,
          uniforms: value.event_team.uniforms,
          event_uniform_color_id: value.member[0]?.event_uniform_color_id
            ? value.member[0]?.event_uniform_color_id
            : null,
          start_list: [],
        };
        array_start.push(temp);
        setStartList(array_start);
      });
      let arrNew1 = match?.event_teams[0]?.event_team_competitor;
      let arrNew2 = match?.event_teams[1]?.event_team_competitor;

      if (
        match?.match_event_teams[0]?.member[0]?.competitor_id &&
        match?.match_event_teams[0]?.event_team?.event_team_competitor.length !=
          match?.stage?.event?.competitor
      ) {
        let array1 = [];
        match?.match_event_teams[0]?.member?.map((item) => {
          array1.push(item?.competitor);
          arrNew1 = arrNew1.filter((i) => i.id !== item.competitor_id);
        });
        setOfficial(array1);
      } else {
        setOfficial(arrNew);
      }
      setArrMatch(arrNew1);
      if (
        match?.match_event_teams[0]?.event_team?.event_team_competitor.length ==
        match?.stage?.event?.competitor
      ) {
        setOfficial(arrNew1);
        setArrMatch(null);
      }
      if (
        match?.match_event_teams[1]?.member[0]?.competitor_id &&
        match?.match_event_teams[1]?.event_team?.event_team_competitor.length !=
          match?.stage?.event?.competitor
      ) {
        let array2 = [];
        match?.match_event_teams[1]?.member?.map((item) => {
          array2.push(item?.competitor);
          arrNew2 = arrNew2.filter((i) => i.id !== item.competitor_id);
        });
        setOfficial2(array2);
      } else {
        setOfficial2(arrNew);
      }
      setArrMatch2(arrNew2);
      if (
        match?.match_event_teams[1]?.event_team?.event_team_competitor.length ==
        match?.stage?.event?.competitor
      ) {
        setOfficial2(arrNew2);
        setArrMatch2(null);
      }
    }
  }, [match]);

  const handleOnDragEnd = useCallback(
    (drop) => {
      const destinationId = drop?.destination?.droppableId;
      const sourceId = drop.source.droppableId;
      const competitor_id = drop.draggableId;
      const item = arrMatch.find((e) => e.id == competitor_id);
      const item1 = official.find((e, index) => index == sourceId);
      const indexDes = drop.destination.index;
      if (drop.type == "competitor" && drop.destination) {
        if (destinationId != sourceId) {
          if (destinationId == "droppable2") {
            let temp = [...official];
            const arrOff = temp.map((e, i) => (i == sourceId ? null : e));
            setOfficial(arrOff);
            let tem = [...arrMatch];
            tem.push(item1);
            setArrMatch(tem);
          } else {
            setOfficial(
              official.map((e, i) => {
                if (
                  destinationId == i &&
                  drop.source.droppableId == "droppable2"
                ) {
                  return item;
                }
                return e;
              })
            );
            let temp = [...arrMatch];
            const ite = official.find((e, i) => destinationId == i);
            if (ite) {
              temp.push(ite);
            }
            const arrPrep = temp.filter((i) => i.id !== item.id);
            setArrMatch(arrPrep);
          }
        }
      }
    },
    [arrMatch, official]
  );

  const handleOnDragEnd2 = useCallback(
    (drop) => {
      const destinationId = drop?.destination?.droppableId;
      const sourceId = drop.source.droppableId;
      const competitor_id = drop.draggableId;
      const item = arrMatch2.find((e) => e.id == competitor_id);
      const item1 = official2.find((e, index) => index == sourceId);
      const indexDes = drop.destination.index;
      if (drop.type == "competitor" && drop.destination) {
        if (destinationId != sourceId) {
          if (destinationId == "droppable3") {
            let temp = [...official2];
            const arrOff = temp.map((e, i) => (i == sourceId ? null : e));
            setOfficial2(arrOff);
            let tem = [...arrMatch2];
            tem.push(item1);
            setArrMatch2(tem);
          } else {
            setOfficial2(
              official2.map((e, i) => {
                if (
                  destinationId == i &&
                  drop.source.droppableId == "droppable3"
                ) {
                  return item;
                }
                return e;
              })
            );
            let temp = [...arrMatch2];
            const ite = official2.find((e, i) => destinationId == i);
            if (ite) {
              temp.push(ite);
            }
            const arrPrep = temp.filter((i) => i.id !== item.id);
            setArrMatch2(arrPrep);
          }
        }
      }
    },
    [arrMatch2, official2]
  );
  const getListStyle = (isDraggingOver) => ({
    backgroundColor: isDraggingOver ? "#64dd17" : "lightgrey",
    borderRadius: 5,
  });

  const changeUniform = (ind, e) => {
    let temp = [...startList];
    temp[ind].event_uniform_color_id = e;
    setStartList(temp);
  };
  const changeInput1 = (index, e) => {
    let temp = [...official];
    temp[index].registration_number = e;
    setOfficial(temp);
  };
  const changeInput2 = (index, e) => {
    let temp = [...official2];
    temp[index].registration_number = e;
    setOfficial2(temp);
  };

  return (
    <div>
      <div>
        {match?.event_teams.length > 0 ? (
          <Grid container spacing={3} style={{ marginBottom: 10 }}>
            <Grid item md={6} sm={6} xs={12}>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Card className={classes.card}>
                  <div className={classes.team}>
                    <img
                      style={{
                        marginRight: 10,
                        marginTop: 3,
                      }}
                      height={35}
                      width={50}
                      src={
                        process.env.MIX_REACT_APP_STORAGE_URL +
                        "/" +
                        match?.event_teams[0]?.team?.country?.flag_url
                      }
                    />
                    <Typography className={classes.text_team}>
                      {match?.event_teams[0]?.name}
                    </Typography>
                  </div>
                  <hr />
                  <div style={{ display: "flex", width: "100%" }}>
                    <Typography
                      style={
                        match?.stage?.event?.event_distinguish_player_method
                          ?.method_id == 2
                          ? { width: "70%" }
                          : { width: "100%" }
                      }
                      className={classes.headRow}
                    >
                      <i>{t("team_line_screen.official_athlete")}</i>
                    </Typography>
                    {match?.stage?.event?.event_distinguish_player_method
                      ?.method_id == 2 ? (
                      <Typography
                        style={{ width: "30%" }}
                        className={classes.headRow}
                      >
                        <i>{t("team_line_screen.registration_number")}</i>
                      </Typography>
                    ) : null}
                  </div>
                  {official?.map((item, index) => {
                    return (
                      <div style={{ width: "100%", display: "flex" }}>
                        <div
                          style={
                            match?.stage?.event?.event_distinguish_player_method
                              ?.method_id == 2
                              ? { width: "70%", marginRight: 10 }
                              : { width: "100%" }
                          }
                        >
                          <Droppable
                            droppableId={`${index}`}
                            type="competitor"
                            // isCombineEnabled={true}
                            // isDropDisabled={true}
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {item ? (
                                  <Draggable
                                    draggableId={`${item?.id}`}
                                    key={item.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Typography className={classes.text}>
                                          {item?.given_name +
                                            " " +
                                            item?.family_name}
                                        </Typography>
                                      </div>
                                    )}
                                  </Draggable>
                                ) : (
                                  <div>
                                    <Typography
                                      className={classes.box}
                                    ></Typography>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                        {match?.stage?.event?.event_distinguish_player_method
                          ?.method_id == 2 ? (
                          <div style={{ width: "30%" }}>
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
                              handleChange={(e) => changeInput1(index, e)}
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
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  <hr />
                  <Droppable droppableId="droppable2" type="competitor">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div style={{ display: "flex", width: "100%" }}>
                          <Typography
                            style={
                              match?.stage?.event
                                ?.event_distinguish_player_method?.method_id ==
                              2
                                ? { width: "70%" }
                                : { width: "100%" }
                            }
                            className={classes.headRow}
                          >
                              {arrMatch?.length > 0 && (<i>{t("team_line_screen.preparatory_athlete")}</i>)}
                          </Typography>
                          {match?.stage?.event?.event_distinguish_player_method
                            ?.method_id == 2 ? (
                            <Typography
                              style={{ width: "30%" }}
                              className={classes.headRow}
                            >
                              <i>{t("team_line_screen.registration_number")}</i>
                            </Typography>
                          ) : null}
                        </div>
                        {arrMatch?.map((item, index) => {
                          return (
                            <div style={{ width: "100%", display: "flex" }}>
                              <div
                                style={
                                  match?.stage?.event
                                    ?.event_distinguish_player_method
                                    ?.method_id == 2
                                    ? { width: "70%", marginRight: 10 }
                                    : { width: "100%" }
                                }
                              >
                                <Draggable
                                  draggableId={`${item?.id}`}
                                  key={item.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Typography className={classes.text}>
                                        {item.given_name +
                                          " " +
                                          item.family_name}
                                      </Typography>
                                    </div>
                                  )}
                                </Draggable>
                              </div>
                              {match?.stage?.event
                                ?.event_distinguish_player_method?.method_id ==
                              2 ? (
                                <div style={{ width: "30%" }}>
                                  <TextInput
                                    type="number"
                                    variant="outlined"
                                    value={item?.registration_number}
                                    disabled={true}
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </DragDropContext>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <DragDropContext onDragEnd={handleOnDragEnd2}>
                <Card className={classes.card}>
                  <div className={classes.team}>
                    <img
                      style={{
                        marginRight: 10,
                        marginTop: 3,
                      }}
                      height={35}
                      width={50}
                      src={
                        process.env.MIX_REACT_APP_STORAGE_URL +
                        "/" +
                        match?.event_teams[1]?.team?.country?.flag_url
                      }
                    />
                    <Typography className={classes.text_team}>
                      {match?.event_teams[1]?.name}
                    </Typography>
                  </div>
                  <hr />
                  <div style={{ display: "flex", width: "100%" }}>
                    <Typography
                      style={
                        match?.stage?.event?.event_distinguish_player_method
                          ?.method_id == 2
                          ? { width: "70%" }
                          : { width: "100%" }
                      }
                      className={classes.headRow}
                    >
                      <i>{t("team_line_screen.official_athlete")}</i>
                    </Typography>
                    {match?.stage?.event?.event_distinguish_player_method
                      ?.method_id == 2 ? (
                      <Typography
                        style={{ width: "30%" }}
                        className={classes.headRow}
                      >
                        <i>{t("team_line_screen.registration_number")}</i>
                      </Typography>
                    ) : null}
                  </div>
                  {official2?.map((item, index) => {
                    return (
                      <div style={{ width: "100%", display: "flex" }}>
                        <div
                          style={
                            match?.stage?.event?.event_distinguish_player_method
                              ?.method_id == 2
                              ? { width: "70%", marginRight: 10 }
                              : { width: "100%" }
                          }
                        >
                          <Droppable
                            droppableId={`${index}`}
                            type="competitor"
                            // isCombineEnabled={true}
                            // isDropDisabled={true}
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {item ? (
                                  <Draggable
                                    draggableId={`${item?.id}`}
                                    key={item.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Typography className={classes.text}>
                                          {item?.given_name +
                                            " " +
                                            item?.family_name}
                                        </Typography>
                                      </div>
                                    )}
                                  </Draggable>
                                ) : (
                                  <div>
                                    <Typography
                                      className={classes.box}
                                    ></Typography>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                        {match?.stage?.event?.event_distinguish_player_method
                          ?.method_id == 2 ? (
                          <div style={{ width: "30%" }}>
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
                              handleChange={(e) => changeInput2(index, e)}
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
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  <hr />
                  <Droppable droppableId="droppable3" type="competitor">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div style={{ display: "flex", width: "100%" }}>
                          <Typography
                            style={
                              match?.stage?.event
                                ?.event_distinguish_player_method?.method_id ==
                              2
                                ? { width: "70%" }
                                : { width: "100%" }
                            }
                            className={classes.headRow}
                          >
                              {arrMatch2?.length > 0 && (<i>{t("team_line_screen.preparatory_athlete")}</i>)}
                          </Typography>
                          {match?.stage?.event?.event_distinguish_player_method
                            ?.method_id == 2 ? (
                            <Typography
                              style={{ width: "30%" }}
                              className={classes.headRow}
                            >
                              <i>{t("team_line_screen.registration_number")}</i>
                            </Typography>
                          ) : null}
                        </div>
                        {arrMatch2?.map((item, index) => {
                          return (
                            <div style={{ width: "100%", display: "flex" }}>
                              <div
                                style={
                                  match?.stage?.event
                                    ?.event_distinguish_player_method
                                    ?.method_id == 2
                                    ? { width: "70%", marginRight: 10 }
                                    : { width: "100%" }
                                }
                              >
                                <Draggable
                                  draggableId={`${item?.id}`}
                                  key={item.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Typography className={classes.text}>
                                        {item.given_name +
                                          " " +
                                          item.family_name}
                                      </Typography>
                                    </div>
                                  )}
                                </Draggable>
                              </div>
                              {match?.stage?.event
                                ?.event_distinguish_player_method?.method_id ==
                              2 ? (
                                <div style={{ width: "30%" }}>
                                  <TextInput
                                    type="number"
                                    variant="outlined"
                                    value={item?.registration_number}
                                    disabled={true}
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </DragDropContext>
            </Grid>
          </Grid>
        ) : (
          <Individual1vs1
            match={match}
            individual={individual}
            setIndividual={setIndividual}
          />
        )}
      </div>
      {match?.stage?.event?.event_distinguish_player_method?.method_id == 1 ? (
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
                  <i> {t("team_line_screen.registered_clothes")}</i>
                </TableCell>
              </TableRow>
            </TableHead>
            {startList?.map((el, ind) => {
              return (
                <TableBody>
                  <TableRow
                    style={{ width: "100%" }}
                    className={classes.row_body}
                  >
                    <TableCell
                      style={{
                        width: "30%",
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        color: "#474343de",
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
                                  <Typography className={classes.texts}>
                                    {t("team_line_screen.player_shirt") + ":"}
                                  </Typography>
                                  <Typography>
                                    {e?.player_shirt + ";"}
                                  </Typography>
                                  <Typography className={classes.texts}>
                                    {t("team_line_screen.player_shorts") + ":"}
                                  </Typography>
                                  <Typography>
                                    {e?.player_shorts + ";"}
                                  </Typography>
                                  <Typography className={classes.texts}>
                                    {t("team_line_screen.goalkeeper_shirt") +
                                      ":"}
                                  </Typography>
                                  <Typography>
                                    {e?.goalkeeper_shirt + ";"}
                                  </Typography>
                                  <Typography className={classes.texts}>
                                    {t("team_line_screen.goalkeeper_shorts") +
                                      ":"}
                                  </Typography>
                                  <Typography>
                                    {e?.goalkeeper_shorts}
                                  </Typography>
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
      ) : null}
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  team: {
    textAlign: "center",
    backgroundColor: "#43a047",
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
  },
  text_team: {
    fontSize: 28,
    fontFamily: "initial",
    fontWeight: 600,
    color: "white",
  },
  card: {
    padding: 20,
    backgroundColor: "#c8e6c9",
  },
  headRow: {
    textAlign: "center",
    fontSize: "1.25rem",
    fontFamily: "emoji",
    color: "#1b5e20",
    fontWeight: "bold",
  },
  text: {
    fontSize: "1.25rem",
    textAlign: "center",
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#e8f5e9",
    marginBottom: 10,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#64dd17",
    },
  },
  box: {
    fontSize: "1.25rem",
    textAlign: "center",
    borderRadius: 5,
    padding: 20,
    marginBottom: 10,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#64dd17",
    },
    fontWeight: "bold",
  },
  rowHeader: {
    backgroundColor: "#43a047",
  },
  row_body: {
    backgroundColor: "#e8f5e9",
  },
  cell_header: {
    fontSize: "1.25rem",
    color: "white",
    fontFamily: "math",
    border: "1px solid #bdbdbd",
  },
  cell_body: {
    fontSize: "1.25rem",
    fontFamily: "math",
    border: "1px solid #bdbdbd",
  },
  div: {
    marginBottom: 20,
    marginTop: 20,
  },
  texts: {
    fontWeight: "bold",
    color: "#474343de",
  },
}));
