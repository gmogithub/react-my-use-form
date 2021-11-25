import React, { FC } from "react";
import { Checkbox, CheckboxProps } from "@mui/material";
import { SFCheckboxLabel } from "./SFCheckboxLabel";

export interface SFCheckboxProps extends CheckboxProps {
  label?: string,
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  messageError?: string
}

export const SFCheckbox = React.forwardRef<any, SFCheckboxProps>((props, ref) => {
  const { labelPlacement, label,  messageError, ...rest } = props;
  return <SFCheckboxLabel labelPlacement={labelPlacement} label={label} messageError={messageError} component={<Checkbox  {...rest} inputRef={ref}/>}/>
});

SFCheckbox.displayName = "SFCheckbox";