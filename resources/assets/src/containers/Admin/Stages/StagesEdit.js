import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import i18n from "../../../i18n/i18n";
import { Box, Typography, Tabs, Tab, Button } from "@material-ui/core";
import ButtonUpdate from "../../../components/button/ButtonUpdateSolashi";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  stage_type,
  event_type,
  match_attendant_type,
  match_score_type,
} from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";
import Matches from "./Matches";
import moment from "moment";
import { useDialog } from "../../../components/Dialog";
import "./stageform.css";
import SplitGrooupsScore from "./CompetitionType/SplitGroupsScore";
import MatchTable from "./MatchTable";
import Dialog from "../../../components/DialogMui";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import StagesForm from "./StagesForm";
import RankTable from "./RankTable/RankTable";
import RankTableNoGroup from "./RankTable/RankTableNoGroup";

const lang = i18n.languages[0];
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const AddDate = (props) => {
  const { close, addDate } = props;
  const [date, setDate] = useState(new Date());
  return (
    <div
      style={{
        maxWidth: 325,
        minWidth: 310,
      }}
    >
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        locale={lang}
        libInstance={moment}
      >
        <DatePicker
          variant="static"
          value={date}
          onChange={(e) => {
            setDate(e);
          }}
        />
      </MuiPickersUtilsProvider>
      <Button
        color="primary"
        onClick={() => {
          addDate(moment(date).format("YYYY-MM-DD"));
          close();
        }}
      >
        OK
      </Button>
    </div>
  );
};

