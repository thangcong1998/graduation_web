import React, { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { inputTypes } from "../../common/constants";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import Number from "./Number";
import Select from "./Select";
import CheckBox from "./CheckBox";
import Radio from "./Radios";
import Switch from "./Switch";
import Date from "./Date";
import CheckboxQuery from "./CheckBoxQuery";
import Autocomplete from "./Autocomplete";
import AutocompleteFilter from "./AutocompleteFilter";
import RegionSelect from "./RegionSelect";
import DateRange from "./DateRange";
import DateTime from "./DateTime";
import Moment from "moment";
import { makeStyles } from "@material-ui/styles";
import { Skeleton } from "@material-ui/lab";
import DateRangePicker from "./DateRangePicker";
import MultiSelectStaff from "./MultiSelectStaff";

const Forms = React.memo(({ inputs, loading, readOnly, variant }) => {
  return (
    <Fragment>
      {inputs?.map((row, index) => (
        <Grid container key={index} spacing={2}>
          {row?.map((column, index) => {
            if (!column) return null;
            const {
              type,
              label,
              value,
              handleChange,
              error,
              grid,
              valueComponent,
              ...otherProps
            } = column;
            return otherProps?.display === false ? (
              ""
            ) : (
              <Grid item {...grid} key={index}>
                {column.component ? (
                  <column.component value={value} handleChange={handleChange} />
                ) : (
                  <Input
                    style={{
                      width: "100%",
                    }}
                    variant={variant || "outlined"}
                    type={type}
                    label={label}
                    value={value}
                    handleChange={handleChange}
                    error={error}
                    loading={loading}
                    readOnly={readOnly}
                    {...otherProps}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Fragment>
  );
});

export const FlatForms = React.memo(({ inputs, formik, variant, ...other }) => {
  return (
    <Grid container {...other.rowProps} spacing={2}>
      {inputs.map((input, index) => {
        const {
          type,
          label,
          field,
          value,
          handleChange,
          error,
          grid,
          ...otherProps
        } = input;
        return (
          <Grid
            item
            xs={12}
            style={otherProps?.gridStyle}
            {...input.grid}
            key={index}
          >
            <Input
              style={{ width: "100%" }}
              controlled={true}
              variant={variant || "outlined"}
              type={type}
              inputVariant={type === "date" ? "outlined" : null}
              label={label}
              value={formik.values[field]}
              handleChange={(value) =>
                formik.setFieldValue(
                  field,
                  type === "query-select" ? value?.[input.valueField] : value
                )
              }
              allValue={formik.values}
              {...otherProps}
            />
          </Grid>
        );
      })}
    </Grid>
  );
});
export const Input = React.memo(
  ({
    type,
    label,
    value,
    handleChange,
    error,
    loading,
    readOnly,
    link,
    allValue,
    ...otherProps
  }) => {
    function renderReadOnly() {
      switch (type) {
        case "autocomplete":
          return value?.[otherProps?.labelField];
        // case "select":
        //   return otherProps?.options?.find((e) => (e.value = value))["label"];
        // case "switch":
        //   return (
        //     <Switch
        //       {...otherProps}
        //       label={label}
        //       value={value}
        //       disable={true}
        //       error={error}
        //     />
        //   );
        case inputTypes.RADIO:
          let render = otherProps?.options?.find((e) => e.value == value);
          return render?.label;
        case inputTypes.CHECKBOX:
          let checkboxs = otherProps?.options
            ?.filter((e) => value?.some((v) => v == e.value))
            .map((c) => <div>{c.label}</div>);
          return checkboxs;
        case "date":
          if (value) {
            return Moment(value).format("DD/MM/YYYY");
          }
          return null;
        case inputTypes.DATETIME:
          if (value) {
            return Moment(value).format("DD/MM/YYYY HH:mm:ss");
          }
          return null;
        case inputTypes.SELECT:
          if (value) {
            return otherProps?.options?.find((e) => e.value == value)?.label;
          }
          return null;
        case "date-range":
          if (value) {
            return `${Moment(value?.startDate).format("DD/MM/YYYY")} - ${Moment(
              value?.endDate
            ).format("DD/MM/YYYY")} `;
          }
          return null;
        default:
          return value;
      }
    }

    function render() {
      switch (type) {
        case inputTypes.TEXT:
        case inputTypes.PASSWORD:
          return (
            <TextInput
              {...otherProps}
              type={type}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case inputTypes.TEXTAREA:
          return (
            <TextArea
              {...otherProps}
              type={type}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.NUMBER:
          return (
            <Number
              {...otherProps}
              type={type}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case inputTypes.SELECT:
          return (
            <Select
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case inputTypes.CHECKBOX:
          return (
            <CheckBox
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case "checkbox-query":
          return (
            <CheckboxQuery
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.RADIO:
          return (
            <Radio
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.SWITCH:
          return (
            <Switch
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.DATE:
          return (
            <Date
              {...otherProps}
              label={label}
              value={value}
              error={error}
              handleChange={handleChange}
              size="small"
            />
          );

        case inputTypes.DATETIME:
          return (
            <DateTime
              {...otherProps}
              label={label}
              value={value}
              error={error}
              handleChange={handleChange}
              size="small"
            />
          );

        case "autocomplete":
          return (
            <Autocomplete
              {...otherProps}
              endpoint={otherProps.endpoint}
              queryField={otherProps.queryField}
              labelField={otherProps.labelField}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case "autocompleteFilter":
          const sub =
            typeof otherProps?.sub_params === "function" &&
            otherProps?.sub_params(allValue);
          return (
            <AutocompleteFilter
              {...otherProps}
              endpoint={otherProps.endpoint}
              queryField={otherProps.queryField}
              label={label}
              value={value}
              handleChange={handleChange}
              size="small"
              params={
                sub ? { ...otherProps?.params, ...sub } : otherProps?.params
              }
            />
          );

        case "multiSelectStaff":
          return (
            <MultiSelectStaff
              {...otherProps}
              endpoint={otherProps.endpoint}
              queryField={otherProps.queryField}
              valueField={otherProps.valueField}
              label={label}
              value={value}
              handleChange={handleChange}
              size="small"
            />
          );

        case "region-select":
          return (
            <RegionSelect
              values={value}
              setFieldValue={otherProps.setFieldValue}
              error={error}
              size={otherProps.size}
            />
          );

        case "date-range":
          return (
            <DateRangePicker
              label={label}
              value={value}
              onChange={handleChange}
              error={error}
              {...otherProps}
            />
          );

        default:
          return null;
      }
    }
    const classes = useStyle();
    return (
      <div style={{ marginBottom: 10 }}>
        {loading ? (
          <Skeleton />
        ) : readOnly ? (
          <div className={classes.readonlyWrapper}>
            <div style={{ fontWeight: "600" }}>
              <label className="readonly-label">{label}&nbsp;</label>
            </div>
            <div style={{ fontSize: "1rem" }}>{renderReadOnly()}</div>
          </div>
        ) : (
          render()
        )}
      </div>
    );
  }
);

export default Forms;

const useStyle = makeStyles((theme) => ({
  readonlyWrapper: {},
}));
