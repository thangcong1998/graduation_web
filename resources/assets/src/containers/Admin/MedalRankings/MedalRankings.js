import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  IconButton,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState, useMemo } from "react";
import { useAPI, useFetch } from "../../../api/api";
import hcv from "./gold_medal.png";
import hcb from "./silver_medal.png";
import hcd from "./bronze_medal.png";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  tableCell: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: "1.15rem",
  },
  gold_medal: {
    textAlign: "center",
    color: "white",
    backgroundColor: "#e2b80f",
    fontWeight: 600,
    fontSize: "1.15rem",
  },
  bronze_medal: {
    textAlign: "center",
    color: "white",
    backgroundColor: "#a96d34",
    fontWeight: 600,
    fontSize: "1rem",
  },
  silver_medal: {
    textAlign: "center",
    color: "white",
    backgroundColor: "#cec9c9",
    fontWeight: 600,
    fontSize: "1rem",
  },
  total_medal: {
    textAlign: "center",
    color: "white",
    backgroundColor: "#2196f3",
    fontWeight: 600,
    fontSize: "1rem",
  },
  rank_no: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: "1rem",
  },
  textField: {
    width: "15%",
    "& input": {
      textAlign: "center",
    },
  },
  editMedal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
});

export default function MedalRankings({}) {
  const { data: data, revalidate: refetch } = useFetch([
    "get",
    `/admin/medalTable`,
  ]);
  const classes = useStyles();
  const [medalTable, setMedalTable] = useState([]);
  const [_medalTable, _setMedalTable] = useState([]);
  const api = useAPI();
  const [edit, setEdit] = useState(null);
  const [editGold, setEditGoldMedal] = useState(null);
  const [editSilver, setEditSilverMedal] = useState(null);
  const [editBronze, setEditBronzeMedal] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (data) {
      setMedalTable(
        data?.map((e, index) => ({
          gold_medal: e?.gold_medal,
          bronze_medal: e?.bronze_medal,
          silver_medal: e?.silver_medal,
          total_medal: [
            parseInt(e?.gold_medal),
            parseInt(e?.bronze_medal),
            parseInt(e?.silver_medal),
          ].reduce(function (a, b) {
            return a + b;
          }, 0)
            ? [
                parseInt(e?.gold_medal),
                parseInt(e?.bronze_medal),
                parseInt(e?.silver_medal),
              ].reduce(function (a, b) {
                return a + b;
              }, 0)
            : 0,
          team: e?.team,
          rank_no: e?.rank_no ? e?.rank_no : index + 1,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (medalTable) {
      _setMedalTable(medalTable);
    }
  }, [medalTable]);

  const update = async (e) => {
    try {
      const res = await api.fetcher("post", "/admin/medalTable", {
        medal_table: medalTable,
      });
      if (res) {
        refetch();
      }
    } catch (e) {}
  };

  const editRank = (index) => {
    setEdit(index);
  };

  const doneRank = (index) => {
    setMedalTable(_medalTable);
    setEdit(null);
  };

  const changeRankNo = (team_id, value) => {
    _setMedalTable((pre) => [
      ...pre?.map((e) => {
        if (e?.team?.id == team_id) {
          return {
            ...e,
            rank_no: value,
          };
        }
        return e;
      }),
    ]);
  };

  const sortMedalTable = React.useMemo(() => {
    return [...medalTable].sort((a, b) => a.rank_no - b.rank_no);
  }, [medalTable]);

  const editGoldMedal = (team_id) => {
    setEditGoldMedal(team_id);
  };
  const editSilverMedal = (team_id) => {
    setEditSilverMedal(team_id);
  };
  const editBronzeMedal = (team_id) => {
    setEditBronzeMedal(team_id);
  };

  const doneGoldMedal = (index) => {
    setMedalTable(_medalTable);
    setEditGoldMedal(null);
  };
  const doneSilverMedal = (index) => {
    setMedalTable(_medalTable);
    setEditSilverMedal(null);
  };
  const doneBronzeMedal = (index) => {
    setMedalTable(_medalTable);
    setEditBronzeMedal(null);
  };

  const changeGoldMedal = (team_id, value) => {
    _setMedalTable((pre) => [
      ...pre?.map((e) => {
        if (e?.team?.id == team_id) {
          return {
            ...e,
            gold_medal: value,
            total_medal: [
              parseInt(value),
              parseInt(e?.bronze_medal),
              parseInt(e?.silver_medal),
            ].reduce(function (a, b) {
              return a + b;
            }, 0),
          };
        }
        return e;
      }),
    ]);
  };

  const changeSilverMedal = (team_id, value) => {
    _setMedalTable((pre) => [
      ...pre?.map((e) => {
        if (e?.team?.id == team_id) {
          return {
            ...e,
            silver_medal: value,
            total_medal: [
              parseInt(e?.gold_medal),
              parseInt(e?.bronze_medal),
              parseInt(value),
            ].reduce(function (a, b) {
              return a + b;
            }, 0),
          };
        }
        return e;
      }),
    ]);
  };

  const changeBronzeMedal = (team_id, value) => {
    _setMedalTable((pre) => [
      ...pre?.map((e) => {
        if (e?.team?.id == team_id) {
          return {
            ...e,
            bronze_medal: value,
            total_medal: [
              parseInt(e?.gold_medal),
              parseInt(value),
              parseInt(e?.silver_medal),
            ].reduce(function (a, b) {
              return a + b;
            }, 0),
          };
        }
        return e;
      }),
    ]);
  };

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell}>
                {t("medal_table.rank_no")}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {t("medal_table.team")}
              </TableCell>
              <TableCell className={classes.tableCell}>
                <img src={hcv} width={65} />
              </TableCell>
              <TableCell className={classes.tableCell}>
                <img src={hcb} width={65} />
              </TableCell>
              <TableCell className={classes.tableCell}>
                <img src={hcd} width={65} />
              </TableCell>
              <TableCell className={classes.tableCell}>
                {t("medal_table.total_medal")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortMedalTable?.map((e, index) => {
              return (
                <TableRow>
                  <TableCell className={classes.rank_no}>
                    <Grid container style={{ alignItems: "center" }}>
                      {edit == e?.team?.id ? (
                        <Grid
                          item
                          xs={12}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <TextField
                            value={_medalTable
                              ?.map((i) => {
                                if (i?.team?.id == e?.team?.id) {
                                  return i?.rank_no;
                                }
                              })
                              ?.find((e) => e > 0)}
                            type="number"
                            onChange={(event) =>
                              changeRankNo(e?.team?.id, event.target.value)
                            }
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 2);
                            }}
                            className={classes.textField}
                          />
                          <IconButton onClick={() => doneRank(index)}>
                            <DoneIcon />
                          </IconButton>
                        </Grid>
                      ) : (
                        <Grid
                          item
                          xs={12}
                          style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Grid>{e?.rank_no}</Grid>
                          <IconButton onClick={() => editRank(e?.team?.id)}>
                            <EditIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell style={{ width: "35%" }}>
                    <Grid
                      container
                      style={{ alignItems: "center" }}
                      justify="center"
                    >
                      <Grid item xs={4} style={{ textAlign: "end" }}>
                        <img
                          src={
                            process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            e?.team?.country?.flag_url
                          }
                          width={65}
                        />
                      </Grid>
                      <Grid
                        xs={8}
                        item
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 600,
                          padding: 10,
                        }}
                      >
                        {i18n?.languages?.[0] == "vi"
                          ? e?.team?.name
                          : e?.team?.english_name}
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell className={classes.gold_medal}>
                    <Grid container style={{ alignItems: "center" }}>
                      {editGold == e?.team?.id ? (
                        <Grid item xs={12} className={classes.editMedal}>
                          <TextField
                            value={
                              _medalTable
                                ?.map((i) => {
                                  if (i?.team?.id == e?.team?.id) {
                                    return i?.gold_medal;
                                  }
                                })
                                ?.find((e) => e > 0)
                                ? _medalTable
                                    ?.map((i) => {
                                      if (i?.team?.id == e?.team?.id) {
                                        return i?.gold_medal;
                                      }
                                    })
                                    ?.find((e) => e > 0)
                                : 0
                            }
                            type="number"
                            onChange={(event) =>
                              changeGoldMedal(e?.team?.id, event.target.value)
                            }
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 3);
                            }}
                            className={classes.textField}
                          />

                          <IconButton onClick={() => doneGoldMedal(index)}>
                            <DoneIcon />
                          </IconButton>
                        </Grid>
                      ) : (
                        <Grid item xs={12} className={classes.editMedal}>
                          <Grid>{e?.gold_medal ? e?.gold_medal : 0}</Grid>
                          <Grid>
                            <IconButton
                              onClick={() => editGoldMedal(e?.team?.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell className={classes.silver_medal}>
                    <Grid container style={{ alignItems: "center" }}>
                      {editSilver == e?.team?.id ? (
                        <Grid item xs={12} className={classes.editMedal}>
                          <TextField
                            value={
                              _medalTable
                                ?.map((i) => {
                                  if (i?.team?.id == e?.team?.id) {
                                    return i?.silver_medal;
                                  }
                                })
                                ?.find((e) => e > 0)
                                ? _medalTable
                                    ?.map((i) => {
                                      if (i?.team?.id == e?.team?.id) {
                                        return i?.silver_medal;
                                      }
                                    })
                                    ?.find((e) => e > 0)
                                : 0
                            }
                            type="number"
                            onChange={(event) =>
                              changeSilverMedal(e?.team?.id, event.target.value)
                            }
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 3);
                            }}
                            className={classes.textField}
                          />
                          <Grid>
                            <IconButton onClick={() => doneSilverMedal(index)}>
                              <DoneIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid item xs={12} className={classes.editMedal}>
                          <Grid>{e?.silver_medal ? e?.silver_medal : 0}</Grid>
                          <Grid>
                            <IconButton
                              onClick={() => editSilverMedal(e?.team?.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell className={classes.bronze_medal}>
                    <Grid container style={{ alignItems: "center" }}>
                      {editBronze == e?.team?.id ? (
                        <Grid item xs={12} className={classes.editMedal}>
                          <TextField
                            value={
                              _medalTable
                                ?.map((i) => {
                                  if (i?.team?.id == e?.team?.id) {
                                    return i?.bronze_medal;
                                  }
                                })
                                ?.find((e) => e > 0)
                                ? _medalTable
                                    ?.map((i) => {
                                      if (i?.team?.id == e?.team?.id) {
                                        return i?.bronze_medal;
                                      }
                                    })
                                    ?.find((e) => e > 0)
                                : 0
                            }
                            type="number"
                            onChange={(event) =>
                              changeBronzeMedal(e?.team?.id, event.target.value)
                            }
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 3);
                            }}
                            className={classes.textField}
                          />
                          <Grid>
                            <IconButton onClick={() => doneBronzeMedal(index)}>
                              <DoneIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid item xs={12} className={classes.editMedal}>
                          <Grid>{e?.bronze_medal ? e?.bronze_medal : 0}</Grid>
                          <Grid>
                            <IconButton
                              onClick={() => editBronzeMedal(e?.team?.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell className={classes.total_medal}>
                    {e?.total_medal}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ padding: 10 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={(e) => update(e)}
          style={{ marginTop: 10 }}
        >
          {t("button.update")}
        </Button>
      </div>
    </Paper>
  );
}
