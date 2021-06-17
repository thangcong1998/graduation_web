import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../../components/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import SaveIcon from "@material-ui/icons/Save";
import * as Yup from "yup";
import UploadOnePicture from "../../../../components/UploadOnePicture";
import { useTranslation } from "react-i18next";

const VehicleForm = React.memo((props) => {
  const formData = new FormData();
  const { t } = useTranslation();
  const { row, close, refetch } = props;
  const [files, setFiles] = useState();
  const formik = useFormik({
    initialValues: {
      name: null,
      icon_url: null,
    },
    onSubmit: async (values) => {
      formData.append("name", values?.name ? values?.name : "");
      formData.append("files",files);
      formData.append(
        "vehicle_id",
        values?.vehicle_id ? values?.vehicle_id : ""
      );
      row?.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          row?.id ? "admin/vehicle/" + row?.id : "admin/vehicle",
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
        .required(t("vehicle_screen.icon_url") + " " + t("errors.required"))
        .nullable(),
      name: Yup.string()
        .required(t("vehicle_screen.name") + " " + t("errors.required"))
        .max(
          255,
          t("vehicle_screen.name") +
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
      formik.setFieldValue("vehicle_id", row.id);
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
          label: t("vehicle_screen.name") + " *",
          value: formik.values?.name,
          error:
              (formik.touched.name && formik.errors?.name) || api.error?.name,
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
      <h3>{t("vehicle_screen.icon_url") + " *"}</h3>
      <UploadOnePicture
        files={files}
        setFiles={setFiles}
        title={t("vehicle_screen.icon_url") + " *"}
        height={"100px"}
        width={"auto"}
        error={
          api.errors?.icon_url ||
          (formik.touched.icon_url && formik.errors.icon_url)
        }
      />
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={row?.id ? null : <SaveIcon />}
        onClick={formik.handleSubmit}
        disableElevation
      >
        {row?.id ? t("button.update") : t("button.add")}
      </Button>
    </div>
  );
});
export default VehicleForm;
