
import React, { FC } from "react";
import { SFTextField, SFTextFieldProps } from "./SFTextField";
import {UseFormProps} from "../../../hook/useForm";

interface SFFormTextFieldProps extends Omit<SFTextFieldProps, 'name' | 'error' | "onChange" | "onBlur">, UseFormProps {

}

export const SFFormTextField = React.forwardRef<HTMLInputElement, SFFormTextFieldProps>((props, ref) => {
  const { onChange, name, error: messageError, errors, ...rest } = props;
  const error = Boolean(messageError);
  return <SFTextField {...rest} name={name} ref={ref} error={error} onChange={onChange} messageError={messageError}/>;
});

SFFormTextField.displayName = "SFFormTextField";