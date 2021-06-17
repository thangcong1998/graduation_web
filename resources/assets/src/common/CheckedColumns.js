import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useCheckedColumns = ({ columns, filterFields }) => {
  const [columnChecked, setColumnChecked] = useState([]);
  const [filterFieldChecked, setFilterFieldChecked] = useState([]);
  const _columnChecked = columnChecked.map((pre, index) => ({
    ...pre,
    title: columns[index]?.title,
  }));
  const _filterFieldChecked = filterFieldChecked.map((f, index) => ({
    ...f,
  }));
  const location = useLocation();
  const [newCache, setNewCache] = useState();
  const { t, i18n } = useTranslation();
  function loadCache() {
    if (localStorage.getItem([location.pathname]) !== "undefined" && columns) {
      const cache = JSON.parse(localStorage.getItem([location.pathname]));
      if (cache?.columnChecked && columns) {
        setColumnChecked(
          columns.map((e, index) => ({
            ...e,
            display: cache?.columnChecked[index]
              ? cache?.columnChecked[index]?.display
              : true,
          }))
        );
      } else {
        setColumnChecked(columns);
      }
      if (cache?.filterFieldChecked && filterFields) {
        setFilterFieldChecked(
          filterFields.map((e, index) => ({
            ...e,
            display: cache?.filterFieldChecked[index]
              ? cache?.filterFieldChecked[index]?.display
              : true,
          }))
        );
      } else {
        setFilterFieldChecked(filterFields);
      }
    }
  }
  useEffect(() => {
    loadCache();
  }, [i18n.languages[0]]);

  useEffect(() => {
    setNewCache(
      JSON.stringify({
        columnChecked: Object.assign(
          columnChecked.map((e) => ({ field: e.field, display: e.display }))
        ),
        filterFieldChecked: Object.assign(
          filterFieldChecked.map((e) => ({
            field: e.field,
            display: e.display,
          }))
        ),
      })
    );
  }, [columnChecked, filterFieldChecked]);

  useEffect(() => {
    localStorage.setItem([location.pathname], newCache);
  }, [newCache]);

  const handleChangeColumns = (column, index) => {
    setColumnChecked((pre) =>
      pre.map((e) =>
        e.field == column.field ? { ...e, display: !e.display } : e
      )
    );
  };

  const handleChangeFilterFields = (field, index) => {
    setFilterFieldChecked((pre) =>
      pre.map((e) =>
        e.field == field.field ? { ...e, display: !e.display } : e
      )
    );
  };

  const defaultColumns = () => {
    setColumnChecked(columns);
  };

  const defaultFilter = () => {
    setFilterFieldChecked(filterFields);
  };
  return {
    columnChecked: _columnChecked,
    filterFieldChecked: _filterFieldChecked,
    handleChangeColumns,
    handleChangeFilterFields,
    defaultColumns,
    defaultFilter,
  };
};

export default useCheckedColumns;
