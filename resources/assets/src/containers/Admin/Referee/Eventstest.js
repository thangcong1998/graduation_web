import React, { useEffect, useState } from "react";
import { Tabs, Tab, Grid, Box, Typography } from "@material-ui/core";
import { useFetch } from "../../../api/api";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import CheckBox from "../../../components/form/CheckBox";
import Autocomplete from "../../../components/form/Autocomplete";

const useStyle = makeStyles((theme) => ({
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    sport_disciplines: {
        fontWeight: "600",
        borderBottom: "1px solid #000",
    },
    active: {
        color: "#f50057",
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography component={"span"}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function SPDEvent(props) {
    const { events, value, options, handleChange, sportDisciplineId } = props;
    const [val, setVal] = useState([]);
    const _value = value?.map((e) => e?.id);

    return (
        <CheckBox
            value={_value}
            label={""}
            handleChange={(e) => {
                const oldVal = events.filter(
                    (ev) => ev.sport_discipline_id != sportDisciplineId
                );
                const addVal = e.map((ev) => ({
                    id: ev,
                    sport_discipline_id: sportDisciplineId,
                }));
                handleChange([...oldVal, ...addVal]);
            }}
            options={options}
            empty={options.length == 0}
        />
    );
}
function countEven(sport, events) {
    let count = 0;
    let event = 0;
    sport?.sport_disciplines?.forEach((e) => {
        event =
            event +
            events.filter((ev) => ev.sport_discipline_id == e.id).length;
        e?.sport_discipline_events?.forEach((ev) => {
            count = count + 1;
        });
    });
    return event + "/" + count;
}

export default function Events(props) {
    const { events, changeEvent, sports, sport, handleChangeSport } = props;
    const classes = useStyle();
    const { t, i18n } = useTranslation();
    const curLang = i18n.languages[0];
    const [sportTab, setSportTab] = useState(0);
    function handleChangeSportTab(ev, val) {
        setSportTab(val);
    }

    const checkEvent = (e) => {
        changeEvent(e);
    };
    return (
        <Grid container spacing={1}>
            <Grid
                item
                md={3}
                xs={3}
                style={{ borderRight: "1px solid #00000024" }}
            >
                <Autocomplete
                    endpoint={"admin/sport"}
                    queryField={
                        curLang == "vi" ? "name_like" : "english_name_like"
                    }
                    labelField={curLang == "vi" ? "name" : "english_name"}
                    value={sport}
                    label={t("referee_screen.sport")}
                    handleChange={(e) => {
                        handleChangeSport(e);
                    }}
                />
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={sportTab}
                    onChange={handleChangeSportTab}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {sports?.map((sp, index) => (
                        <Tab
                            value={index}
                            label={
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        textAlign: "left",
                                    }}
                                >
                                    <span>
                                        {i18n.languages[0] == "vi"
                                            ? sp?.name
                                            : sp?.english_name}
                                    </span>
                                    <span>{countEven(sp, events)}</span>
                                </div>
                            }
                            style={{
                                fontWeight: sportTab == index ? 600 : 400,
                            }}
                            key={index}
                        />
                    ))}
                </Tabs>
            </Grid>
            <Grid item md={9} xs={9}>
                {sports?.map((sp, index) => (
                    <TabPanel value={sportTab} index={index} key={index}>
                        <Grid container spacing={3}>
                            {sp?.sport_disciplines.length > 0 ? (
                                sp?.sport_disciplines?.map((spd, spdIndex) => (
                                    <Grid item md={6} xs={6} key={spdIndex}>
                                        <div>
                                            <div
                                                className={
                                                    classes.sport_disciplines
                                                }
                                            >
                                                {curLang == "vi"
                                                    ? spd?.name
                                                    : spd?.english_name}
                                            </div>
                                            <SPDEvent
                                                events={events}
                                                options={spd.sport_discipline_events.map(
                                                    (e, eIndex) => ({
                                                        value: e?.id,
                                                        label: `${
                                                            eIndex + 1
                                                        }. ${
                                                            curLang == "vi"
                                                                ? e?.name
                                                                : e?.english_name
                                                        }`,
                                                    })
                                                )}
                                                handleChange={(e) =>
                                                    checkEvent(e)
                                                }
                                                value={events.filter(
                                                    (e) =>
                                                        e?.sport_discipline_id ==
                                                        spd?.id
                                                )}
                                                sportDisciplineId={spd.id}
                                            />
                                        </div>
                                    </Grid>
                                ))
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    {t("title.empty_data")}
                                </div>
                            )}
                        </Grid>
                    </TabPanel>
                ))}
            </Grid>
        </Grid>
    );
}
