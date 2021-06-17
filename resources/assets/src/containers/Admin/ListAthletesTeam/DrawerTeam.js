import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Paper, makeStyles } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ChooseItem from "../../../components/choosePeopleEvent/ChooseItem";
import memberInput from "./MemberInput";
import { CheckSex, profile_status } from "../../../common/constants";
import { adminApi } from "../../../routes/AdminRoutes";
import { userApi } from "../../../routes/AdminRoutes";
import { AuthContext } from "../../AuthProvider";
const useStyle = makeStyles((theme) => ({
  container: {},
}));

export default function DrawerMember(props) {
  const { members, setMembers, teamId, sport_id } = props;
  const { admin, user, perms } = useContext(AuthContext);
  const [tempMembers, setTempMembers] = useState([]);
  const [firstOpen, setFirstOpen] = useState(true);
  const { t, i18n } = useTranslation();
  const classes = useStyle();
  const [tab, setTab] = useState(1);
  const handleChangeTab = (ev, val) => {
    setTab(val);
  };
  const endPointApi = adminApi;
  useEffect(() => {
    setTempMembers(members);
    setFirstOpen(false);
  }, []);

  const { columns: memberColumns, filterInputs: memberFilter } = memberInput();
  function onCheckMembers(check) {
    setTempMembers(
      check.map((e) => ({
        ...e,
        organization:
          typeof e?.organization == "object"
            ? e?.organization?.abbreviation
            : e?.organization,
        function:
          typeof e?.function == "object"
            ? i18n.languages[0] == "en"
              ? e?.function?.english_name
              : e?.function?.name
            : e?.function,
        sport:
          typeof e?.sport == "object"
            ? i18n.languages[0] == "en"
              ? e?.sport?.english_name
              : e?.sport?.name
            : e?.sport,
        team_name:
          i18n.languages[0] == "en" ? e?.team?.english_name : e?.team?.name,
        sex: e?.sex == 1 || e?.sex == 2 ? CheckSex(e?.sex, t) : e?.sex,
      }))
    );
  }
  return (
    <React.Fragment>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab label={t("member_screen.member")} value={1} />
      </Tabs>
      <Paper
        className={classes.container}
        style={{ padding: "5px 10px 10px 10px", marginBottom: 50 }}
      >
        <div style={{ display: tab !== 1 && "none" }}>
          <ChooseItem
            items={tempMembers}
            setItems={(check) => onCheckMembers(check)}
            columns={memberColumns}
            filterInputs={memberFilter}
            // endpoint={`${endPointApi}/participant?team_id_equal=${teamId}&sport_id_equal=${sport_id}`}
            endpoint={`${endPointApi}/participant?team_id_equal=${teamId}`}
          />
        </div>
      </Paper>
      <div style={{ position: "fixed", right: 20, bottom: 10 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setMembers(tempMembers);
          }}
        >
          {t("button.save")}
        </Button>
      </div>
    </React.Fragment>
  );
}
