import { Grid } from "@material-ui/core";
import React, { memo, useCallback, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import update from "immutability-helper";

const styleItem = {
    border: "1px solid #000",
    padding: 20,
};

const DragItem = (props) => {
    const { id, name, index } = props;
    return (
        <Draggable key={id} draggableId={id} index={index} type="root">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div style={styleItem}>{name}</div>
                    {provided.placeholder}
                </div>
            )}
        </Draggable>
    );
};

export const DragDrop = memo((props) => {
    const groups = [
        {
            name: "group1",
            id: 1,
            items: [
                {
                    id: "1",
                    name: "Gary Goodspeed 1",
                },
                {
                    id: "2",
                    name: "Gary Goodspeed 2",
                },
            ],
        },
        {
            name: "group2",
            id: 2,
            items: [
                {
                    id: "3",
                    name: "Gary Goodspeed 3",
                },
                {
                    id: "4",
                    name: "Gary Goodspeed 4",
                },
            ],
        },
        {
            name: "group2",
            id: 3,
            items: [],
        },
    ];
    const [characters, setCharacters] = useState(groups);

    const handleOnDragEnd = useCallback(
        (event) => {
            if (event) {
                const destination = event.destination;
                const source = event.source;
                console.log("source", source);
                const item = characters[source.droppableId].items.find(
                    (e) => e.id == event.draggableId
                );
                console.log("item", item);
                if (source.droppableId != destination.droppableId) {
                    setCharacters((pre) =>
                        pre.map((group, grIndex) => {
                            if (grIndex == source.droppableId) {
                                const items = group.items;
                                items.splice(source.index, 1);
                                return {
                                    ...group,
                                    items: items,
                                };
                            }
                            if (grIndex == destination.droppableId) {
                                const items = group.items;
                                items.splice(destination.index, 0, item);
                                return {
                                    ...group,
                                    items: items,
                                };
                            }
                            return { ...group };
                        })
                    );
                } else {
                    setCharacters((pre) =>
                        pre.map((group, grIndex) => {
                            if (grIndex == source.droppableId) {
                                if (source.index >= destination.index) {
                                    const items = group.items.filter(
                                        (it, itIndex) => itIndex != source.index
                                    );
                                    items.splice(destination.index, 0, item);
                                    return {
                                        ...group,
                                        items: items,
                                    };
                                } else {
                                    const items = group.items.filter(
                                        (it, itIndex) => itIndex != source.index
                                    );
                                    items.splice(source.index + 1, 0, item);
                                    return {
                                        ...group,
                                        items: items,
                                    };
                                }
                            } else {
                                return { ...group };
                            }
                        })
                    );
                }
            }
        },
        [characters]
    );
    console.log("characters", characters);
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Grid container spacing={2}>
                {characters.map((group, index) => (
                    <Grid item md={4}>
                        <Droppable droppableId={`${index}`} type="root">
                            {(provided) => (
                                <div
                                    key={index}
                                    className="characters"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {group?.items?.map(
                                        ({ id, name }, itemIndex) => (
                                            <DragItem
                                                id={id}
                                                name={name}
                                                index={itemIndex}
                                                key={itemIndex}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </Grid>
                ))}
            </Grid>
        </DragDropContext>
    );
});

export default DragDrop;
