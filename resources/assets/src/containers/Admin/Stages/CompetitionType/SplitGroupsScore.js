import { Card, Grid, Button, IconButton, TextField } from "@material-ui/core";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAPI, useFetch } from "../../../../api/api";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { event_type, DragdropColors } from "../../../../common/constants";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "../../../../components/DialogMui";
import TextInput from "../../../../components/form/TextInput";
import ButtonUpdate from "../../../../components/button/ButtonUpdateSolashi";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "nowrap",
  },
  competitors: {
    minWidth: 300,
    maxWidth: 450,
    marginRight: 8,
    backgroundColor: "#e5e5e5",
    padding: 5,
  },
  groups: {
    overflow: "auto",
  },
  group: {
    minWidth: 400,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  columnBackground: {
    backgroundColor: "#ebecf0",
  },
  spacingColumn: {
    borderRight: "8px solid #ffffff",
    verticalAlign: "top",
  },
  headGroup: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  listCompetitor: {
    height: "100%",
  },
}));

const AddGroup = (props) => {
  const { close, addGroup, refetch } = props;
  const [name, setName] = useState(null);
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  const api = useAPI();
  const params = useParams();
  const submit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.fetcher("post", "/admin/event_group", {
        name: name,
        count: count,
        stage_id: params?.id,
      });
      if (res) {
        addGroup({
          id: res?.id,
          name: name,
          count: count,
          stage_id: params?.id,
          group_members: [],
        });
        refetch();
        close();
      }
    } catch (e) {}
  };
  return (
    <form onSubmit={submit}>
      <TextInput
        label={t("group_screen.name")}
        value={name}
        handleChange={(e) => setName(e)}
        error={api.error?.name}
      />
      <Button
        variant="text"
        color="primary"
        style={{ marginTop: 10 }}
        type="submit"
      >
        OK
      </Button>
    </form>
  );
};

const Edit = (props) => {
  const { group, setEdit, setGroups, setTempGroups } = props;
  const [temp, setTemp] = useState(group);
  const api = useAPI();
  const classes = useStyles();
  const handleDoneEdit = async (event) => {
    event.preventDefault();
    try {
      let res = await api.fetcher("put", "/admin/event_group/" + group?.id, {
        name: temp?.name,
      });
      if (res) {
        setEdit(null);
        setGroups((pre) =>
          pre.map((g) => {
            if (g.id == group.id) {
              return { ...g, name: temp.name };
            }
            return { ...g };
          })
        );
      }
    } catch (e) {}
  };
  return (
    <div>
      <form onSubmit={handleDoneEdit} className={classes.headGroup}>
        <TextInput
          variant="standard"
          defaultValue={temp?.groups?.name}
          size="small"
          value={temp?.name}
          error={api.error?.name}
          handleChange={(e) => setTemp((pre) => ({ ...pre, name: e }))}
        />
        <IconButton type="submit">
          <DoneIcon />
        </IconButton>
      </form>
    </div>
  );
};

