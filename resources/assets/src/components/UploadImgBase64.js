import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import i18n from "../i18n/i18n";

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
  error,
}) {
  const [fileUpload, setFileUpload] = useState([]);
  const [imageView, setImageView] = useState();
  const [loadingFist, setLoadingFist] = useState(true);
  useEffect(() => {
    if (files !== undefined && loadingFist === true) {
      setImageView(process.env.REACT_APP_PUBLIC_URL + "/storage/" + files);
      setFileUpload(
        fileUpload.concat({
          name: "",
          preview: files,
        })
      );
      setLoadingFist(false);
      if (loadPreview === true) {
        setPreviewImage(process.env.REACT_APP_PUBLIC_URL + "/storage/" + files);
      }
    }
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
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
    },
  });
  const images = fileUpload.map((value) => {
    let temp = value.name;
    let arrayName = temp.split(".");
    let typeFile = arrayName[arrayName.length - 1];
    if (
      typeFile == "jpg" ||
      typeFile == "png" ||
      typeFile == "gif" ||
      typeFile == "jpeg" ||
      typeFile == "JPG" ||
      typeFile == "PNG" ||
      typeFile == "GIF" ||
      typeFile == "JPEG" ||
      files !== undefined
    ) {
      return (
        <div key={value.name}>
          <div style={{ textAlign: "center" }}>
            <img
              src={value.preview}
              style={{
                width: width ? width : "100%",
                height: height ? height : "100%",
              }}
              alt={"preview"}
            />
          </div>
        </div>
      );
    } else {
      return (
        <p
          style={{
            minHeight: "200px",
            width: width ? width : "100%",
            height: height ? height : "100%",
            border: "#F44A00 solid 2px",
            borderRadius: 5,
            borderStyle: "dotted",
            textAlign: "center",
            paddingTop: "35%",
            color: "#F44A00",
          }}
        >
          File được chọn không phải là ảnh
        </p>
      );
    }
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {files ? (
        <div
          style={{
            width: width ? width : "100%",
            height: height ? height : "100%",
              margin: '10px'
          }}
        >
          {images}
        </div>
      ) : (
        <p
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
          {error ? error : title}
        </p>
      )}
    </div>
  );
}
