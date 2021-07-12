import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAPI } from "../../api/api";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Container,
  Card,
  FormGroup,
} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyle = makeStyles((theme) => ({
  button: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    "& a": {
      textDecoration: "none",
      // color: "#2196F3",
      color: "#040404",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "& button": {
      background: "#F2994A",
      color: "#ffffff",
      [theme.breakpoints.up("lg")]: {
        width: 200,
        height: 50,
      },
    },
  },
  input: {
    display: "flex",
    flexFlow: "column",
    marginBottom: 20,
  },
}));

export default function ResetPassword(props) {
  const classes = useStyle();
  const { t } = useTranslation();
  const params = useParams();
  const api = useAPI();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      password: "",
      token: params?.token,
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      password: Yup.string()
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
    }),
    onSubmit: async (values, params) => {
      try {
        const res = await api.fetcher("post", "/setNewPassword", values);
        if (res) {
          history.push("/login");
        }
      } catch (e) {}
    },
  });
  return (
    <form style={{ padding: 10 }}>
      <Grid className={classes.input}>
        <Input
          className="input1"
          type="password"
          value={formik.values?.password}
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          error={
            (formik.errors?.password && formik.touched.password) ||
            api.error?.password
          }
          id="input-with-icon-adornment"
          placeholder={t("change_password_screen.renew_password")}
          startAdornment={
            <InputAdornment position="start">
              <LockOutlinedIcon style={{ fontSize: 25 }} color="action" />
            </InputAdornment>
          }
        />
        <FormHelperText error={true}>
          {(formik.touched.password && formik.errors?.password) ||
            api.error?.password}
        </FormHelperText>
      </Grid>
      <Grid className={classes.button}>
        <Button
          variant="contained"
          type="submit"
          onClick={formik.handleSubmit}
          style={{
            marginBottom: 10,
            width: "100%",
            borderRadius: 25,
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {t("change_password_screen.change_password")}
          </span>
        </Button>
      </Grid>
    </form>
  );
}
