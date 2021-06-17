import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import i18n from "../../../i18n/i18n";
import ButtonAdd from "../../../components/button/ButtonAddSolashi";
import ButtonUpdate from "../../../components/button/ButtonUpdateSolashi";
import * as Yup from "yup";
import { adminPrefix } from "../../../routes/AdminRoutes";
import UploadOnePicture from "../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";

export default function (props) {
    const { row, close, refetch } = props;
    const api = useAPI();
    const { perms } = useContext(AuthContext);
    const { t } = useTranslation();
    const history = useHistory();

    const [files, setFiles] = useState();

    useEffect(() => {
        if (files) {
            formik.setFieldValue("icon", true);
        }
    }, [files]);
    useEffect(() => {
        if (row) setFiles(row?.icon);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: row ? row.name : null,
            english_name: row ? row.english_name : null,
            icon: null,
            code: row ? row.code : null,
        },
        onSubmit: async (values) => {
            try {
                let formData = new FormData();
                formData.append(
                    "english_name",
                    formik.values?.english_name
                        ? formik.values?.english_name
                        : ""
                );
                formData.append(
                    "name",
                    formik.values?.name ? formik.values?.name : ""
                );
                formData.append(
                    "code",
                    formik.values?.code ? formik.values?.code : ""
                );
                formData.append("files", files);
                formData.append(
                    "sport_id",
                    values?.sport_id ? values?.sport_id : ""
                );
                formData.append("_method", row ? "put" : "post");
                let res = await api.fetcher(
                    "post",
                    row ? "/admin/sport/" + row.id : "/admin/sport",
                    formData
                );
                if (res) {
                    close();
                    refetch();
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required(t("sport_screen.name") + " " + t("errors.required"))
                .max(
                    255,
                    t("sport_screen.name") +
                        " " +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .nullable()
                .trim(),
            english_name: Yup.string()
                .required(
                    t("sport_screen.english_name") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("sport_screen.english_name") +
                        " " +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .nullable()
                .trim(),
            icon:
                !files &&
                Yup.object()
                    .required(
                        t("sport_screen.icon") + " " + t("errors.required")
                    )
                    .nullable(),
            code: Yup.string()
                .required(t("sport_screen.code") + " " + t("errors.required"))
                .max(
                    3,
                    t("sport_screen.code") +
                        " " +
                        t("errors.max.before") +
                        " 3 " +
                        t("errors.max.after")
                )
                .nullable()
                .trim(),
        }),
    });

    useEffect(() => {
        if (row) {
            formik.setFieldValue("sport_id", row.id);
        }
    }, [row]);

    const inputs = useMemo(
        () => [
            [
                {
                    field: "name",
                    label: i18n.t("sport_screen.name") + " *",
                    value: formik.values?.name,
                    error:
                        api.error?.name ||
                        (formik.touched.name && formik.errors?.name),
                    handleChange: (e) => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "english_name",
                    label: i18n.t("sport_screen.english_name") + " *",
                    value: formik.values?.english_name,
                    error:
                        api.error?.english_name ||
                        (formik.touched.english_name &&
                            formik.errors.english_name),
                    handleChange: (e) =>
                        formik.setFieldValue("english_name", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "code",
                    label: i18n.t("sport_screen.code") + " *",
                    value: formik.values?.code,
                    error:
                        api.error?.code ||
                        (formik.touched.code && formik.errors?.code),
                    handleChange: (e) => formik.setFieldValue("code", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
            ],
        ],
        [formik, api]
    );

    return (
        <div>
            <Forms inputs={inputs} />
            <UploadOnePicture
                files={files}
                setFiles={setFiles}
                title={i18n.t("upload.message")}
                // height={"100px"}
                // width={"100px"}
                error={
                    api.errors?.icon ||
                    (formik.touched.icon && formik.errors.icon)
                }
            />
            <div style={{ marginBottom: 10 }}></div>
            {row?.id ? (
                checkPerm(perms, "sport_management") ? (
                    <ButtonUpdate
                        style={{ marginLeft: 10 }}
                        variant="contained"
                        loading={api.loading}
                        // text={i18n.t("sport_screen.user")}
                        onClick={formik.handleSubmit}
                    />
                ) : (
                    <div></div>
                )
            ) : (
                <ButtonAdd
                    style={{ marginLeft: 10 }}
                    variant="contained"
                    loading={api.loading}
                    text={i18n.t("sport_screen.sport")}
                    onClick={formik.handleSubmit}
                />
            )}
        </div>
    );
}
