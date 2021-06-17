import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import Forms from "./Forms";
import { useAPI, useFetch } from "../../api/api";
import {
  attributeTypes,
  attributeCategories,
  displayDefault,
  checkPerm,
} from "../../common/constants";
import DataTable from "../table/DataTable";
import "./CustomAttributeList.css";
import DialogMui from "../DialogMui";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import RadioGroup from "@material-ui/core/RadioGroup";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
} from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import * as moment from "moment";
import * as Yup from "yup";
import { useDialog } from "../../components/Dialog";
import { cache, mutate } from "swr";
import { CheckAttributeType } from "../../common/constants";
//-------------------------------------

function CustomAttributeList() {
  const [endpoint, setEndpoint] = useState("/admin/attribute");
  const [params, setParams] = useState();
  const [trash, setTrash] = useState(false);
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const [selectedTabId, setSelectedTabId] = useState(
    attributeCategories.PARTNER
  );

  const { t, i18n } = useTranslation();
  const language = i18n.languages[0];
  if (language == "vi") {
    moment.locale("vi");
  } else {
    moment.locale("en");
  }
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/attribute",
    params,
  ]);
  const fetcher = useFetch([
    "get",
    `admin/attributeGroup?category_equal=${selectedTabId}`,
  ]);
  const columns = [
    {
      title: t("customs_attributes_screen.name"),
      field: "name",
      display: true,
    },
    {
      title: t("customs_attributes_screen.english_name"),
      field: "english_name",
      display: true,
    },
    {
      title: t("customs_attributes_screen.attribute_type"),
      field: "value_type",
      display: true,
      render: (row) => {
        return CheckAttributeType(row.value_type, t);
      },
    },
    {
      title: t("customs_attributes_screen.value_list"),
      field: "value_list",
      display: true,
    },
    {
      title: t("customs_attributes_screen.date"),
      field: "date",
      display: true,
    },
  ];

  const handleDeleteGroupAttribute = async (id) => {
    await dialog({
      title: t("action_column.delete.confirm"),
      type: "confirm",
      confirmationText: t("action_column.delete.confirm_text"),
      cancellationText: t("action_column.delete.cancel_text"),
    });
    try {
      const res = await api.fetcher("delete", "admin/attributeGroup/" + id, {
        action: "force",
      });
      if (res) {
        fetcher.revalidate();
        handleClose();
      }
    } catch (e) {}
  };

  const [initDataAtt, setInitDataAtt] = useState();
  const [initDataGroup, setInitDataGroup] = useState();
  const classes = useStyles();
  useEffect(() => {}, [initDataAtt]);
  return (
    <Grid container item xs={12} className={classes.grid}>
      <DialogMui
        open={!!initDataGroup}
        onClose={() => setInitDataGroup()}
        title={
          initDataGroup?.id
            ? t("customs_attributes_screen.edit_attribute")
            : t("customs_attributes_screen.add_attribute_group")
        }
        content={
          <GroupForm
            data={initDataGroup}
            onClose={() => {
              setInitDataGroup();
              fetcher.revalidate();
            }}
          />
        }
      />
      <DialogMui
        open={!!initDataAtt}
        onClose={() => setInitDataAtt()}
        title={
          initDataAtt?.id
            ? t("customs_attributes_screen.edit_attribute")
            : t("customs_attributes_screen.add_attribute")
        }
        content={
          <AttributeForm
            data={initDataAtt}
            onClose={() => {
              setInitDataAtt();
              fetcher.revalidate();
            }}
          />
        }
      />

      <Grid item xs={6}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={selectedTabId}
          onChange={(event, value) => {
            setSelectedTabId(value);
          }}
        >
          <Tab
            value={attributeCategories.PARTNER}
            label={t("customs_attributes_screen.staff")}
          />
          <Tab
            value={attributeCategories.CUSTOMER}
            label={t("customs_attributes_screen.volunteer")}
          />
        </Tabs>
      </Grid>
      <Grid item xs={6}>
        <div style={{ display: "flex", marginRight: 15 }}>
          <div style={{ marginLeft: "auto" }}>
            <ButtonGroup>
              <Button
                size="medium"
                variant="contained"
                onClick={() => setInitDataAtt({ category: selectedTabId })}
                style={{ backgroundColor: "#1976D2", color: "white" }}
                startIcon={<AddIcon />}
              >
                {t("customs_attributes_screen.add_attribute")}
              </Button>

              <Button
                size="medium"
                variant="contained"
                onClick={() => setInitDataGroup({ category: selectedTabId })}
                style={{
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
                startIcon={<AddIcon />}
              >
                {t("customs_attributes_screen.add_attribute_group")}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Grid>

      {fetcher.data?.data &&
        fetcher.data?.data.map((group) => (
          <Grid item xs={12} style={{ marginBottom: 15 }}>
            <Paper key={group.id} style={{ marginRight: 15 }}>
              <div className="cal-card-header">
                {language == "vi" && <h3 className="cal-h6">{group.name}</h3>}
                {language == "en" && (
                  <h3 className="cal-h6">{group.english_name}</h3>
                )}
                <EditIcon
                  color="primary"
                  className={classes.action_button}
                  titleAccess="Sửa"
                  onClick={() =>
                    setInitDataGroup({
                      id: group.id,
                      category: group.category,
                      name: group.name,
                      english_name: group.english_name,
                      display_default: group.display_default,
                      group_id: group.id,
                    })
                  }
                />
                <DeleteIcon
                  color="error"
                  className={classes.action_button}
                  titleAccess={t("customs_attributes_screen.delete")}
                  onClick={() => handleDeleteGroupAttribute(group.id)}
                />
              </div>
              <DataTable
                data={data?.data}
                onClickRow={(row) =>
                  setInitDataAtt({
                    ...row,
                    group_id: row.group?.id,
                    category: row.group?.category,
                  })
                }
                loading={fetcher.loading}
                columns={columns}
                data={group.children.map((attr) => ({
                  id: attr.id,
                  name: attr.name,
                  english_name: attr.english_name,
                  group_id: attr.group.id,
                  value_type: attr.value_type,
                  value_list: attr.value_list || null,
                  group: attr.group,
                  date:
                    moment(attr.updated_at).fromNow() ||
                    moment(attr.created_at).fromNow(),
                }))}
                actionColumn={{
                  onDelete: {
                    display: true,
                    action: "force",
                  },
                  onEdit: {
                    display: true,
                    callback: (row) =>
                      setInitDataAtt({
                        ...row,
                        group_id: row.group?.id,
                        category: row.group?.category,
                      }),
                  },
                  onRestore: true,
                  endpoint: endpoint,
                  trashed: params?.only_trashed,
                  refetch: fetcher.revalidate,
                }}
                loading={loading}
              />
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
}

const AttributeForm = React.memo(({ data, onClose }) => {
  const api = useAPI();
  const { t, i18n } = useTranslation();

  const formik = useFormik({
    initialValues: {
      id: "",
      category: "",
      group_id: "",
      name: "",
      value_type: attributeTypes.TEXT,
      value_list: "",
      english_name: "",
    },
    onSubmit: async (values) => {
      let res;
      if (values.id) {
        res = await api.fetcher("put", `admin/attribute/${data.id}`, values);
      } else {
        res = await api.fetcher("post", "admin/attribute", values);
      }
      if (res) {
        onClose();
      }
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      group_id: Yup.string()
        .required(
          t("customs_attributes_screen.attribute_group") +
            " " +
            t("errors.required")
        )
        .nullable(),
      name: Yup.string()
        .required(
          t("customs_attributes_screen.name") + " " + t("errors.required")
        )
        .max(
          50,
          t("customs_attributes_screen.name") +
            " " +
            t("errors.max.before") +
            " 50 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      english_name: Yup.string()
        .required(
          t("customs_attributes_screen.name") + " " + t("errors.required")
        )
        .max(
          50,
          t("customs_attributes_screen.name") +
            " " +
            t("errors.max.before") +
            " 50 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      value_list: Yup.string()
        .when("value_type", {
          is: (v) => v === attributeTypes.SELECT,
          then: Yup.string()
            .required(
              t("customs_attributes_screen.value_lists") +
                " " +
                t("errors.required")
            )
            .nullable(),
          otherwise: null,
        })
        .nullable(),
    }),
  });

  const getData = async (id) => {
    const res = await api.fetcher("get", `admin/attribute/${id}`);
    if (res) {
      formik.setValues({ ...res, group_id: res?.group.id });
    }
  };
  useEffect(() => {
    if (data) {
      formik.setValues({ ...formik.values, ...data });
      formik.setFieldValue("group_id", data.group?.id);
    }
    if (data?.id) {
      getData(data.id);
    }
  }, [data]);
  const inputs = useMemo(
    () => [
      [
        i18n.languages[0] == "vi"
          ? {
              label: t("customs_attributes_screen.attribute_group"),
              field: "group_id",
              endpoint: "admin/attributeGroup?category_equal=" + data?.category,
              valueField: "id",
              labelField: "name",
              queryField: "name_like",
              type: "query-select",
              required: true,
              error: formik.touched.name && formik.errors?.group_id,
              readOnlyValue: formik.values.group,
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : {
              label: t("customs_attributes_screen.attribute_group"),
              field: "group_id",
              endpoint: "admin/attributeGroup?category_equal=" + data?.category,
              valueField: "id",
              labelField: "english_name",
              queryField: "english_name_like",
              type: "query-select",
              required: true,
              error: formik.touched.english_name && formik.errors?.group_id,
              readOnlyValue: formik.values.group,
              grid: { xs: 12, sm: 12, md: 12 },
            },
        {
          label: t("customs_attributes_screen.name"),
          field: "name",
          type: "text",
          required: true,
          grid: { xs: 12, sm: 12, md: 12 },
          error:
            api.error?.name || (formik.touched.name && formik.errors?.name),
        },
        {
          label: t("customs_attributes_screen.english_name"),
          field: "english_name",
          required: true,
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
          error:
            api.error?.english_name ||
            (formik.touched.english_name && formik.errors?.english_name),
        },
        {
          label: t("customs_attributes_screen.attribute_type"),
          field: "value_type",
          type: "select",
          options: [
            {
              label: t("customs_attributes_screen.text"),
              value: "text",
            },
            {
              label: t("customs_attributes_screen.number"),
              value: "number",
            },
            {
              label: t("customs_attributes_screen.select"),
              value: "select",
            },
            {
              label: t("customs_attributes_screen.date"),
              value: "date",
            },
          ],
          grid: { xs: 12, sm: 12, md: 12 },
        },
        formik.values.value_type === "select" && {
          label: t("customs_attributes_screen.value_lists"),
          field: "value_list",
          type: "tag",
          error:
            api.error?.value_list ||
            (formik.touched.value_list && formik.errors?.value_list),
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FormControl>
          <FormLabel>{t("customs_attributes_screen.attribute")}</FormLabel>
          <RadioGroup
            style={{ display: "inline" }}
            value={data?.category}
            onChange={(event) =>
              formik.setFieldValue(
                "category",
                parseInt(event.currentTarget.value)
              )
            }
          >
            {data?.category == 0 ? (
              <FormControlLabel
                value={attributeCategories.PARTNER}
                control={<Radio color="primary" />}
                label={t("customs_attributes_screen.staff")}
              />
            ) : (
              <FormControlLabel
                value={attributeCategories.CUSTOMER}
                control={<Radio color="primary" />}
                label={t("customs_attributes_screen.volunteer")}
              />
            )}
          </RadioGroup>
        </FormControl>
      </div>
      <Forms
        inputs={inputs}
        variant="standard"
        data={formik.values}
        onChange={formik.setFieldValue}
        errors={api.error}
      />
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: "auto" }}>
          <Button
            variant="contained"
            color="default"
            disabled={formik.isSubmitting || api.loading}
            onClick={onClose}
          >
            {t("customs_attributes_screen.cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 5 }}
            onClick={formik.handleSubmit}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={20} style={{ color: "white" }} />
            ) : (
              t("customs_attributes_screen.save")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

const GroupForm = React.memo(({ data, onClose }) => {
  const api = useAPI();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      id: "",
      category: "",
      name: "",
      english_name: "",
      group_id: "",
      display_default: displayDefault.noneDisplay,
    },
    onSubmit: async (values, { setFieldError }) => {
      try {
        let res;
        if (values.id) {
          res = await api.fetcher(
            "put",
            `admin/attributeGroup/${data.id}`,
            values
          );
        } else {
          res = await api.fetcher("post", "admin/attributeGroup", values);
        }
        if (res) {
          onClose();
          cache.clear();
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
      category: Yup.string()
        .required(
          t("customs_attributes_screen.name") + " " + t("errors.required")
        )
        .nullable(),
      name: Yup.string()
        .required(
          t("customs_attributes_screen.attribute_group_name") +
            " " +
            t("errors.required")
        )
        .max(
          50,
          t("customs_attributes_screen.attribute_group_name") +
            " " +
            t("errors.max.before") +
            " 50 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
      english_name: Yup.string()
        .required(
          t("customs_attributes_screen.add_attribute_group_english_name") +
            " " +
            t("errors.required")
        )
        .max(
          50,
          t("customs_attributes_screen.add_attribute_group_english_name") +
            " " +
            t("errors.max.before") +
            " 50 " +
            t("errors.max.after")
        )
        .trim()
        .nullable(),
    }),
  });

  const getData = async (id) => {
    const res = await api.fetcher("get", `/admin/attributeGroup/${id}`);
    if (res) {
      formik.setValues(res);
    }
  };
  useEffect(() => {
    if (data) {
      formik.setFieldValue("category", data?.category);
    }
    if (data?.id) {
      getData(data.id);
    }
  }, [data]);

  const inputs = useMemo(
    () => [
      [
        {
          label: t("customs_attributes_screen.attribute_group_name"),
          variant: "standard",
          field: "name",
          type: "text",
          value: formik.values?.name,
          required: true,
          error: formik.touched.name && formik.errors?.name,
          onChange: formik.handleChange("name"),
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: t(
            "customs_attributes_screen.add_attribute_group_english_name"
          ),
          variant: "standard",
          field: "english_name",
          type: "text",
          value: formik.values?.english_name,
          required: true,
          error: formik.touched.english_name && formik.errors?.english_name,
          onChange: formik.handleChange("english_name"),
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FormControl>
          <FormLabel>{t("customs_attributes_screen.attribute")}</FormLabel>
          <RadioGroup
            style={{ display: "inline" }}
            value={formik.values.category}
            onChange={(event) =>
              formik.setFieldValue(
                "category",
                parseInt(event.currentTarget.value)
              )
            }
          >
            <FormControlLabel
              value={attributeCategories.PARTNER}
              control={<Radio color="primary" />}
              label={t("customs_attributes_screen.staff")}
            />
            <FormControlLabel
              value={attributeCategories.CUSTOMER}
              control={<Radio color="primary" />}
              label={t("customs_attributes_screen.volunteer")}
            />
          </RadioGroup>
        </FormControl>
      </div>
      <Forms
        inputs={inputs}
        data={formik.values}
        onChange={formik.setFieldValue}
        errors={api.error}
      />
      <Grid container xs={12}>
        <Grid item xs={12}>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="default"
                disabled={formik.isSubmitting || api.loading}
                onClick={onClose}
              >
                {t("customs_attributes_screen.cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 5 }}
                onClick={formik.handleSubmit}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={20} style={{ color: "white" }} />
                ) : (
                  t("customs_attributes_screen.save")
                )}
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
});

export default CustomAttributeList;
const useStyles = makeStyles((theme) => ({
  grid: {
    marginLeft: 5,
  },
  action_button: {
    cursor: "pointer",
    marginLeft: 5,
    fontSize: 20,
  },
  loading: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  header: {
    fontWeight: 600,
    fontSize: 18,
  },

  root: {
    width: "100%",
    padding: 20,
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },

  table: {
    minWidth: 750,
  },

  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));
