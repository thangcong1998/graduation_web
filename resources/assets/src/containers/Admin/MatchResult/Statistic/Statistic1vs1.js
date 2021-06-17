import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Paper,
  Popper,
  TextField,
  Button,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useAPI } from "../../../../api/api";
import { useHistory } from "react-router-dom";
import {
  stage_type,
  sub_criterias_type,
  event_type,
} from "../../../../common/constants";
import SubCriteria1vs1 from "./SubCriteria1vs1";

const useStyles = makeStyles((theme) => ({
  textRight: {
    textAlign: "right",
  },
  textLeft: {
    textAlign: "left",
  },
  inputRight: {
    "& input": {
      textAlign: "right",
    },
  },
  flexEnd: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  name: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
}));

export default function Statistic1vs1({ match }) {
  const [statistic, setStatistic] = useState();
  const classes = useStyles();
  const api = useAPI();
  const history = useHistory();
  const [competitors, setCompetitors] = useState([]);
  const [competitionType, setCompetitorType] = useState(null);
  const [subCriteriaErrors, setSubCriteriaErrors] = useState(null);
  const [subCriterias, setSubCriterias] = useState();
  useEffect(() => {
    if (match?.event_statistics_match?.length > 0) {
      setStatistic(
        match?.stage?.event?.event_statistic?.map((e) => ({
          ...e,
          statistic: e?.event_statistics_match_relations?.map((st) => ({
            id: st?.id,
            event_team_id: st?.event_team_id,
            value: st?.value,
            competitor_id: st?.competitor_id,
          })),
        }))
      );
    } else {
      setStatistic(
        match?.stage?.event?.event_statistic?.map((e) => ({
          ...e,
          statistic:
            match?.event_teams?.length > 0
              ? match?.event_teams?.map((st) => ({
                  event_team_id: st?.id,
                  value: 0,
                  id: null,
                }))
              : match?.match_individual_competitors?.map((st) => ({
                  competitor_id: st?.competitor_id,
                  value: 0,
                  id: null,
                })),
        }))
      );
    }
    let sub_subcriterias = match?.stage?.event?.sub_criterias;
    if (
      sub_subcriterias?.filter((e) => e.type == sub_criterias_type.OTHER)
        .length > 0
    ) {
      setSubCriterias(
        sub_subcriterias?.filter((e) => e.type == sub_criterias_type.OTHER)
      );
    }
    setCompetitorType(match?.stage?.event?.competition_type);
    if (match?.stage?.event?.competition_type == event_type.TEAM) {
      setCompetitors(match?.match_event_teams);
    }
    if (match?.stage?.event?.competition_type == event_type.INDIVIDUAL) {
      setCompetitors(match?.match_individual_competitors);
    }
  }, [match]);

  const { t, i18n } = useTranslation();
  const updateStatistic = async (e) => {
    try {
      let res = await api.fetcher("post", "admin/updateStatistic1vs1", {
        statistic: statistic?.map((e) => ({
          event_statistic_id: e?.id,
          match_id: match?.id,
          statistic: e?.statistic,
        })),
        sub_criterias: competitors.map((e) => e?.match_sub_criterias_relations),
        stage_id: match?.stage_id,
      });
      if (res) {
        history.goback();
      }
    } catch ($e) {}
  };

  const changeValue = (value, index, stIndex) => {
    setStatistic((pre) => [
      ...pre?.map((e, rIndex) => {
        if (rIndex == index) {
          return {
            ...e,
            statistic: e?.statistic?.map((t, tIndex) => {
              if (stIndex == tIndex) {
                return { ...t, value: value };
              }
              return t;
            }),
          };
        }
        return e;
      }),
    ]);
  };

  const renderCompetitor = (competitor, index) => {
    const individual =
      index == 0 ? (
        <div className={classes.flex}>
          <span className={classes.name}>
            {competitor?.competitor?.family_name +
              " " +
              competitor?.competitor?.given_name}
          </span>
          <img
            src={
              process.env.MIX_REACT_APP_STORAGE_URL +
              "/" +
              competitor?.competitor?.team?.country?.flag_url
            }
            width={"70"}
            height={"42.9"}
            style={{ margin: 5 }}
          />
        </div>
      ) : (
        <div className={classes.flexEnd}>
          <img
            src={
              process.env.MIX_REACT_APP_STORAGE_URL +
              "/" +
              competitor?.competitor?.team?.country?.flag_url
            }
            width={"70"}
            height={"42.9"}
            style={{ margin: 5 }}
          />
          <span className={classes.name}>
            {competitor?.competitor?.family_name +
              " " +
              competitor?.competitor?.given_name}
          </span>
        </div>
      );

    const eventTeam =
      index == 0 ? (
        <div className={classes.flex}>
          <span className={classes.name}>
            {competitor?.event_team?.name
              ? competitor?.event_team?.name
              : competitor?.event_team?.team?.name}
          </span>
          <img
            src={
              process.env.MIX_REACT_APP_STORAGE_URL +
              "/" +
              competitor?.event_team?.team?.country?.flag_url
            }
            width={"70"}
            height={"42.9"}
            style={{ margin: 5 }}
          />
        </div>
      ) : (
        <div className={classes.flexEnd}>
          <img
            src={
              process.env.MIX_REACT_APP_STORAGE_URL +
              "/" +
              competitor?.event_team?.team?.country?.flag_url
            }
            width={"70"}
            height={"42.9"}
            style={{ margin: 5 }}
          />
          <span className={classes.name}>
            {competitor?.event_team?.name
              ? competitor?.event_team?.name
              : competitor?.event_team?.team?.name}
          </span>
        </div>
      );

    return (
      <div className={index == 0 ? classes.textRight : classes.textLeft}>
        {competitionType == event_type.INDIVIDUAL && individual}
        {competitionType == event_type.TEAM && eventTeam}
      </div>
    );
  };

  return (
    <Grid>
      <table width="100%">
        <tr>
          <td width={"50%"}>{renderCompetitor(competitors?.[0], 0)}</td>
          <td width={"50%"}>{renderCompetitor(competitors?.[1], 1)}</td>
        </tr>
      </table>
      <TableContainer component={Paper}>
        <Table>
          {statistic?.[0]?.statistic?.length > 0 ? (
            <TableBody>
              {statistic?.map((e, index) => {
                return (
                  <TableRow>
                    {e?.statistic?.map((st, stIndex) => {
                      return (
                        <React.Fragment>
                          {stIndex == 0 && (
                            <TableCell style={{ width: "30%" }}>
                              <TextField
                                value={st?.value}
                                variant="outlined"
                                onChange={(e) =>
                                  changeValue(e.target.value, index, stIndex)
                                }
                              />
                            </TableCell>
                          )}
                          {stIndex == 0 && (
                            <TableCell>
                              <p
                                style={{
                                  textAlign: "center",
                                  fontSize: "1.25rem",
                                  fontWeight: 600,
                                }}
                              >
                                {e?.name}
                              </p>
                            </TableCell>
                          )}
                          {stIndex == 1 && (
                            <TableCell
                              style={{ width: "30%", textAlign: "end" }}
                            >
                              <TextField
                                value={st?.value}
                                variant="outlined"
                                onChange={(e) =>
                                  changeValue(e.target.value, index, stIndex)
                                }
                              />
                            </TableCell>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <Grid style={{ padding: 10, fontWeight: 600, fontSize: "1rem" }}>
              {t("statistic_screen.empty")}
            </Grid>
          )}
        </Table>
      </TableContainer>
      {match?.stage?.stage_type == stage_type.QUALIFIED_USED_TABLE && (
        <SubCriteria1vs1
          match={match}
          setSubCriteriaOnCompetitors={setCompetitors}
          setErrs={setSubCriteriaErrors}
        />
      )}
      {(statistic?.[0]?.statistic?.length > 0 || subCriterias) && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 15 }}
          onClick={(e) => updateStatistic(e)}
        >
          {t("button.update")}
        </Button>
      )}
    </Grid>
  );
}
