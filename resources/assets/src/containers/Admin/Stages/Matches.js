import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Grid } from "@material-ui/core";
import {
  match_attendant_type,
  event_type,
  DragdropColors,
} from "../../../common/constants";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { Individual, Team, EditMatch } from "./EditMatch";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import i18n from "../../../i18n/i18n";
import Dialog from "../../../components/DialogMui";
import EditMatch1vsn from "./EditMatch1vsn";

const lang = i18n.languages[0];
const grid = 8;
const background = "#e5e5e5";
const styleItem = (isDragging, draggableStyle) => ({
  padding: 10,
  margin: `0 0 ${grid}px 0`,
  borderRadius: 2,
  backgroundColor: isDragging ? "#05aef5" : "#FFFFFF",
  border: isDragging ? "1px inset" : "unset",
  ...draggableStyle,
});

const styleMatch = () => ({
  padding: grid,
});

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#ffffff",
    padding: grid,
    borderRadius: 2,
  },
  container: {
    display: "flex",
    flexWrap: "nowrap",
  },
  competitionDate: {
    minWidth: 400,
  },
  tableMatch: {},
  columnBackground: {
    backgroundColor: "#ebecf0",
  },
  spacingColumn: {
    borderRight: "8px solid #ffffff",
    verticalAlign: "top",
  },
  buttonAdd: {
    width: "100%",
    height: 70,
  },
  textDate: {
    padding: 8,
    textAlign: "center",
    fontWeight: 600,
    fontSize: "1.25rem",
  },
  competitors: {
    minWidth: 300,
    maxWidth: 450,
    marginRight: 8,
  },
  rootDate: {},
}));
const DragItem = (props) => {
  const { id, competitor, index, competitionType } = props;
  return (
    <Draggable key={id} draggableId={id} index={index} type="competitor">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={styleItem(snapshot.isDragging, provided.draggableProps.style)}
        >
          {provided.placeholder}
          {competitionType == event_type.INDIVIDUAL && (
            <Individual competitor={competitor} />
          )}
          {competitionType == event_type.TEAM && (
            <Team competitor={competitor} />
          )}
        </div>
      )}
    </Draggable>
  );
};

const AddDate = (props) => {
  const { close, addDate } = props;
  const [date, setDate] = useState(new Date());
  return (
    <div
      style={{
        maxWidth: 325,
        minWidth: 310,
      }}
    >
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        locale={lang}
        libInstance={moment}
      >
        <DatePicker
          variant="static"
          value={date}
          onChange={(e) => {
            setDate(e);
          }}
        />
      </MuiPickersUtilsProvider>
      <Button
        color="primary"
        onClick={() => {
          addDate(moment(date).format("YYYY-MM-DD"));
          close();
        }}
      >
        OK
      </Button>
    </div>
  );
};

