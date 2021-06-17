import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Grid, Collapse, IconButton } from "@material-ui/core";
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
import i18n from "../../../i18n/i18n";
import EditMatch1vsn from "./EditMatch1vsn";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useDialog } from "../../../components/Dialog";
import { useAPI } from "../../../api/api";

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

export const MatchTable = memo((props) => {
  const {
    // handleOnDragEnd,
    group,
    competitionType,
    venues,
    competitionDate,
    error,
    matchAttendantType,
    refetch,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const [open, setOpen] = useState(true);
  const [isEdit, setIsEdit] = useState(null);
  const [temp, setTemp] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    if (group) {
      setCompetitors(group.group_members);
      //individual
      if (
        competitionType == event_type.INDIVIDUAL &&
        matchAttendantType == match_attendant_type._1VS1
      ) {
        let competitorMatch = (match, mI) => {
          let _competitors = match.competitors.map((cp, cpI) => ({
            key: `match_${cpI + 1}_${mI}`,
            competitor: {
              ...cp,
              event_group_member_id: cp.pivot.event_group_member_id,
            },
          }));
          if (_competitors.length < 2) {
            if (_competitors.length == 1) {
              _competitors[1] = {
                key: "match" + "_2_" + (mI + 1),
                competitor: null,
              };
            } else {
              _competitors = [
                {
                  key: "match" + "_1_" + (mI + 1),
                  competitor: null,
                },
                {
                  key: "match" + "_2_" + (mI + 1),
                  competitor: null,
                },
              ];
            }
          }
          return _competitors;
        };
        setMatches(
          group?.matches.map((e, i) => ({
            ...e,
            competitors: competitorMatch(e, i),
            index: i,
          }))
        );
      }
      if (
        competitionType == event_type.INDIVIDUAL &&
        matchAttendantType == match_attendant_type._1VSN
      ) {
        setMatches(
          group?.matches.map((e, i) => ({
            ...e,
            competitors: e.competitors.map((cp) => ({
              ...cp,
              event_group_member_id: cp.pivot.event_group_member_id,
            })),
            index: i,
          }))
        );
      }
      //team
      if (
        competitionType == event_type.TEAM &&
        matchAttendantType == match_attendant_type._1VS1
      ) {
        let competitorMatch = (match, mI) => {
          let _competitors = match.event_teams.map((cp, cpI) => ({
            key: `match_${cpI + 1}_${mI}`,
            competitor: {
              ...cp,
              event_group_member_id: cp.pivot.event_group_member_id,
            },
          }));
          if (_competitors.length < 2) {
            if (_competitors.length == 1) {
              _competitors[1] = {
                key: "match" + "_2_" + (mI + 1),
                competitor: null,
              };
            } else {
              _competitors = [
                {
                  key: "match" + "_1_" + (mI + 1),
                  competitor: null,
                },
                {
                  key: "match" + "_2_" + (mI + 1),
                  competitor: null,
                },
              ];
            }
          }
          return _competitors;
        };
        setMatches(
          group?.matches.map((e, i) => ({
            ...e,
            competitors: competitorMatch(e, i),
            index: i,
          }))
        );
      }
      if (
        competitionType == event_type.TEAM &&
        matchAttendantType == match_attendant_type._1VSN
      ) {
        setMatches(
          group?.matches.map((e, i) => ({
            ...e,
            competitors: e.event_teams.map((cp) => ({
              ...cp,
              event_group_member_id: cp.pivot.event_group_member_id,
            })),
            index: i,
          }))
        );
      }
    }
  }, [group]);
  useEffect(() => {
    if (isEdit == null) {
      setTemp(null);
      api.fetcher("");
    }
  }, [isEdit]);
  const handleOnDragEnd = useCallback(
    (event) => {
      const droppableId = event.destination.droppableId;
      if (event.type == "competitor") {
        if (droppableId == "competitors") {
          return 0;
        }
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

  const addMatch = (date) => {
    const matchesOfDate = matches.filter((m) => m.event_date == date);
    const mIndex = `${date}_${matchesOfDate.length}`;
    setMatches((pre) => [
      ...pre,
      {
        name: "Match " + (pre.length + 1),
        event_date: date,
        start_time: new Date(),
        end_time: null,
        key: "match_" + matches.length,
        venue_id: null,
        competitors:
          matchAttendantType == match_attendant_type._1VS1
            ? [
                {
                  key: "match" + "_1_" + matches.length,
                  competitor: null,
                },
                {
                  key: "match" + "_2_" + matches.length,
                  competitor: null,
                },
              ]
            : [],
        index: matches.length,
      },
    ]);
    setIsEdit(mIndex);
  };

  const handleChangeMatch = async (val) => {
    try {
      const res = await api.fetcher(
        val?.id ? "put" : "post",
        val?.id ? "/admin/match/" + val?.id : "/admin/match",
        {
          ...val,
          stage_id: group?.stage_id,
          event_group_id: group?.id,
          event_date: moment(val.event_date).format("YYYY-MM-DD"),
          start_time: moment(val.start_time).format("YYYY-MM-DD HH:mm:ss"),
          second_date: val?.second_date
            ? moment(val.second_date).format("YYYY-MM-DD")
            : null,
          match_type: matchAttendantType,
          competitors:
            matchAttendantType == match_attendant_type._1VS1
              ? val?.competitors
                  .map((e) =>
                    e?.competitor
                      ? {
                          competitor_id: e?.competitor?.id,
                          event_group_member_id:
                            e?.competitor.event_group_member_id,
                        }
                      : null
                  )
                  .filter((e) => e != null)
              : val.competitors.map((e) => ({
                  competitor_id: e?.id,
                  event_group_member_id: e?.event_group_member_id,
                })),
        }
      );
      if (res) {
        setIsEdit(null);
        refetch();
      }
    } catch (e) {
      // return false;
    }
  };

  const deleteMatch = async (indexMatch, cancle) => {
    if (!cancle) {
      await dialog({
        title: t("stages_screen.delete.confirm"),
        type: "confirm",
        confirmationText: t("stages_screen.delete.confirm_text"),
        cancellationText: t("stages_screen.delete.cancel_text"),
      });
    }

    if (matches[indexMatch]?.id) {
      try {
        const res = await api.fetcher(
          "delete",
          "/admin/match/" + matches[indexMatch]?.id
        );
        if (res) {
          setMatches((pre) =>
            pre
              .filter((e, i) => i != indexMatch)
              .map((e, i) => ({ ...e, index: i }))
          );
        }
      } catch (e) {}
    } else {
      setMatches((pre) =>
        pre
          .filter((e, i) => i != indexMatch)
          .map((e, i) => ({ ...e, index: i }))
      );
    }
    api.fetcher(null);
  };

  return (
    <React.Fragment>
      <div>
        {group?.name}
        <IconButton onClick={() => setOpen((pre) => !pre)}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <Collapse in={open}>
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
                      <div key={itemIndex}>
                        <DragItem
                          id={"competitor_" + competitor.id}
                          competitor={competitor}
                          index={itemIndex}
                          competitionType={competitionType}
                        />
                      </div>
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
                                .filter((m, mIndex) => m?.event_date == date)
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
                                        error={api?.error}
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
                                        error={api?.error}
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
      </Collapse>
    </React.Fragment>
  );
});

export default MatchTable;
