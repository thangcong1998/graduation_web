import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import pdfThumb from "../assets/thumbnail/pdf-thumbnail.svg";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export default function Upload({
  files,
  setFiles,
  limitHeight,
  title,
  height,
  width,
  previewImage,
  setPreviewImage,
  loadPreview,
  objectFit,
  error,
  readOnly,
  accept,
  name,
}) {
  const [fileUpload, setFileUpload] = useState([]);
  const [imageView, setImageView] = useState();
  const [loadingFist, setLoadingFist] = useState(true);

  useEffect(() => {
    if (typeof files == "string") {
      setImageView(process.env.MIX_REACT_APP_PUBLIC_URL + "/storage/" + files);
      setFileUpload([
        {
          name: "",
          preview: process.env.MIX_REACT_APP_PUBLIC_URL + "/storage/" + files,
        },
      ]);
      if (loadPreview === true) {
        setPreviewImage(
          process.env.MIX_REACT_APP_PUBLIC_URL + "/storage/" + files
        );
      } else {
      }
      setLoadingFist(false);
    } else {
      if (files) {
        setFileUpload([
          Object.assign(
            files,
            {
              preview: URL.createObjectURL(files),
            },
            setLoadingFist(false),
            loadPreview === true
              ? setPreviewImage(URL.createObjectURL(files))
              : null
          ),
        ]);
      }
    }
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (!readOnly) {
        setFileUpload(
          acceptedFiles.map((file) =>
            Object.assign(
              file,
              {
                preview: URL.createObjectURL(file),
              },
              setFiles(file),
              setLoadingFist(false),
              loadPreview === true
                ? setPreviewImage(URL.createObjectURL(file))
                : null
            )
          )
        );
      }
    },
    accept: accept ? accept : ["image/*"],
    disabled: readOnly,
  });

  const images = fileUpload.map((value) => {
    const fileScan = value?.preview.split(".");

    return (
      <div key={value.name}>
        <div style={{ textAlign: "center" }}>
          {value?.type == "application/pdf" ||
          fileScan[fileScan.length - 1] == "pdf" ? (
            <div>
              <img
                alt=""
                style={{ width: width, height: height }}
                src={pdfThumb}
              />
              <div>{name}</div>
            </div>
          ) : (
            <img
              src={value.preview}
              style={{
                width: width ? width : "100%",
                height: height ? height : "100%",
                objectFit: objectFit ? objectFit : "contain",
              }}
              alt={"preview"}
            />
          )}
        </div>
      </div>
    );
  });
  return (
    <div {...getRootProps()} style={{ marginBottom: 15 }}>
      <input readOnly={readOnly} {...getInputProps()} multiple={false} />
      {files ? (
        <div>
          <div>{images}</div>
        </div>
      ) : (
        <div>
          <div
            style={
              error
                ? {
                    minHeight: "200px",
                    width: width ? width : "100%",
                    height: height ? height : "100%",
                    border: "red solid 2px",
                    borderRadius: 5,
                    borderStyle: "dotted",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "red",
                  }
                : {
                    minHeight: "200px",
                    width: width ? width : "100%",
                    height: height ? height : "100%",
                    border: "#c4c4c4 solid 2px",
                    borderRadius: 5,
                    borderStyle: "dotted",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
            }
          >
            <div>
              <div style={{ width: "100%" }}>
                <CloudUploadIcon fontSize={"large"} />
              </div>
              <span style={{ width: "100%" }}>{error ? error : title}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
