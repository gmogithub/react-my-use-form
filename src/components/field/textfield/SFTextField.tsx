import React, { FC, useState } from "react";
import { OutlinedTextFieldProps, TextField } from "@mui/material";
import { SFFieldLabel } from "../SFFieldLabel";
import { SFInputAdornment } from "./SFInputAdornment";

export interface SFTextFieldProps extends Omit<OutlinedTextFieldProps, 'variant'> {
  messageError?: string
}

export const SFTextField = React.forwardRef<HTMLInputElement, SFTextFieldProps>((props, ref) => {
  const {
    error,
    messageError,
    label,
    fullWidth,
    className,
    type: typeProp,
    InputProps: InputPropsProp,
    ...rest
  } = props;
  const [type, setType] = useState<undefined | string>(typeProp);
  let InputProps = InputPropsProp;

  if (!InputProps) {
    InputProps = {
      endAdornment: <SFInputAdornment type={type} initialType={typeProp} onClick={handleClickShowPassword}/>,
    }
  }

  // InputProps = {...InputProps, ref}

  function handleClickShowPassword(showPassword: boolean) {
    setType(showPassword ? 'text' : 'password');
  }

  return (
    <SFFieldLabel
      error={error}
      messageError={messageError}
      label={label}
      fullWidth={fullWidth}
      className={className}>
      <TextField {...rest}
                 inputRef={ref}
                 type={type}
                 InputProps={InputProps}
                 error={error}
                 variant={"outlined"}
                 fullWidth={fullWidth}/>
    </SFFieldLabel>);
});

SFTextField.displayName = "SFTextField";