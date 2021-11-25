import React, { FC } from "react";
import { Theme, Typography } from "@mui/material";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { SFTooltipError } from "./SFTooltipError";

const useStyles = makeStyles<Theme, StylesProps>({
  root: {
    display: 'inline-block',
    // width: ({ fullWidth }) => fullWidth ? "100%" : undefined,
    position: "relative"
  },
  fullWidth: {
    width: "100%"
  },
  label: {
    padding: '10px 0 2px 0',
    alignItems: 'center',
    fontSize: 14,
  },
  notLabel: {
    visibility: "hidden"
  },
  tooltipError: {
    position: "absolute",
    right: 0,
    top: 6
  }
});

interface StylesProps {
  fullWidth?: boolean
}

interface SFFieldLabelProps extends StylesProps {
  label?: React.ReactNode,
  ref?: React.Ref<any>,
  className?: string,
  error?: boolean,
  messageError?: string
}


export const SFFieldLabel: FC<SFFieldLabelProps> = React.forwardRef<any, SFFieldLabelProps>((props, ref) => {
  const {
    children,
    label,
    className,
    fullWidth,
    error,
    messageError = ""
  } = props;

  const classes = useStyles({fullWidth});
  const open = Boolean(error);
  return (
    <span className={clsx({ [classes.fullWidth]: fullWidth }, classes.root, className)} ref={ref}>
          {
            label ?
              (React.isValidElement(label) ? label : <Typography className={clsx(classes.label)}>{label}</Typography>)
              :
              null
          }
      <SFTooltipError message={messageError} open={open} className={classes.tooltipError}/>
      {children}
    </span>)
});
