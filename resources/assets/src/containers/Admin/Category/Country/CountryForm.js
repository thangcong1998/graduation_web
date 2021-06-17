import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import UploadOnePicture from "../../../../components/UploadOnePicture";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";

export default function (props) {
    const formData = new FormData();
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const formik = useFormik({
        initialValues: {
            name: null,
            country_code_3_digits: null,
            files: null,
        },
        onSubmit: async (values) => {
            formData.append("name", values?.name ? values?.name : "");
            formData.append(
                "english_name",
                values?.english_name ? values?.english_name : ""
            );
            formData.append(
                "country_code_3_digits",
                values?.country_code_3_digits
                    ? values?.country_code_3_digits
                    : ""
            );
            formData.append("files", files);
            formData.append(
                "country_id",
                values?.country_id ? values?.country_id : ""
            );
            params.id
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    params.id ? "admin/country/" + params.id : "admin/country",
                    formData
                );
                if (res) {
                    history.push("/country");
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            name: Yup.string()
                .required(t("country_screen.name") + " " + t("errors.required"))
                .max(
                    50,
                    t("country_screen.name") +
                        " " +
                        t("errors.max.before") +
                        " 50 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            country_code_3_digits: Yup.string()
                .required(
                    t("country_screen.country_code_3_digits") +
                        " " +
                        t("errors.required")
                )
                .max(
                    6,
                    t("country_screen.country_code_3_digits") +
                        t("errors.max.before") +
                        " 6 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            files: Yup.string()
                .required(t("country_screen.flag") + " " + t("errors.required"))
                .trim()
                .nullable(),
        }),
    });
    const [files, setFiles] = useState();

    const api = useAPI();
    const params = useParams();
    const history = useHistory();
    const { data: data } = useFetch([
        params?.id ? "get" : null,
        params?.id ? "admin/country/" + params.id : null,
    ]);
    useEffect(() => {
        if (data) {
            inputs[0]
                .filter((e) => e.field)
                .forEach((e, index) => {
                    formik.setFieldValue(e.field, data?.[e.field]);
                });
            setFiles(data?.flag_url);
            formik.setFieldValue("country_id", data.id);
        }
    }, [data]);
    useEffect(() => {
        if (files) {
            formik.setFieldValue("files", files);
        }
    }, [files]);
    const inputs = useMemo(
        () => [
            [
                {
                    field: "name",
                    label: t("country_screen.name"),
                    required: true,
                    value: formik.values?.name,
                    error:
                        (formik.touched.name && formik.errors?.name) ||
                        api.error?.name,
                    handleChange: (e) => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "country_code_3_digits",
                    label: t("country_screen.country_code_3_digits"),
                    required: true,
                    value: formik.values?.country_code_3_digits,
                    error:
                        api.error?.country_code_3_digits ||
                        (formik.touched.country_code_3_digits &&
                            formik.errors?.country_code_3_digits),
                    handleChange: (e) =>
                        formik.setFieldValue("country_code_3_digits", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
            ],
        ],
        [formik]
    );
    return (
        <PaperContainer>
            <Forms inputs={inputs} />
            <div style={{ padding: 20 }}>
                <h3>{t("country_screen.country_flag")}</h3>
                <UploadOnePicture
                    files={files}
                    setFiles={setFiles}
                    title={t("country_screen.country_flag_upload")}
                    height={"300px"}
                    error={
                        api.error?.files ||
                        (formik.touched.files && formik.errors?.files)
                    }
                    formik={formik}
                />
            </div>
            {params?.id ? (
                checkPerm(perms, "country_edit") ? (
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={null}
                        onClick={formik.handleSubmit}
                        disableElevation
                    >
                        {t("button.update")}
                    </Button>
                ) : (
                    <div></div>
                )
            ) : ( checkPerm(perms, "country_edit") ?
                (<Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={formik.handleSubmit}
                    disableElevation
                >
                    {t("button.add")}
                </Button>) : null
            )}
        </PaperContainer>
    );
}
