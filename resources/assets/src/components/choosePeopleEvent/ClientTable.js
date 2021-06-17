import React, { forwardRef, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation } from "react-i18next";
import {
  MuiThemeProvider,
  createMuiTheme,
  IconButton,
} from "@material-ui/core";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function (props) {
  const {
    data,
    onDelete,
    title,
    columns,
    add,
    showCheck,
    onEdit,
    loading,
    optionProps,
    ...otherProps
  } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const _columns = [
    {
      field: "",
      title: "",
      cellStyle: {
        overflowWrap: "anywhere",
        textAlign: "right",
      },
      sorting: false,
      headerStyle: { width: "50px !important" },
      render: (row) => (
        <IconButton onClick={() => onDelete(row?.id)}>
          <DeleteOutline />
        </IconButton>
      ),
    },
  ];
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#2196F3",
      },
    },
  });
  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        {...otherProps}
        title={title}
        icons={tableIcons}
        columns={columns}
        onChangePage={(page) => {
          setPage(page);
        }}
        onChangeRowsPerPage={(e) => {
          setPerPage(e);
        }}
        data={data}
        components={{
          Toolbar: (props) => <MTableToolbar {...props} />,
        }}
        isLoading={loading}
        actions={[
          onEdit && {
            icon: () => <VisibilityOutlinedIcon />,
            tooltip: "Edit",
            onClick: (event, row) => {
              onEdit(row);
            },
          },
          onDelete && {
            icon: () => <DeleteOutline />,
            tooltip: "Delete",
            onClick: () => {
              onDelete(checked);
              setChecked([]);
            },
          },
        ]}
        onSelectionChange={(rows, row) => {
          setChecked(rows?.map((e) => e?.id));
        }}
        options={{
          actionsColumnIndex: -1,
          pageSize: 20,
          pageSizeOptions: [20, 35, 50],
          selection: !!showCheck,
          headerStyle: {
            fontSize: "1rem",
            fontWeight: "bold",
          },
          emptyRowsWhenPaging: false,
          ...optionProps,
        }}
        localization={{
          pagination: {
            labelDisplayedRows:
              "{from} - {to} " + t("pagination.total") + " {count}",
            labelRowsSelect: "",
          },
          toolbar: {
            searchTooltip: t("title.filter"),
            searchPlaceholder: t("title.filter"),
            nRowsSelected: "{0} " + t("title.row_selected"),
          },
          body: {
            emptyDataSourceMessage: t("title.empty_data"),
          },
          header: {
            actions: " ",
          },
        }}
      />
    </MuiThemeProvider>
  );
}
