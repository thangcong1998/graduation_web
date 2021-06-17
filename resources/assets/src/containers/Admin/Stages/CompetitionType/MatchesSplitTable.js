import React, { memo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Grid } from "@material-ui/core";
import { event_type } from "../../../../common/constants";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { Individual, Team, EditMatch } from "../EditMatch";

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
    matches: {
        backgroundColor: background,
        borderRadius: 2,
    },
    box: {
        backgroundColor: "#ffffff",
        padding: grid,
        borderRadius: 2,
    },
}));

const DragItem = (props) => {
    const { id, competitor, index, competitionType } = props;
    return competitor?.group_member?.map((e, indexGroupMember) => (
        <Draggable
            key={e?.id}
            draggableId={`${e?.id}`}
            index={indexGroupMember}
            type="root"
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={styleItem(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                >
                    {provided.placeholder}
                    {competitionType == event_type.INDIVIDUAL && (
                        <Individual competitor={competitor} />
                    )}
                    {competitionType == event_type.TEAM && (
                        <Team competitor={e} />
                    )}
                </div>
            )}
        </Draggable>
    ));
};

export const MatchesSplitTable = memo((props) => {
    const {
        handleOnDragEnd,
        addMatch,
        competitors,
        matches,
        competitionType,
        deleteCompetitor,
        handleChangeMatch,
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const [isEdit, setIsEdit] = useState(null);
    return (
        <React.Fragment>
            <Button onClick={addMatch}>{t("button.add_match")}</Button>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        {competitors?.map((competitor, groupIndex) => (
                            <Droppable
                                droppableId={`competitors_${groupIndex}`}
                            >
                                {(provided) => (
                                    <div
                                        className="characters"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        style={{
                                            borderRadius: 5,
                                            padding: 10,
                                            backgroundColor: background,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {provided.placeholder}
                                        <div>
                                            {competitionType == event_type.TEAM
                                                ? t("text.group_A")
                                                : t("text.group_B")}
                                        </div>

                                        <DragItem
                                            id={"competitor_" + competitor.id}
                                            competitor={competitor}
                                            index={groupIndex}
                                            competitionType={competitionType}
                                        />
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </Grid>
                    <Grid item md={9}>
                        <Grid className={`${classes.matches}`} container>
                            {matches.map((match, index) => (
                                <Grid
                                    style={styleMatch()}
                                    key={index}
                                    item
                                    md={6}
                                >
                                    <EditMatch
                                        match={match}
                                        index={index}
                                        competitionType={competitionType}
                                        isEdit={isEdit}
                                        setIsEdit={setIsEdit}
                                        handleChangeMatch={handleChangeMatch}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </DragDropContext>
        </React.Fragment>
    );
});

export default MatchesSplitTable;
