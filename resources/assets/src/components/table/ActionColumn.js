import React from "react";
import { IconButton, TableCell } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useDialog } from "../../components/Dialog";
import { useAPI } from "../../api/api";
import { useTranslation } from "react-i18next";
import EditIcon from "@material-ui/icons/Edit";

export default function ActionColumn(props) {
  const { row, actionColumn, onCheck } = props;
  const { dialog, handleClose } = useDialog();
  const api = useAPI();
  const { t } = useTranslation();
  const deleteConfirm = async (row, endpoint, refetch, action, message) => {
    await dialog({
      title: message ? message : t("action_column.delete.confirm"),
      type: "confirm",
      confirmationText: t("action_column.delete.confirm_text"),
      cancellationText: t("action_column.delete.cancel_text"),
    });
    try {
      const res = await api.fetcher("delete", endpoint + "/" + row.id, {
        action: action,
      });
      if (res) {
        refetch();
        onCheck((pre) => pre.filter((e) => e != row.id));
        handleClose();
      }
    } catch (e) {
      handleClose();
    }
  };

  const restoreConfirm = async (row, endpoint, refetch, action) => {
    await dialog({
      title: t("action_column.restore.confirm"),
      type: "confirm",
      confirmationText: t("action_column.restore.confirm_text"),
      cancellationText: t("action_column.restore.cancel_text"),
    });
    try {
      const res = await api.fetcher("delete", endpoint + "/" + row.id, {
        action: action,
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {
      handleClose();
    }
  };

  const onEdit = (row) => {
    if (actionColumn.onEdit?.display) {
      if (
        typeof actionColumn.onEdit?.display == "boolean"
          ? actionColumn.onEdit?.display
          : actionColumn.onEdit?.display(row)
      ) {
        return (
          <IconButton
            color="primary"
            title={t("action_column.view.title")}
            style={{
              padding: 3,
            }}
            onClick={() => actionColumn.onEdit?.callback(row)}
          >
            <EditIcon />
          </IconButton>
        );
      }
    }
    return null;
  };

  const onDelete = (row) => {
    if (actionColumn.onDelete?.display) {
      if (
        typeof actionColumn.onDelete?.display == "boolean"
          ? actionColumn.onDelete?.display
          : actionColumn.onDelete?.display(row)
      ) {
        return (
          <IconButton
            title={t("action_column.delete.title")}
            style={{
              color: "#c90303c7",
              padding: 3,
            }}
            onClick={() =>
              deleteConfirm(
                row,
                actionColumn.endpoint,
                actionColumn.refetch,
                actionColumn?.onDelete?.action
                  ? actionColumn?.onDelete?.action
                  : actionColumn.trashed
                  ? "force"
                  : "",
                actionColumn?.onDelete?.message
              )
            }
          >
            {actionColumn.trashed ? <DeleteIcon /> : <DeleteIcon />}
          </IconButton>
        );
      }
    }
    return null;
  };

  const onRestore = (row) => {
    if (actionColumn.trashed && actionColumn.onRestore) {
      return (
        <IconButton
          title={t("action_column.restore.title")}
          style={{
            padding: 3,
          }}
          onClick={() =>
            restoreConfirm(
              row,
              actionColumn.endpoint,
              actionColumn.refetch,
              "restore"
            )
          }
        >
          <RestoreFromTrashIcon />
        </IconButton>
      );
    }
    return null;
  };

  if (
    (!actionColumn.onEdit && !actionColumn.onDelete && !actionColumn.render) ||
    actionColumn.hide
  ) {
    return null;
  }

  return (
    <TableCell
      style={{
        textAlign: "right",
        minWidth: 190,
      }}
      {...actionColumn?.props}
    >
      {actionColumn?.render ? actionColumn?.render(row) : ""}
      {onEdit(row)}
      {onDelete(row)}
      {onRestore(row)}
    </TableCell>
  );
}
