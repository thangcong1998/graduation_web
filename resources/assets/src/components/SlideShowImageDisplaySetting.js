import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
    InputBase,
    InputLabel,
    Button,
    FormHelperText,
    Grid,
    IconButton,
    ButtonGroup,
    Dialog,
    Paper,
    MobileStepper,
    Typography
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
// import PublishIcon from "@material-ui/icons/Publish";
// import mime from "mime-types";
// import { convert } from "../../common/utils";
import { useAPI } from "../api/api";
import { useDropzone } from "react-dropzone";
import { color } from "../common/constants";
import defaultThumb from "../assets/thumbnail/no_image.jpg";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import addIcon from "../assets/thumbnail/add.png";
// import DeleteIcon from "@material-ui/icons/Delete";
// import VisibilityIcon from "@material-ui/icons/Visibility";
// import GetAppIcon from "@material-ui/icons/GetApp";
import { useTranslation } from "react-i18next";
// import Forms from "./form/Form";
// import SelectRoomServices from "../containers/Admin/Category/Logistic/Accommodation/SelectRoomServices";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";
// import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
// import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import "./upload.css";
import ClearIcon from "@material-ui/icons/Clear";
import ShowImageHandMake from "./ShowImage/ShowImageHandMake";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

SwiperCore.use([Navigation, Pagination, Controller, Thumbs]);

