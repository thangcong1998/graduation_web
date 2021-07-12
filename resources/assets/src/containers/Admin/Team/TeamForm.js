import React, { useContext, useEffect, useMemo, useState } from "react";
import Forms from "../../../components/form/Form";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../AuthProvider";
import { checkPerm } from "../../../common/constants";
import PaperContainer from "../../../components/PaperContainer";
import SyncIcon from "@material-ui/icons/Sync";

export default function (props) {
  const formData = new FormData();
  const { t } = useTranslation();
  const { perms } = useContext(AuthContext);
  const api = useAPI();
  const params = useParams();
  const history = useHistory();
  const { data: data } = useFetch([
    params?.id ? "get" : null,
    params?.id ? "admin/team/" + params.id : null,
  ]);
  console.log({ params });
  const formik = useFormik({
    initialValues: {
      name: null,
      english_name: null,
      is_sport_team: 2,
      country: null,
      id: null,
    },
    onSubmit: async (values) => {
      formData.append("id", values?.id);
      formData.append("name", values?.name ? values?.name : "");
      formData.append(
        "english_name",
        values?.english_name ? values?.english_name : ""
      );
      formData.append(
        "is_sport_team",
        values?.is_sport_team ? values?.is_sport_team : ""
      );
      formData.append("country_id", values?.country ? values?.country.id : "");
      formData.append("user_name", values?.user_name ? values?.user_name : "");
      if (values?.password) {
        formData.append("password", values?.password);
      }
      formData.append("phone", values?.phone ? values?.phone : "");
      formData.append("email", values?.email ? values?.email : "");
      formData.append("user_id", values?.user_id ? values?.user_id : "");
      params.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params.id ? "admin/team/" + params.id : "admin/team",
          formData
        );
        if (res) {
          history.push("/team");
        }
      } catch (e) {}
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      english_name: Yup.string()
        .required(t("team_screen.english_name") + " " + t("errors.required"))
        .max(
          255,
          t("team_screen.english_name") +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      name: Yup.string()
        .required(t("team_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("team_screen.name") +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      is_sport_team: Yup.string()
        .required(t("team_screen.is_sport_team") + " " + t("errors.required"))
        .nullable(),
      country: Yup.object()
        .required(t("team_screen.country") + " " + t("errors.required"))
        .nullable(),
    }),
  });
  useEffect(() => {
    if (data) {
      inputs[0]
        .filter((e) => e.field)
        .forEach((e, index) => {
          formik.setFieldValue(e.field, data?.[e.field]);
        });
      // formik.setFieldValue("user_name", data.user?.user_name);
      // formik.setFieldValue("password", data.user?.password);
      // formik.setFieldValue("phone", data.user?.phone);
      // formik.setFieldValue("email", data.user?.email);
      // formik.setFieldValue("user_id", data.user_id);
      formik.setFieldValue("id", data?.id);
    }
  }, [data]);

  const syncData = async () => {
    try {
      let res = await api.fetcher("post", `admin/syncDataParticipant`, {
        team_id: data?.id,
      });
    } catch (e) {}
  };

  const inputs = useMemo(
    () => [
      [
        {
          field: "name",
          label: t("team_screen.name") + " *",
          value: formik.values?.name,
          error:
            api.error?.name || (formik.touched.name && formik.errors?.name),
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "english_name",
          label: t("team_screen.english_name") + " *",
          value: formik.values?.english_name,
          error:
            api.error?.english_name ||
            (formik.touched.english_name && formik.errors?.english_name),
          handleChange: (e) => formik.setFieldValue("english_name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "country",
          label: t("team_screen.country") + " *",
          endpoint: "admin/country",
          queryField: "name_like",
          labelField: "name",
          value: formik.values?.country,
          error:
            api.error?.country ||
            (formik.touched.country && formik.errors?.country),
          handleChange: (value) => {
            formik.setFieldValue("country", value);
          },
          type: "autocomplete",
          grid: { xs: 12, sm: 6, md: 6 },
          size: "medium",
        },
        {
          field: "is_sport_team",
          label: t("team_screen.is_sport_team"),
          value: formik.values?.is_sport_team == 2,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("is_sport_team", e == true ? 2 : 1);
          },
          inputVariant: "outlined",
          type: "switch",
          grid: { xs: 12, sm: 6, md: 6 },
          error:
            api.error?.is_sport_team ||
            (formik.touched.is_sport_team && formik.errors?.is_sport_team),
        },
      ],
    ],
    [formik]
  );

  return (
    <PaperContainer>
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
        <div style={{ width: "50%" }}>
          <h3 style={{ padding: 10 }}>{t("team_screen.team_info")}</h3>
        </div>
        {/*  đông bộ dữ liệu */}
        {/* <div style={{ width: "50%" }}>
          {checkPerm(perms, "team_edit") ? (
            <Button
              variant={"contained"}
              color={"primary"}
              style={{ float: "right" }}
              onClick={(row) => syncData(row)}
            >
              <SyncIcon /> {t("team_screen.sync")}
            </Button>
          ) : null}
        </div> */}
      </div>
      <Forms inputs={inputs} />

      {params?.id ? (
        checkPerm(perms, "team_edit") ? (
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
    </PaperContainer>
  );
}
