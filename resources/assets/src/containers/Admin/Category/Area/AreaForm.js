import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import UploadOnePicture from "../../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";

const AreaForm = React.memo((props) => {
    const formData = new FormData();
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const { row, close, refetch } = props;
    const [files, setFiles] = useState();
    const formik = useFormik({
        initialValues: {
            name: null,
            icon_url: null,
        },
        onSubmit: async (values) => {
            formData.append("name", values?.name ? values?.name : "");
            formData.append("area_id", values?.area_id ? values?.area_id : "");
            formData.append("files", files);
            row?.id
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    row?.id ? "admin/area/" + row?.id : "admin/area",
                    formData
                );
                if (res) {
                    refetch();
                    close();
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            icon_url:
                !files &&
                Yup.object()
                    .required(
                        t("area_screen.icon_url") + " " + t("errors.required")
                    )
                    .nullable(),
            name: Yup.string()
                .required(t("area_screen.name") + " " + t("errors.required"))
                .max(
                    255,
                    t("area_screen.name") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
        }),
    });
    const api = useAPI();
    useEffect(() => {
        if (row) {
            formik.setFieldValue("name", row.name);
            formik.setFieldValue("area_id", row.id);
        }
    }, [row]);
    useEffect(() => {
        if (files) {
            formik.setFieldValue("icon", true);
        }
    }, [files]);
    useEffect(() => {
        if (row) setFiles(row?.icon_url);
    }, []);
    const inputs = useMemo(
        () => [
            [
                {
                    field: "name",
                    label: t("area_screen.name"),
                    required: true,
                    value: formik.values?.name,
                    error:
                        (formik.touched.name && formik.errors?.name) ||
                        api.error?.name,
                    handleChange: (e) => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 12, md: 12 },
                },
            ],
        ],
        [formik]
    );
    return (
        <div>
            <Forms inputs={inputs} />
            <h3>{t("area_screen.icon_url")}</h3>
            <UploadOnePicture
                files={files}
                setFiles={setFiles}
                title={t("area_screen.icon_url") + " *"}
                height={"100px"}
                width={"auto"}
                error={
                    api.errors?.icon_url ||
                    (formik.touched.icon_url && formik.errors.icon_url)
                }
            />
            {row?.id ? (
                checkPerm(perms, "area_edit") ? (
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
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={formik.handleSubmit}
                    disableElevation
                >
                    {t("button.add")}
                </Button>
            )}
        </div>
    );
});
export default AreaForm;
