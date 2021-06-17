import React from "react";
import { Button, SvgIcon, CircularProgress } from "@material-ui/core";
import loadingBtn from "../../assets/loading-btn.svg";

export default function (props) {
  const { loading, startIcon, ...otherProps } = props;
  // const loadingSvg = (
  //   <SvgIcon>
  //     <img src={loadingBtn} />
  //   </SvgIcon>
  // );
  return (
    <Button startIcon={startIcon} disabled={loading} {...otherProps}>
      {loading && <CircularProgress size={16} />}
      {!loading && props.children}
    </Button>
  );
}
