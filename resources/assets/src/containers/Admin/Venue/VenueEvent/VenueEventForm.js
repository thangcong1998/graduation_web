import React, {useEffect, useState} from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import {useAPI, useFetch} from "../../../../api/api";
import {
    Paper,
    Grid,
    Button,
    IconButton,
    TextField
} from "@material-ui/core";
import Autocomplete from "../../../../components/form/Autocomplete";
import {useTranslation} from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MapIcon from '@material-ui/icons/Map';
import stadium from "../../../../assets/image/stadium.png";
import CheckIcon from '@material-ui/icons/Check';
import AddPosition from "./AddPosition";

export default function VenueEventForm() {
    const params = useParams();
    const { t, i18n } = useTranslation();
    const api = useAPI();
    const history = useHistory();
    const [arrayData, setArrayData] = useState([]);
    const {data: data, loading: loading} = useFetch(params?.id ? ['get', 'admin/venue/' + params?.id] : [null, null]);
    useEffect(() => {
        if(data)
        {
            let tempData = [];
            data.venue_relation.map((value, index) => {
                let temp = {
                    event: "",
                    position: [],
                    check: false,
                    error_event: "",
                }
                if(index == 0) {
                    temp.check = true;
                }
                temp.event = value.event;
                value.event_field.map(field => {
                    let temp_field = {
                        field_id: "",
                        name: "",
                        english_name: "",
                        error_name: "",
                        error_english_name: "",
                        edit: false,
                        position: []
                    };
                    temp_field.field_id = field.id;
                    temp_field.name = field.name;
                    temp_field.english_name = field.english_name;
                    field.position_field.map(position => {
                        let temp_position = {
                            position_id: "",
                            name: "",
                            english_name: "",
                            error_name: "",
                            error_english_name: "",
                        }
                        temp_position.position_id = position.id;
                        temp_position.name = position.name;
                        temp_position.english_name = position.english_name;
                        temp_field.position.push(temp_position);
                    })
                    temp.position.push(temp_field);
                })
                tempData.push(temp);
            })
            setArrayData(tempData);
        }
    }, [data]);
    const formik = useFormik({
        initialValues: {
            sport_id: null,
            discipline_id: null,
            event_id: null,
        },

        onSubmit: async (values) => {
            let formData = new FormData();
            formData.append("position", JSON.stringify(arrayData));
            formData.append("venue_id", params?.id ? params?.id : "");
            formData.append("_method", "PUT");
            try {
                let res = await api.fetcher("post", "/admin/venue/" + params?.id, formData);
                if (res) {
                    history.goBack();
                }
            } catch (e) {}
        }
    });
    const addEvent = () => {
        if(formik.values.event_id)
        {
            let tempData = [...arrayData];
            let temp = {
                event: "",
                position: [
                    {
                        name: "",
                        english_name: "",
                        error_name: "",
                        error_english_name: "",
                        edit: true,
                        position: []
                    }
                ],
                check: true,
                error_event: "",
            }
            let check = false;
            tempData.map(value => {
                if(value.event.id == formik.values.event_id.id) {
                    check = true;
                }
            })
            if(check == false) {
                tempData.map(value => {
                    value.check = false;
                })
                temp.event = formik.values.event_id;
                tempData.push(temp);
                setArrayData(tempData);
            }
            formik.setFieldValue("sport_id", null);
            formik.setFieldValue("discipline_id", null);
            formik.setFieldValue("event_id", null);
        }
    };
    const OpenDialog = (index) => {
        let tempArray = [...arrayData];
        tempArray[index].position = [...tempArray[index].position];
        let tempPosition = {
            name: "",
            english_name: "",
            error_name: "",
            error_english_name: "",
            edit: true,
            position: []
        };
        tempArray[index].position.push(tempPosition);
        setArrayData(tempArray);
    }
    const deleteEvent = (index) => {
        arrayData.splice(index, 1);
    }

    const editPosition = (EventIndex, PlaceIndex) => {
        let tempData = [...arrayData];
        tempData[EventIndex].position = [...arrayData[EventIndex].position];
        tempData[EventIndex].position[PlaceIndex].edit = false;
        setArrayData(tempData);
    }
    const deletePlace = (venue, position) => {
        let temp = [...arrayData];
        temp[venue] = {...arrayData[venue]};
        temp[venue].position = [...arrayData[venue].position];
        temp[venue].position.splice(position, 1);
        setArrayData(temp);
    }
    const deletePosition = (venue, place, position) => {
        let temp = [...arrayData];
        temp[venue] = {...arrayData[venue]};
        temp[venue].position = [...arrayData[venue].position];
        temp[venue].position[place].position = [...arrayData[venue].position[place].position];
        temp[venue].position[place].position.splice(position, 1);
        setArrayData(temp);
    }
    const setShowEvent = (id) => {
        let temp = [...arrayData];
        arrayData.map((value, index) => {
            if(value.event.id == id)
            {
                temp[index].check = true;
            } else {
                temp[index].check = false;
            }
        })
        setArrayData(temp);
    }
    const changeEditStatus = (EventIndex, PlaceIndex) => {
        let tempData = [...arrayData];
        tempData[EventIndex].position = [...arrayData[EventIndex].position];
        tempData[EventIndex].position[PlaceIndex].edit = true;
        setArrayData(tempData);
    }
    const changeNamePlace = (value, EventIndex, PlaceIndex) => {
        if(value.length > 255)
        {
            let tempData = [...arrayData];
            tempData[EventIndex].position = [...arrayData[EventIndex].position];
            tempData[EventIndex].position[PlaceIndex].error_name =
                t("position_screen.place_name") +
                " " +
                t("errors.max.before") +
                " 255 " +
                t("errors.max.after");
            tempData[EventIndex].error_event = "";
            setArrayData(tempData);
        } else {
            let tempData = [...arrayData];
            tempData[EventIndex].position = [...arrayData[EventIndex].position];
            tempData[EventIndex].position[PlaceIndex].name = value;
            tempData[EventIndex].position[PlaceIndex].error_name = "";
            tempData[EventIndex].error_event = "";
            setArrayData(tempData);
        }
    }
    const sendData = async () => {
        let tempData = [...arrayData];
        let count = 0;
        arrayData.map((event, eventIndex) => {
            let countEvent = 0;
            event.position.map((place, placeIndex) => {
                place.position.map((position, positionIndex) => {
                    if (position.name == "") {
                        tempData[eventIndex].position[placeIndex].position[positionIndex].error_name = t("position_screen.error_message");
                        count++;
                        countEvent++;
                    }
                })
                if(place.name == "") {
                    tempData[eventIndex].position[placeIndex].error_name = t("position_screen.error_message");
                    tempData[eventIndex].position[placeIndex].edit = true;
                    countEvent++;
                    count++;
                }
            })
            if(countEvent > 0) {
                tempData[eventIndex].error_event = t("position_screen.error_message");
            }
        })
        setArrayData(tempData);
        if(count == 0) {
            let formData = new FormData();
            formData.append("position", JSON.stringify(arrayData));
            formData.append("venue_id", params?.id ? params?.id : "");
            formData.append("_method", "PUT");
            try {
                let res = await api.fetcher("post", "/admin/venue/" + params?.id, formData);
                if (res) {
                    history.goBack();
                }
            } catch (e) {}
        }
    }
    return (
        <Paper style={{ padding: 20}}>
            <Grid container spacing={1}>
                <div style={{ margin: '10px 0px'}}>
                    <h2 style={{ margin: 0 }}><img src={stadium} width={24} height={24} />{" "} {data?.name}</h2>
                    <h4 style={{ margin: 0 }}><LocationOnIcon />{" "}{data?.region?.name}</h4>
                    <i><MapIcon />{" "}{data?.latitude && data?.latitude && (
                        <a
                            target="_blank"
                            alt=""
                            href={`http://www.google.com/maps/place/${data?.latitude},${data?.longtitude}`}
                        >
                            {data?.address}
                        </a>
                    )}</i>
                </div>
            </Grid>
            <hr width={'100%'} />
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={"admin/sport"}
                        queryField={
                            i18n.language == "vi" ? "name_like" : "english_name_like"
                        }
                        labelField={i18n.language == "vi" ? "name" : "english_name"}
                        valueField={"id"}
                        label={t("sport_discipline_screen.sport")}
                        value={formik.values?.sport_id}
                        handleChange={(e) => {
                            formik.setFieldValue("sport_id", e);
                            formik.setFieldValue("discipline_id", null);
                            formik.setFieldValue("event_id", null);
                        }}
                        error={
                            api.error?.sport_id ||
                            (formik.touched.sport_id && formik.errors?.sport_id)
                        }
                        helpText={
                            api.error?.team_id ||
                            (formik.touched.sport_id && formik.errors?.sport_id)
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={
                            formik.values?.sport_id
                                ? "admin/sportDiscipline?sport_id_equal=" +
                                formik.values?.sport_id?.id
                                : ""
                        }
                        queryField={
                            i18n.language == "vi" ? "name_like" : "english_name_like"
                        }
                        labelField={i18n.language == "vi" ? "name" : "english_name"}
                        valueField={"id"}
                        label={t("sport_discipline_screen.sport_discipline")}
                        value={formik.values?.discipline_id}
                        handleChange={(e) => {
                            formik.setFieldValue("discipline_id", e);
                            formik.setFieldValue("event_id", null);
                        }}
                        error={
                            api.error?.discipline_id ||
                            (formik.touched.discipline_id && formik.errors?.discipline_id)
                        }
                        helpText={
                            api.error?.team_id ||
                            (formik.touched.discipline_id && formik.errors?.discipline_id)
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        endpoint={
                            formik.values?.discipline_id
                                ? "admin/sportDisciplineEvent?sport_discipline_id_equal=" +
                                formik.values?.discipline_id?.id
                                : ""
                        }
                        queryField={
                            i18n.language == "vi" ? "name_like" : "english_name_like"
                        }
                        labelField={i18n.language == "vi" ? "name" : "english_name"}
                        valueField={"id"}
                        label={t("sport_discipline_screen.event")}
                        value={formik.values?.event_id}
                        handleChange={(e) => formik.setFieldValue("event_id", e)}
                        error={
                            api.error?.event_id ||
                            (formik.touched.event_id && formik.errors?.event_id)
                        }
                        helpText={
                            api.error?.team_id ||
                            (formik.touched.event_id && formik.errors?.event_id)
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button variant={"contained"} color={"primary"} onClick={() => addEvent()} >{t("position_screen.add_event")}</Button>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: 10}}>
                <Grid item xs={3}>
                    {arrayData.map((value, index) => {
                        return (
                            <div>
                                <div
                                    style={ value.check == true ?
                                        { minHeight: '50px', width: '100%', margin: '5px 0px', border: '#f3f3f3 solid 1px', backgroundColor: '#fcefe5', padding: 10, display: 'flex',justifyContent: "space-between"} :
                                        { minHeight: '50px', width: '100%', margin: '5px 0px', border: '#f3f3f3 solid 1px', padding: 10, display: 'flex',justifyContent: "space-between"}
                                    }
                                    onClick={() => setShowEvent(value.event.id)}>
                                    {value.error_event ?
                                        (<p style={{ fontWeight: "bold", fontSize: '1.3rem', margin: 0, display: 'flex', alignItem: 'center', color:'red'}}>                                        {value.error_event}
                                        </p>) : (
                                            <p style={{ fontWeight: "bold", fontSize: '1.3rem', margin: 0, display: 'flex', alignItem: 'center'}}>
                                                {i18n.language == "vi" ? value?.event?.sport_discipline?.name : value?.event?.sport_discipline?.english_name}{" "}{"/"}{" "}
                                                {i18n.language == "vi" ? value?.event?.name : value?.event?.english_name}
                                            </p>
                                    )}
                                    {value.check == true && (<div>
                                        <IconButton
                                            onClick={() =>
                                                OpenDialog(index)
                                            }
                                            aria-expanded={value.check}
                                            size={"small"}
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                deleteEvent(index)
                                            }
                                            size={"small"}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>)}
                                </div>
                            </div>
                        )
                    })}
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={1}>
                        {arrayData.map((value, index) => {
                            if(value.check == true) {
                                return (
                                    <>
                                        {value.position.map((place, m) => {
                                            return (
                                                <Grid item xs={6} style={{padding: 5}}>
                                                    <div style={{minHeight: '150px', width: '100%', backgroundColor: '#f3f3f3', borderRadius: 5}}>
                                                        <div style={{ display: 'flex',justifyContent: "space-between", padding: 10 }}>
                                                            <div onClick={() => changeEditStatus(index, m)}>
                                                                {place.edit == false ?
                                                                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', display:'flex', alignItems: 'center', textTransform: 'capitalize'}}>
                                                                    {i18n.language == "vi" ? place.name : place.name}
                                                                </p> :
                                                                    <TextField
                                                                        fullWidth={true}
                                                                        label={t("position_screen.place_name")}
                                                                        style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold'}}
                                                                        value={place.name}
                                                                        error={place.error_name}
                                                                        helperText={place.error_name}
                                                                        onChange={(e) => changeNamePlace(e.target.value, index, m)} />}
                                                            </div>
                                                            {place.error_name && place.edit == false && (<p>{place.error_name}</p>)}
                                                            <div style={{ display:'flex', alignItems: 'center'}}>
                                                                <IconButton onClick={() => place.edit == true ? editPosition(index, m) : changeEditStatus(index, m)} style={{ height: 24, width: 24}}>
                                                                    {place.edit == true ? <CheckIcon color={"primary"} /> : <CreateIcon color={"primary"} />}
                                                                </IconButton>
                                                                <IconButton onClick={() => deletePlace(index, m)} style={{ height: 24, width: 24}}>
                                                                    <DeleteIcon color={"secondary"} />
                                                                </IconButton>
                                                            </div>
                                                        </div>
                                                        <div style={{ padding: '0px 20px 20px 20px'}}>
                                                            <b>{t("position_screen.position_name")}</b>
                                                            {place.position.map((value2, index2, arrayInput) => {
                                                                return (
                                                                    <div style={{
                                                                        backgroundColor: '#fff',
                                                                        height: 30,
                                                                        borderRadius: 3,
                                                                        margin: '5px 0px',
                                                                        display:'flex',
                                                                        justifyContent: "space-between"
                                                                    }}>
                                                                        <p style={{
                                                                            fontSize: '1rem',
                                                                            margin: 0,
                                                                            display:'flex',
                                                                            alignItems: 'center',
                                                                            padding: '0px 0px 0px 10px',
                                                                            textOverflow: 'ellipsis',
                                                                            overflow:'hidden'
                                                                        }}
                                                                        >{value2.name}</p>
                                                                        <IconButton onClick={() => deletePosition(index, m, index2)} size={"small"}>
                                                                            <DeleteIcon color={"secondary"} />
                                                                        </IconButton>
                                                                    </div>
                                                                )
                                                            })}
                                                            <AddPosition arrayData={arrayData} setArrayData={setArrayData} EventIndex={index} PlaceIndex={m} />
                                                        </div>
                                                    </div>
                                                </Grid>
                                            )
                                        })}
                                    </>
                                )
                            }
                        })}
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ padding: '10px 0px'}}>
                <Button variant={"contained"} color={"primary"} onClick={() => sendData()}>{t("button.update")}</Button>
            </div>
        </Paper>
    )
}
const useStyle = makeStyles((theme) => ({
    root: {
        padding: 10,
    },
    action: {
        paddingLeft: 10,
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
    h2: {
        color: "#1976d2",
    },
}));
