import React, { FC } from "react";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

interface SFIconButtonProps extends IconButtonProps{
   placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
}

export const SFIconButton: FC<SFIconButtonProps>= React.forwardRef((props, ref) => {
  const { children, title, placement, ...rest } = props;
  return title ? (
    <SFIconButtonTooltip {...rest} placement={placement === undefined ? 'top' : placement} title={title} ref={ref}>
      {children}
    </SFIconButtonTooltip>
  ) : (
    <IconButton {...rest} ref={ref}>
      {children}
    </IconButton>
  );
});

SFIconButton.displayName = "SFIconButton";


const SFIconButtonTooltip: FC<SFIconButtonProps> = React.forwardRef((props, ref) => {
  const { children, title, placement, ...rest } = props;
  return (
    <Tooltip title={title as any} placement={placement}>
      <span>
        <IconButton {...rest} ref={ref}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
});

SFIconButtonTooltip.displayName = "SFIconButtonTooltip";
