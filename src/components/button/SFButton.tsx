import React, { FC } from "react";
import { Button, ButtonProps } from "@mui/material";
import { makeStyles } from "@mui/styles";

export interface SFButtonProps extends ButtonProps{
}

const useStyles = makeStyles({
  root: {
    textTransform: "none"
  }
});

export const SFButton: FC<SFButtonProps> = (props) => {
  const  classes = useStyles();
  const {children, variant = "outlined", ...rest} = props;
  return <Button {...rest} variant={variant} classes={classes}>{children}</Button>
};
