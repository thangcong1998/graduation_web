import React, { useState } from "react";
import { Tabs, Tab, Paper } from "@material-ui/core";
import VenueForm from "./VenueForm";
import VenueEventForm from "./VenueEvent/VenueEventForm";
import { useTranslation } from "react-i18next";

export default function VenueTabForm() {
    const [tab, setTab] = useState("Venue");
    const { t } = useTranslation();
    const ChangeTab = (e, value) => {
        setTab(value);
    };
    return (
        <Paper square>
            <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={ChangeTab}
                aria-label="disabled tabs example"
            >
                <Tab label={t("venue_screen.venue")} value={"Venue"} />
                <Tab
                    label={t("position_screen.add_place")}
                    value={"Position"}
                />
            </Tabs>
            {tab == "Venue" && <VenueForm />}
            {tab == "Position" && <VenueEventForm />}
        </Paper>
    );
}
