import React, { useEffect, useState } from "react";
import { IconButton, TextField, Grid, Paper, Button } from "@material-ui/core";
import Popover from "../../../../../components/popover";

export default function RefereePointScoreko({ doneEdit, index, value }) {
  const [close, setClose] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const changeScoreReferee = (value, rsIndex, index) => {
    setNewValue((pre) => ({
      ...pre,
      result: pre?.result?.map((rl, rlIndex) => {
        if (rsIndex == rlIndex) {
          return {
            ...rl,
            referee: rl?.referee?.map((rf, i) => {
              if (i == index) {
                return { ...rf, score: value };
              }
              return rf;
            }),
            resultScore: rl?.referee
              ?.map((rf, i) => {
                if (i == index) {
                  return parseInt(value);
                }
                return parseInt(rf.score);
              })
              .reduce(function (a, b) {
                return a + b;
              }, 0),
          };
        }
        return { ...rl };
      }),
    }));
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        {newValue?.result?.map((rs, ri) => {
          return (
            <div
              style={{
                minHeight: "60px",
                width: "100%",
              }}
            >
              <Grid
                container
                spacing={0}
                style={{
                  margin: 5,
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  height: "100%",
                  width: "99%",
                  padding: 20,
                }}
              >
                <Grid
                  item
                  xs={6}
                  style={{
                    padding: "0px 10px",
                    display: "flex",
                  }}
                >
                  <Popover
                    close={close}
                    setClose={() => setClose(false)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    content={
                      <div>
                        <div
                          style={{
                            padding: "10px 10px 0px 10px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          {t("referee_screen.referee")}:
                        </div>
                        <Paper
                          style={{
                            padding: "0px 10px 10px 10px",
                            display: "flex",
                          }}
                        >
                          {rs?.referee?.map((rf, index) => {
                            return (
                              <table>
                                <tr>
                                  {rf?.family_name + " " + rf?.given_name}
                                </tr>
                                <tr>
                                  <td>
                                    <TextField
                                      style={{
                                        marginRight: 5,
                                      }}
                                      type="number"
                                      onInput={(e) => {
                                        e.target.value = Math.max(
                                          0,
                                          parseInt(e.target.value)
                                        )
                                          .toString()
                                          .slice(0, 2);
                                      }}
                                      value={rf?.score}
                                      size="small"
                                      variant={"outlined"}
                                      onChange={(e) =>
                                        changeScoreReferee(
                                          e.target.value,
                                          ri,
                                          index
                                        )
                                      }
                                      fullWidth
                                    />
                                  </td>
                                </tr>
                              </table>
                            );
                          })}
                        </Paper>
                      </div>
                    }
                  >
                    <Button>
                      <p
                        style={{
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "1.3rem",
                          marginRight: 10,
                        }}
                      >
                        {t("rank_table.score")}: {rs?.resultScore}
                      </p>
                    </Button>
                  </Popover>
                </Grid>
              </Grid>
            </div>
          );
        })}
      </div>
    </div>
  );
}
