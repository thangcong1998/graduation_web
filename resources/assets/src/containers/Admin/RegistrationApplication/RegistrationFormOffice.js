import React from "react";
import {useAPI, useFetch} from "../../../api/api";
import {
    Card,
    Button,
    Grid
} from "@material-ui/core"
import {useTranslation} from "react-i18next";

export default function RegistrationFormOffice() {
    const api = useAPI();
    const { t } = useTranslation();
    const {data: card} = useFetch(["get", 'admin/cardTemplate']);
    const downloadForm = async (value) => {
        try {
            let res = await api.fetcher(
                "POST",
                "/admin/downloadForm/" + value,
                { path: "pdf File" },
                {
                    responseType: "blob",
                }
            );
            if (res) {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "RegisterOffline.pdf");
                document.body.appendChild(link);
                link.click();
            }
        } catch (e) { }
    }
    return (
        <div>
            <h2>{t("member_screen.template_form")}</h2>
            <Grid container spacing={3}>
                {card?.data.length !== 0 ? card?.data.map((value, index) => {
                    return (
                        <Grid item xs={3}>
                            <Button style={{
                                color: value.text_color,
                                backgroundColor: value.background_color,
                                minWidth: "200px",
                                fontSize: 30, padding: 20, textAlign: "center"
                            }}
                                    onClick={() => downloadForm(value.name)}
                            >{value.text}</Button>
                        </Grid>
                    )
                }) : null}
            </Grid>
        </div>
    )
}
