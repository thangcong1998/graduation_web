import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Grid } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import { Editor } from "@tinymce/tinymce-react";
import UploadFileSlide from "../../../components/SlideShowImage";
import PreviewVenueInForm from "./PreviewVenueInForm";
import Dialog from "@material-ui/core/Dialog";
import { Switch } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

export default function (props) {
    const [open, setOpen] = useState(false);
    const formData = new FormData();
    const [newFiles, setNewFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const [trainingPlace, setTrainingPlace] = useState([]);
    const [competitionPlace, setCompetitionPlace] = useState([]);
    const group = [];
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const api = useAPI();
    const params = useParams();
    const history = useHistory();
    const { data: data } = useFetch([
        params?.id ? "get" : null,
        params?.id ? "admin/venueCreate/" + params.id : null,
    ]);
    const { data: sportDiscipline } = useFetch([
        "get",
        "/admin/sportDiscipline",
    ]);
    const handleDelete = (file) => {
        if (file.id) {
            setOldFiles((pre) => pre.filter((e) => e.id != file.id));
        } else {
            setNewFiles((pre) => pre.filter((e) => e.name != file.name));
        }
    };

    const [files, setFiles] = useState();

    const formik = useFormik({
        initialValues: {
            name: null,
            address: null,
            map_url: null,
            latitude: null,
            longtitude: null,
            practise_flag: 1,
            competition_flag: 1,
            html: null,
            region: null,
        },
        onSubmit: async (values) => {
            formData.append("id", values?.id ? values?.id : "");
            formData.append("name", values?.name ? values?.name : "");
            formData.append("address", values?.address ? values?.address : "");
            formData.append(
                "latitude",
                values?.latitude ? values?.latitude : ""
            );
            formData.append("html", values?.html ? values?.html : "");
            formData.append("sport", group ? JSON.stringify(group) : "");
            formData.append("region", values?.region ? values?.region?.id : "");
            formData.append(
                "longtitude",
                values?.longtitude ? values?.longtitude : ""
            );
            formData.append(
                "training_place",
                trainingPlace
                    ? JSON.stringify(trainingPlace)
                    : JSON.stringify([])
            );
            formData.append(
                "competition_place",
                competitionPlace
                    ? JSON.stringify(competitionPlace)
                    : JSON.stringify([])
            );
            newFiles.forEach((e, index) => {
                formData.append("files[" + index + "]", e);
            });
            params.id && formData.append("oldFiles", JSON.stringify(oldFiles));
            params.id
                ? formData.append("_method", "PUT")
                : formData.append("_method", "POST");
            try {
                let res = await api.fetcher(
                    "post",
                    params.id
                        ? "admin/venueCreate/" + params.id
                        : "admin/venueCreate",
                    formData
                );
                if (res) {
                    history.push("/venue");
                }
            } catch (e) {}
        },
        validationSchema: Yup.object().shape({
            // Validate form field
            name: Yup.string()
                .required(t("venue_screen.name") + " " + t("errors.required"))
                .max(
                    255,
                    t("venue_screen.name") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            address: Yup.string()
                .required(
                    t("venue_screen.address") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("venue_screen.address") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            map_url: Yup.string()
                .required(
                    t("venue_screen.map_url") + " " + t("errors.required")
                )
                .trim()
                .nullable(),
            latitude: Yup.string()
                .required(
                    t("venue_screen.latitude") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("venue_screen.latitude") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            longtitude: Yup.string()
                .required(
                    t("venue_screen.longtitude") + " " + t("errors.required")
                )
                .max(
                    255,
                    t("venue_screen.longtitude") +
                        t("errors.max.before") +
                        " 255 " +
                        t("errors.max.after")
                )
                .trim()
                .nullable(),
            html: Yup.string()
                .required(t("venue_screen.html") + " " + t("errors.required"))
                .trim()
                .nullable(),
            region: Yup.object()
                .required(t("venue_screen.region") + " " + t("errors.required"))
                .nullable(),
        }),
    });

    useEffect(() => {
        if (data) {
            let training_place = [];
            let competition_place = [];
            inputs[0]
                .filter((e) => e.field)
                .forEach((e, index) => {
                    formik.setFieldValue(e.field, data?.[e.field]);
                });
            formik.setFieldValue("name", data?.name);
            formik.setFieldValue("address", data?.address);
            formik.setFieldValue("latitude", data?.latitude);
            formik.setFieldValue("longtitude", data?.longtitude);
            formik.setFieldValue("practise_flag", data?.practise_flag);
            formik.setFieldValue("competition_flag", data?.competition_flag);
            formik.setFieldValue("html", data?.html);
            formik.setFieldValue("id", data?.id);
            formik.setFieldValue("region", data?.region);
            formik.setFieldValue(
                "map_url",
                `http://www.google.com/maps/place/${data?.latitude},${data?.longtitude}`
            );
            setOldFiles(data?.files);
            setFiles(data?.images);
            if (files) {
                formik.setFieldValue("images", files);
            }
            if (data?.venue_training_place) {
                data.venue_training_place.forEach((value) => {
                    training_place.push(value.id);
                });
            }
            setTrainingPlace(training_place);
            if (data?.venue_competition_place) {
                data.venue_competition_place.forEach((value) => {
                    competition_place.push(value.id);
                });
            }
            setCompetitionPlace(competition_place);
        }
    }, [data]);

    const inputs = useMemo(
        () => [
            [
                {
                    field: "name",
                    label: t("venue_screen.name") + " *",
                    value: formik.values?.name,
                    error:
                        api.error?.name ||
                        (formik.touched.name && formik.errors?.name),
                    handleChange: (e) => formik.setFieldValue("name", e),
                    type: "text",
                    variant: "outlined",
                    readOnly: false,
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "region",
                    label: t("venue_screen.region") + " *",
                    endpoint: "admin/regions?level_like=1",
                    queryField: "name",
                    valueField: "id",
                    value: formik.values?.region,
                    error:
                        api.error?.region ||
                        (formik.touched.region && formik.errors?.region),
                    handleChange: (value) => {
                        formik.setFieldValue("region", value);
                    },
                    type: "autocomplete",
                    grid: { xs: 12, sm: 12, md: 12 },
                    size: "medium",
                },
                {
                    field: "address",
                    label: t("venue_screen.address") + " *",
                    value: formik.values?.address,
                    error:
                        api.error?.address ||
                        (formik.touched.address && formik.errors?.address),
                    handleChange: (e) => formik.setFieldValue("address", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
                {
                    field: "map_url",
                    label: t("venue_screen.map_url") + " *",
                    value: formik.values?.map_url,
                    error:
                        api.error?.map_url ||
                        (formik.touched.map_url && formik.errors?.map_url),
                    handleChange: (e) => formik.setFieldValue("map_url", e),
                    type: "text",
                    variant: "outlined",
                    grid: { xs: 12, sm: 12, md: 12 },
                },
            ],
        ],
        [formik]
    );
    const handleClickOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        if (
            formik?.values?.map_url &&
            formik?.values?.map_url?.trim().length !== 0
        ) {
            if (formik?.values?.map_url.includes("@")) {
                const splitUrl = formik.values.map_url.split("!3d");
                const latLong = splitUrl[splitUrl.length - 1].split("!4d");
                let longitude;

                if (latLong.indexOf("?") !== -1) {
                    longitude = latLong[1].split("\\?")[0];
                } else {
                    longitude = latLong[1].split("?")[0];
                }
                let tempLongitude = longitude.split("?");
                const latitude = latLong[0];
                formik.setFieldValue("latitude", latitude);
                formik.setFieldValue("longtitude", tempLongitude[0]);
            }
        }
    }, [formik.values]);
    const changeHtml = (value) => {
        formik.setFieldValue("html", value);
    };
    const changeStatus1 = (id) => {
        let temp = [...trainingPlace];
        let check = false;
        let position = 0;
        trainingPlace.map((value, index) => {
            if (value == id) {
                check = true;
                position = index;
            }
        });
        if (check === true) {
            temp.splice(position, 1);
        } else {
            temp.push(id);
        }
        setTrainingPlace(temp);
    };
    const changeStatus2 = (id) => {
        let temp = [...competitionPlace];
        let check = false;
        let position = 0;
        competitionPlace.map((value, index) => {
            if (value == id) {
                check = true;
                position = index;
            }
        });
        if (check === true) {
            temp.splice(position, 1);
        } else {
            temp.push(id);
        }
        setCompetitionPlace(temp);
    };
    return (
        <div>
            <h3 style={{ padding: 10 }}>{t("venue_screen.venue_info")}</h3>
            <Card style={{ padding: 20 }}>
                <Grid container spacing={3}>
                    <Grid item md={8} sm={8} xs={12}>
                        <Forms inputs={inputs} />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <UploadFileSlide
                            data={data}
                            errors={api.error?.files}
                            newFiles={newFiles}
                            setNewFiles={setNewFiles}
                            oldFiles={oldFiles}
                            setOldFiles={setOldFiles}
                            multiple={true}
                            handleDelete={handleDelete}
                        />
                    </Grid>
                </Grid>
                {sportDiscipline?.data.length > 0 && (
                    <table
                        style={{
                            border: "#d9d9d9 solid 1px",
                            width: "100%",
                            borderSpacing: 0,
                        }}
                    >
                        <tr style={{ border: "#d9d9d9 solid 1px" }}>
                            <th
                                style={{
                                    width: "80%",
                                    border: "#d9d9d9 solid 1px",
                                }}
                            >
                                {t("venue_screen.sport")}
                            </th>
                            <th
                                style={{
                                    width: "10%",
                                    border: "#d9d9d9 solid 1px",
                                }}
                            >
                                {t("venue_screen.practise_flag_setup")}
                            </th>
                            <th
                                style={{
                                    width: "10%",
                                    border: "#d9d9d9 solid 1px",
                                }}
                            >
                                {t("venue_screen.competition_flag_setup")}
                            </th>
                        </tr>
                        {sportDiscipline?.data.map((value, index) => {
                            return (
                                <tr>
                                    <td
                                        style={{
                                            width: "80%",
                                            border: "#d9d9d9 solid 1px",
                                        }}
                                    >
                                        <p style={{ marginLeft: 20 }}>
                                            {i18n.language == "vi" ? value.sport?.name : value?.sport?.english_name}
                                            {" "}
                                            {"/"}
                                            {" "}
                                            {i18n.language == "vi"
                                                ? value.name
                                                : value.english_name}
                                        </p>
                                    </td>
                                    <td
                                        style={{
                                            width: "10%",
                                            border: "#d9d9d9 solid 1px",
                                            textAlign: "center",
                                        }}
                                        onClick={() => changeStatus1(value.id)}
                                    >
                                        <Switch
                                            color={"primary"}
                                            checked={
                                                trainingPlace.includes(value.id)
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </td>
                                    <td
                                        style={{
                                            width: "10%",
                                            border: "#d9d9d9 solid 1px",
                                            textAlign: "center",
                                        }}
                                        onClick={() => changeStatus2(value.id)}
                                    >
                                        <Switch
                                            color={"primary"}
                                            checked={
                                                competitionPlace.includes(
                                                    value.id
                                                )
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                )}
                <h2>{t("venue_screen.html") + " " + "*"}</h2>
                <p style={{ color: "#f44336", fontSize: "0.75rem" }}>
                    {api.error?.html ||
                        (formik.touched.html && formik.errors?.html)}
                </p>
                <div style={{ minHeight: 500, marginBottom: 20 }}>
                    <Editor
                        value={formik.values?.html}
                        init={{
                            min_height: 500,
                            menubar: false,
                            plugins: [
                                "advlist autolink lists link image charmap print preview anchor autoresize",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                                "undo redo | formatselect | fontsizeselect | fontselect | bold italic forecolor backcolor | \
                                      alignleft aligncenter alignright alignjustify | \
                                      bullist numlist outdent indent | image | table | preview",
                            font_formats:
                                "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n; Times New Roman=times new roman",
                            tinycomments_mode: "embedded",
                            tinycomments_author: "Author name",
                            image_title: true,
                            fontsize_formats:
                                "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt",
                            language: "en",
                            images_upload_handler: function (
                                blobInfo,
                                success,
                                failure
                            ) {
                                let xhr, formData;
                                xhr = new XMLHttpRequest();
                                xhr.withCredentials = false;
                                xhr.open(
                                    "POST",
                                    process.env.MIX_REACT_APP_API_URL +
                                        "/admin/imageVenue"
                                );
                                xhr.onload = function () {
                                    let json;

                                    if (xhr.status != 200) {
                                        failure("HTTP Error: " + xhr.status);
                                        return;
                                    }
                                    json = JSON.parse(xhr.responseText);

                                    if (
                                        !json ||
                                        typeof json.location != "string"
                                    ) {
                                        failure(
                                            "Invalid JSON: " + xhr.responseText
                                        );
                                        return;
                                    }
                                    let temp = json.location;
                                    temp =
                                        process.env.MIX_REACT_APP_PUBLIC_URL +
                                        temp;
                                    success(temp);
                                };
                                formData = new FormData();
                                formData.append(
                                    "upload",
                                    blobInfo.blob(),
                                    blobInfo.filename()
                                );
                                xhr.send(formData);
                            },
                        }}
                        apiKey={
                            "qwmqc3ytmph9t44hht3z1fubvdqjrk1f2j2e6wy32k995b8l"
                        }
                        onEditorChange={(e) => changeHtml(e)}
                    />
                </div>

                {params?.id ? (
                    checkPerm(perms, "venue_edit") ? (
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
                <Button
                    style={{ marginLeft: 10 }}
                    variant="contained"
                    color="primary"
                    size="large"
                    disableElevation
                    onClick={handleClickOpen}
                >
                    {t("button.preview")}
                </Button>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="100%"
                >
                    <CancelIcon
                        style={{
                            color: "white",
                            position: "fixed",
                            top: 10,
                            right: 10,
                        }}
                        onClick={() => setOpen(false)}
                        fontSize={"large"}
                    />
                    <PreviewVenueInForm
                        newFiles={newFiles}
                        oldFiles={oldFiles}
                        formik={formik}
                        close={setOpen}
                        sport={group}
                        training={trainingPlace}
                        competition={competitionPlace}
                    />
                </Dialog>
            </Card>
        </div>
    );
}
