import React, { FC, useState } from "react";
import { InputAdornment } from "@mui/material";
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import {SFIconButton} from "../../button/SFIconButton";

interface SFInputAdornmentProps {
  type?: string,
  initialType?: string,
  onClick: (showPassword: boolean, event: React.MouseEvent<HTMLButtonElement>) => void
}

export const SFInputAdornment: FC<SFInputAdornmentProps> = ({ initialType, onClick }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    const show = !showPassword;
    setShowPassword(show);
    onClick(show, e);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  if (initialType === "password") {
    return (
      <InputAdornment position="end">
        <SFIconButton
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
        </SFIconButton>
      </InputAdornment>
    );
  }
  return null;
};
