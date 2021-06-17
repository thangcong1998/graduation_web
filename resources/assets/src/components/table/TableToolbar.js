import React, { useState, Fragment } from "react";
import {
  IconButton,
  Button,
  Toolbar,
  ButtonGroup,
  Collapse,
} from "@material-ui/core";
import ButtonAdd from "../button/ButtonAddSolashi";
import Filter from "./Filter";
import FilterCollapse from "./FilterCollapse";
import FieldCheck from "./FieldCheck";
import { makeStyles } from "@material-ui/core/styles";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import { useTranslation } from "react-i18next";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAPI } from "../../api/api";
import { useDialog } from "../Dialog";
import SearchIcon from "@material-ui/icons/Search";
import Shirt from "../../assets/image/shirt.png";
const useStyles = makeStyles((theme) => ({
  toolbar: {
    padding: 0,
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function TableToolbar(props) {
  const {
    loading,
    addButton,
    columns,
    filterInput,
    handleChangeParams,
    checked,
    setChecked,
    endpoint,
    trashed,
    nameFileExport,
    endpointDelete,
    refetch,
    actionDelete,
    showDelete,
    initialParams,
    popover,
    noneColumns,
    showUniform,
      endpointUniform,
      showExport
  } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  const api = useAPI();
  const [viewFilter, setViewFilter] = useState(false);
  const exportExcel = async (ids) => {
    try {
      let res = await api.fetcher(
        "get",
        endpoint,
        {
          path: "excel File",
          ids: JSON.stringify(ids),
          columns: JSON.stringify(
            columns.columnChecked.filter((column) => column.display == true)
          ),
        },
        {
          responseType: "blob",
        }
      );

      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nameFileExport + ".xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };

  const { dialog, handleClose } = useDialog();
  const deleteList = async (ids) => {
    await dialog({
      title: t("action_column.delete.confirm"),
      type: "confirm",
      confirmationText: t("action_column.delete.confirm_text"),
      cancellationText: t("action_column.delete.cancel_text"),
    });
    try {
      const res = await api.fetcher("post", endpointDelete, {
        ids: JSON.stringify(ids),
        action: actionDelete,
      });
      if (res) {
        setChecked([]);
        refetch();
        handleClose();
      }
    } catch (e) {
      handleClose();
    }
  };
  const uniformCheck = async (ids) => {
    await dialog({
      title: t("action_column.uniform"),
      type: "confirm",
      confirmationText: t("action_column.delete.confirm_text"),
      cancellationText: t("action_column.delete.cancel_text"),
    });
    try {
      const res = await api.fetcher("post", endpointUniform, {
        ids: JSON.stringify(ids),
      });
      if (res) {
        setChecked([]);
        refetch();
        handleClose();
      }
    } catch (e) {
      handleClose();
    }
  };

  return (
    <Fragment>
      {!popover && (
        <div>
          <Collapse in={viewFilter}>
            <FilterCollapse
              handleChangeParams={handleChangeParams}
              inputs={columns?.filterFieldChecked}
              handleChangeFilterFields={columns?.handleChangeFilterFields}
              loading={loading}
              initialParams={initialParams}
              reset={columns?.defaultFilter}
              setHide={setViewFilter}
            />
          </Collapse>
        </div>
      )}
      <Toolbar className={classes.toolbar}>
        {addButton?.render ? (
          addButton.render
        ) : addButton.display ? (
          <ButtonAdd
            text={addButton?.text}
            onClick={() => addButton.onClick()}
          />
        ) : (
          <div></div>
        )}
        <div style={{ display: "flex" }}>
          {checked?.length > 0 && showExport !== false && (
            <IconButton
              title={t("toolbar.export")}
              onClick={() => {
                exportExcel(checked);
              }}
            >
              <GetAppIcon />
            </IconButton>
          )}
          {checked?.length > 0 && showDelete === true && (
            <IconButton
              title={t("toolbar.delete_list")}
              onClick={() => {
                deleteList(checked);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {checked?.length > 0 && showUniform === true && (
              <IconButton
                  title={t("toolbar.uniform")}
                  onClick={() => {
                    uniformCheck(checked);
                  }}
              >
                <img src={Shirt} alt={""} width={24} height={24}/>
              </IconButton>
          )}
          {/* filter */}
          {popover ? (
            <Filter
              handleChangeParams={handleChangeParams}
              inputs={filterInput}
              loading={loading}
              initialParams={initialParams}
            />
          ) : (
            <IconButton
              onClick={() => setViewFilter((pre) => !pre)}
              title={t("title.filter")}
            >
              <SearchIcon />
            </IconButton>
          )}
          {columns && !noneColumns && <FieldCheck columns={columns} />}
          {trashed?.display ? (
            trashed?.isTrash ? (
              <IconButton
                title={t("toolbar.back")}
                onClick={() =>
                  handleChangeParams((pre) => ({
                    ...pre,
                    only_trashed: undefined,
                  }))
                }
              >
                <KeyboardBackspaceIcon />
              </IconButton>
            ) : (
              <IconButton
                title={t("toolbar.trash")}
                onClick={() =>
                  handleChangeParams((pre) => ({ ...pre, only_trashed: true }))
                }
              >
                <DeleteSweepIcon />
              </IconButton>
            )
          ) : null}
        </div>
      </Toolbar>
    </Fragment>
  );
}
