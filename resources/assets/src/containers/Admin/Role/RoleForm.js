import React, { useContext, useEffect, useMemo, useState } from "react";
import { Paper, Grid, Checkbox, Button } from "@material-ui/core";
import { useAPI, useFetch } from "../../../api/api";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Forms from "../../../components/form/Form";
import ButtonCreate from "../../../components/button/ButtonCreate";
import CircularProgress from "@material-ui/core/CircularProgress";
import { checkPerm } from "../../../common/constants";
import * as Yup from "yup";

export default function RoleForm() {
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const params = useParams();
  const history = useHistory();
  const { perms, revalidate } = useContext(AuthContext);
  const [arrayGroup, setArrayGroup] = useState([]);
  const [showGroup, setShowGroup] = useState(1);
  const [firstCheck, setFirstCheck] = useState(true);
  const [updateData, setUpdateData] = useState([]);
  const { data: permission, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/all-permissions",
  ]);
  const { data: groupName, loading: loading3 } = useFetch([
    "get",
    "/admin/roleGroupName",
  ]);
  const {
    data: fetcher2,
    revalidate: refetch2,
    loading: loadingApi2,
  } = useFetch(
    params?.id ? ["get", "/admin/role/" + params?.id] : [null, "/admin/role"],
    {
      onSuccess: (res) => {
        formik.setFieldValue("display_name", res.role.display_name);
        formik.setFieldValue("english_name", "bcd");
        setUpdateData(res.role.permissions);
      },
    }
  );
  const GroupCheck = (array) => {
    array.map((value) => {
      let checkGroup = true;
      value.permission.map((role) => {
        let checkTeam = true;
        if (role?.check == false) {
          checkGroup = false;
        }
        role.permissions.map((role2) => {
          if (role2?.check == false) {
            checkTeam = false;
          }
        });
        role.check = checkTeam;
      });
      value.check = checkGroup;
    });
    return array;
  };
  useEffect(() => {
    if (fetcher2 && arrayGroup.length > 0 && firstCheck === false) {
      let temp = [...arrayGroup];
      temp.map((value) => {
        value.permission.map((role) => {
          role.permissions.map((role2) => {
            updateData.map((dataUpdate) => {
              if (dataUpdate.id == role2.id) {
                role2.check = true;
              }
            });
          });
        });
      });
      temp = GroupCheck(temp);
      temp = GroupCheck(temp);
      setArrayGroup(temp);
    }
  }, [fetcher2, permission, updateData]);
  useEffect(() => {
    if (permission && groupName && firstCheck === true) {
      let temp = [];
      let group = [];
      permission.map((value, index) => {
        if (!group.includes(value.group)) {
          group.push(value.group);
        }
      });
      permission.map((value, index) => {
        value.check = false;
        value.permissions.map((role) => {
          role.check = false;
        });
      });
      group = group.sort(function (a, b) {
        return a - b;
      });
      group.map((value, index) => {
        let tempGroup = {
          name: "",
          english_name: "",
          permission: [],
          group: value,
          check: false,
        };
        groupName.map((name) => {
          if (value == name.group) {
            tempGroup.name = name.name;
            tempGroup.english_name = name.english_name;
          }
        });
        permission.map((role, key) => {
          if (value == role.group) {
            tempGroup.permission.push(role);
          }
        });
        temp.push(tempGroup);
      });
      setArrayGroup(temp);
      setFirstCheck(false);
    }
  }, [permission, groupName]);
  const checkRole = (value) => {
    let temp = [...arrayGroup];
    temp.map((group) => {
      group.permission.map((role) => {
        role.permissions.map((role2) => {
          if (role2.id == value.id) {
            role2.check = !role2.check;
          }
        });
      });
    });
    temp = GroupCheck(temp);
    setArrayGroup(temp);
  };
  const checkTeam = (value) => {
    let temp = [...arrayGroup];
    temp.map((group) => {
      group.permission.map((role) => {
        if (role.id == value.id) {
          role.check = !role.check;
        }
        role.permissions.map((role2) => {
          if (role2.module_id == value.id) {
            role2.check = role.check;
          }
        });
      });
    });
    temp = GroupCheck(temp);
    setArrayGroup(temp);
  };
  const checkGroup = (value) => {
    let temp = [...arrayGroup];
    temp.map((group) => {
      if (group.group == value.group) {
        group.check = !group.check;
        group.permission.map((role) => {
          role.check = group.check;
          role.permissions.map((role2) => {
            role2.check = group.check;
          });
        });
      }
    });
    setArrayGroup(temp);
  };
  const formik = useFormik({
    initialValues: {
      english_name: "ABC",
      display_name: "",
    },
    onSubmit: async (values, { setFieldError }) => {
      let _temp = [];
      arrayGroup.map((value, index) => {
        value.permission.map((role) => {
          role.permissions.map((role2) => {
            if (role2.check == true) {
              _temp.push(role2.name);
            }
          });
        });
      });
      try {
        let res;
        !params?.id
          ? (res = await api.fetcher("post", "/admin/role", {
              ...values,
              permissions: _temp,
            }))
          : (res = await api.fetcher("put", "/admin/role/" + params?.id, {
              ...values,
              permissions: _temp,
              id: params.id,
            }));
        if (res) {
          revalidate();
          history.goBack();
        }
      } catch (e) {
        if (e.data?.errors) {
          Object.keys(e.data.errors).forEach((field) => {
            setFieldError(field, e.data.errors[field][0]);
          });
        }
      }
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      display_name: Yup.string()
        .required(t("role_screen.display_name") + " " + t("errors.required"))
        .max(
          255,
          t("role_screen.display_name") +
            t("errors.max.before") +
            " 255 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
    }),
  });
  const inputs = useMemo(
    () => [
      [
        {
          label: t("role_screen.group_name") + "*",
          type: "text",
          field: "display_name",
          value: formik.values?.display_name,
          error:
            api.error?.display_name ||
            (formik.touched.display_name && formik.errors?.display_name),
          handleChange: (e) => formik.setFieldValue("display_name", e),
          variant: "outlined",
          readOnly: false,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  return (
    <Paper style={{ padding: 10 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ padding: 10 }}>
          <div style={{ borderBottom: "#0000001f solid 1px" }}>
            <Forms
              inputs={inputs}
              data={formik.values}
              onChange={formik.setFieldValue}
              errors={api.error}
            />
            <b3
              style={{
                fontSize: 18,
                color: "#1A4973",
                fontWeight: "bold",
                margin: "10px 0px",
              }}
            >
              {t("role_screen.list")}
            </b3>
          </div>
        </Grid>
        <Grid
          item
          xs={3}
          style={{ borderRight: "#f3f3f3 solid 1px", padding: 10 }}
        >
          {arrayGroup.map((value) => {
            let totalPermission = 0;
            let checkPermission = 0;
            value.permission.map((role) => {
              totalPermission = totalPermission + role.permissions.length;
              role.permissions.map((role2) => {
                if (role2.check == true) {
                  checkPermission = checkPermission + 1;
                }
              });
            });
            return (
              <div
                style={
                  value.group == showGroup
                    ? {
                        minHeight: "50px",
                        width: "100%",
                        margin: "5px 0px",
                        borderBottom: "#f3f3f3 solid 1px",
                        backgroundColor: "#fcefe5",
                        padding: 10,
                      }
                    : {
                        minHeight: "50px",
                        width: "100%",
                        margin: "5px 0px",
                        borderBottom: "#f3f3f3 solid 1px",
                        padding: 10,
                      }
                }
                onClick={() => setShowGroup(value.group)}
              >
                <p style={{ fontWeight: "bold", fontSize: "15px", margin: 0 }}>
                  {i18n.language == "vi" ? value.name : value.english_name}
                </p>
                <div
                  style={{
                    fontSize: "0.75rem",
                    margin: 0,
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 5px",
                      borderRadius: "5px",
                      marginRight: 5,
                      color: "white",
                      backgroundColor: "#f89e49",
                      width: 40,
                      height: 20,
                      textAlign: "center",
                    }}
                  >
                    {checkPermission}/{totalPermission}
                  </span>
                  <span style={{ fontSize: "15px" }}>
                    {t("role_screen.role_selected")}
                  </span>
                </div>
              </div>
            );
          })}
        </Grid>
        <Grid item xs={9} style={{ padding: 10 }}>
          <Grid container spacing={3}>
            {arrayGroup.map((value) => {
              if (value.group == showGroup) {
                let totalPermission = 0;
                value.permission.map((role) => {
                  totalPermission = totalPermission + role.permissions.length;
                });
                return (
                  <Grid
                    item
                    xs={12}
                    style={{ padding: "0px 15px", width: "100%" }}
                  >
                    <div
                      style={{
                        float: "left",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {i18n.language == "vi" ? value.name : value.english_name}
                    </div>
                    <div style={{ float: "right" }}>
                      <Button
                        style={{ color: "#fb9c45" }}
                        onClick={() => checkGroup(value)}
                      >
                        {value.check == true
                          ? t("role_screen.clear_all")
                          : t("role_screen.select_all")}
                        ({totalPermission})
                      </Button>
                    </div>
                  </Grid>
                );
              }
            })}
            <Grid item xs={12}></Grid>
            {arrayGroup.map((value, index) => {
              if (value.group == showGroup) {
                return value.permission.map((role) => {
                  return (
                    <Grid item xs={6}>
                      <div
                        style={{
                          padding: 10,
                          backgroundColor: "#f6f6f6",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            padding: "5px 0px",
                            borderBottom: "#0000001f solid 1px",
                          }}
                        >
                          <Checkbox
                            checked={role.check}
                            onChange={() => checkTeam(role)}
                            color={"primary"}
                          />
                          <p style={{ paddingLeft: 10, fontWeight: "bold" }}>
                            {i18n.language == "vi"
                              ? role.display_name
                              : role.english_name}
                          </p>
                        </div>
                        {role.permissions.map((role2) => {
                          return (
                            <div
                              style={{ display: "flex", padding: "5px 0px" }}
                            >
                              <Checkbox
                                checked={role2.check}
                                onChange={() => checkRole(role2)}
                                color={"primary"}
                              />
                              <p style={{ paddingLeft: 10 }}>
                                {i18n.language == "vi"
                                  ? role2.display_name
                                  : role2.english_name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </Grid>
                  );
                });
              }
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div style={{ marginRight: 20, marginBottom: 10, float: "right" }}>
            {!params?.id && (
              <ButtonCreate
                variant="contained"
                color="primary"
                onClick={formik.handleSubmit}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={20} style={{ color: "white" }} />
                ) : (
                  t("role_screen.add_new")
                )}
              </ButtonCreate>
            )}
            {params?.id && (
              <>
                <Button
                  variant="contained"
                  color="default"
                  style={{ marginRight: 10 }}
                  onClick={() => history.goBack()}
                >
                  {t("role_screen.cancel")}
                </Button>
                {checkPerm(perms, "role_edit") ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : (
                      t("role_screen.update")
                    )}
                  </Button>
                ) : (
                  <div></div>
                )}
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}
