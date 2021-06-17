import React, {useState} from "react";
import {
    Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
    Button, Grid, TextField, InputAdornment
} from "@material-ui/core";
import Autocomplete from "../../../../../components/form/Autocomplete";
import TimeFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";

export default function ErrorDialog({open, setOpen, member, setMember, index}) {
    const [time, setTime] = useState(null);
    const [score, setScore] = useState(null);
    const [foul, setFoul] = useState(null);
    const [referee, setReferee] = useState(null);
    const [description, setDescription] = useState(null);
    console.log(time, score, foul, referee, description)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addError = () => {
        let temp = [...member];
        temp[index] = {...member[index]};
        let tempError = {
            time: '',
            score: '',
            foul: '',
            referee: '',
            description: '',
            check: false,
        };
        tempError.time = time;
        tempError.score = score;
        tempError.foul = foul;
        tempError.referee = referee;
        tempError.description = description;
        if(temp[index].error) {
            temp[index].error.push(tempError);
        } else {
            temp[index].error = [];
            temp[index].error.push(tempError);
        }
        setMember(temp);
        setOpen(false);
        setDescription("");
        setTime(new Date());
        setReferee("");
        setScore("");
        setFoul("");
    }
    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Error"}</DialogTitle>
                <DialogContent >
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={TimeFnsUtils}>
                                <TimePicker
                                    clearable
                                    ampm={false}
                                    views={["hours", "minutes", "seconds"]}
                                    format="HH:mm:ss"
                                    label={"Time"}
                                    inputVariant="outlined"
                                    size="small"
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e);
                                    }}
                                    style={{ width: "100%" }}
                                    // error={
                                    //     (formik.touched.end_time && formik.errors?.end_time) ||
                                    //     api.error?.end_time
                                    // }
                                    // helperText={
                                    //     (formik.touched.end_time && formik.errors?.end_time) ||
                                    //     api.error?.end_time
                                    // }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <WatchLaterOutlinedIcon style={{ color: "#0000008a" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            {/*<TextField variant={"outlined"} value={time} onChange={(e) => setTime(e.target.value)} size={'small'} fullWidth label={'Time'} />*/}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField variant={"outlined"} value={score} onChange={(e) => setScore(e.target.value)} size={'small'} fullWidth label={'Score'} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant={"outlined"} value={foul} onChange={(e) => setFoul(e.target.value)} size={'small'} fullWidth label={'Foul'} />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                endpoint={"admin/referee"}
                                queryField={'name_like'}
                                labelField={"name"}
                                valueField={"id"}
                                label={"Referee"}
                                value={referee}
                                handleChange={(e) => setReferee(e)}
                                // handleChange={(e) => {
                                //     formik.setFieldValue("discipline_id", e);
                                //     formik.setFieldValue("event_id", null);
                                // }}
                                // error={
                                //     api.error?.discipline_id ||
                                //     (formik.touched.discipline_id && formik.errors?.discipline_id)
                                // }
                                // helpText={
                                //     api.error?.team_id ||
                                //     (formik.touched.discipline_id && formik.errors?.discipline_id)
                                // }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant={"outlined"} value={description} onChange={(e) => setDescription(e.target.value)} size={'small'} fullWidth label={'Description'} rows={4} multiline />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color={"secondary"} variant={"contained"}>
                        Cancel
                    </Button>
                    <Button onClick={addError} color="primary" variant={"contained"}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
