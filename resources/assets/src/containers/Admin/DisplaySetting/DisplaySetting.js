import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import UploadOnePicture from "../../../components/UploadOnePicture";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ButtonSolashi from "../../../components/button/ButtonSolashi";

const DisplaySetting = React.memo((props) => {
    const formData = new FormData();
    const { t } = useTranslation();
    const [image, setImage] = useState();
    const [logo, setLogo] = useState();
    const api = useAPI();
    const params = useParams();
    const history = useHistory();

    const { data: data, loading: loading, revalidate: reFetch } = useFetch(
        ["get", "admin/display_setting"],
        {
            onSuccess: (res) => {
                if (res !== undefined) {
                    setImage(res?.image_url);
                    setLogo(res?.logo_url);
                }
            },
        }
    );

    const res = data;
    const formik = useFormik({
        initialValues: {
            logo: null,
        },
        onSubmit: async (values) => {
            formData.append("logo", logo);
            res !== undefined
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                await api.fetcher(
                    "post",
                    res !== undefined
                        ? "admin/display_setting/" + res?.id
                        : "admin/display_setting",
                    formData
                );
                if (res) {
                    history.push("/displaySetting");
                }
            } catch (e) {}
        },
    });

    useEffect(() => {
        if (logo) {
            formik.setFieldValue("logo", logo);
        }
    }, [logo]);

    return (
        <Paper style={{ padding: "5px 10px 10px 10px" }}>
            <div>
                <h3 style={{ textAlign: "center" }}>
                    {t("display_setting.logo")}
                </h3>
                <UploadOnePicture
                    files={logo}
                    setFiles={setLogo}
                    title={t("display_setting.logo_upload")}
                    height={"300px"}
                    error={
                        api.error?.logo ||
                        (formik.touched.logo && formik.errors?.logo)
                    }
                    formik={formik}
                />
            </div>

            <ButtonSolashi
                variant="contained"
                color="primary"
                startIcon={res?.id ? null : <SaveIcon />}
                onClick={formik.handleSubmit}
                style={{ display: "flex", marginLeft: "auto", marginRight: 10 }}
                loading={formik.isSubmitting}
            >
                {res?.id ? t("button.update") : t("button.add")}
            </ButtonSolashi>
        </Paper>
    );
});
export default DisplaySetting;
