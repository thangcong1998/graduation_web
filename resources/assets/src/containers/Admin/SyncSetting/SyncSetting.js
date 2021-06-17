import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import UploadOnePicture from "../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";
import Paper from "@material-ui/core/Paper";
import { useHistory, useParams } from "react-router-dom";
import { TextFieldWrap } from "../../../components/CustomAttributes/TextField";
import ClientTable from "../../../components/choosePeopleEvent/ClientTable";
import SyncIcon from "@material-ui/icons/Sync";

const SyncSetting = React.memo((props) => {
    const formData = new FormData();
    const { t } = useTranslation();
    const history = useHistory();
    const { row, close } = props;
    const { data: data, loading: loading, revalidate: refetch } = useFetch([
        "get",
        "admin/syncDataSetting",
    ]);
    const api = useAPI();

    const [syncData, setSyncData] = useState([]);

    const syncDataSetting = async (row) => {
        try {
            let res = await api.fetcher("post", "/admin/syncData", {
                id: row?.id,
                name: row?.name,
                api_url: row?.api_url,
            });
        } catch (e) {}
    };

    useEffect(() => {
        if (data) {
            setSyncData(data?.data);
        }
    }, [data]);

    const saveApiUrl = async () => {
        try {
            let res = await api.fetcher("post", "/admin/syncDataSetting", {
                syncData: JSON.stringify(syncData),
            });
            if (res) {
                refetch();
            }
        } catch (e) {}
    };

    const syncDataSettingColumns = [
        {
            field: "name",
            title: t("sync_data_setting_screen.sync_data"),
            cellStyle: {
                fontSize: "1rem",
                // fontWeight: "600",
                overflowWrap: "anywhere",
            },
            sorting: false,
        },
        {
            field: "api_url",
            title: t("sync_data_setting_screen.api_url"),
            cellStyle: {
                overflowWrap: "anywhere",
            },
            sorting: false,
            render: (row) => (
                <TextFieldWrap
                    value={row?.api_url}
                    type={"text"}
                    onChange={(value) =>
                        setSyncData((pre) =>
                            pre.map((me) =>
                                me?.id == row?.id
                                    ? { ...me, api_url: value }
                                    : me
                            )
                        )
                    }
                />
            ),
        },
        {
            field: "sync",
            cellStyle: {
                overflowWrap: "anywhere",
                textAlign: "right",
            },
            sorting: false,
            render: (row) =>
                row?.name == "Participant" ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => syncDataSetting(row)}
                        startIcon={<SyncIcon />}
                    >
                        {t("button.sync_data")}
                    </Button>
                ),
        },
    ];

    const SyncDatasSettingTable = useMemo(
        () => (
            <ClientTable
                loading={loading}
                data={syncData}
                showCheck={false}
                columns={syncDataSettingColumns}
                title={
                    <div style={{ fontWeight: 600, fontSize: "1.5rem" }}>
                        {t("sync_data_setting_screen.sync_data_table")}
                    </div>
                }
            />
        ),
        [api]
    );

    return (
        <React.Fragment>
            <Paper style={{ padding: "5px 10px 10px 10px" }}>
                <div>{SyncDatasSettingTable}</div>
                <Button
                    style={{ marginTop: 10 }}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => saveApiUrl()}
                >
                    {t("button.save")}
                </Button>
            </Paper>
        </React.Fragment>
    );
});

export default SyncSetting;
