import React, { memo, useEffect, useMemo, useState } from "react";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import i18n from "../../../i18n/i18n";
import { Grid, IconButton, InputAdornment } from "@material-ui/core";
import { event_type } from "../../../common/constants";
import { makeStyles } from "@material-ui/styles";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  DatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { useTranslation } from "react-i18next";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import Select from "../../../components/form/Select";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import TextInput from "../../../components/form/TextInput";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory, Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const lang = i18n.languages[0];
const grid = 8;
const background = "#e5e5e5";
const useStyles = makeStyles((theme) => ({
  matches: {
    backgroundColor: background,
    borderRadius: 2,
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 2,
    borderRadius: 5,
    transition: "height 0.5s",
    maxWidth: 376,
    "& .action-row": {
      visibility: "collapse",
      opacity: 0,
      height: 0,
      transition: "height 1s,visibility 0s, opacity 0s linear",
    },
    "&:hover": {
      boxShadow:
        "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
      border: "3px outset #2196f3",
      "& .action-row": {
        opacity: 1,
        background: "#fff",
        visibility: "visible",
        border: "1px solid #dedede59",
        left: "0",
        zIndex: 1,
        height: "auto",
      },
    },
  },
  inputcenter: {
    textAlign: "center",
    "& input": {
      textAlign: "center",
    },
  },
  edit: {
    border: "3px outset #2196f3",
    boxShadow:
      "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
  },
  unEdit: {},
  flexVerticalCenter: {
    display: "flex",
    alignItems: "center",
  },
  limit: {
    // display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  backgroundHead: {
    backgroundColor: "#dedede59",
  },
  head: {
    padding: 5,
  },
  error: {
    color: "#f44336",
    fontSize: "0.875rem",
  },
}));

export const Individual = (props) => {
  const { competitor, match, deleteCompetitor } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ marginRight: 5 }}>
          <img
            style={{
              height: 30,
              width: 45.42,
              verticalAlign: "middle",
            }}
            src={
              process.env.MIX_REACT_APP_STORAGE_URL +
              "/" +
              competitor.team.country.flag_url
            }
          />
        </div>
        <div>{`${competitor.family_name} ${competitor.given_name}`}</div>
      </div>
      {match && deleteCompetitor && (
        <div style={{ color: "#ff5353" }}>
          <ClearIcon onClick={() => deleteCompetitor(competitor.id)} />
        </div>
      )}
    </div>
  );
};

export const Team = (props) => {
  const { competitor, match, deleteCompetitor } = props;
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ marginRight: 5 }}>
        <img
          height={30}
          width={45.42}
          src={
            process.env.MIX_REACT_APP_STORAGE_URL +
            "/" +
            competitor?.team?.country.flag_url
          }
        />
      </div>
      <div>
        <span style={{ fontSize: "1rem", fontWeight: 600 }}>{`${
          competitor.name
            ? competitor.name
            : i18n.languages[0] == "vi"
            ? competitor.team.name
            : competitor.team.english_name
        }`}</span>
      </div>
      {match && deleteCompetitor && (
        <div style={{ color: "#ff5353" }}>
          <ClearIcon onClick={() => deleteCompetitor(competitor.id)} />
        </div>
      )}
    </div>
  );
};

