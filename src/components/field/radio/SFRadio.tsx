import React, { FC } from "react";
import { Radio, RadioProps } from "@mui/material";
import { SFRadioLabel } from "./SFRadioLabel";

interface SFRadioProps extends RadioProps {
  label?: string,
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  messageError?: string
}

export const SFRadio: FC<SFRadioProps> = React.forwardRef<any, SFRadioProps>((props, ref) => {
  const { labelPlacement, label, messageError, ...rest } = props;
  return <SFRadioLabel label={label} messageError={messageError} labelPlacement={labelPlacement} component={<Radio  {...rest} inputRef={ref}/>}/>
});

SFRadio.displayName = "SFRadio";
