import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAPI, useFetch } from "../../../../api/api";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  makeStyles,
} from "@material-ui/core";
import {
  measurement_unit,
  event_type,
  qualification_type,
  sub_criterias_type,
} from "../../../../common/constants";
import Select from "../../../../components/form/Select";
import ButtonSolashi from "../../../../components/button/ButtonSolashi";
import { useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  group: {
    marginBottom: 15,
  },
  groupName: {
    fontWeight: 600,
  },
  name: {
    display: "flex",
    alignItems: "center",
  },
  headRow: {
    "& th": {
      fontWeight: 600,
    },
  },
}));
function checkUnit(unit, tran) {
  switch (unit) {
    case measurement_unit.HOUR:
      return tran("measurement_unit.hour.short_name");
    case measurement_unit.MINUTE:
      return tran("measurement_unit.minute.short_name");
    case measurement_unit.SECONDS:
      return tran("measurement_unit.seconds.short_name");
    case measurement_unit.CENTIMETER:
      return tran("measurement_unit.centimeter.short_name");
    case measurement_unit.METER:
      return tran("measurement_unit.meter.short_name");
    case measurement_unit.CENTIMETER:
      return t("measurement_unit.centimeter.short_name");
    case measurement_unit.KILOGRAM:
      return tran("measurement_unit.kilogram.short_name");
    default:
      return "";
  }
}

