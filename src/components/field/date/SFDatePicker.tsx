import React, { FC } from "react";
import { DatePicker, DatePickerProps } from "@mui/lab";
import { OutlinedTextFieldProps, TextField, TextFieldProps } from "@mui/material";
import { SFTextField } from "../textfield/SFTextField";
import { SFFieldLabel } from "../SFFieldLabel";

interface SFDatePickerProps extends Omit<DatePickerProps<Date>, "renderInput" | "date" | "openPicker" | "rawValue">  {
  fullWidth: boolean
}

export const SFDatePicker: FC<SFDatePickerProps> = ({ fullWidth, ...props }) => {
  // const [value, setValue] = React.useState<Date | null>();
  // @ts-ignore
  return <DatePicker {...props}
                     // value={value}
                     // onChange={(newValue: Date | null) => {
                     //   setValue(newValue);
                     // }}
                     renderInput={(params) => {
                       // @ts-ignore
                       return <DatePickerTextField {...params} fullWidth={fullWidth}/>
                     }}
  />
};


interface DatePickerTextFieldProps extends OutlinedTextFieldProps {
}

export const DatePickerTextField: FC<DatePickerTextFieldProps> = (props) => {
  const {
    error,
    label,
    fullWidth,
    ...rest
  } = props;

  return <SFFieldLabel
    error={error}
    label={label}
    fullWidth={fullWidth}
  >
    <TextField {...rest} fullWidth={fullWidth} error={error}/>
  </SFFieldLabel>

}
