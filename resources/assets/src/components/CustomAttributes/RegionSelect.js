import React, { Fragment, useState } from "react";
import { Input } from "./Forms";
import { Row, Col } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
// import {useAuthContext} from "../../containers/AuthProvider";

export default React.memo(({ values, onChange, label, error, ...other }) => {
  // const { authorizedRoutes, me,perms } = useAuthContext();
  // const endpointUrl =
  //   me && me?.roles[0]?.name && me.roles[0].name === "user"
  //     ? "v1/user"
  //     : "v1/admin";
  return (
    <Fragment>
      <Grid item xs={4}>
        <Input
          label="Tỉnh/Thành phố"
          type="query-select"
          labelField="_name"
          queryField="_name_like"
          // endpoint={endpointUrl + "/province"}
          valueField="id"
          value={values.province_id}
          onChange={(value) =>
            onChange({
              province_id: value,
              district_id: null,
              ward_id: null,
              address: values.address,
            })
          }
          {...other}
          error={error["province_id"]}
        />
      </Grid>
      <Grid item xs={4}>
        <Input
          label="Quận/Huyện"
          type="query-select"
          labelField="_name"
          queryField="_name_like"
          // endpoint={me && me?.roles[0].name !== 'user'?"v1/admin/province":"v1/user/province"}
          // endpoint={
          //   values.province_id &&
          //   `${endpointUrl}/district?_province_id_equal=` + values.province_id
          // }
          valueField="id"
          value={values.district_id}
          onChange={(value) =>
            onChange({
              ...values,
              district_id: value,
              ward_id: null,
            })
          }
          disabled={!values.province_id}
          error={error["district_id"]}
          {...other}
        />
      </Grid>
      <Grid item xs={4}>
        <Input
          label="Phường/Xã"
          type="query-select"
          labelField="_name"
          queryField="_name_like"
          // endpoint={
          //   values.district_id &&
          //    `${endpointUrl}/ward?_district_id_equal=` + values.district_id
          // }
          valueField="id"
          value={values.ward_id}
          onChange={(value) =>
            onChange({
              ...values,
              ward_id: value,
            })
          }
          disabled={!values.district_id}
          error={error["ward_id"]}
          {...other}
        />
      </Grid>

      <Grid item xs={12}>
        <Input
          label="Địa chỉ cụ thể"
          type="textarea"
          rows={2}
          value={values.address}
          onChange={(val) => onChange({ ...values, address: val })}
          error={error["address"]}
        />
      </Grid>
    </Fragment>
  );
});
