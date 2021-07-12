import React, { useState, useEffect, useContext, useMemo } from "react";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import TableToolbar from "../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../common/CheckedColumns";
import RegistrationInputs from "./RegistrationInputs";
import { adminApi } from "../../../routes/AdminRoutes";
import { useHistory } from "react-router-dom";
import { Paper, makeStyles } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import Pagination from "../../../components/table/Pagination";
import { IconButton, Button, ButtonGroup } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDialog } from "../../../components/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { checkPerm, profile_status } from "../../../common/constants";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ButtonDownloadCard from "../../../components/button/ButtonDownloadCard";
import ButtonIconDownloadCard from "../../../components/button/ButtonIconDownloadCard";
import { AuthContext } from "../../AuthProvider";
import { useFormik } from "formik";
import SportsSoccerSharpIcon from "@material-ui/icons/SportsSoccerSharp";
import Popover from "../../../components/popover";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { CheckProfileStatus, CheckSex } from "../../../common/constants";
import color from "../../../common/color.json";
const DownloadCards = (props) => {
  const { checked, close } = props;
  const api = useAPI();
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const download = async () => {
    try {
      if (checked) {
        setMessage(t("process.processing"));
        let res = await api.fetcher(
          "post",
          "/admin/downloadCards",
          { ids: checked },
          {
            responseType: "blob",
          }
        );
        if (res) {
          setMessage(t("process.success"));
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Cards.pdf");
          document.body.appendChild(link);
          link.click();
          close();
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    download();
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="loadingDC"
    >
      {api.loading && (
        <span>
          <CircularProgress />
        </span>
      )}
      {message}
    </div>
  );
};

const SpportList = ({ row }) => {
  const { t, i18n } = useTranslation();
  return (
    <Paper style={{ padding: 10 }}>
      <div>
        {row?.entry_by_name.length > 0 ? (
          row?.entry_by_name?.map((e, index) => (
            <div>
              {index + 1}.{" "}
              {i18n?.languages[0] == "vi" ? e?.name : e?.english_name}
            </div>
          ))
        ) : (
          <div>{t("title.empty_data")}</div>
        )}
      </div>
    </Paper>
  );
};

const AttachFile = ({ row }) => {
  const { t } = useTranslation();
  return row?.file_scan ? (
    <object
      style={{
        width: 900,
        height: "99%",
      }}
      data={process.env.REACT_APP_STORAGE_URL + "/" + row?.file_scan}
    ></object>
  ) : (
    <div>{t("message.empty")}</div>
  );
};

export default function RegistrationList(props) {
  const [endpoint, setEndpoint] = useState("/admin/participant");
  const { t, i18n } = useTranslation();
  const initialParams = {
    per_page: 50,
    page: 1,
  };
  const classes = useStyle();
  const history = useHistory();
  const { perms } = useContext(AuthContext);
  const api = useAPI();
  const [params, setParams] = useState(initialParams);
  const [checked, setChecked] = useState([]);
  const { dialog, handleClose } = useDialog();
  // const [tab, setTab] = useState(1);
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "/admin/participant",
    params,
  ]);

  const { data: count, loading: countLoading, revalidate: reCount } = useFetch([
    "get",
    "/admin/countPersonalInfo",
  ]);

  // useEffect(() => {
  //   setParams((pre) => ({ ...pre, page: 1, tab: tab }));
  //   setChecked([]);
  // }, [tab]);

  const processing = async () => {
    await dialog({
      title: "",
      content: <DownloadCards checked={checked} close={handleClose} />,
    });
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: (value) => {
      {
        setParams((params) => ({
          ...params,
          function_id_equal: value?.function_id_equal,
          team_id_equal: value?.team_id_equal,
          ...value,
          team: null,
          page: 1,
        }));
      }
    },
  });
  const handleReset = () => {
    formik.setValues({});
    setParams({ ...initialParams });
  };

  const GroupButton = (
    <ButtonGroup variant="contained" color="primary">
      <ButtonGroup variant="contained" color="primary">
        <Button
          startIcon={<AddIcon />}
          style={{
            color: "#ffffff",
          }}
          color="primary"
          variant="contained"
          onClick={() => {
            history.push("/registration/create");
          }}
        >
          {t("member_screen.register_member")}
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );

  const downloadCard = async (row) => {
    try {
      let res = await api.fetcher(
        "get",
        `/admin/downloadCard/${row?.id}?v=${Math.random()}`,
        {},
        {
          responseType: "blob",
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "card.pdf");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };

  const decided = async (status) => {
    try {
      let res = await api.fetcher(
        "get",
        adminApi + "/bulkDecided/personalInfo",
        { ids: checked, approval_status: status }
      );
      if (res) {
        setChecked([]);
        refetch();
        reCount();
      }
    } catch (e) {}
  };

  const showAttachFile = async (row) => {
    await dialog({
      title: "",
      content: <AttachFile row={row} />,
      dialogProps: {
        maxWidth: "md",
        PaperProps: row?.file_scan
          ? {
              style: {
                height: 800,
                maxHeight: "90%",
              },
            }
          : {},
      },
    });
  };

  const { filterInputs } = RegistrationInputs();

  const approve = async (id) => {
    try {
      let res = await api.fetcher("put", "/admin/approvePersonal/" + id, {
        approval_status: 2,
      });
      if (res) {
        refetch();
      }
    } catch (e) {}
  };

  const reject = async (id) => {
    try {
      let res = await api.fetcher("put", "/admin/approvePersonal/" + id, {
        approval_status: 3,
      });
      if (res) {
        refetch();
      }
    } catch (e) {}
  };

  const columns = [
    {
      field: "given_name",
      title: t("member_screen.given_name"),
      display: true,
      sort: true,
    },
    {
      field: "family_name",
      title: t("member_screen.family_name"),
      display: true,
      sort: true,
    },
    {
      field: "sex",
      title: t("member_screen.sex"),
      display: true,
      render: (row) => {
        return CheckSex(row.sex, t);
      },
    },
    {
      field: "team",
      title: t("member_screen.team"),
      display: true,
      render: (row) => {
        return i18n.languages[0] == "en"
          ? row?.team?.english_name
          : row?.team?.name;
      },
    },
    // {
    //     field: "approval_status",
    //     title: t("member_screen.approval_status"),
    //     display: true,
    //     render: (row) => {
    //         return CheckProfileStatus(row.approval_status, t);
    //     },
    // },
    // {
    //   field: "doping_registered",
    //   title: t("member_screen.doping_registered"),
    //   display: false,
    //   render: (row) =>
    //     row?.doping_url
    //       ? t("member_screen.doping.registered")
    //       : t("member_screen.doping.no"),
    // },
  ];

  const columnCheck = useCheckedColumns({
    columns: columns,
    filterFields: filterInputs,
  });

  return (
    <React.Fragment>
      <Paper style={{ padding: "5px 10px 10px 10px" }}>
        <TableToolbar
          addButton={{
            render: GroupButton,
          }}
          endpoint={"/admin/exportMember"}
          nameFileExport={"Member"}
          columns={columnCheck}
          handleChangeParams={setParams}
          loading={loading}
          checked={checked}
          setChecked={setChecked}
          endpointDelete={"/admin/bulkDelete/personalInfo"}
          refetch={() => {
            refetch();
            reCount();
          }}
          showDelete={checkPerm(perms, "register_management_delete")}
        />
        <DataTable
          data={data?.data}
          columns={[
            ...columnCheck.columnChecked,
            {
              display: true,
              props: { onClick: (row) => {} },
              render: (row) => {
                return (
                  <React.Fragment>
                    {row?.approval_status === 1 && (
                      <ButtonGroup variant="contained" orientation="vertical">
                        <Button
                          onClick={() => approve(row?.id)}
                          color="primary"
                          style={{
                            height: 40,
                            fontSize: "0.75rem",
                            padding: 2,
                            minWidth: 77,
                          }}
                        >
                          {t("button.approve")}
                        </Button>
                        <Button
                          onClick={() => reject(row?.id)}
                          color="secondary"
                          style={{
                            height: 40,
                            fontSize: "0.75rem",
                            padding: 0,
                            minWidth: 77,
                          }}
                        >
                          {t("member_registration.reject")}
                        </Button>
                      </ButtonGroup>
                    )}
                  </React.Fragment>
                );
              },
            },
            params?.approval_status_equal == 2 && {
              title: t("member_registration.sport"),
              display: true,
              props: { onClick: (row) => {} },
              render: (row) => {
                return (
                  row?.approval_status === 2 && (
                    <React.Fragment>
                      <Popover content={<SpportList row={row} />}>
                        <IconButton
                          className={classes.actionColumn}
                          title={t("title.sport")}
                        >
                          <SportsSoccerSharpIcon />
                        </IconButton>
                      </Popover>
                    </React.Fragment>
                  )
                );
              },
            },
          ]}
          actionColumn={{
            onEdit: {
              display: checkPerm(perms, "register_management_view"),
              callback: (row) => {
                history.push(history.push("/registration/" + row.id));
              },
            },
            onDelete: {
              display: checkPerm(perms, "register_management_delete"),
              action: "force",
            },
            onRestore: true,
            endpoint: endpoint,
            trashed: params?.only_trashed,
            refetch: refetch,
          }}
          checked={checked}
          onCheck={setChecked}
          onClickRow={
            checkPerm(perms, "register_management_view")
              ? "/registration"
              : null
          }
          onSort={setParams}
          loading={loading}
        />
        <Pagination
          setParams={setParams}
          count={data?.last_page}
          page={params?.page}
          perPage={params.per_page}
          fromTo={[data?.from, data?.to]}
          total={data?.total}
        />
      </Paper>
    </React.Fragment>
  );
}

const useStyle = makeStyles((theme) => ({
  table: {
    marginTop: 10,
    width: "100%",
    fontSize: "1rem",
  },
  cellHead: {
    padding: 10,
    fontWeight: 549,
    textAlign: "start",
    width: "10%",
    backgroundColor: "#9c9a9a2e",
  },
  cell: {
    width: "25%",

    textAlign: "start",
    padding: 4,
  },
  buttonSearch: {
    backgroundColor: "#2296f3",
    color: "white",
    marginTop: 10,
    fontWeight: 400,
  },
  actionColumn: {
    padding: 3,
  },
  attachImg: {
    width: 300,
    height: 400,
    objectFit: "contain",
  },
}));
