import React, { FC, useEffect, useState } from "react";
import { SFSelect, SFSelectProps } from "./SFSelect";
import { SelectChangeEvent } from "@mui/material";
import {UseFormProps} from "../../../hook/useForm";

interface SFFormSelectProps extends Omit<SFSelectProps, "name" | "error" | "onChange" | "onBlur">, UseFormProps {
}

export const SFFormSelect: FC<SFFormSelectProps> = React.forwardRef((props, ref) => {
  const { onChange, name, error: messageError, errors, children, ...rest } = props;
  const error = Boolean(messageError);


  return <SFSelect {...rest}
                   name={name}
                   ref={ref}
                   error={error}
                   onChange={onChange}
                   messageError={messageError}>
    {children}
  </SFSelect>
});

SFFormSelect.displayName = "SFFormSelect";