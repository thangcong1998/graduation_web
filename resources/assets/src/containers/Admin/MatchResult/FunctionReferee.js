import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import Autocomplete from "../../../components/form/Autocomplete";
import { useFetch } from "../../../api/api";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import SearchIcon from "@material-ui/icons/Search";

export default function FunctionReferee(props) {
  const classes = useStyle();
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState();
  const {
    match,
    referFunc,
    setReferFunc,
    params,
    setParams,
    referee,
    arrRef,
    setArrRef,
  } = props;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState({});
  const [search1, setSearch1] = useState({});
  const [search2, setSearch2] = useState({});

  useEffect(() => {
    if (match?.stage?.event?.referee) {
      let temp = { ...params };
      temp.event_id = match?.stage?.event_id;
      setParams(temp);
    }
  }, [match?.stage?.event?.referee, match?.match_referee_relations]);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (match) {
      let array_function = [];
      match?.stage?.event?.function_referee?.map((value) => {
        let temp = {
          id: value.id,
          name: value.name,
          english_name: value.english_name,
          referee: {},
        };
        match?.match_referee_relations?.map((item, i) => {
          if (item.referee_role_id == value.id) {
            temp.referee = item.referee;
          }
        });
        array_function.push(temp);
      });
      setReferFunc(array_function);
    }
  }, [match]);

  const handleClickOpen = (index) => {
    setIndex(index);
    setOpen(true);
  };
  const chooseReferee = (val) => {
    let temp = [...referFunc];
    temp[index] = { ...referFunc[index] };
    temp[index].referee = val;
    setReferFunc(temp);
    let tem = [];
    temp?.map((item) => {
      if (item?.referee?.id) {
        tem.push(item?.referee?.id);
      }
    });
    let temParams = { ...params };
    temParams.id = JSON.stringify(tem);
    setParams(temParams);
    setOpen(false);
  };

  const handleSearch = (value) => {
    setSearch(value);
    let temp = { ...params };
    if (value?.id) {
      temp.nationality_id_equal = value.id;
    } else {
      temp.nationality_id_equal = null;
    }
    setParams(temp);
  };
  const searchName = (value) => {
    setSearch1(value);
    let temp = { ...params };
    if (value) {
      temp.name = value;
    } else {
      temp.name = null;
    }
    setParams(temp);
  };
  const searchAd = (value) => {
    setSearch2(value);
    let temp = { ...params };
    if (value) {
      temp.accreditation_number_like = value;
    } else {
      temp.accreditation_number_like = null;
    }
    setParams(temp);
  };
  const removeReferee = (index) => {
    let temp = [...referFunc];
    let tempParams = JSON.parse(params.id);
    let tem = { ...params };
    const ids = tempParams?.filter((item) => item !== temp[index].referee.id);
    tem.id = JSON.stringify(ids);
    setParams(tem);
    temp[index] = { ...referFunc[index] };
    temp[index].referee = null;
    setReferFunc(temp);
  };

  return (
    <div>
      <Typography className={classes.typo}>
        <i>{t("match_result_screen.referee")}</i>
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {referFunc?.map((value, index) => {
          return (
            <div style={{ margin: 11 }}>
              <Typography className={classes.text_referee}>
                {i18n.language == "vi" ? value?.name : value.english_name}
              </Typography>
              <div
                className={classes.referee}
                onClick={() => handleClickOpen(index)}
              >
                <div className={classes.icon}>
                  {!referFunc[index]?.referee?.given_name ? (
                    <AddIcon />
                  ) : (
                    <div style={{ with: "100%" }}>
                      <img
                        className={classes.img}
                        height={30}
                        width={45.42}
                        src={
                          process.env.MIX_REACT_APP_STORAGE_URL +
                          "/" +
                          referFunc[index]?.referee?.nationality?.flag_url
                        }
                      />
                      <Typography className={classes.name}>
                        {(
                          referFunc[index]?.referee.given_name +
                          " " +
                          referFunc[index]?.referee.family_name
                        ).length > 15
                          ? (
                              referFunc[index]?.referee.given_name +
                              " " +
                              referFunc[index]?.referee.family_name
                            ).slice(0, 15) + "..."
                          : referFunc[index]?.referee.given_name +
                            " " +
                            referFunc[index]?.referee.family_name}
                      </Typography>
                      <IconButton onClick={() => removeReferee(index)}>
                        <HighlightOffOutlinedIcon color="secondary" />
                      </IconButton>
                    </div>
                  )}
                </div>
              </div>
              {!referFunc[index]?.referee?.id ? (
                <Typography className={classes.error}>
                  {t("match_result_screen.referee") +
                    " " +
                    t("errors.required")}
                </Typography>
              ) : null}
            </div>
          );
        })}
        <Dialog open={open} onClose={handleClose}>
          <div className={classes.dialog}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.rowHeader}>
                  <TableCell
                    className={classes.tableRe}
                    style={{
                      width: "30%",
                    }}
                  >
                    Ad no
                  </TableCell>
                  <TableCell
                    className={classes.tableRe}
                    style={{
                      width: "30%",
                    }}
                  >
                    {t("member_registration.nationality")}
                  </TableCell>
                  <TableCell
                    className={classes.tableRe}
                    style={{
                      width: "40%",
                    }}
                  >
                    {t("match_result_screen.referee_name")}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: "#e8f5e9" }}>
                  <TableCell
                    className={classes.tableRe}
                    style={{
                      width: "30%",
                    }}
                  >
                    <TextField
                      className={classes.textField}
                      style={{ width: "100%" }}
                      label={"Ad no"}
                      onChange={(e) => searchAd(e.target.value)}
                      value={search2?.accreditation_number}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              style={{
                                color: "#0000008a",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell
                    className={classes.tableRe}
                    style={{
                      width: "30%",
                    }}
                  >
                    <Autocomplete
                      className={classes.textField}
                      label={t("member_registration.nationality")}
                      variant="standard"
                      queryField={"name_like"}
                      labelField={"name"}
                      endpoint="/admin/country"
                      handleChange={(e) => handleSearch(e)}
                      value={search}
                    />
                  </TableCell>
                  <TableCell
                    className={classes.tableRe}
                    style={{
                      width: "40%",
                    }}
                  >
                    <TextField
                      className={classes.textField}
                      style={{ width: "100%" }}
                      label={t("match_result_screen.referee_name")}
                      onChange={(e) => searchName(e.target.value)}
                      value={search1?.name}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              style={{
                                color: "#0000008a",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              {arrRef?.length > 0 ? (
                arrRef?.map((val, index) => {
                  return (
                    <TableBody>
                      <TableRow
                        className={classes.row}
                        onClick={() => chooseReferee(val)}
                      >
                        <TableCell
                          style={{
                            width: "30%",
                          }}
                          className={classes.cell}
                        >
                          {val?.accreditation_number}
                        </TableCell>
                        <TableCell
                          style={{
                            width: "30%",
                          }}
                          className={classes.cell}
                        >
                          <img
                            style={{
                              float: "left",
                              marginRight: 10,
                            }}
                            height={30}
                            width={45.42}
                            src={
                              process.env.MIX_REACT_APP_STORAGE_URL +
                              "/" +
                              val?.nationality?.flag_url
                            }
                          />
                        </TableCell>
                        <TableCell
                          style={{
                            width: "40%",
                          }}
                          className={classes.cell}
                        >
                          {val?.given_name + " " + val?.family_name}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className={classes.empty} colSpan={3}>
                    {t("match_result_screen.no_data")}
                  </TableCell>
                </TableRow>
              )}
            </Table>
            <Button
              style={{ float: "right", marginTop: 10 }}
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              {t("match_result_screen.cancel")}
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  rowHeader: {
    backgroundColor: "#43a047",
  },
  row: {
    width: "100%",
    "&:hover": {
      background: " #c8e6c9",
    },
  },
  empty: {
    width: "100%",
    textAlign: "center",
    fontSize: "1rem",
  },
  tableRe: {
    fontSize: 20,
    color: "white",
    fontFamily: "initial",
    lineHeight: 0.8,
  },
  cell: {
    fontSize: 18,
    cursor: "pointer",
  },
  typo: {
    fontFamily: "initial",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 5,
  },
  referee: {
    cursor: "pointer",
    backgroundColor: "white",
    width: 310,
    minHeight: 50,
    borderRadius: 5,
    border: "2px dashed #0000003b",
    "&:hover": {
      border: "2px dashed #1b5e20",
    },
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    padding: 11,
    backgroundColor: "#dcedc8",
  },
  text_referee: {
    fontSize: "1.25rem",
    textAlign: "center",
    marginBottom: 5,
  },
  dialog: {
    width: 600,
    padding: 20,
  },
  name_referee: {
    fontSize: "1.25rem",
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#e8f5e9",
    cursor: "pointer",
    padding: "5px 15px",
    "&:hover": {
      backgroundColor: "#c8e6c9",
    },
  },
  textField: {
    "& label.Mui-focused": {
      color: "green",
    },
  },
  img: {
    float: "left",
    marginRight: 10,
    marginTop: 10,
  },
  name: {
    float: "left",
    marginTop: 10,
    fontSize: "1.2rem",
  },
  error: {
    color: "#f44336",
    margin: "4px 14px 0px 14px",
    fontSize: "14px",
  },
}));
