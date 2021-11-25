import React, { FC } from "react";
import { SFCheckbox, SFCheckboxProps } from "./SFCheckbox";
import {UseFormProps} from "../../../hook/useForm";


interface SFFormCheckboxProps extends Omit<SFCheckboxProps, 'name' | 'error' | "onChange" | "onBlur">, UseFormProps {
}

export const SFFormCheckbox = React.forwardRef<any, SFFormCheckboxProps>((props, ref) => {
  const {onChange, name, error: messageError, errors, ...rest} = props;
  return <SFCheckbox {...rest} name={name} ref={ref} onChange={onChange} messageError={messageError}/>
});

SFFormCheckbox.displayName = "SFFormCheckbox";