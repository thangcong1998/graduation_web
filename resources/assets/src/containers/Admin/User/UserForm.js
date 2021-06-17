import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useAPI, useFetch } from "../../../api/api";
import { useTranslation } from "react-i18next";
import ButtonCreate from "../../../components/button/ButtonCreate";
import ButtonUpdate from "../../../components/button/ButtonUpdateSolashi";
import * as Yup from "yup";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";

export default function (props) {
    const api = useAPI();
    const { admin, perms } = useContext(AuthContext);
    const history = useHistory();
    const params = useParams();
    const { t, i18n } = useTranslation();
    const { data: user } = useFetch(
        params?.id ? ["get", "/admin/user/" + params?.id] : null
    );
    const { data: organization } = useFetch(["get", "/admin/organization"]);

    const formik = useFormik({
        initialValues: {
            user_name: null,
            password: null,
            phone: null,
            email: null,
            name: null,
            role_id: null,
            role: null,
        },
        onSubmit: async (values) => {
            try {
                let res = await api.fetcher(
                    params?.id ? "put" : "post",
                    params?.id ? "/admin/user/" + params?.id : "/admin/user",
                    {
                        ...values,
                    }
                );
                if (res) {
                    history.push("/user");
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            user_name: Yup.string()
                .required(
                    t("user_screen.user_name") + " " + t("errors.required")
                )
                .min(
                    6,
                    t("user_screen.user_name") +
                        " " +
                        t("errors.min.before") +
                        " 6 " +
                        t("errors.min.after")
                )
                .max(
                    30,
                    t("user_screen.user_name") +
                        " " +
                        t("errors.max.before") +
                        " 30 " +
                        t("errors.max.after")
                )
                .nullable()
                .trim(),
            password: params?.id
                ? Yup.string()
                      .min(
                          6,
                          t("user_screen.password") +
                              " " +
                              t("errors.min.before") +
                              " 6 " +
                              t("errors.min.after")
                      )
                      .max(
                          32,
                          t("user_screen.password") +
                              " " +
                              t("errors.max.before") +
                              " 32 " +
                              t("errors.max.after")
                      )
                      .nullable()
                : Yup.string()
                      .required(
                          t("user_screen.password") + " " + t("errors.required")
                      )
                      .min(
                          6,
                          t("user_screen.password") +
                              " " +
                              t("errors.min.before") +
                              " 6 " +
                              t("errors.min.after")
                      )
                      .max(
                          32,
                          t("user_screen.password") +
                              " " +
                              t("errors.max.before") +
                              " 32 " +
                              t("errors.max.after")
                      )
                      .nullable(),
            phone: Yup.string()
                .required(t("user_screen.phone") + " " + t("errors.required"))
                .max(
                    15,
                    t("user_screen.phone") +
                        " " +
                        t("errors.max.before") +
                        " 15 " +
                        t("errors.max.after")
                )
                .matches(
                    /^[0-9]*$/,
                    t("user_screen.phone") + " " + t("errors.number")
                )
                .nullable()
                .trim(),
            name: Yup.string()
                .required(t("user_screen.name") + " " + t("errors.required"))
                .max(
                    50,
                    t("user_screen.name") +
                        " " +
                        t("errors.max.before") +
                        " 50 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            email: Yup.string()
                .required(t("user_screen.email") + " " + t("errors.required"))
                .max(
                    50,
                    t("user_screen.email") +
                        " " +
                        t("errors.max.before") +
                        " 50 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            role: Yup.object()
                .required(t("user_screen.role") + " " + t("errors.required"))
                .nullable(),
        }),
    });

    useEffect(() => {
        if (user) {
            formik.setValues(user);
        }
    }, [user]);

    const inputs = useMemo(
        () => [
            [
                {
                    field: "user_name",
                    label: t("user_screen.user_name"),
                    required: true,
                    value: formik.values?.user_name,
                    error:
                        formik.touched.user_name && formik.errors?.user_name
                            ? formik.touched.user_name &&
                              formik.errors?.user_name
                            : api.error?.user_name,
                    handleChange: (e) => formik.setFieldValue("user_name", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: params?.id ? true : false,
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "password",
                    label: t("user_screen.password"),
                    required: true,
                    value: formik.values?.password,
                    error:
                        api.error?.password ||
                        (formik.touched.password && formik.errors.password),
                    handleChange: (e) => formik.setFieldValue("password", e),
                    type: "password",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
            ],
            [
                {
                    field: "name",
                    label: t("user_screen.name"),
                    required: true,
                    value: formik.values?.name,
                    error:
                        formik.touched.name && formik.errors?.name
                            ? formik.touched.name && formik.errors?.name
                            : api.error?.name,
                    handleChange: (e) => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "phone",
                    label: t("user_screen.phone"),
                    required: true,
                    value: formik.values?.phone,
                    error:
                        formik.touched.phone && formik.errors.phone
                            ? formik.touched.phone && formik.errors.phone
                            : api.error?.phone,
                    handleChange: (e) => formik.setFieldValue("phone", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "email",
                    label: t("user_screen.email"),
                    required: true,
                    value: formik.values?.email,
                    error:
                        formik.touched.email && formik.errors?.email
                            ? formik.touched.email && formik.errors?.email
                            : api.error?.email,
                    handleChange: (e) => formik.setFieldValue("email", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
                {
                    field: "role",
                    label: t("user_screen.role"),
                    required: true,
                    error:
                        formik.touched.role && formik.errors.role
                            ? formik.touched.role && formik.errors.role
                            : api.error?.role_id,
                    value: formik.values?.role,
                    endpoint: "admin/role?",
                    queryField: "display_name_like",
                    labelField: "display_name",
                    handleChange: (e) => {
                        formik.setFieldValue("role", e);
                        formik.setFieldValue("role_id", e?.id);
                        if (e?.id === 1) {
                            formik.setFieldValue(
                                "organization",
                                organization?.data.find((el) => el.id === 6)
                            );
                            formik.setFieldValue("organization_id", 6);
                        } else if (
                            e?.id === 2 &&
                            formik.values?.organization_id == 6
                        ) {
                            formik.setFieldValue("organization", null);
                            formik.setFieldValue("organization_id", null);
                        }
                        if (e?.id != 2) {
                            formik.setFieldValue("team", null);
                            formik.setFieldValue("team_id", null);
                        }
                    },
                    disabled: checkRole(),
                    type: "autocomplete",
                    size: "medium",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 },
                },
            ],
        ],
        [formik, api]
    );
    function checkRole() {
        if (user?.role_id === 1) {
            return true;
        }
        return false;
    }

    return (
        <PaperContainer>
            <Forms inputs={inputs} />
            {params?.id ? (
                checkPerm(perms, "user_edit") ? (
                    <ButtonUpdate
                        style={{ marginLeft: 10 }}
                        variant="contained"
                        loading={api.loading}
                        // text={i18n.t("user_screen.user")}
                        onClick={formik.handleSubmit}
                    />
                ) : (
                    <div></div>
                )
            ) : (
                <ButtonCreate
                    variant="contained"
                    loading={api.loading}
                    text={t("user_screen.user")}
                    onClick={formik.handleSubmit}
                />
            )}
        </PaperContainer>
    );
}
