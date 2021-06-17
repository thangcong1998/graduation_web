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
  TableHead,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useAPI } from "../../../../api/api";
import { useHistory } from "react-router";
import SubCriteria1vsn from "./SubCriteria1vsn";
import { stage_type } from "../../../../common/constants";
import { Tooltip } from "@material-ui/core";

export default function Statistic1vs1N({ match }) {
  const [statistic, setStatistic] = useState();
  const api = useAPI();
  const history = useHistory();
  const [competitors, setCompetitors] = useState([]);
  useEffect(() => {
    if (match?.event_statistics_match?.length > 0) {
      setStatistic(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors?.map((t) => ({
              competitor: t?.competitor,
              statistic: match?.stage?.event?.event_statistic?.map((e) => ({
                ...e,
                value: e?.event_statistics_match_relations?.find(
                  (i) => i?.competitor_id == t?.competitor?.id
                )?.value,
                id: e?.event_statistics_match_relations?.find(
                  (i) => i?.competitor_id == t?.competitor?.id
                )?.id,
                event_statistic_id: e?.id,
              })),
            }))
          : match?.match_event_teams?.map((t) => ({
              event_team: t?.event_team,
              statistic: match?.stage?.event?.event_statistic?.map((e) => ({
                ...e,
                value: e?.event_statistics_match_relations?.find(
                  (i) => i?.event_team_id == t?.event_team_id
                )?.value,
                id: e?.event_statistics_match_relations?.find(
                  (i) => i?.event_team_id == t?.event_team_id
                )?.id,
                event_statistic_id: e?.id,
              })),
            }))
      );
    } else {
      setStatistic(
        match?.match_individual_competitors?.length > 0
          ? match?.match_individual_competitors?.map((e) => ({
              competitor: e?.competitor,
              statistic: match?.stage?.event?.event_statistic?.map((st) => ({
                event_statistic_id: st?.id,
                value: 0,
              })),
            }))
          : match?.match_event_teams?.map((e) => ({
              event_team: e?.event_team,
              statistic: match?.stage?.event?.event_statistic?.map((st) => ({
                event_statistic_id: st?.id,
                value: 0,
              })),
            }))
      );
    }
  }, [match]);

  const { t, i18n } = useTranslation();

  const updateStatistic = async (e) => {
    try {
      let res = await api.fetcher("post", "admin/updateStatistic1vsN", {
        statistic: statistic?.map((e) => ({
          competitor_id: e?.competitor?.id,
          event_team_id: e?.event_team?.id,
          match_id: match?.id,
          statistic:
            match?.event_statistics_match?.length > 0
              ? e?.statistic?.map((e) => ({
                  id: e?.id ? e?.id : null,
                  event_statistic_id: e?.event_statistic_id
                    ? e?.event_statistic_id
                    : e?.id,
                  value: e?.value,
                }))
              : e?.statistic,
        })),
        sub_criterias: competitors.map((e) => e?.match_sub_criterias_relations),
        stage_id: match?.stage_id,
      });
      if (res) {
        history.goBack();
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

  return (
    <Grid>
      <TableContainer component={Paper}>
        {statistic?.[0]?.statistic?.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {match?.stage?.event?.event_statistic?.map((e) => {
                  return (
                    <TableCell>
                      <p style={{ fontSize: "1.15rem", fontWeight: 600 }}>
                        {e?.name}
                      </p>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {statistic?.map((e, index) => {
                return (
                  <TableRow>
                    <TableCell>
                      <Grid style={{ display: "flex" }}>
                        <img
                          src={
                            e?.competitor
                              ? process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                e?.competitor?.team?.country.flag_url
                              : process.env.MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                e?.event_team?.team?.country.flag_url
                          }
                          width={65}
                          height={"auto"}
                          style={{ minWidth: 55, maxHeight: 50, minHeight: 26 }}
                        />
                        <Tooltip
                          title={
                            e?.event_team
                              ? e?.event_team?.name
                              : e?.competitor?.family_name +
                                " " +
                                e?.competitor?.given_name
                          }
                          interactive
                        >
                          <p
                            style={{
                              fontSize: "1.15rem",
                              fontWeight: 600,
                              marginLeft: 5,
                              maxWidth: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {e?.event_team
                              ? e?.event_team?.name
                              : e?.competitor?.family_name +
                                " " +
                                e?.competitor?.given_name}
                          </p>
                        </Tooltip>
                      </Grid>
                    </TableCell>
                    {e?.statistic?.map((i, stIndex) => {
                      return (
                        <TableCell>
                          <TextField
                            value={i?.value}
                            variant="outlined"
                            onChange={(e) =>
                              changeValue(e.target.value, index, stIndex)
                            }
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Grid style={{ padding: 10, fontWeight: 600, fontSize: "1rem" }}>
            {t("statistic_screen.empty")}
          </Grid>
        )}
      </TableContainer>
      {match?.stage?.stage_type == stage_type.QUALIFIED_USED_TABLE && (
        <SubCriteria1vsn
          match={match}
          setSubCriteriaOnCompetitors={setCompetitors}
        />
      )}

      {statistic?.[0]?.statistic?.length > 0 && (
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
