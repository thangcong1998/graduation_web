import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
    InputBase,
    InputLabel,
    Button,
    FormHelperText,
    Grid,
    IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PublishIcon from "@material-ui/icons/Publish";
import mime from "mime-types";
// import { convert } from "../../common/utils";
import { useAPI } from "../../api/api";
import { useDropzone } from "react-dropzone";
import { color } from "../../common/constants";
import docThumb from "../../assets/thumbnail/doc-thumbnail.svg";
import txtThumb from "../../assets/thumbnail/txt-thumbnail.svg";
import xlsxThumb from "../../assets/thumbnail/xlsx-thumbnail.svg";
import pdfThumb from "../../assets/thumbnail/pdf.png";
import defaultThumb from "../../assets/thumbnail/default-thumbnail.svg";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import addIcon from "../../assets/thumbnail/add.png";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useTranslation } from "react-i18next";
import ClearIcon from "@material-ui/icons/Clear";

const UploadFile = React.memo(props => {
    const {
        data,
        errors,
        oldFiles,
        setOldFiles,
        setNewFiles,
        newFiles,
        multiple,
        base64,
        handleDelete,
        readOnly,
        accept
    } = props;
    const classes = useStyle();
    const api = useAPI();
    const { t, i18n } = useTranslation();
    const [temp, setTemp] = useState();
    const thumnail = (file, index, statusFile) => {
        const name = file.name.split(".");
        const extension = name[name.length - 1].toLowerCase();

        const content = () => {
            switch (extension) {
                case "xlsx":
                case "xls":
                    return (
                        <>
                            <img
                                alt=""
                                className={classes.thumbImg}
                                src={xlsxThumb}
                            />
                        </>
                    );
                case "jpg":
                case "jpeg":
                case "png":
                case "svg":
                    if (file.id) {
                        return (
                            <img
                                alt=""
                                className={classes.preview}
                                src={
                                    process.env.MIX_REACT_APP_STORAGE_URL +
                                    "/" +
                                    file.path
                                }
                            />
                        );
                    }
                    return (
                        <img
                            alt=""
                            className={classes.preview}
                            src={file.preview}
                        />
                    );

                case "doc":
                case "docx":
                    return (
                        <>
                            <img
                                alt=""
                                className={classes.thumbImg}
                                src={docThumb}
                            />
                        </>
                    );
                case "txt":
                    return (
                        <>
                            <img
                                alt=""
                                className={classes.thumbImg}
                                src={txtThumb}
                            />
                        </>
                    );
                case "pdf":
                    return (
                        <>
                            <img
                                alt=""
                                className={classes.thumbImg}
                                src={pdfThumb}
                            />
                        </>
                    );
                default:
                    return (
                        <>
                            <img
                                alt=""
                                className={classes.thumbImg}
                                src={defaultThumb}
                            />
                        </>
                    );
            }
        };

        const downloadFile = async file => {
            if (file.id) {
                try {
                    let res = await api.fetcher(
                        "post",
                        "/admin/downloadDocument/" + file.id,
                        { path: file?.path },
                        {
                            responseType: "blob"
                        }
                    );
                    if (res) {
                        const url = window.URL.createObjectURL(new Blob([res]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", file.name);
                        document.body.appendChild(link);
                        link.click();
                    }
                } catch (e) {}
            } else {
                const url = file.preview;
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", file.name);
                document.body.appendChild(link);
                link.click();
            }
        };
        return (
            <Grid
                className={classes.thumbContainer}
                item
                key={index}
                title={file.name}
            >
                <Grid onClick={() => downloadFile(file)}>
                    {content()}
                    <p className={classes.filename}>
                        {" "}
                        {file.name.length > 20
                            ? file.name.substring(0, 20) + "..."
                            : file.name}
                    </p>
                </Grid>
                <div
                    className={classes.btnDelete}
                    title="Xóa"
                    onClick={() => handleDelete(file)}
                >
                    <ClearIcon
                        fontSize={"medium"}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            border: "#dbdbdb solid 0.5px"
                        }}
                    />
                </div>
            </Grid>
        );
    };
    const onDrop = useCallback(acceptedFiles => {
        if (multiple) {
            // setNewFiles([]);
            const filesWithPreview = acceptedFiles.map(file =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            );
            setNewFiles(pre => [...pre, ...filesWithPreview]);
        } else {
            if (acceptedFiles.length > 0)
                setNewFiles([
                    Object.assign(acceptedFiles[0], {
                        preview: URL.createObjectURL(acceptedFiles[0])
                    })
                ]);
        }
    }, []);

    const empty =
        (!newFiles && !oldFiles) ||
        (newFiles?.length == 0 && oldFiles?.length == 0) ||
        (!newFiles && oldFiles?.length == 0) ||
        (newFiles?.length == 0 && !oldFiles);
    const { getRootProps, getInputProps, open } = useDropzone(
        !readOnly
            ? { onDrop, noClick: true, accept: accept }
            : { onDrop, noClick: true, noDrag: true }
    );

    return (
        <div>
            <div
                className={`${
                    empty && readOnly ? classes.emptyReadOnly : classes.dropDrag
                } ${errors ? classes.errorBorder : ""}`}
                {...getRootProps()}
                onClick={empty && open}
            >
                <Grid className={classes.listFile}>
                    <Grid container>
                        {multiple ? (
                            empty && readOnly ? (
                                <p className={classes.emptyText}>
                                    Không có dữ liệu
                                </p>
                            ) : (
                                <>
                                    {newFiles?.map((file, index) =>
                                        thumnail(file, index, "new")
                                    )}
                                    {oldFiles?.map((file, index) =>
                                        thumnail(file, index, "old")
                                    )}
                                </>
                            )
                        ) : newFiles.length > 0 ? (
                            newFiles?.map((file, index) =>
                                thumnail(file, index)
                            )
                        ) : (
                            oldFiles?.map((file, index) =>
                                thumnail(file, index)
                            )
                        )}

                        {(newFiles?.length > 0 || oldFiles?.length > 0) &&
                            readOnly !== true && (
                                <img
                                    alt=""
                                    onClick={open}
                                    src={addIcon}
                                    className={classes.addFileIcon}
                                />
                            )}
                    </Grid>
                </Grid>
                {readOnly !== true && (
                    <div>
                        <input {...getInputProps()} />
                        <p
                            onClick={
                                (newFiles?.length > 0 ||
                                    oldFiles?.length > 0) &&
                                open
                            }
                            className={"dragText"}
                        >
                            {t("drag_drop.default")}
                        </p>
                    </div>
                )}
            </div>
            <FormHelperText className={classes.error}>{errors}</FormHelperText>
        </div>
    );
});
const useStyle = makeStyles(theme => ({
    input: {
        display: "none"
    },
    url: {
        "&:hover": {
            cursor: "pointer",
            textDecoration: "underline",
            color: "#1034bdde"
        }
    },
    dropDrag: {
        minHeight: "80px",
        border: "2px dashed #0000003b",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            borderColor: color.PRIMARY,
            "& .dragText": {
                color: color.PRIMARY
            }
        }
    },
    emptyReadOnly: {
        border: "2px dashed #0000003b",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            borderColor: color.PRIMARY,
            "& .dragText": {
                color: color.PRIMARY
            }
        },
        "& .flex-center": {
            justifyContent: "center"
        }
    },
    listFile: {
        width: "100%",
        "& p": {
            fontSize: "0.875rem"
        }
    },
    thumbContainer: {
        padding: 15,
        margin: 10,
        border: "1px solid #0000003b",
        borderRadius: 4,
        position: "relative",
        [theme.breakpoints.up("lg")]: {
            width: "calc(70% * (1/6) - 10px - 10px)"
        },
        [theme.breakpoints.down("md")]: {
            width: "calc(70% * (1/4) - 10px - 10px)"
        },
        [theme.breakpoints.down("sm")]: {
            width: "calc(70% * (1/3) - 10px - 10px)"
        },
        [theme.breakpoints.down("xs")]: {
            width: "calc(70% * (1/2) - 10px - 10px)"
        },
        "&:hover": {
            cursor: "pointer"
        }
    },
    thumbImg: {
        width: "100%",
        // minHeight: 200,
        zIndex: 0
    },
    preview: {
        width: "100%",
        // minHeight: 200,
        zIndex: 0,
        marginTop: 25
    },
    filename: {
        overflowWrap: "anyWhere"
    },
    btnDelete: {
        position: "absolute",
        top: "-4%",
        right: "-5%",
        zIndex: 1,
        color: "#000",
        height: 0,
        backgroundColor: "#ffffff"
    },
    buttons: {
        "& svg": {
            width: 16,
            height: 16
        }
    },
    errorBorder: {
        border: "1px solid #f44336",
        color: "#f44336"
    },
    error: {
        color: "#f44336"
    },
    addFileIcon: {
        margin: "40px 20px",
        height: "150px",
        width: "auto",
        opacity: 0.3
    }
}));
export default UploadFile;
