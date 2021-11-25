import React, { FC, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import {isMobile} from "../../utils/utils";
import {Error as ErrorIcon} from "@mui/icons-material";
import {SFTooltip} from "../tooltip/SFTooltip";


const useStyles = makeStyles<Theme>((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.error.main
  }
}));

interface StylesProps {
  fullWidth?: boolean
}

interface SFTooltipErrorProps extends StylesProps {
  message: string;
  open: boolean,
  className?: string
}

export const SFTooltipError: FC<SFTooltipErrorProps> = (props) => {
  const {
    children,
    open,
    message,
    className,
  } = props;
  const classes = useStyles(props);
  const [mobile, setMobile] = useState<boolean>();

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  return (
    <>
      {
        open
        &&
        <SFTooltip openOnClick={mobile} title={message} className={className} classes={{tooltip: classes.tooltip}} >
          <ErrorIcon color={"error"}/>
        </SFTooltip>
      }
    </>)
};
