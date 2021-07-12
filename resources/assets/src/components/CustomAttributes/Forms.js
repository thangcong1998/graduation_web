import React, { Fragment, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import Link from "./Link";
import DatePicker from "../form/Date";
import Radio from "./Radio";
import QueryCheckbox from "./QueryCheckbox";
import MultiSelect from "./MultiSelect";
import QuerySelect from "./QuerySelect";
import Checkbox from "./Checkbox";
import { inputTypes } from "../../common/constants";
import Select from "./Select";
import { NumberFieldWrap } from "./Number";
import { TextFieldWrap } from "./TextField";
import * as moment from "moment";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import RegionSelect from "./RegionSelect";
import TagInput from "./TagInput";
import DateRangePicker from "./DateRangePicker";

const Forms = React.memo(
    ({ inputs, loading, readOnly, variant, data, onChange, errors }) => {
      //scroll into first error
      const ref = useRef();
      useEffect(() => {
        if (ref.current) {
          ref.current.scrollIntoView();
        }
      });
      console.log("thanhcong");
      return (
        <Fragment>
          {inputs?.map((row, index) => (
            <Grid container spacing={3} key={index}>
              {row.map((column, index) => {
                if (!column) return null;
                const { type, label, grid, field, ...otherProps } = column;

                if (type === "region") {
                  if (readOnly) {
                    if (!otherProps.readOnlyValue) return null;
                    return (
                      <Grid
                        item
                        xs={12}
                        key={index}
                        style={{ marginBottom: 15 }}
                      >
                        <div className="readonly-wrapper">
                          <label className="readonly-label">{label}</label>
                          <span className="readonly-value text-break">
                            {otherProps.readOnlyValue}
                          </span>
                        </div>
                      </Grid>
                    );
                  }

                  return (
                    <RegionSelect
                      variant={variant || "outlined"}
                      label={label}
                      values={data}
                      onChange={otherProps.onChange}
                      loading={loading}
                      readOnly={readOnly}
                      error={errors}
                      {...otherProps}
                    />
                  );
                }

                return (
                  <Grid item xs={6} {...grid} key={index}>
                    <div
                      id={field}
                      ref={errors[field] && !ref.current ? ref : null}
                    >
                      {column.component ? (
                        <column.component />
                      ) : (
                        <Input
                          variant={variant || "outlined"}
                          type={type}
                          label={label}
                          value={data[field]}
                          onChange={(val) => onChange(field, val)}
                          error={errors[field]}
                          loading={loading}
                          readOnly={readOnly}
                          {...otherProps}
                        />
                      )}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Fragment>
      );
    }
  ),
  
export const FlatForms = React.memo(({ inputs, formik, variant, ...other }) => {
  return (
    <Grid container {...other.rowProps}>
      {inputs.map((input, index) => {
        const {
          type,
          label,
          field,
          value,
          onChange,
          error,
          grid,
          ...otherProps
        } = input;

        return (
          <Grid item xs={6} {...input.grid} key={index}>
            <Input
              // controlled={['number', 'text'].includes(type) ? true : ''}
              variant={variant || "standard"}
              type={type === "select" ? "checkbox" : type}
              label={label}
              value={formik.values[field]}
              onChange={(value) =>
                formik.setFieldValue(
                  field,
                  type === "query-select" ? value?.[input.valueField] : value
                )
              }
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
    onChange,
    error,
    loading,
    readOnly,
    link,
    ...otherProps
  }) => {
    if (readOnly && !value) return null;
    function renderReadOnly() {
      // console.log('query',otherProps.readOnlyValue)
      switch (type) {
        case inputTypes.TEXT:
          return <span className="readonly-value text-break">{value}</span>;
        case inputTypes.TEXTAREA:
          return <span className="readonly-value text-break">{value}</span>;
        case inputTypes.LINK:
          return (
            <a
              href={value}
              target="_blank"
              className="readonly-value text-break"
            >
              {value}
            </a>
          );
        case inputTypes.PASSWORD:
          return (
            <TextField
              className="standard-required"
              label={label}
              value={value || ""}
              fullWidth={true}
              shrink="true"
              onChange={onChange}
            />
          );

        case inputTypes.NUMBER:
          return <span className="readonly-value text-break">{value}</span>;
        //-----------------no read-only
        case inputTypes.RADIO:
          return (
            <span className="readonly-value text-break">
              {
                otherProps.options.find((option) => option.value == value)
                  ?.label
              }
            </span>
          );
        case "select":
          return otherProps?.options
            ?.filter((x) => x.value === value)
            .map((a) => (
              <span className="readonly-value text-break">{a?.label}</span>
            ));

        case "query-select":
          return (
            <span className="readonly-value text-break">
              {otherProps.readOnlyValue}
            </span>
          );
        case "date":
          return (
            <span className="readonly-value text-break">
              {value ? moment(value).format("DD/MM/YYYY") : null}
            </span>
          );
        default:
          return null;
      }
    }

    function render() {
      switch (type) {
        case inputTypes.TEXT:
        case inputTypes.LINK:
        case inputTypes.PASSWORD:
        case inputTypes.TEXTAREA:
          return (
            <TextFieldWrap
              {...otherProps}
              type={type}
              label={label}
              value={value}
              onChange={onChange}
              error={error}
            />
          );
        case inputTypes.NUMBER:
          return (
            <NumberFieldWrap
              {...otherProps}
              type={type}
              label={label}
              value={value}
              onChange={onChange}
              error={error}
            />
          );
        case inputTypes.SELECT:
          return (
            <Select
              {...otherProps}
              label={label}
              value={value}
              onChange={onChange}
              error={error}
            />
          );
        case inputTypes.CHECKBOX:
          return (
            <Checkbox
              {...otherProps}
              label={label}
              value={value}
              onChange={onChange}
              error={error}
            />
          );
        case "query-select":
          return (
            <QuerySelect
              endpoint={otherProps.endpoint}
              labelField={otherProps.labelField}
              valueField={otherProps.valueField}
              queryField={otherProps.queryField}
              value={value}
              onChange={onChange}
              label={label}
              error={error}
              {...otherProps}
            />
          );
        case "multiselect":
          return (
            <MultiSelect
              endpoint={otherProps.endpoint}
              labelField={otherProps.labelField}
              valueField={otherProps.valueField}
              queryField={otherProps.queryField}
              value={value}
              onChange={onChange}
              label={label}
              error={error}
              {...otherProps}
            />
          );
        case "cate-checkbox":
        case "query-checkbox":
          return (
            <QueryCheckbox
              label={label}
              value={value}
              onChange={onChange}
              {...otherProps}
            />
          );
        case inputTypes.RADIO:
          return (
            <Radio
              {...otherProps}
              label={label}
              onChange={onChange}
              value={value}
              error={error}
            />
          );

        case "date":
          return (
            <DatePicker
              label={label}
              value={value}
              onChange={onChange}
              error={error}
              {...otherProps}
            />
          );
        case "date-range":
          return (
            <DateRangePicker
              label={label}
              value={value}
              onChange={onChange}
              error={error}
              {...otherProps}
            />
          );
        case "tag":
          return (
            <TagInput
              error={error}
              defaultValue={value?.split(",") || []}
              label={label}
              fullWidth
              onChange={(values) => onChange(values.join(","))}
            />
          );
        // case 'date-range-bp':
        //   return (
        //     <DateRangeInput
        //       shortcuts={false}
        //       locale="vi"
        //       localeUtils={MomentLocaleUtils}
        //       className="dateRange"
        //       formatDate={date => Moment(date).format('DD/MM/YYYY')}
        //       parseDate={str =>
        //         new Date(Moment(str, 'DD/MM/YYYY').format('YYYY/MM/DD'))
        //       }
        //       value={[
        //         value && value[0] ? new Date(value[0]) : null,
        //         value && value[1] ? new Date(value[1]) : null
        //       ]}
        //       onChange={date => {
        //         onChange([
        //           Moment(date[0]).format('YYYY-MM-DD'),
        //           Moment(date[1]).format('YYYY-MM-DD')
        //         ]);
        //       }}
        //       contiguousCalendarMonths={false}
        //       timePrecision={false}
        //       closeOnSelection={false}
        //       placeholder="DD/MM/YY"
        //       startInputProps={{ placeholder: 'Từ...' }}
        //       endInputProps={{ placeholder: 'Đến...' }}
        //       popoverProps={{
        //         captureDismiss: true,
        //         usePortal: false
        //       }}
        //       {...otherProps}
        //     />
        //   );

        default:
          return null;
      }
    }

    if (type === "region") {
      return (
        <RegionSelect values={value} onChange={onChange} {...otherProps} />
      );
    }

    return (
      <div style={{ marginBottom: 20 }}>
        <div className={loading ? "bp3-skeleton" : null}>
          {readOnly ? (
            <div className="readonly-wrapper">
              {(otherProps.readOnlyValue || value) && (
                <label className="readonly-label">{label}</label>
              )}
              {renderReadOnly()}
            </div>
          ) : (
            render()
          )}
        </div>
      </div>
    );
  }
);
export default Forms;
