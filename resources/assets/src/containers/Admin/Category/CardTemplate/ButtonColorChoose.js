import React, {useState} from "react";
import {
    Button,
    ButtonGroup,
    TextField
} from "@material-ui/core";

export default function ButtonColorChoose ({ color, setColor, text, error}) {
    const changeColor = (value) => {
        setColor(value);
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap'}}>
            <div>
                <div style={{ padding: '0px 0px 20px 0px'}}>
                    <TextField value={color || ''} onChange={(e) => changeColor(e.target.value)} label={text} error={error} helperText={error} />
                </div>
                <ButtonGroup orientation="vertical"
                             aria-label="vertical outlined button group">
                    <ButtonGroup aria-label="outlined button group">
                        <Button onClick={() => changeColor('#000000')} style={{ width: 50, height: 50, backgroundColor: "#000000"}} />
                        <Button onClick={() => changeColor('#FF0000')} style={{ width: 50, height: 50, backgroundColor: "#FF0000"}} />
                        <Button onClick={() => changeColor('#0000FF')} style={{ width: 50, height: 50, backgroundColor: "#0000FF"}} />
                        <Button onClick={() => changeColor('#008000')} style={{ width: 50, height: 50, backgroundColor: "#008000"}} />
                    </ButtonGroup>
                    <ButtonGroup  aria-label="outlined button group">
                        <Button onClick={() => changeColor('#A52A2A')} style={{ width: 50, height: 50, backgroundColor: "#A52A2A"}} />
                        <Button onClick={() => changeColor('#FF4500')} style={{ width: 50, height: 50, backgroundColor: "#FF4500"}} />
                        <Button onClick={() => changeColor('#87CEFA')} style={{ width: 50, height: 50, backgroundColor: "#87CEFA"}} />
                        <Button onClick={() => changeColor('#00FF7F')} style={{ width: 50, height: 50, backgroundColor: "#00FF7F"}} />
                    </ButtonGroup>
                    <ButtonGroup aria-label="outlined button group">
                        <Button onClick={() => changeColor('#BC8F8F')} style={{ width: 50, height: 50, backgroundColor: "#BC8F8F"}} />
                        <Button onClick={() => changeColor('#FFA500')} style={{ width: 50, height: 50, backgroundColor: "#FFA500"}} />
                        <Button onClick={() => changeColor('#B0C4DE')} style={{ width: 50, height: 50, backgroundColor: '#B0C4DE'}} />
                        <Button onClick={() => changeColor('#800080')} style={{ width: 50, height: 50, backgroundColor: "#800080"}} />
                    </ButtonGroup>
                    <ButtonGroup aria-label="outlined button group">
                        <Button onClick={() => changeColor('#C0C0C0')} style={{ width: 50, height: 50, backgroundColor: "#C0C0C0"}} />
                        <Button onClick={() => changeColor('#FFFF00')} style={{ width: 50, height: 50, backgroundColor: "#FFFF00"}} />
                        <Button onClick={() => changeColor('#7FFFD4')} style={{ width: 50, height: 50, backgroundColor: '#7FFFD4'}} />
                        <Button onClick={() => changeColor('#FFC0CB')} style={{ width: 50, height: 50, backgroundColor: "#FFC0CB"}} />
                    </ButtonGroup>
                </ButtonGroup>
            </div>
        </div>
    )
}
