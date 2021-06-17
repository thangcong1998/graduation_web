import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Grid } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import ButtonColorChoose from "./ButtonColorChoose";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { checkPerm } from "../../../../common/constants";
import { AuthContext } from "../../../AuthProvider";
import person from "../../../../assets/image/boss.png";
import barCode from "../../../../assets/image/barcode2.png";
import sign from "../../../../assets/image/sign.png";
import icon1 from "../../../../assets/image/icon1.png";
import icon2 from "../../../../assets/image/icon2.png";
import icon3 from "../../../../assets/image/icon3.png";

export default function(props) {
    const formData = new FormData();
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const [backColor, setBackColor] = useState("#ffffff");
    const [colorText, setColorText] = useState("#000000");
    const [previewBackground, setPreviewBackground] = useState();
    const [previewFrontIcon, setPreviewFrontIcon] = useState();
    const formik = useFormik({
        initialValues: {
            name: null,
            text: null,
            backColor: "#ffffff",
            colorText: "#000000"
        },
        onSubmit: async values => {
            formData.append("name", values?.name ? values?.name : "");
            formData.append(
                "background_color",
                backColor ? backColor : values?.backColor
            );
            formData.append(
                "text_color",
                colorText ? colorText : values?.colorText
            );
            formData.append("text", values?.text ? values?.text : "");
            formData.append("card_id", values?.card_id ? values?.card_id : "");
            params.id
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    params.id
                        ? "admin/cardTemplate/" + params.id
                        : "admin/cardTemplate",
                    formData
                );
                if (res) {
                    history.push("/cardTemplate");
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            text: Yup.string()
                .required(
                    t("card_template_screen.text") + " " + t("errors.required")
                )
                .max(
                    7,
                    t("card_template_screen.text") +
                        t("errors.max.before") +
                        " 7 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            name: Yup.string()
                .required(
                    t("card_template_screen.name") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("card_template_screen.name") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable()
        })
    });
    const api = useAPI();
    const params = useParams();
    const history = useHistory();
    const { data: data } = useFetch([
        params?.id ? "get" : null,
        params?.id ? "admin/cardTemplate/" + params.id : null
    ]);
    useEffect(() => {
        if (data) {
            inputs[0]
                .filter(e => e.field)
                .forEach((e, index) => {
                    formik.setFieldValue(e.field, data?.[e.field]);
                });
            setBackColor(data.background_color);
            setColorText(data.text_color);
            formik.setFieldValue("card_id", data.id);
        }
    }, [data]);
    const inputs = useMemo(
        () => [
            [
                {
                    field: "name",
                    label: t("card_template_screen.name"),
                    required: true,
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
                    field: "text",
                    label: t("card_template_screen.text"),
                    required: true,
                    value: formik.values?.text,
                    error:
                        api.error?.text ||
                        (formik.touched.text && formik.errors?.text),
                    handleChange: e => formik.setFieldValue("text", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 6, md: 6 }
                }
            ]
        ],
        [formik]
    );
    return (
        <Grid>
            <Forms inputs={inputs} />
            <Grid container style={{ padding: 20 }} spacing={2}>
                <Grid item xs={3} md={3} sm={12}>
                    <ButtonColorChoose
                        color={backColor}
                        setColor={setBackColor}
                        text={t("card_template_screen.back_color")}
                        error={
                            api.error?.background_color ||
                            (formik.touched.back_color &&
                                formik.errors?.back_color)
                        }
                    />
                </Grid>
                <Grid item xs={3} md={3} sm={12}>
                    <ButtonColorChoose
                        color={colorText}
                        setColor={setColorText}
                        text={t("card_template_screen.text_color")}
                        error={
                            api.error?.text_color ||
                            (formik.touched.text_color &&
                                formik.errors?.text_color)
                        }
                    />
                </Grid>
                <Grid item xs={6} md={6} sm={12} style={{ padding: 15 }}>
                    <div
                        style={{
                            backgroundImage: "url(" + previewBackground + ")",
                            backgroundSize: "cover",
                            height: 500,
                            width: 300,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            border: "black solid 0.5px",
                            padding: 10
                        }}
                    >
                        <div
                            style={{
                                height: 200,
                                display: "flex",
                                flexWrap: "wrap"
                            }}
                        >
                            <div style={{ width: "50%" }}>
                                <img
                                    src={person}
                                    width={"100%"}
                                    height={"200px"}
                                />
                            </div>
                            <div style={{ width: "50%", padding: 10 }}>
                                <div style={{ height: 110, marginBottom: 10 }}>
                                    {previewFrontIcon !==
                                    process.env.MIX_REACT_APP_PUBLIC_URL +
                                        "/storage/" +
                                        null ? (
                                        <div
                                            // src={previewFrontIcon}
                                            height={"120px"}
                                            width={"100%"}
                                        ></div>
                                    ) : null}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 50,
                                        backgroundColor: backColor
                                            ? backColor
                                            : "white",
                                        color: colorText ? colorText : "black",
                                        textAlign: "center",
                                        marginTop: "40px"
                                    }}
                                >
                                    <h6 style={{ fontSize: 20 }}>
                                        {formik.values?.text}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div style={{ height: 300 }}>
                            <p style={{ margin: 0, fontSize: 20 }}>
                                <b>FULL NAME</b>
                            </p>
                            <p style={{ margin: 0, fontSize: 15 }}>FUNCTION</p>
                            <p style={{ margin: 0, fontSize: 15 }}>
                                RESPONSIBILITY ORGANIZATION NOC
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    height: 120
                                }}
                            >
                                <div style={{ width: "30%" }} />
                                <div
                                    style={{
                                        width: "30%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                fontSize: 20,
                                                color: "black",
                                                border: "black solid 0.5px",
                                                height: 30,
                                                width: 50,
                                                textAlign: "center",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            AH
                                        </p>
                                    </div>
                                </div>
                                <div style={{ width: "40%" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            padding: "10px 2px"
                                        }}
                                    >
                                        <img
                                            src={icon1}
                                            height={20}
                                            width={40}
                                            style={{ marginRight: 5 }}
                                        />
                                        <img
                                            src={icon2}
                                            height={20}
                                            width={20}
                                            style={{ marginRight: 5 }}
                                        />
                                        <img
                                            src={icon3}
                                            height={20}
                                            width={20}
                                            style={{ marginRight: 5 }}
                                        />
                                    </div>
                                    <img
                                        src={barCode}
                                        height={40}
                                        width={100}
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    width: "100%"
                                }}
                            >
                                <b
                                    style={{
                                        float: "left",
                                        width: "90%",
                                        fontSize: 30,
                                        color: "black"
                                    }}
                                >
                                    AS 1 2 3
                                </b>
                                <b
                                    style={{
                                        float: "right",
                                        width: "10%",
                                        fontSize: 30,
                                        color: "black"
                                    }}
                                >
                                    R
                                </b>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
            {params?.id ? (
                checkPerm(perms, "card_template_edit") ? (
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
        </Grid>
    );
}