const DragItem = (props) => {
  const {
    id,
    competitor,
    index,
    country,
    group,
    droppableId,
    competitionType,
    isDragDisabled,
  } = props;
  const styleItem = {
    // border: "1px solid #000",
    padding: 10,
    display: "flex",
    background: "white",
    borderRadius: 2,
    marginBottom: 10,
  };
  const { i18n } = useTranslation();
  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      type="competitor"
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Grid style={styleItem} alignItems="center">
            <img
              src={process.env.MIX_REACT_APP_STORAGE_URL + "/" + country}
              width="46px"
              height="30px"
              style={{
                marginRight: 10,
              }}
            />
            <Grid
              style={{
                marginTop: 2,
                textAlign: "center",
              }}
            >
              {competitionType == event_type.INDIVIDUAL ? (
                `${competitor.family_name} ${competitor.given_name}`
              ) : (
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {competitor.name
                    ? competitor.name
                    : i18n.languages[0] == "vi"
                    ? competitor.team.name
                    : competitor.team.english_name}
                </span>
              )}
            </Grid>
            {/* {group && (
                                  <Grid
                                      xs={2}
                                      item
                                      style={{ textAlign: "end" }}
                                  >
                                      <HighlightOffIcon
                                          onClick={() =>
                                              deleteGroups(index, droppableId)
                                          }
                                      />
                                  </Grid>
                              )} */}
          </Grid>
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
};
export const SplitGrooupsScore = memo((props) => {
  const {
    competitors,
    groups,
    setCompetitors,
    setGroups,
    event,
    refetch,
    disabledEdit,
  } = props;
  const _competitors =
    event?.competition_type == event_type.INDIVIDUAL
      ? event?.participant
      : event?.event_team;
  const api = useAPI();
  const params = useParams();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [tempGroups, setTempGroups] = useState([]);
  const [tempCompetitors, setTempCompetitors] = useState([]);
  useEffect(() => {
    setTempGroups(groups);
  }, [groups]);
  useEffect(() => {
    setTempCompetitors(competitors);
  }, [competitors]);
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        const res = api.fetcher("put", "/admin/stageGroup/" + params?.id, {
          groups: tempGroups,
        });
        if (res) {
          console.log("thanhcong");
          refetch();
        }
      } catch (e) {}
    },
  });
  const deleteGroup = async (groupId) => {
    try {
      const res = await api.fetcher("delete", "admin/event_group/" + groupId);
      if (res) {
        setTempGroups((pre) => pre.filter((e) => e.id != groupId));
        refetch();
      }
    } catch (e) {}
  };

  const [edit, setEdit] = useState(null);

  const handleAddGroup = (group) => {
    setTempGroups((pre) => [
      ...pre,
      { ...group, color: (pre.length + 1) % 10 },
    ]);
  };

  const handleEditNameGroups = (index) => {
    setEdit(index);
  };

  const handleOnDragEnd = useCallback(
    (drop) => {
      const destinationId = drop?.destination?.droppableId;
      const sourceId = drop.source.droppableId;
      const competitor_id = drop.draggableId.split("_")[1];
      const item = _competitors.find((e) => e.id == competitor_id);
      if (drop.type == "competitor" && drop.destination) {
        if (sourceId == "competitor" && destinationId != "competitor") {
          setTempCompetitors((pre) => pre.filter((e) => e.id != item.id));
          setTempGroups((pre) =>
            pre.map((g, gI) => {
              if (gI == destinationId) {
                return {
                  ...g,
                  group_members: [...g.group_members, item],
                };
              }
              return { ...g };
            })
          );
        } else {
          if (sourceId != destinationId) {
            setTempGroups((pre) =>
              pre.map((g, gI) => {
                if (gI == sourceId) {
                  return {
                    ...g,
                    group_members: [
                      ...g.group_members.filter((e) => e.id != item.id),
                    ],
                  };
                }
                if (gI == destinationId) {
                  return {
                    ...g,
                    group_members: [...g.group_members, item],
                  };
                }
                return { ...g };
              })
            );
          }
          if (sourceId != "competitor" && destinationId == "competitor") {
            setTempCompetitors((pre) => [...pre, item]);
          }
        }
      }
    },
    [tempCompetitors, tempGroups]
  );

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Dialog
          title={t("group_screen.add_group")}
          fullWidth={false}
          content={(close) => (
            <AddGroup
              close={close}
              addGroup={handleAddGroup}
              refetch={refetch}
            />
          )}
        >
          <Button variant="outlined" color="primary" disabled={edit != null}>
            {t("group_screen.add_group")}
          </Button>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Grid className={classes.container}>
          <Grid item className={classes.competitors}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              {event?.competition_type == event_type.INDIVIDUAL
                ? t("text.competitors")
                : t("text.NOC")}
            </div>
            <div style={{ height: "100%" }}>
              <Droppable droppableId={`competitor`} type="competitor">
                {(provided) => (
                  <div
                    className={classes.listCompetitor}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tempCompetitors?.map((e, itemIndex) => (
                      <DragItem
                        id={`competitor_${e?.id}`}
                        competitor={e}
                        index={itemIndex}
                        key={itemIndex}
                        country={e?.team?.country?.flag_url}
                        competitionType={event?.competition_type}
                        isDragDisabled={edit != null || disabledEdit}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </Grid>
          <Grid className={classes.groups}>
            <table
              className={classes.tableGroup}
              cellSpacing="0"
              cellPadding="0"
            >
              {/* Head */}
              <thead>
                <tr>
                  {tempGroups.map((group, groupIndex) => (
                    <td
                      className={`${classes.group} ${classes.spacingColumn}`}
                      key={groupIndex}
                    >
                      <div
                        className={`${classes.columnBackground}`}
                        style={{
                          padding: 8,
                          backgroundColor: DragdropColors[group?.color],
                        }}
                      >
                        {edit == groupIndex ? (
                          <Edit
                            group={group}
                            setEdit={setEdit}
                            setGroups={setGroups}
                            setTempGroups={setTempGroups}
                          />
                        ) : (
                          <div className={classes.headGroup}>
                            <span>{group?.name}</span>
                            {disabledEdit ? (
                              <span></span>
                            ) : (
                              <span>
                                <IconButton
                                  style={{
                                    marginTop: -8,
                                  }}
                                  onClick={() =>
                                    handleEditNameGroups(groupIndex)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  style={{
                                    marginTop: -8,
                                  }}
                                  onClick={() => deleteGroup(group?.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              {/* group */}
              <tbody>
                <tr>
                  {tempGroups.map((group, groupIndex) => (
                    <td className={`${classes.spacingColumn}`}>
                      <Droppable
                        droppableId={`${groupIndex}`}
                        type="competitor"
                      >
                        {(provided) => (
                          <div
                            className="characters"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: "#ebecf0",
                              padding: 10,
                              minHeight: 90,
                            }}
                          >
                            {group?.group_members?.map((e, cpIndex) => (
                              <DragItem
                                id={`competitor_${e?.id}`}
                                competitor={e}
                                index={cpIndex}
                                key={cpIndex}
                                country={e?.team?.country?.flag_url}
                                competitionType={event?.competition_type}
                                droppableId={groupIndex}
                                isDragDisabled={edit != null || disabledEdit}
                              />
                            ))}
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
      <div
        style={{
          marginTop: 10,
        }}
      >
        {!api.loading == true && (
          <ButtonUpdate
            variant="contained"
            loading={api.loading}
            // text={i18n.t("sport_screen.user")}
            onClick={formik.handleSubmit}
            disabled={disabledEdit || api.loading == true}
          />
        )}
      </div>
    </div>
  );
});

export default SplitGrooupsScore;
