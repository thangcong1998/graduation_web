import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button, makeStyles, Grid } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/i18n";
import PaperContainer from "../../../../components/PaperContainer";
import { checkPerm } from "../../../../common/constants";
import { AuthContext } from "../../../AuthProvider";
import barcode from "../../../../assets/image/barcode.png";

const useStyle = makeStyles(theme => ({
    cardContainer: {
        border: "1px solid #000000",
        width: 300,
        height: 410,
        backgroundSize: "300px 410px"
    },
    leftFront: {
        width: 156.87
    },
    avata: {
        width: 121.3,
        height: 161.5
    },
    frontLogo: {
        height: 121.3
    },
    frontMiddle: {
        fontSize: 15
    },
    frontBottom: {},
    listIcon: {
        textAlign: "right"
    },
    icon: {
        height: 17,
        marginLeft: 3,
        border: "1px solid #000"
    },
    barcode: {
        position: "absolute",
        bottom: 0,
        left: 5,
        width: 90,
        "& img": {
            width: 90
        }
    },
    backAvata: {
        width: 60.5,
        height: 80.5,
        "& img": {
            width: 60.5,
            height: 80.5
        }
    },
    backTop: {
        height: 89,
        paddingLeft: 17
    },
    info: {
        width: 157.7,
        marginLeft: 5,
        fontSize: 9
    },
    condition: {
        height: 37.5,
        fontSize: 7,
        borderBottom: "1px solid #CCC",
        borderTop: "1px solid #CCC",
        verticalAlign: "top",
        textAlign: "left",
        padding: "2px 1px",
        margin: "1px 5px"
    },
    backIcon: {
        fontSize: 6,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
        verticalAlign: "top",
        "& td": {
            verticalAlign: "top"
        }
    },
    backBottom: {
        position: "absolute",
        bottom: 2,
        textAlign: "center",
        width: "100%",
        fontWeight: 600
    }
}));
export default function(props) {
    const formData = new FormData();
    const { t } = useTranslation();
    const classes = useStyle();
    const { perms } = useContext(AuthContext);
    const [staff, setStaff] = useState(1);
    const formik = useFormik({
        initialValues: {
            name: null,
            english_name: null,
            code: null,
            sub_code: null,
            local_code: null,
            organization: null,
            card_template: null,
            area: null,
            zone: null,
            vehicle: null,
            is_staff: 1,
            is_volunteer: 1
        },
        onSubmit: async values => {
            formData.append("name", values?.name ? values?.name : "");
            formData.append(
                "english_name",
                values?.english_name ? values?.english_name : ""
            );
            formData.append("code", values?.code ? values?.code : "");
            formData.append(
                "sub_code",
                values?.sub_code ? values?.sub_code : ""
            );
            formData.append(
                "organization_id",
                values?.organization ? values?.organization?.id : ""
            );
            formData.append(
                "card_template_id",
                values?.card_template ? values?.card_template.id : ""
            );
            // formData.append(
            //     "zone",
            //     values?.zone ? JSON.stringify(values?.zone) : ""
            // );
            // formData.append(
            //     "area",
            //     values?.area ? JSON.stringify(values?.area) : ""
            // );
            // formData.append(
            //     "vehicle",
            //     values?.vehicle ? JSON.stringify(values?.vehicle) : ""
            // );
            formData.append(
                "function_id",
                params?.id ? values.function_id : ""
            );
            formData.append(
                "is_staff",
                values?.organization?.is_holder === 2 && staff == 1 ? 2 : 1
            );
            formData.append(
                "is_volunteer",
                values?.organization?.is_holder === 2 && staff == 2 ? 2 : 1
            );
            params.id
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    params.id
                        ? "admin/function/" + params.id
                        : "admin/function",
                    formData
                );
                if (res) {
                    history.push("/function");
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            english_name: Yup.string()
                .required(
                    t("function_screen.english_name") +
                        " " +
                        t("errors.required")
                )
                .max(
                    255,
                    t("function_screen.english_name") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            name: Yup.string()
                .required(
                    t("function_screen.name") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("function_screen.name") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            code: Yup.string()
                .required(
                    t("function_screen.code") + " " + t("errors.required")
                )
                .max(
                    15,
                    t("function_screen.code") +
                        t("errors.max.before") +
                        " 15 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            sub_code: Yup.string()
                .required(
                    t("function_screen.sub_code") + " " + t("errors.required")
                )
                .max(
                    15,
                    t("function_screen.sub_code") +
                        t("errors.max.before") +
                        " 15 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            organization: Yup.object()
                .required(
                    t("function_screen.organization") +
                        " " +
                        t("errors.required")
                )
                .nullable(),
            card_template: Yup.object()
                .required(
                    t("function_screen.card_template") +
                        " " +
                        t("errors.required")
                )
                .nullable()
            // area: Yup.string()
            //     .required(
            //         t("function_screen.area") + " " + t("errors.required")
            //     )
            //     .trim()
            //     .nullable(),
            // zone: Yup.string()
            //     .required(
            //         t("function_screen.zone") + " " + t("errors.required")
            //     )
            //     .trim()
            //     .nullable(),
            // vehicle: Yup.string()
            //     .required(
            //         t("function_screen.vehicle") + " " + t("errors.required")
            //     )
            //     .trim()
            //     .nullable()
        })
    });
    const api = useAPI();
    const params = useParams();
    const history = useHistory();
    const { data: data } = useFetch([
        params?.id ? "get" : null,
        params?.id ? "admin/function/" + params.id : null
    ]);
    useEffect(() => {
        if (data) {
            inputs[0]
                .filter(e => e.field)
                .forEach((e, index) => {
                    formik.setFieldValue(e.field, data?.[e.field]);
                });
            formik.setFieldValue("function_id", data?.id);
            // let area = [];
            // let vehicle = [];
            // let zone = [];
            // if (data.area_relation) {
            //     data.area_relation.forEach(value => {
            //         area.push(String(value.id));
            //     });
            // }
            // if (data.zone_relation) {
            //     data.zone_relation.forEach(value => {
            //         zone.push(String(value.id));
            //     });
            // }
            // if (data.vehicle_relation) {
            //     data.vehicle_relation.forEach(value => {
            //         vehicle.push(String(value.id));
            //     });
            // }
            // formik.setFieldValue("area", area);
            // formik.setFieldValue("zone", zone);
            // formik.setFieldValue("vehicle", vehicle);
            formik.setFieldValue("is_staff", data?.is_staff);
            formik.setFieldValue("is_volunteer", data?.is_volunteer);
            if (data?.is_staff == 2) {
                setStaff(1);
            }
            if (data?.is_volunteer == 2) {
                setStaff(2);
            }
        }
    }, [data]);
    // const { data: area } = useFetch(["get", "/admin/area"]);
    // const _area = useMemo(() => {
    //     if (area) {
    //         return area.data.map(e => ({
    //             label: e.id + "." + e.name,
    //             value: e.id,
    //             icon_url: e?.icon_url,
    //             name: e.name
    //         }));
    //     }
    //     return [];
    // }, [area]);
    // const { data: vehicle } = useFetch(["get", "/admin/vehicle"]);
    // const _vehicle = useMemo(() => {
    //     if (vehicle) {
    //         return vehicle.data.map(e => ({
    //             label: e.id + "." + e.name,
    //             value: e.id,
    //             icon_url: e?.icon_url,
    //             name: e.name
    //         }));
    //     }
    //     return [];
    // }, [vehicle]);
    // const { data: zone } = useFetch(["get", "/admin/zone"]);
    // const _zone = useMemo(() => {
    //     if (zone) {
    //         return zone.data.map(e => ({
    //             label: e.id + "." + e.name,
    //             value: e.id,
    //             icon_url: e?.icon_url,
    //             name: e.name
    //         }));
    //     }
    //     return [];
    // }, [zone]);

    const inputs = useMemo(
        () => [
            [
                {
                    field: "name",
                    label: t("function_screen.name") + " *",
                    value: formik.values?.name,
                    error:
                        api.error?.name ||
                        (formik.touched.name && formik.errors?.name),
                    handleChange: e => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 6, md: 6 }
                },
                {
                    field: "english_name",
                    label: t("function_screen.english_name") + " *",
                    value: formik.values?.english_name,
                    error:
                        api.error?.english_name ||
                        (formik.touched.english_name &&
                            formik.errors?.english_name),
                    handleChange: e => formik.setFieldValue("english_name", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 }
                },
                {
                    field: "code",
                    label: t("function_screen.code") + " *",
                    value: formik.values?.code,
                    error:
                        api.error?.code ||
                        (formik.touched.code && formik.errors?.code),
                    handleChange: e => formik.setFieldValue("code", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 }
                },
                {
                    field: "sub_code",
                    label: t("function_screen.sub_code") + " *",
                    value: formik.values?.sub_code,
                    error:
                        api.error?.sub_code ||
                        (formik.touched.sub_code && formik.errors?.sub_code),
                    handleChange: e => formik.setFieldValue("sub_code", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 }
                },
                {
                    field: "organization",
                    label: t("function_screen.organization") + " *",
                    endpoint: "admin/organization",
                    queryField: i18n.language == "vi" ? "name" : "english_name",
                    valueField: "id",
                    value: formik.values?.organization,
                    error:
                        api.error?.organization ||
                        (formik.touched.organization &&
                            formik.errors?.organization),
                    handleChange: value => {
                        formik.setFieldValue("organization", value);
                    },
                    type: "autocomplete",
                    grid: { xs: 12, sm: 6, md: 6 },
                    size: "medium"
                },
                {
                    field: "card_template",
                    label: t("function_screen.card_template") + " *",
                    endpoint: "admin/cardTemplate",
                    queryField: "name",
                    valueField: "id",
                    value: formik.values?.card_template,
                    error:
                        api.error?.card_template ||
                        (formik.touched.card_template &&
                            formik.errors?.card_template),
                    handleChange: value => {
                        formik.setFieldValue("card_template", value);
                    },
                    type: "autocomplete",
                    grid: { xs: 12, sm: 6, md: 6 },
                    size: "medium"
                },
                formik.values?.organization?.is_holder === 2 && {
                    field: "dada",
                    value: staff,
                    handleChange: e => {
                        setStaff(e);
                    },
                    type: "radio",
                    options: [
                        { label: t("function_screen.is_staff"), value: 1 },
                        { label: t("function_screen.is_volunteer"), value: 2 }
                    ],
                    formLabelProps: {
                        style: {
                            color: "#000000",
                            fontWeight: "bold"
                        }
                    },
                    grid: { xs: 12, sm: 12, md: 12 }
                }
                // {
                //     field: "area",
                //     label: t("function_screen.area") + " *",
                //     value: formik.values.area,
                //     handleChange: e => {
                //         formik.setFieldValue("area", e);
                //     },
                //     error:
                //         api.error?.area_id ||
                //         (formik.touched.area && formik.errors?.area),
                //     type: "checkbox",
                //     options: _area,
                //     formLabelProps: {
                //         style: {
                //             color: "#000000",
                //             fontWeight: "bold"
                //         }
                //     },
                //     grid: { xs: 12, sm: 4, md: 4 }
                // },
                // {
                //     field: "zone",
                //     label: t("function_screen.zone") + " *",
                //     value: formik.values.zone,
                //     handleChange: e => {
                //         formik.setFieldValue("zone", e);
                //     },
                //     error:
                //         api.error?.zone_id ||
                //         (formik.touched.zone && formik.errors?.zone),
                //     type: "checkbox",
                //     options: _zone,
                //     formLabelProps: {
                //         style: {
                //             color: "#000000",
                //             fontWeight: "bold"
                //         }
                //     },
                //     grid: { xs: 12, sm: 4, md: 4 }
                // },
                // {
                //     field: "vehicle",
                //     label: t("function_screen.vehicle") + " *",
                //     value: formik.values.vehicle,
                //     handleChange: e => {
                //         formik.setFieldValue("vehicle", e);
                //     },
                //     error:
                //         api.error?.vehicle_id ||
                //         (formik.touched.vehicle && formik.errors?.vehicle),
                //     type: "checkbox",
                //     options: _vehicle,
                //     formLabelProps: {
                //         style: {
                //             color: "#000000",
                //             fontWeight: "bold"
                //         }
                //     },
                //     grid: { xs: 12, sm: 4, md: 4 }
                // }
            ]
        ],
        [formik]
    );

    return (
        <PaperContainer>
            <Forms inputs={inputs} />
            <div style={{ paddingTop: 10 }}>
                {params?.id ? (
                    checkPerm(perms, "function_edit") ? (
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
        </PaperContainer>
    );
}