export const EditMatch = memo((props) => {
  const {
    match,
    index,
    competitionType,
    isEdit,
    setIsEdit,
    handleChangeMatch,
    deleteMatch,
    venues,
    temp,
    setTemp,
    error,
    deleteCompetitor,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const handleChangeEdit = (val) => {
    if (val) {
      setIsEdit(val);
    } else {
      setIsEdit(null);
      if (!temp.id) {
        deleteMatch(temp.index, true);
      }
    }
  };

  useEffect(() => {
    if (isEdit == index) {
      setTemp(match);
    }
    if (match?.second_date) {
      setActiveSecondDate(true);
    } else {
      setActiveSecondDate(false);
    }
  }, [match, isEdit]);
  const venue = venues.find((e) => e.competitor_venue_id == match.venue_id);
  const [activeSecondDate, setActiveSecondDate] = useState(false);
  const addSecondDate = (active) => {
    if (active == true) {
      setTemp((pre) => ({
        ...pre,
        second_date: null,
      }));
    } else {
      if (temp.second_date == null) {
        setTemp((pre) => ({
          ...pre,
          second_date: pre?.event_date,
        }));
      }
    }
    setActiveSecondDate(!active);
  };
  const View = useMemo(
    (props) => {
      return (
        <div style={{ width: "100%" }}>
          <Grid
            container
            style={{
              marginBottom: grid,
            }}
            className={`${classes.backgroundHead} ${classes.head}`}
            wrap="nowrap"
            justify="space-between"
          >
            <Grid container>
              {match?.name && (
                <Grid
                  item
                  md={12}
                  className={classes.flexVerticalCenter}
                  style={{ marginBottom: 10 }}
                >
                  {match?.name}
                </Grid>
              )}
              <Grid item md={12} className={classes.flexVerticalCenter}>
                <span style={{ color: "#2196f3", marginRight: 5 }}>
                  <InsertInvitationIcon />
                </span>
                {moment(match?.event_date).format("DD/MM/YYYY")}{" "}
                {moment(match?.start_time).format("HH:mm")}
              </Grid>
              {match?.second_date && (
                <Grid item md={12} className={classes.flexVerticalCenter}>
                  {`${t("match_screen.second_date")}: ${moment(
                    match?.second_date
                  ).format("DD/MM/YYYY")}`}
                </Grid>
              )}
              <Grid
                item
                md={12}
                style={{
                  fontSize: "0.875rem",
                }}
                className={`${classes.flexVerticalCenter} ${classes.limit}`}
              >
                <span style={{ color: "#e54949", marginRight: 5 }}>
                  <LocationOnIcon />
                </span>
                {venue?.venue?.name}
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {match.competitors.map((cps, cpIndex) => (
              <Grid item md={6} alignItems="center" style={{ display: "flex" }}>
                <div>
                  {competitionType == event_type.INDIVIDUAL && (
                    <Individual
                      competitor={cps}
                      match={true}
                      // deleteCompetitor={deleteCompetitor}
                    />
                  )}
                  {competitionType == event_type.TEAM && (
                    <Team
                      competitor={cps}
                      match={true}
                      // deleteCompetitor={deleteCompetitor}
                    />
                  )}
                </div>
              </Grid>
            ))}
          </Grid>
          <Grid item container className={`action-row`}>
            <Link to={"/matchSchedule/matchView/" + match?.id}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
            <IconButton
              disabled={isEdit != null && isEdit != index}
              onClick={() => handleChangeEdit(index)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={isEdit != null && isEdit != index}
              onClick={() => deleteMatch(match.index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </div>
      );
    },
    [match, isEdit]
  );
  const Edit = useMemo(
    (props) => {
      return (
        <>
          <Grid
            container
            item
            md={12}
            justify="space-between"
            alignItems="center"
            style={{ marginBottom: 8 }}
            className={`${classes.backgroundHead} ${classes.head}`}
          >
            <Grid item md={12} style={{ marginBottom: 15 }}>
              <TextInput
                value={temp?.name}
                handleChange={(e) =>
                  setTemp((pre) => ({
                    ...pre,
                    name: e,
                  }))
                }
                placeholder={t("match_screen.name")}
                error={error?.name && `* ${error?.name?.[0]}`}
              />
            </Grid>
            <Grid item md={12}>
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                locale={lang}
                libInstance={moment}
              >
                <DateTimePicker
                  format="DD/MM/YYYY HH:mm"
                  ampm={false}
                  inputVariant="standard"
                  size="small"
                  value={moment(
                    moment(temp?.event_date).format("MM/DD/YYYY") +
                      " " +
                      moment(temp?.start_time).format("hh:mm")
                  )}
                  onChange={(e) => {
                    setTemp((pre) => ({
                      ...pre,
                      event_date: e,
                      start_time: e,
                    }));
                  }}
                  // disablePast={true}DateTimePicker
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span style={{ color: "#2196f3" }}>
                          <InsertInvitationIcon />
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  className={classes.inputcenter}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={12}>
              <div>
                <IconButton onClick={() => addSecondDate(activeSecondDate)}>
                  {!activeSecondDate ? <AddIcon /> : <RemoveIcon />}
                </IconButton>
                {t("match_screen.second_date")}
              </div>
              {activeSecondDate && (
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  locale={lang}
                  libInstance={moment}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    ampm={false}
                    inputVariant="standard"
                    size="small"
                    value={moment(temp?.second_date)}
                    onChange={(e) => {
                      setTemp((pre) => ({
                        ...pre,
                        second_date: e,
                      }));
                    }}
                    // disablePast={true}DateTimePicker
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span style={{ color: "#2196f3" }}>
                            <InsertInvitationIcon />
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    className={classes.inputcenter}
                  />
                </MuiPickersUtilsProvider>
              )}
            </Grid>
            <Grid item md={12}>
              <Select
                value={temp?.venue_id}
                options={venues?.map((e, index) => {
                  return {
                    label: e?.venue?.name,
                    value: e.competitor_venue_id,
                  };
                })}
                handleChange={(e) => {
                  setTemp((pre) => ({
                    ...pre,
                    venue_id: e,
                  }));
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ color: "#e54949" }}>
                        <LocationOnIcon />
                      </span>
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
              <Grid item md={12} className={classes.error}>
                {error?.venue_id && `* ${error?.venue_id?.[0]}`}
              </Grid>
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Droppable
              droppableId={`competitorOfMatch_${match.index}`}
              type="competitor"
            >
              {(provided) => (
                <div
                  className="characters"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    minHeight: 100,
                    width: "100%",
                    border: "1px dashed #767676",
                    display: "flex",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Grid container spacing={2}>
                    {temp?.competitors.map((cps, cpIndex) => (
                      <Grid
                        item
                        md={6}
                        alignItems="center"
                        style={{ display: "flex" }}
                      >
                        <div>
                          {competitionType == event_type.INDIVIDUAL && (
                            <Individual
                              competitor={cps}
                              match={true}
                              deleteCompetitor={deleteCompetitor}
                            />
                          )}
                          {competitionType == event_type.TEAM && (
                            <Team
                              competitor={cps}
                              match={true}
                              deleteCompetitor={deleteCompetitor}
                            />
                          )}
                        </div>
                      </Grid>
                    ))}
                    {provided.placeholder}
                  </Grid>
                </div>
              )}
            </Droppable>
          </Grid>
          <Grid item md={12} className={classes.error}>
            {error?.competitors && `* ${error?.competitors?.[0]}`}
          </Grid>
          <Grid
            container
            item
            md={12}
            justify="space-between"
            alignItems="flex-start"
            className={classes.backgroundHead}
          >
            <IconButton
              onClick={() => {
                handleChangeMatch(temp);
              }}
            >
              <DoneIcon />
            </IconButton>
            <IconButton onClick={() => handleChangeEdit(null)}>
              <ClearIcon />
            </IconButton>
          </Grid>
        </>
      );
    },
    [temp, error, activeSecondDate]
  );
  const indexMatchOfDate = index.split("_")[1];
  return isEdit == index && temp ? (
    <Grid
      container
      alignItems="center"
      className={`${classes.box} ${
        isEdit == index ? classes.edit : classes.unEdit
      }`}
    >
      {Edit}
    </Grid>
  ) : (
    <Draggable
      key={match.index}
      draggableId={`match_${match.index}`}
      index={parseInt(indexMatchOfDate)}
      type="match"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Grid
            container
            alignItems="center"
            className={`${classes.box} ${
              isEdit == index ? classes.edit : classes.unEdit
            }`}
          >
            {View}
          </Grid>
        </div>
      )}
    </Draggable>
  );
});

export default EditMatch;
