import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { event_type, sub_criterias_type } from "../../../../common/constants";
import Number from "../../../../components/form/Number";
import { makeStyles, Paper } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  centerCol: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
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

export default function SubCriteria1vs1(props) {
  const { match, setSubCriteriaOnCompetitors, errs, setErrs } = props;
  const classes = useStyles();
  const [subCriterias, setSubCriterias] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [competitionType, setCompetitorType] = useState(null);
  const [errors, setErrors] = useState([{}, {}]);
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
  const handleChangeInput = (value, competitor_index, sub_criteria_id) => {
    // if (value > 1000 || value < -1000) {
    //   let errs = [...errors];
    //   errs[competitor_index][sub_criteria_id] = "errors !";
    //   setErrors(errs);
    // } else {
    //   let errs = [...errors];
    //   errs[competitor_index][sub_criteria_id] = undefined;
    //   setErrors(errs);
    // }
    let cps = [...competitors];
    let cp = cps[competitor_index];
    let sub_criterias = cp?.match_sub_criterias_relations;
    if (sub_criterias.some((e) => e?.sub_criteria_id == sub_criteria_id)) {
      sub_criterias.map((sc) => {
        if (sc.sub_criteria_id == sub_criteria_id) {
          sc.value = value;
        }
      });
    } else {
      if (competitionType == event_type.INDIVIDUAL) {
        let sub_criteria = {
          event_id: match?.stage?.event?.id,
          competitor_id: cp?.competitor_id,
          match_id: match?.id,
          stage_id: match?.stage_id,
          sub_criteria_id: sub_criteria_id,
          value: value,
        };
        sub_criterias.push(sub_criteria);
      }
      if (competitionType == event_type.TEAM) {
        let sub_criteria = {
          event_id: match?.stage?.event?.id,
          event_team_id: cp?.event_team_id,
          match_id: match?.id,
          stage_id: match?.stage_id,
          sub_criteria_id: sub_criteria_id,
          value: value,
        };
        sub_criterias.push(sub_criteria);
      }
    }
    setCompetitors(cps);
  };
  useEffect(() => {
    setSubCriteriaOnCompetitors(competitors);
  }, [competitors]);

  // useEffect(() => {
  //   let a = null;
  //   let b = null;
  //   Object.keys(errors[0]).map((e) => {
  //     if (errors[0]?.[e]) {
  //       a = 1;
  //     }
  //   });
  //   Object.keys(errors[1]).map((e) => {
  //     if (errors[0]?.[e]) {
  //       b = 1;
  //     }
  //   });
  //   if (a || b) {
  //     setErrs(1);
  //   } else {
  //     setErrs();
  //   }
  // }, [errors]);

  // const renderCompetitor = (competitor, index) => {
  //   const individual =
  //     index == 0 ? (
  //       <div className={classes.flexEnd}>
  //         <span className={classes.name}>
  //           {competitor?.competitor?.family_name +
  //             " " +
  //             competitor?.competitor?.given_name}
  //         </span>
  //         <img
  //           src={
  //             process.env.MIX_REACT_APP_STORAGE_URL +
  //             "/" +
  //             competitor?.competitor?.team?.country?.flag_url
  //           }
  //           width={"65"}
  //           height={"42.9"}
  //           style={{ margin: 5 }}
  //         />
  //       </div>
  //     ) : (
  //       <div className={classes.flex}>
  //         <img
  //           src={
  //             process.env.MIX_REACT_APP_STORAGE_URL +
  //             "/" +
  //             competitor?.competitor?.team?.country?.flag_url
  //           }
  //           width={"65"}
  //           height={"42.9"}
  //           style={{ margin: 5 }}
  //         />
  //         <span className={classes.name}>
  //           {competitor?.competitor?.family_name +
  //             " " +
  //             competitor?.competitor?.given_name}
  //         </span>
  //       </div>
  //     );

  //   const eventTeam =
  //     index == 0 ? (
  //       <div className={classes.flexEnd}>
  //         <span className={classes.name}>
  //           {competitor?.event_team?.name
  //             ? competitor?.event_team?.name
  //             : competitor?.event_team?.team?.name}
  //         </span>
  //         <img
  //           src={
  //             process.env.MIX_REACT_APP_STORAGE_URL +
  //             "/" +
  //             competitor?.event_team?.team?.country?.flag_url
  //           }
  //           width={"65"}
  //           height={"42.9"}
  //           style={{ margin: 5 }}
  //         />
  //       </div>
  //     ) : (
  //       <div className={classes.flex}>
  //         <img
  //           src={
  //             process.env.MIX_REACT_APP_STORAGE_URL +
  //             "/" +
  //             competitor?.event_team?.team?.country?.flag_url
  //           }
  //           width={"65"}
  //           height={"42.9"}
  //           style={{ margin: 5 }}
  //         />
  //         <span className={classes.name}>
  //           {competitor?.event_team?.name
  //             ? competitor?.event_team?.name
  //             : competitor?.event_team?.team?.name}
  //         </span>
  //       </div>
  //     );

  //   return (
  //     <div className={index == 0 ? classes.textRight : classes.textLeft}>
  //       {competitionType == event_type.INDIVIDUAL && individual}
  //       {competitionType == event_type.TEAM && eventTeam}
  //     </div>
  //   );
  // };

  return (
    <Paper style={{ marginTop: 20, padding: 10 }}>
      {subCriterias?.length > 0 ? (
        <>
          <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
            {t("sub_criteria.sub_criteria")}
          </div>

          <Paper>
            <table width="100%">
              {subCriterias?.map((sub) => (
                <tr>
                  <td width="30%" style={{ padding: 16 }}>
                    <Number
                      fullWidth={false}
                      handleChange={(e) => handleChangeInput(e, 0, sub?.id)}
                      value={
                        competitors?.[0]?.match_sub_criterias_relations.find(
                          (e) => e?.sub_criteria_id == sub?.id
                        )?.value
                      }
                      variant="outlined"
                      className={classes.inputLeft}
                      // error={errors[0]?.[sub?.id]}
                    />
                  </td>
                  <td width="40%" className={classes.centerCol}>
                    {sub.name}
                  </td>
                  <td width="30%" style={{ padding: 16, textAlign: "right" }}>
                    <Number
                      fullWidth={false}
                      className={classes.inputRight}
                      variant="outlined"
                      handleChange={(e) => handleChangeInput(e, 1, sub?.id)}
                      value={
                        competitors?.[1]?.match_sub_criterias_relations.find(
                          (e) => e?.sub_criteria_id == sub?.id
                        )?.value
                      }
                    />
                  </td>
                </tr>
              ))}
            </table>
          </Paper>
        </>
      ) : (
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
          {t("sub_criteria.empty")}
        </div>
      )}
    </Paper>
  );
}