const UploadFileSlide = React.memo(props => {
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
    const theme = useTheme();
    const [imageShow, setImageShow] = useState();
    const [arrayFile, setArrayFile] = useState([]);
    const [startImage, setStartImage] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [maxSteps, setMaxSteps] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const [position, setPosition] = useState(0);
    const [startList, setStartList] = useState(0);
    const [endList, setEndList] = useState(2);
    const NextListImage = () => {
        setStartList(endList + 1);
        if (arrayFile.length - 1 <= endList + (3 - 1)) {
            setEndList(arrayFile.length - 1);
        } else {
            setEndList(endList + 3);
        }
    };
    const BackListImage = () => {
        if (startList - 3 === 0) {
            setStartList(0);
            setEndList(3 - 1);
        } else {
            setStartList(startList - 3);
            setEndList(startList - 1);
        }
    };
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleOpen = () => {
        setOpenDialog(true);
    };
    useEffect(() => {
        let temp = newFiles.concat(oldFiles);
        setArrayFile(temp);
        setMaxSteps(temp.length);
    }, [oldFiles, newFiles]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (arrayFile.length !== 0) {
                if (arrayFile[startImage].id) {
                    setImageShow(
                        process.env.MIX_REACT_APP_STORAGE_URL +
                            "/" +
                            arrayFile[startImage].path
                    );
                } else {
                    setImageShow(arrayFile[startImage].preview);
                }
                if (startImage == arrayFile.length - 1) {
                    setStartImage(0);
                } else {
                    setStartImage(startImage + 1);
                }
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [arrayFile, startImage]);
    const thumnail = (file, index, statusFile) => {
        const name = file.name.split(".");
        const extension = name[name.length - 1].toLowerCase();
        const content = () => {
            if (file.id) {
                return (
                    <button
                        style={{
                            backgroundImage: `url(${process.env
                                .MIX_REACT_APP_STORAGE_URL +
                                "/" +
                                file.path})`
                        }}
                        className={classes.btnImage}
                        onClick={() => {
                            setImageShow(
                                process.env.MIX_REACT_APP_STORAGE_URL +
                                    "/" +
                                    file.path
                            );
                            setStartImage(index);
                            setActiveStep(index);
                            handleOpen();
                            setPosition(index);
                        }}
                    />
                );
            }
            return (
                <button
                    style={{
                        backgroundImage: `url(${file.preview})`
                    }}
                    className={classes.btnImage}
                    onClick={() => {
                        setImageShow(file.preview);
                        setStartImage(index);
                        setActiveStep(index);
                        handleOpen();
                        setPosition(index);
                    }}
                />
            );
        };

        return (
            <Grid
                className={classes.thumbContainer}
                item
                key={index}
                title={file.name}
                // onClick={() => downloadFile(file)}
            >
                <ShowImageHandMake
                    open={openDialog}
                    setOpen={setOpenDialog}
                    position={position}
                    setPosition={setPosition}
                    array={arrayFile}
                />
                {content()}
                {readOnly ? (
                    ""
                ) : (
                    <div
                        className={classes.btnDelete}
                        onClick={() => {
                            handleDelete(file);
                            if (startImage == 0) {
                                setStartImage(0);
                            } else {
                                setStartImage(startImage - 1);
                            }
                        }}
                    >
                        <ClearIcon
                            fontSize={"small"}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                                border: "#dbdbdb solid 0.5px"
                            }}
                        />
                    </div>
                )}
            </Grid>
        );
    };
    const onDrop = useCallback(acceptedFiles => {
        if (multiple) {
            // setNewFiles([]);
            acceptedFiles.forEach(file => {
                setNewFiles(pre => [
                    ...pre,
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                ]);
            });
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
            ? { onDrop, noClick: true, accept: "images/*" }
            : { onDrop, noClick: true, noDrag: true, accept: "images/*" }
    );
    return (
        <div>
            <div
                style={{
                    height: "200px",
                    width: "100%"
                }}
            >
                <img
                    alt=""
                    style={{
                        width: "100%",
                        maxHeight: "200px",
                        padding: 20,
                        maxWidth: "350px",
                        display: "block",
                        margin: "auto"
                    }}
                    src={imageShow ? imageShow : defaultThumb}
                />
            </div>
            <div
                className={`${
                    empty && readOnly ? classes.emptyReadOnly : classes.dropDrag
                } ${errors ? classes.errorBorder : ""}`}
                {...getRootProps()}
                onClick={empty && open}
            >
                <Grid className={classes.listFile}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            {(newFiles?.length > 0 || oldFiles?.length > 0) &&
                                startList > 1 && (
                                    <ChevronLeftIcon
                                        style={{
                                            color: "#1a59c4",
                                            height: "100%"
                                        }}
                                        onClick={() => BackListImage()}
                                    />
                                )}
                        </Grid>
                        <Grid item xs={8} style={{ display: "flex" }}>
                            {multiple ? (
                                empty && readOnly ? (
                                    <p className={classes.emptyText}>
                                        Không có dữ liệu
                                    </p>
                                ) : (
                                    <>
                                        {arrayFile?.map((file, index) => {
                                            if (
                                                index >= startList &&
                                                index <= endList
                                            ) {
                                                return thumnail(file, index);
                                            }
                                        })}
                                    </>
                                )
                            ) : arrayFile.length > 0 ? (
                                arrayFile?.map((file, index) => {
                                    if (
                                        index >= startList &&
                                        index <= endList
                                    ) {
                                        return thumnail(file, index);
                                    }
                                })
                            ) : (
                                ""
                            )}
                            {(newFiles?.length > 0 || oldFiles?.length > 0) &&
                                readOnly !== true && (
                                    <div
                                        style={{
                                            width: "30%",
                                            height: "50px",
                                            marginTop: 2
                                        }}
                                    >
                                        <button
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                backgroundColor: "#f6f6f6",
                                                borderRadius: "10px",
                                                fontSize: "2rem"
                                            }}
                                            onClick={open}
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                        </Grid>
                        <Grid item xs={2}>
                            {(newFiles?.length > 0 || oldFiles?.length > 0) &&
                                endList != arrayFile.length - 1 && (
                                    <ChevronRightIcon
                                        style={{
                                            color: "#1a59c4",
                                            height: "100%"
                                        }}
                                        onClick={() => NextListImage()}
                                    />
                                )}
                        </Grid>
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
                            {newFiles.length === 0 &&
                                oldFiles.length === 0 &&
                                t("drag_drop.default")}
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
        width: "33%",
        height: "65px",
        padding: "2%",
        borderRadius: 4,
        position: "relative",
        "&:hover": {
            cursor: "pointer"
        }
    },
    thumbContainerButton: {
        width: "33%",
        height: "65px",
        padding: "2%",
        position: "relative",
        "&:hover": {
            cursor: "pointer"
        },
        textAlign: "center"
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
        top: 0,
        right: 10,
        zIndex: 1,
        color: "#000",
        height: "5px",
        backgroundColor: "#ffffff"
    },
    btnImage: {
        position: "absolute",
        width: "75%",
        height: "75%",
        backgroundSize: "cover"
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
        height: "30px",
        width: "auto",
        opacity: 0.3,
        display: "block",
        margin: "auto"
    },
    MuiDialogPaperWidthSm: {
        maxWidth: 1200
    }
}));
export default UploadFileSlide;
