import React, { FC } from "react";
import { FormControlLabel, FormControlLabelProps, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SFTooltipError } from "../SFTooltipError";

const useStyles = makeStyles({
  label: {
    fontSize: 14
  },
  tooltipError: {
    position: "absolute",
    right: 0,
    top: 6
  }
});

type SFFormControlLabelProps = Omit<FormControlLabelProps, 'control' | 'label'>

export interface SFCheckboxLabelProps extends SFFormControlLabelProps {
  label?: string
  component: React.ReactElement,
  messageError?: string
}

export const SFCheckboxLabel: FC<SFCheckboxLabelProps> = (props) => {
  const { label, component, messageError = "",...rest } = props;
  const classes = useStyles();
  const open = Boolean(messageError);
  return (
    <span>
      {
        label ?
          <FormControlLabel {...rest}
                            control={component}
                            label={<Typography className={classes.label}>{label}</Typography>}/>
          :
          component
      }
      <SFTooltipError message={messageError} open={open} className={classes.tooltipError}/>
    </span>)
};
