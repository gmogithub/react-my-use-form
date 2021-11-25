import React, { FC } from "react";
import { SFCheckboxProps } from "../checkbox/SFCheckbox";

import { SFRadio } from "./SFRadio";
import {UseFormProps} from "../../../hook/useForm";

interface SFFormRadioProps extends Omit<SFCheckboxProps, 'name' | 'error' | "onChange" | "onBlur">, UseFormProps {
}

export const SFFormRadio = React.forwardRef<any, SFFormRadioProps>((props, ref) => {
  const { onChange, name, error: messageError, errors, ...rest } = props;
  return <SFRadio {...rest} name={name} ref={ref} onChange={onChange} messageError={messageError}/>;
});

SFFormRadio.displayName = "SFFormRadio";