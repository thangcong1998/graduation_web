import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";
import {TextField, IconButton} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useTranslation} from "react-i18next";

export default function AddPosition ({arrayData, setArrayData, EventIndex, PlaceIndex}) {
    const {t, i18n} = useTranslation();
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState();

    const addTag = (e) => {
        if(e.key === 'Enter') {
            let tempArray = e.target.value.split("");
            let totalSpace = 0;
            tempArray.map(value => {
                if(value == " ") {
                    totalSpace = totalSpace + 1;
                }
            })
            if(e.target.value !== '' && totalSpace != tempArray?.length && e.target.value.length < 255) {
                let tempData = [...arrayData];
                tempData[EventIndex].position = [...arrayData[EventIndex].position];
                tempData[EventIndex].position[PlaceIndex].position = [...arrayData[EventIndex].position[PlaceIndex].position];
                let temp = {name: '',english_name: 'ABC', error_name: "", error_english_name: ""};
                temp.name = e.target.value;
                setTagInput('');
                tempData[EventIndex].position[PlaceIndex].position.push(temp);
                setArrayData(tempData);
                setError(null);
            }
        if(e.target.value !== '' && totalSpace != tempArray?.length && e.target.value.length > 255) {
            setError(
                t("position_screen.add_position") +
                " " +
                t("errors.max.before") +
                " 255 " +
                t("errors.max.after"))
        }
        }
    };
    console.log(error);
    const showTagInput = (e) => {
        setTagInput(e.target.value);
    };
    return (
        <div>
            <div>
                <TextField
                    label={t("position_screen.add_position")}
                    type={'text'}
                    onKeyDown={e => addTag(e)}
                    size={"small"}
                    fullWidth={true}
                    onChange={e => showTagInput(e)}
                    value={tagInput}
                    error={error}
                    helperText={error}
                    className={'form-control'}
                />
            </div>
        </div>
    );
}