export default function (props) {
  const { t } = useTranslation();
  const [valueTab, setValueTab] = useState(1);
  const api = useAPI();
  const history = useHistory();
  const { dialog, handleClose } = useDialog();
  const params = useParams();
  const { data: data, loading: loading, revalidate: refetch } = useFetch(
    params?.id && ["get", "admin/stage/" + params?.id]
  );
  const sport_name =
    i18n.languages[0] == "en"
      ? data?.event?.sport_discipline.sport.english_name
      : data?.event?.sport_discipline.sport.name;
  const sd_name =
    i18n.languages[0] == "en"
      ? data?.event?.sport_discipline.english_name
      : data?.event?.sport_discipline.name;
  const sde_name =
    i18n.languages[0] == "en" ? data?.event?.english_name : data?.event?.name;
  const [competitors, setCompetitors] = useState([]);
  const [matches, setMatches] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isEdit, setIsEdit] = useState(null);
  const [competitionDate, setCompetitionDate] = useState([]);
  const [groups, setGroups] = useState([]);
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  useEffect(() => {
    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    if (data) {
      if (data?.event_groups.length > 0) {
        const all_participant = [];

        if (data.event.competition_type == event_type.INDIVIDUAL) {
          setGroups(
            data?.event_groups.map((e, i) => ({
              ...e,
              group_members: e.group_members.map((m) => {
                let mem = { ...m?.participant, event_group_member_id: m.id };
                all_participant.push(mem);
                return mem;
              }),
              color: i % 10,
            }))
          );
          setCompetitors(
            data?.event?.participant.filter(
              (p) => !all_participant.map((e) => e.id).includes(p.id)
            )
          );
        }
        //Team
        else {
          setGroups(
            data?.event_groups.map((e, i) => ({
              ...e,
              group_members: e.group_members.map((m) => {
                let mem = { ...m?.event_team, event_group_member_id: m.id };
                all_participant.push(mem);
                return mem;
              }),
              color: i % 10,
            }))
          );
          setCompetitors(
            data?.event?.event_team.filter(
              (p) => !all_participant.map((e) => e.id).includes(p.id)
            )
          );
        }
      } else {
        if (data.event.competition_type == event_type.INDIVIDUAL) {
          if (data?.qualified_competitors.length > 0) {
            setCompetitors(
              data?.qualified_competitors.map((e) => e.competitor)
            );
          } else {
            setCompetitors(data.event?.participant);
          }
        } else {
          if (data?.qualified_competitors.length > 0) {
            setCompetitors(
              data?.qualified_competitors.map((e) => e.event_team)
            );
          } else {
            setCompetitors(data.event?.event_team);
          }
        }
      }
      setCompetitionDate(
        data.competition_dates.map((e, i) => ({
          date: e.event_date,
          color: i % 10,
        }))
      );
      setVenues(data.event.venues);
      //individual
      if (
        data.event.competition_type == event_type.INDIVIDUAL &&
        data?.event?.match_type == match_attendant_type._1VS1
      ) {
        let competitorMatch = (match, mI) => {
          let _competitors = match.competitors.map((cp, cpI) => ({
            key: `match_${cpI + 1}_${mI}`,
            competitor: cp,
          }));

          if (_competitors.length < 2) {
            if (_competitors.length == 1) {
              _competitors[1] = {
                key: "match" + "_2_" + (mI + 1),
                competitor: null,
              };
            } else {
              _competitors = [
                {
                  key: "match" + "_1_" + (mI + 1),
                  competitor: null,
                },
                {
                  key: "match" + "_2_" + (mI + 1),
                  competitor: null,
                },
              ];
            }
          }
          return _competitors;
        };

        setMatches(
          data?.matches.map((e, i) => ({
            ...e,
            competitors: competitorMatch(e, i),
            index: i,
          }))
        );
      }
      if (
        data.event.competition_type == event_type.INDIVIDUAL &&
        data?.event?.match_type == match_attendant_type._1VSN
      ) {
        setMatches(
          data?.matches.map((e, i) => ({
            ...e,
            competitors: e.competitors,
            index: i,
          }))
        );
      }
      //team
      if (
        data.event.competition_type == event_type.TEAM &&
        data?.event?.match_type == match_attendant_type._1VS1
      ) {
        let competitorMatch = (match, mI) => {
          let _competitors = match.event_teams.map((cp, cpI) => ({
            key: `match_${cpI + 1}_${mI}`,
            competitor: cp,
          }));

          if (_competitors.length < 2) {
            if (_competitors.length == 1) {
              _competitors[1] = {
                key: "match" + "_2_" + (mI + 1),
                competitor: null,
              };
            } else {
              _competitors = [
                {
                  key: "match" + "_1_" + (mI + 1),
                  competitor: null,
                },
                {
                  key: "match" + "_2_" + (mI + 1),
                  competitor: null,
                },
              ];
            }
          }
          return _competitors;
        };
        setMatches(
          data?.matches.map((e, i) => ({
            ...e,
            competitors: competitorMatch(e, i),
            index: i,
          }))
        );
      }
      if (
        data.event.competition_type == event_type.TEAM &&
        data?.event?.match_type == match_attendant_type._1VSN
      ) {
        setMatches(
          data?.matches.map((e, i) => ({
            ...e,
            competitors: e.event_teams,
            index: i,
          }))
        );
      }
    }
  }, [data]);
  const formik = useFormik({
    initialValues: {
      name: null,
      english_name: null,
      event_id: null,
    },
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher("put", "/admin/stage/" + params.id, {
          ...values,
        });
        // formData.append(
        //     "splitGoups",
        //     JSON.stringify(
        //         splitGroups?.map((e) => ({
        //             event_group_id: e?.id,
        //             characters: e?.characters?.map((ch) => ({
        //                 event_id: ch?.event_id,
        //                 event_team_id: ch?.id,
        //             })),
        //         }))
        //     )
        // );
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(t("stages_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("stages_screen.name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
      english_name: Yup.string()
        .required(t("stages_screen.english_name") + " " + t("errors.required"))
        .max(
          255,
          t("stages_screen.english_name") +
            " " +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .nullable()
        .trim(),
    }),
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        ...data,
      });
    }
  }, [data]);

  const inputs = useMemo(
    () => [
      [
        {
          field: "name",
          label: i18n.t("stages_screen.name"),
          required: true,
          value: formik.values?.name,
          error:
            (formik.touched.name && formik.errors?.name) || api.error?.name,
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "english_name",
          label: i18n.t("stages_screen.english_name"),
          value: formik.values?.english_name,
          required: true,
          error:
            (formik.touched.english_name && formik.errors.english_name) ||
            api.error?.english_name,
          handleChange: (e) => formik.setFieldValue("english_name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: i18n.t("stages_screen.stage_type.title"),
          field: "stage_type",
          value: formik.values.stage_type,
          handleChange: (e) => {
            formik.setFieldValue("stage_type", e);
          },
          error:
            api.error?.stage_type ||
            (formik.touched.stage_type && formik.errors?.stage_type),
          type: "radio",
          options: [
            {
              label: i18n.t("stages_screen.stage_type.qualified_used_table"),
              value: stage_type.QUALIFIED_USED_TABLE,
              disabled: true,
            },
            {
              label: i18n.t("stages_screen.stage_type.qualified_used_record"),
              disabled: true,
              value: stage_type.QUALIFIED_USED_RECORD,
            },
            {
              label: i18n.t("stages_screen.stage_type.knock_out"),
              value: stage_type.KNOCK_OUT,
              disabled: true,
            },
          ],
          formLabelProps: {
            style: {
              color: "#000000",
              fontWeight: "bold",
            },
          },
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: i18n.t("stages_screen.match_score_type.title"),
          field: "match_score_type",
          value: formik.values.match_score_type,
          handleChange: (e) => {
            formik.setFieldValue("match_score_type", e);
          },
          error:
            api.error?.match_score_type ||
            (formik.touched.match_score_type &&
              formik.errors?.match_score_type),
          type: "radio",
          options: [
            {
              label: i18n.t("stages_screen.match_score_type.record"),
              value: match_score_type.RECORD,
              disabled: true,
            },
            {
              label: i18n.t("stages_screen.match_score_type.target_record"),
              value: match_score_type.TARGET_RECORD,
              disabled: true,
            },
            {
              label: i18n.t("stages_screen.match_score_type.score"),
              value: match_score_type.SCORE,
              disabled: true,
            },
            {
              label: i18n.t("stages_screen.match_score_type.score_ko"),
              value: match_score_type.SCORE_KO,
              disabled: true,
            },
          ],
          formLabelProps: {
            style: {
              color: "#000000",
              fontWeight: "bold",
            },
          },
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik, api]
  );

  const addMatch = (date) => {
    const matchesOfDate = matches.filter((m) => m.event_date == date);
    const mIndex = `${date}_${matchesOfDate.length}`;
    setMatches((pre) => [
      ...pre,
      {
        name: "",
        event_date: date,
        start_time: new Date(date),
        end_time: null,
        key: "match_" + matches.length,
        venue_id: null,
        competitors:
          data?.event?.match_type == match_attendant_type._1VS1
            ? [
                {
                  key: "match" + "_1_" + matches.length,
                  competitor: null,
                },
                {
                  key: "match" + "_2_" + matches.length,
                  competitor: null,
                },
              ]
            : [],
        index: matches.length,
      },
    ]);
    setIsEdit(mIndex);
  };
  const handleOnDragEnd = useCallback(
    (event) => {
      const droppableId = event.destination.droppableId;
      const droppableIndex = droppableId.split("_");
      const date = isEdit.split("_")[0];
      const matchesOfDate = isEdit.split("_")[1];
      const match = matches.filter((e, i) => e.event_date == date)[
        matchesOfDate
      ];
      if (droppableIndex[droppableIndex.length - 1] == match.index) {
        const draggableIndex = event.source.index;
        const item = competitors.find((e, index) => index == draggableIndex);
        if (item) {
          setMatches((pre) => [
            ...pre.map((m, index) => {
              if (index == droppableIndex[droppableIndex.length - 1]) {
                if (m.competitors.some((c) => c.competitor?.id == item?.id)) {
                  return { ...m };
                }
                return {
                  ...m,
                  competitors: m.competitors.map((cp) => {
                    if (cp.key == droppableId) {
                      return {
                        ...cp,
                        competitor: item,
                      };
                    } else {
                      return { ...cp };
                    }
                  }),
                };
              } else {
                return { ...m };
              }
            }),
          ]);
        }
      }
    },
    [competitors, matches, isEdit]
  );

  const deleteCompetitor = (matchIndex, cpIndex) => {
    setMatches((pre) => [
      ...pre.map((m, index) => {
        if (index == matchIndex) {
          return {
            ...m,
            competitors: m.competitors.map((cp, index) => {
              if (index == cpIndex) {
                return {
                  ...cp,
                  competitor: null,
                };
              } else {
                return { ...cp };
              }
            }),
          };
        } else {
          return { ...m };
        }
      }),
    ]);
  };

  const handleChangeMatch = async (val) => {
    try {
      const res = await api.fetcher(
        val?.id ? "put" : "post",
        val?.id ? "/admin/match/" + val?.id : "/admin/match",
        {
          ...val,
          stage_id: params?.id,
          event_date: moment(val.event_date).format("YYYY-MM-DD"),
          start_time: moment(val.start_time).format("YYYY-MM-DD HH:mm:ss"),
          second_date: val?.second_date
            ? moment(val.second_date).format("YYYY-MM-DD")
            : null,
          competitors:
            data?.event?.match_type == match_attendant_type._1VS1
              ? val?.competitors
                  .map((e) => e?.competitor?.id)
                  .filter((e) => e != null)
              : val.competitors.map((e) => e.id),
        }
      );
      if (res) {
        setIsEdit(null);
        refetch();
        // return true;
      }
    } catch (e) {
      // return false;
    }
  };

  const deleteMatch = async (indexMatch, cancle) => {
    if (!cancle) {
      await dialog({
        title: t("stages_screen.delete.confirm"),
        type: "confirm",
        confirmationText: t("stages_screen.delete.confirm_text"),
        cancellationText: t("stages_screen.delete.cancel_text"),
      });
    }

    if (matches[indexMatch]?.id) {
      try {
        const res = await api.fetcher(
          "delete",
          "/admin/match/" + matches[indexMatch]?.id
        );
        if (res) {
          setMatches((pre) =>
            pre
              .filter((e, i) => i != indexMatch)
              .map((e, i) => ({ ...e, index: i }))
          );
        }
      } catch (e) {}
    } else {
      setMatches((pre) =>
        pre
          .filter((e, i) => i != indexMatch)
          .map((e, i) => ({ ...e, index: i }))
      );
    }
    api.fetcher(null);
  };

  const addCompetitionDate = (date) => {
    if (!competitionDate.map((e) => e.date).includes(date)) {
      setCompetitionDate((pre) =>
        [
          ...pre,
          {
            date: date,
            color: getRndInteger(0, 10),
          },
        ].sort((a, b) => {
          const _a = new Date(a.date);
          const _b = new Date(b.date);
          return _a.getTime() - _b.getTime();
        })
      );
    }
  };

  return (
    <PaperContainer>
      <div
        style={{
          minHeight: 50,
          fontSize: "1rem",
          paddingTop: 10,
          fontWeight: 600,
        }}
      >
        {data?.event && <div>{`${sport_name} / ${sd_name} / ${sde_name}`}</div>}
      </div>
      <Tabs
        value={valueTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(ev, val) => {
          setValueTab(val);
        }}
        style={{ marginBottom: 10 }}
      >
        <Tab value={1} label={t("title.information")} />
        {formik.values?.stage_type &&
          formik.values?.stage_type == stage_type.QUALIFIED_USED_TABLE && (
            <Tab value={2} label={t("stages_screen.groups")} />
          )}
        <Tab value={3} label={t("stages_screen.match")} />
        {(data?.stage_type == stage_type.QUALIFIED_USED_TABLE ||
          data?.stage_type == stage_type.ROUND_ROBIN) && (
          <Tab value={4} label={t("rank_table.rank_table")} />
        )}
      </Tabs>
      <TabPanel value={valueTab} index={1}>
        <StagesForm stage={data} refetch={refetch} />
      </TabPanel>
      {/* chia bang */}

      {formik.values?.stage_type != stage_type.KNOCK_OUT && (
        <TabPanel value={valueTab} index={2}>
          <div style={{ padding: 10 }}>
            <SplitGrooupsScore
              competitors={competitors}
              groups={groups}
              setCompetitors={setCompetitors}
              setGroups={setGroups}
              event={data?.event}
              refetch={refetch}
              disabledEdit={matches.find((e) => e?.status > 1) ? true : false}
            />
          </div>
        </TabPanel>
      )}

      <TabPanel value={valueTab} index={3}>
        {/* 1vs1 */}
        {data?.event?.match_type == match_attendant_type._1VS1 &&
          formik.values?.stage_type == stage_type.QUALIFIED_USED_TABLE && (
            <>
              <div style={{ marginBottom: 8 }}>
                <Dialog
                  title={t("stages_screen.select_date")}
                  fullWidth={false}
                  content={(close) => (
                    <AddDate close={close} addDate={addCompetitionDate} />
                  )}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={isEdit != null}
                  >
                    {t("button.add_competition_date")}
                  </Button>
                </Dialog>
              </div>
              {groups.map((group, groupIndex) => (
                <MatchTable
                  competitionType={formik.values?.event?.competition_type}
                  group={group}
                  venues={venues}
                  competitionDate={competitionDate}
                  addCompetitionDate={addCompetitionDate}
                  matchAttendantType={data?.event?.match_type}
                  refetch={refetch}
                />
              ))}
            </>
          )}
        {data?.event?.match_type == match_attendant_type._1VS1 &&
          formik.values?.stage_type != stage_type.QUALIFIED_USED_TABLE && (
            <Matches
              handleOnDragEnd={handleOnDragEnd}
              competitors={competitors}
              addMatch={addMatch}
              matches={matches}
              competitionType={formik.values?.event?.competition_type}
              deleteCompetitor={deleteCompetitor}
              handleChangeMatch={handleChangeMatch}
              deleteMatch={deleteMatch}
              venues={venues}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              competitionDate={competitionDate}
              error={api.error}
              addCompetitionDate={addCompetitionDate}
              matchAttendantType={data?.event?.match_type}
            />
          )}
        {/* 1vsn */}
        {data?.event?.match_type == match_attendant_type._1VSN &&
          formik.values?.stage_type == stage_type.QUALIFIED_USED_TABLE && (
            <>
              <div style={{ marginBottom: 8 }}>
                <Dialog
                  title={t("stages_screen.select_date")}
                  fullWidth={false}
                  content={(close) => (
                    <AddDate close={close} addDate={addCompetitionDate} />
                  )}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={isEdit != null}
                  >
                    {t("button.add_competition_date")}
                  </Button>
                </Dialog>
              </div>
              {groups.map((group, groupIndex) => (
                <MatchTable
                  competitionType={formik.values?.event?.competition_type}
                  group={group}
                  venues={venues}
                  competitionDate={competitionDate}
                  addCompetitionDate={addCompetitionDate}
                  matchAttendantType={data?.event?.match_type}
                  refetch={refetch}
                />
              ))}
            </>
          )}
        {data?.event?.match_type == match_attendant_type._1VSN &&
          formik.values?.stage_type != stage_type.QUALIFIED_USED_TABLE && (
            <Matches
              handleOnDragEnd={handleOnDragEnd}
              competitors={competitors}
              addMatch={addMatch}
              matches={matches}
              competitionType={formik.values?.event?.competition_type}
              deleteCompetitor={deleteCompetitor}
              handleChangeMatch={handleChangeMatch}
              deleteMatch={deleteMatch}
              venues={venues}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              competitionDate={competitionDate}
              error={api.error}
              addCompetitionDate={addCompetitionDate}
              matchAttendantType={data?.event?.match_type}
            />
          )}
      </TabPanel>
      <TabPanel value={valueTab} index={4}>
        {data?.stage_type == stage_type.QUALIFIED_USED_TABLE && (
          <RankTable
            event={data?.event}
            unit={data?.unit}
            rankType={data?.rank_type}
            stageQualificationSettings={data?.stage_qualification_settings}
          />
        )}
        {data?.stage_type == stage_type.ROUND_ROBIN && (
          <RankTableNoGroup
            event={data?.event}
            unit={data?.unit}
            rankType={data?.rank_type}
            stageQualificationSettings={data?.stage_qualification_settings}
          />
        )}
      </TabPanel>
    </PaperContainer>
  );
}
