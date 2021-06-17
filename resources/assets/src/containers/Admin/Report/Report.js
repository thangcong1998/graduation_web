import React, { useState } from "react";
import { Paper, Button } from "@material-ui/core";
import Autocomplete from "../../../components/form/Autocomplete";
import { useTranslation } from "react-i18next";
import { useAPI } from "../../../api/api";

export default function Report() {
  const { i18n, t } = useTranslation();
  const [sport, setSport] = useState();
  const api = useAPI();
  const download = async (row) => {
    let formData = new FormData();
    formData.append("sport_id", sport ? sport?.id : "");
    formData.append("_method", "POST");
    try {
      let res = await api.fetcher(
        "post",
        "/admin/export_report_docx",
        formData,
        {
          responseType: "blob",
          timeout: 120000,
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          "Report_" + sport?.english_name + ".docx"
        );
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };
  return (
    <Paper style={{ padding: 20 }}>
      <Autocomplete
        endpoint={"admin/sport"}
        queryField={i18n.language == "vi" ? "name_like" : "english_name_like"}
        labelField={i18n.language == "vi" ? "name" : "english_name"}
        valueField={"id"}
        label={t("sport_screen.sport")}
        value={sport}
        handleChange={(e) => {
          setSport(e);
        }}
        fullWidth
      />
      <br />
      {sport && (
        <Button
          onClick={() => download()}
          variant={"contained"}
          color={"primary"}
          size={"small"}
        >
          {t("report_screen.download")}
        </Button>
      )}
    </Paper>
  );
}
