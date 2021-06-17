import React from "react";
import { Fragment, useMemo } from "react";
import useDebouncedQuery from "./useDebouncedQuery";
import Checkbox from "./Checkbox";

export default ({ endpoint, ...other }) => {
  const { items } = useDebouncedQuery(endpoint);

  const options = useMemo(
    () =>
      items?.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [items]
  );

  return <Checkbox {...other} options={other.options || options} />;
};
