import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  makeStyles,
  withStyles,
  Typography,
} from "@material-ui/core";
import TextInput from "../../../components/form/TextInput";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import { useTranslation } from "react-i18next";
import { event_distinguish_player_method } from "../../../common/constants";

export default function Individual1vs1(props) {
  const { t, i18n } = useTranslation();
  const { match, individual, setIndividual } = props;
  const classes = useStyle();
  const [rules, setRules] = useState([]);
  console.log({ match }, { rules }, { individual });
  useEffect(() => {
    if (match) {
      let arr_rule = match?.stage?.event?.event_distinguish_player_method?.rules?.split(
        /["]/
      );
      let arr = arr_rule?.filter((e) => e.length > 3);
      let temp = [];
      arr?.map((e, index) => {
        let tem = {
          id: index + 1,
          values: e,
        };
        temp.push(tem);
        setRules(temp);
      });
      setIndividual(match?.match_individual_competitors);
    }
  }, [match]);
  const changeRule = (index, e) => {
    let temp = [...individual];
    temp[index] = { ...individual[index] };
    temp[index].rule = e;
    setIndividual(temp);
  };
  const checkRule = (id, rule_id) => {
    const isChoose = individual?.find((e) => e.rule == rule_id);
    if (!isChoose) {
      return true;
    } else {
      if (isChoose.competitor_id == id) {
        return true;
      }
      return false;
    }
  };

  return (
    <div style={{ with: "100%", display: "flex" }}>
      {individual?.map((value, index) => {
        return (
          <Card className={classes.card}>
            <div style={{ marginBottom: "20px" }} className={classes.div}>
              <Typography
                style={{ marginRight: "10px" }}
                className={classes.text}
              >
                {value?.competitor?.given_name +
                  " " +
                  value?.competitor?.family_name}
              </Typography>
              <img
                height={50}
                width={65}
                src={
                  process.env.MIX_REACT_APP_STORAGE_URL +
                  "/" +
                  value?.competitor?.team?.country?.flag_url
                }
              />
            </div>
            {match?.stage?.event?.event_distinguish_player_method?.method_id ==
            event_distinguish_player_method.CUSTOM ? (
              <div className={classes.div}>
                <FormControl style={{ width: "50%" }}>
                  <Select
                    input={<Input />}
                    variant="outlined"
                    onChange={(e) => changeRule(index, e.target.value)}
                    value={`${value?.rule}`}
                  >
                    <MenuItem value={null}>---</MenuItem>
                    {rules
                      ?.filter((e) => checkRule(value.competitor_id, e?.id))
                      ?.map((e, i) => {
                        return <MenuItem value={e?.id}>{e?.values}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

const useStyle = makeStyles((theme) => ({
  card: {
    padding: 30,
    backgroundColor: "#a5d6a7",
    width: "50%",
    margin: 15,
  },
  text: {
    fontSize: "1.75rem",
    fontFamily: "math",
    fontWeight: "bold",
  },
  div: {
    display: "flex",
    justifyContent: "center",
  },
  position: {
    fontSize: "1.2rem",
  },
}));
const Input = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    border: "1px solid #0000003b",
    fontSize: 16,
    padding: "11px 14px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      border: "2px solid #80bdff",
    },
  },
}))(InputBase);
