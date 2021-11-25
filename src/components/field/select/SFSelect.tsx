import React, { FC } from "react";
import { Select, SelectProps } from "@mui/material";
import { SFFieldLabel } from "../SFFieldLabel";

export interface SFSelectProps extends SelectProps {
  messageError?: string
}

export const SFSelect: FC<SFSelectProps> = React.forwardRef((props, ref) => {
  const {
    error,
    messageError,
    label,
    fullWidth,
    className,
    children,
    ...rest
  } = props;
  return (
    <SFFieldLabel label={label}
                  messageError={messageError}
                  error={error}
                  fullWidth={fullWidth}
                  className={className}>
      <Select {...rest}
              inputRef={ref}
              error={error}
              variant={"outlined"}
              fullWidth={fullWidth}
      >
        {children}
      </Select>
    </SFFieldLabel>)
});

SFSelect.displayName = "SFSelect";