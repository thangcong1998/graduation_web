import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";

const StaffGroupActive = React.memo((props) => {
    const { error, arr } = props;
    const { t } = useTranslation();
    const [click, setClick] = useState([]);

    useEffect(() => {
      console.log("arr", arr);
    },[arr]);

    const classes = useStyles();

    const handleClick = (id) => {
      
      if(!click.includes(id)){
        click.push(id);
        setClick([...click]);
      }else{
        let arrClick = [];
        arrClick = click.filter((item) => item !== id);
        setClick(arrClick);
        // console.log("arrClick", arrClick);
      }
      
      console.log("click", click);
    }

    return (
      <div>
        <FormControl>
          <FormLabel className={classes.formLabel}>{t('staff_screen.staff_group')  +"*"}</FormLabel>
            <Grid className={classes.grid} container spacing={3}>
              {arr?.map((item, index) => (
              
                <Grid item md={2} sm={2} xs={3} key={index} >
                  <Button   
                  style={click.includes(item.id)?{backgroundColor:'#bbdefb'}:{backgroundColor:'white'}} 
                  onClick={() => handleClick(item.id)} 
                  variant="outlined" 
                  className={classes.button}
                  key={index}>{item.name}</Button>
                </Grid>
            ))}
            </Grid>
        </FormControl>
      </div>
     
    );
  });
  export default StaffGroupActive;

  const useStyles = makeStyles(() => ({
    button:{ 
      textTransform:"capitalize",
    },
    formLabel:{ 
      marginLeft:10,
    },
    grid:{
      padding:20,
    }
}));
