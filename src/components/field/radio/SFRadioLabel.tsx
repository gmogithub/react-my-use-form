import React, { FC } from "react";
import { SFCheckboxLabelProps } from "../checkbox/SFCheckboxLabel";
import { FormControlLabel } from "@mui/material";
import { SFTooltipError } from "../SFTooltipError";
import { makeStyles } from "@mui/styles";

interface SFRadioLabelProps extends SFCheckboxLabelProps {
}

const useStyles = makeStyles({
  tooltipError: {
    position: "absolute",
    right: 0,
    top: 6
  }
});
export const SFRadioLabel: FC<SFRadioLabelProps> = (props) => {
  const { label, component, messageError = "", ...rest } = props;
  const open = Boolean(messageError);
  const classes = useStyles();
  return (
    <span>
      {
        label ?
          <FormControlLabel control={component} label={label} {...rest} />
          :
          component
      }
      <SFTooltipError message={messageError} open={open} className={classes.tooltipError}/>
    </span>);
};