export const RankingTable = (props) => {
  const {
    rankType,
    rankTable,
    group,
    competitionType,
    stageQualificationSettings,
    updateQualified,
    unit,
    subCriterias,
    ...otherProps
  } = props;
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const Team = ({ team }) => (
    <div className={classes.name}>
      <img
        style={{ height: 30, width: 45.42, marginRight: 5 }}
        src={
          process.env.MIX_REACT_APP_STORAGE_URL +
          "/" +
          team?.team?.country?.flag_url
        }
      />
      <span>{team?.name ? team?.name : team?.team?.name}</span>
    </div>
  );
  const Competitor = ({ competitor }) => {
    return (
      <div className={classes.name}>
        <img
          style={{ height: 30, width: 45.42, marginRight: 5 }}
          src={
            process.env.MIX_REACT_APP_STORAGE_URL +
            "/" +
            competitor?.team?.country?.flag_url
          }
        />
        <span>{competitor?.family_name + " " + competitor?.given_name}</span>
      </div>
    );
  };
  const checkQualified = (stageSetting, tran) => {
    if (stageSetting?.qualification_type == qualification_type.QUALIFIED) {
      return (
        tran("stages_screen.qualified_to.title") +
        ` ${
          i18n.languages[0] == "vi"
            ? stageSetting?.qualified_to_stage?.name
            : stageSetting?.qualified_to_stage?.english_name
        }`
      );
    }
    if (stageSetting?.qualification_type == qualification_type.HCV) {
      return tran("award.hcv");
    }
    if (stageSetting?.qualification_type == qualification_type.HCB) {
      return tran("award.hcb");
    }
    if (stageSetting?.qualification_type == qualification_type.HCD) {
      return tran("award.hcd");
    }
  };

  function renderPoint(subCriteria, competitor) {
    let subType = subCriteria.type;
    let fields = Object.keys(competitor).filter((e) =>
      e.includes("val_sub_criteria_")
    );

    switch (subType) {
      case sub_criterias_type.WIN_MATCH:
        return competitor.win;
      case sub_criterias_type.SCORE:
        return competitor.score;
      case sub_criterias_type.GOAL:
        return competitor.goal;
      case sub_criterias_type.DIFFERENCE:
        return "";
      default:
        if (fields.includes("val_sub_criteria_" + subCriteria.id)) {
          return competitor?.["val_sub_criteria_" + subCriteria.id];
        }
        return 0;
        break;
    }
  }
  const arrange = (arr, score, index) => {
    let rank = 1;
    arr?.some((e, i) => {
      if (i == index) {
        return true;
      }
      if (i == arr.length - 1) {
        return true;
      }
      if (i < arr.length - 1) {
        if (arr[i]?.score > arr[i + 1]?.score) {
          rank++;
        }
      }
    });
    return rank;
  };

  const TableRanked = () => (
    <div className={classes.group}>
      {/* <div className={classes.groupName}>{group.group.name}</div> */}
      <div>
        <TableContainer style={{ borderRadius: 0 }} elevation={0}>
          <Table>
            <TableHead>
              <TableRow className={classes.headRow}>
                <TableCell>{t("rank_table.rank")}</TableCell>
                <TableCell>{t("rank_table.name")}</TableCell>
                {/* {subCriterias?.length ? (
                  subCriterias.map((e, index) => (
                    <TableCell key={index}>{e?.name}</TableCell>
                  ))
                ) : ( */}
                <TableCell>{t("rank_table.score")}</TableCell>
                {/* )} */}

                <TableCell>{t("rank_table.medal")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankTable?.rank_table.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {arrange(rankTable?.rank_table, e?.score, i)}
                  </TableCell>
                  <TableCell>
                    {competitionType == event_type.INDIVIDUAL && (
                      <Competitor competitor={e} />
                    )}
                    {competitionType == event_type.TEAM && <Team team={e} />}
                  </TableCell>
                  {/* {subCriterias?.length ? (
                    subCriterias.map((sub, index) => (
                      <TableCell key={index}>{renderPoint(sub, e)}</TableCell>
                    ))
                  ) : ( */}
                  <TableCell>{`${e?.score ? e?.score : 0} ${
                    rankType != 1 ? checkUnit(unit, t) : "pts"
                  }`}</TableCell>
                  {/* )} */}
                  <TableCell>
                    <Select
                      label=""
                      value={e?.qualification_type}
                      variant="standard"
                      handleChange={(value) => updateQualified(i, value)}
                      options={[
                        {
                          value: null,
                          label: "---",
                        },
                        {
                          value: 2,
                          label: t("award.hcv"),
                        },
                        {
                          value: 3,
                          label: t("award.hcb"),
                        },
                        {
                          value: 4,
                          label: t("award.hcd"),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );

  return <TableRanked />;
};

export const StageRankTable = (props) => {
  const { unit, rankType, event, ...otherProps } = props;
  const { t } = useTranslation();
  const params = useParams();
  const { data: rankTable } = useFetch(
    params?.sub_id && ["get", "admin/stageRankTable?event_id=" + params?.sub_id]
  );
  const api = useAPI();
  const [rankTables, setRankTables] = useState();
  const [subCriterias, setSubCriterias] = useState([]);
  useEffect(() => {
    if (rankTable) {
      if (event?.competition_type == event_type.INDIVIDUAL) {
        setRankTables({
          rank_table: rankTable.rank_table.map((rt) => {
            if (rt?.event_qualification_competitors.length > 0) {
              return {
                ...rt,
                qualification_type:
                  rt?.event_qualification_competitors[0]?.qualification_type,
              };
            }
            return { ...rt, qualification_type: null };
          }),
        });
      }
      if (event?.competition_type == event_type.TEAM) {
        setRankTables({
          rank_table: rankTable.rank_table.map((rt) => {
            if (rt?.event_qualification_competitors.length > 0) {
              return {
                ...rt,
                qualification_type:
                  rt?.event_qualification_competitors[0]?.qualification_type,
              };
            }
            return { ...rt, qualification_type: null };
          }),
        });
      }
    }
  }, [rankTable]);

  useEffect(() => {
    if (event) {
      setSubCriterias(event?.sub_criterias);
    }
  }, [event]);

  function updateQualified(competitor_index, qualification_type) {
    let _rankTables = rankTables;
    let newRankTable = _rankTables?.rank_table.map((rt, rtIndex) => {
      if (rtIndex == competitor_index) {
        return {
          ...rt,
          qualification_type: qualification_type,
        };
      }
      return rt;
    });
    setRankTables({ rank_table: newRankTable });
  }

  const update = () => {
    try {
      const res = api.fetcher("post", "/admin/noneStageEventAdward", {
        event_id: params?.sub_id,
        rank_tables: rankTables?.rank_table,
        competition_type: event?.competition_type,
      });
    } catch (e) {}
  };

  return (
    <div>
      <div>
        <RankingTable
          unit={unit}
          rankTable={rankTables}
          rankType={rankType}
          competitionType={event?.competition_type}
          updateQualified={updateQualified}
          // subCriterias={subCriterias}
        />
      </div>
      <ButtonSolashi
        variant="contained"
        color="primary"
        onClick={() => update()}
      >
        {t("button.update")}
      </ButtonSolashi>
    </div>
  );
};

export default StageRankTable;