export const Matches = memo((props) => {
  const {
    // handleOnDragEnd,
    addMatch,
    competitors,
    matches,
    competitionType,
    handleChangeMatch,
    deleteMatch,
    venues,
    isEdit,
    setIsEdit,
    competitionDate,
    addCompetitionDate,
    error,
    matchAttendantType,
    refetch,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const [temp, setTemp] = useState(null);
  useEffect(() => {
    if (isEdit == null) {
      setTemp(null);
    }
  }, [isEdit]);
  const handleOnDragEnd = useCallback(
    (event) => {
      const droppableId = event.destination.droppableId;
      if (event.type == "competitor") {
        const draggableIndex = event.source.index;
        const item = competitors.find((e, index) => index == draggableIndex);
        if (matchAttendantType == match_attendant_type._1VS1) {
          if (!temp.competitors.find((e) => e.competitor?.id == item?.id)) {
            setTemp((pre) => ({
              ...pre,
              competitors: pre.competitors.map((e, i) => {
                if (e.key == droppableId) {
                  return { ...e, competitor: item };
                }
                return { ...e };
              }),
            }));
          }
        } else {
          if (!temp.competitors.find((e) => e.id == item?.id)) {
            setTemp((pre) => ({
              ...pre,
              competitors: [...pre.competitors, item],
            }));
          }
        }
      }
      if (event.type == "match") {
        const sourceId = event.source.droppableId;
        if (sourceId != droppableId) {
          const matchIndex = event.draggableId.split("match_")[1];
          const _match = matches.find((e, i) => i == matchIndex);
          _match.event_date = droppableId.split("_")[0];
          _match.start_time = `${droppableId.split("_")[0]} ${moment(
            _match.start_time
          ).format("HH:mm:ss")}`;
          handleChangeMatch(_match);
        }
      }
    },
    [temp, competitors]
  );

  const deleteCompetitor = (id) => {
    if (id) {
      setTemp((pre) => ({
        ...pre,
        competitors: pre.competitors.filter((e) => e.id != id),
      }));
    }
  };

  return (
    <React.Fragment>
      <div style={{ marginBottom: 8 }}>
        <Dialog
          title={t("stages_screen.select_date")}
          fullWidth={false}
          content={(close) => (
            <AddDate close={close} addDate={addCompetitionDate} />
          )}
        >
          <Button variant="outlined" color="primary" disabled={isEdit != null}>
            {t("button.add_competition_date")}
          </Button>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={(event) => handleOnDragEnd(event)}>
        <Grid className={classes.container}>
          <Grid item className={classes.competitors}>
            <Droppable droppableId={`competitors`} type="competitor">
              {(provided) => (
                <div
                  className="characters"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    borderRadius: 5,
                    padding: 10,
                    backgroundColor: background,
                  }}
                >
                  <div className={"head-competitor"}>
                    {competitionType == event_type.INDIVIDUAL
                      ? t("text.competitors")
                      : t("text.NOC")}
                  </div>
                  {competitors.map((competitor, itemIndex) => (
                    <DragItem
                      id={"competitor_" + competitor.id}
                      competitor={competitor}
                      index={itemIndex}
                      competitionType={competitionType}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>
          <Grid
            item
            style={{
              overflow: "auto",
            }}
          >
            <table
              className={classes.tableMatch}
              cellSpacing="0"
              cellPadding="0"
            >
              {/* Date */}
              <thead>
                <tr>
                  {competitionDate.map(({ date, color }, dateIndex) => (
                    <td
                      className={`${classes.competitionDate} ${classes.spacingColumn}`}
                      key={dateIndex}
                    >
                      <div
                        className={`${classes.columnBackground}`}
                        style={{
                          padding: 8,
                          borderTopRightRadius: 5,
                          borderTopLeftRadius: 5,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: DragdropColors[color],
                          }}
                          className={classes.textDate}
                        >
                          {moment(date).format("DD-MM-YYYY")}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              {/* Match */}
              <tbody>
                <tr>
                  {competitionDate.map(({ date, color }, dateIndex) => (
                    <td
                      className={`${classes.columnMatch} ${classes.columnBackground} ${classes.spacingColumn}`}
                      key={dateIndex}
                    >
                      <Droppable
                        droppableId={`${date}_${dateIndex}`}
                        type="match"
                      >
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`${classes.columnBackground}`}
                            style={{
                              padding: 8,
                            }}
                          >
                            {matches
                              .filter((m, mIndex) => m.event_date == date)
                              .map((match, mIndex) => (
                                <div
                                  style={{
                                    marginBottom: 5,
                                  }}
                                >
                                  {matchAttendantType ==
                                  match_attendant_type._1VS1 ? (
                                    <EditMatch
                                      match={match}
                                      index={`${date}_${mIndex}`}
                                      competitionType={competitionType}
                                      isEdit={isEdit}
                                      setIsEdit={setIsEdit}
                                      handleChangeMatch={handleChangeMatch}
                                      deleteMatch={deleteMatch}
                                      venues={venues}
                                      temp={temp}
                                      setTemp={setTemp}
                                      error={error}
                                    />
                                  ) : (
                                    <EditMatch1vsn
                                      match={match}
                                      index={`${date}_${mIndex}`}
                                      competitionType={competitionType}
                                      isEdit={isEdit}
                                      setIsEdit={setIsEdit}
                                      handleChangeMatch={handleChangeMatch}
                                      deleteMatch={deleteMatch}
                                      venues={venues}
                                      temp={temp}
                                      setTemp={setTemp}
                                      error={error}
                                      deleteCompetitor={deleteCompetitor}
                                    />
                                  )}
                                </div>
                              ))}
                            <div>
                              <Button
                                variant="outlined"
                                className={classes.buttonAdd}
                                color="primary"
                                onClick={() => addMatch(date)}
                                disabled={isEdit != null}
                                title={t("button.add_match")}
                              >
                                <AddIcon
                                  style={{
                                    fontSize: 40,
                                  }}
                                />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </DragDropContext>
    </React.Fragment>
  );
});

export default Matches;
