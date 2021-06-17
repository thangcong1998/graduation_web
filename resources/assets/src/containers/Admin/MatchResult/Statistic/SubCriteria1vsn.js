import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { event_type, sub_criterias_type } from "../../../../common/constants";
import Number from "../../../../components/form/Number";

export default function SubCriteria1vsn(props) {
  const { match, setSubCriteriaOnCompetitors } = props;
  const [subCriterias, setSubCriterias] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [competitionType, setCompetitorType] = useState(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    let sub_subcriterias = match?.stage?.event?.sub_criterias;
    setSubCriterias(
      sub_subcriterias?.filter((e) => e.type == sub_criterias_type.OTHER)
    );
    setCompetitorType(match?.stage?.event?.competition_type);
    if (match?.stage?.event?.competition_type == event_type.TEAM) {
      setCompetitors(match?.match_event_teams);
    }
    if (match?.stage?.event?.competition_type == event_type.INDIVIDUAL) {
      setCompetitors(match?.match_individual_competitors);
    }
  }, []);

  useEffect(() => {
    setSubCriteriaOnCompetitors(competitors);
  }, [competitors]);
  console.log(competitors);

  const handleChangeInput = (competitor, cpIndex, sub_criteria_id, value) => {
    let cps = [...competitors];
    let cp = cps[cpIndex];
    let sub_criterias = cp?.match_sub_criterias_relations;
    if (sub_criterias.some((e) => e?.sub_criteria_id == sub_criteria_id)) {
      sub_criterias.map((sc) => {
        if (sc.sub_criteria_id == sub_criteria_id) {
          sc.value = value;
        }
      });
    } else {
      let sub_criteria = {
        event_id: match?.stage?.event?.id,
        competitor_id: cp?.competitor_id,
        event_team_id: cp?.event_team_id,
        match_id: match?.id,
        stage_id: match?.stage_id,
        sub_criteria_id: sub_criteria_id,
        value: value,
      };
      sub_criterias.push(sub_criteria);
    }
    setCompetitors(cps);
  };

  const renderCompetitor = (competitor) => {
    const individual = (
      <div>
        <img
          src={
            process.env.MIX_REACT_APP_STORAGE_URL +
            "/" +
            competitor.competitor?.team?.country?.flag_url
          }
          height={"42.9"}
          width={"65"}
          style={{ marginRight: 5 }}
        />
        <span>
          {competitor.competitor?.family_name +
            " " +
            competitor.competitor?.given_name}
        </span>
      </div>
    );

    const eventTeam = (
      <div>
        <img
          src={
            process.env.MIX_REACT_APP_STORAGE_URL +
            "/" +
            competitor.event_team?.team?.country?.flag_url
          }
          height={"42.9"}
          width={"65"}
          style={{ marginRight: 5 }}
        />
        <span>
          {competitor.event_team?.name
            ? competitor.event_team?.name
            : competitor.event_team?.team?.name}
        </span>
      </div>
    );

    return <div>{competitionType == event_type.INDIVIDUAL && individual}</div>;
  };

  return (
    <Paper
      style={{
        marginTop: 20,
        padding: 10,
      }}
    >
      {subCriterias?.length > 0 ? (
        <>
          <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
            {t("sub_criteria.sub_criteria")}
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {subCriterias.map((sub, index) => (
                    <TableCell key={index}>{sub?.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {competitors?.map((cp, cpIndex) => (
                  <TableRow key={cpIndex}>
                    <TableCell>{renderCompetitor(cp)}</TableCell>
                    {subCriterias.map((sub, index) => (
                      <TableCell key={index}>
                        <Number
                          handleChange={(e) =>
                            handleChangeInput(cp, cpIndex, sub?.id, e)
                          }
                          value={
                            cp.match_sub_criterias_relations?.find(
                              (e) => e?.sub_criteria_id == sub?.id
                            )?.value
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
          {t("sub_criteria.empty")}
        </div>
      )}
    </Paper>
  );
}
