import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import RegistrationMemberForm from "../../RegistrationMemberForm";
import RecordMemberList from "../RegistrationApplication/RecordMember/RecordMemberList";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            // hidden={}
            style={{ display: value !== index ? "none" : "unset" }}
            {...other}
        >
            {/* {value === index && ( */}
            <Box>
                <Typography>{children}</Typography>
            </Box>
            {/* )} */}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function RegistrationForm() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const location = useLocation();
    const competitor_id = location.pathname.split("/")[2];
    const { t } = useTranslation();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
            >
                <Tab
                    label={t("record_participant_screen.information")}
                    {...a11yProps(0)}
                />
                <Tab
                    label={t("record_participant_screen.record")}
                    {...a11yProps(1)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <RegistrationMemberForm />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <RecordMemberList competitor_id={competitor_id} />
            </TabPanel>
        </div>
    );
}
