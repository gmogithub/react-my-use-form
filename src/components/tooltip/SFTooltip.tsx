import React, { useState } from 'react';
import { Tooltip, TooltipProps } from "@mui/material";


interface SFTooltipProps extends TooltipProps {
   openOnClick?: boolean
}

export const SFTooltip:React.FC<SFTooltipProps> = ({title, openOnClick = false, classes, TransitionComponent, PopperProps, children, ...rest}) => {
  const [open, setOpen] = useState(false);

  function handleOnClick() {
    setOpen(prev => !prev);
  }

  function handleMouseLeave() {
    setOpen(false);
  }

  return (
    <>
      {
        openOnClick ?
          (
            <span onClick={handleOnClick} onMouseLeave={handleMouseLeave}>
              <Tooltip
                title={title}
                classes={classes}
                TransitionComponent={TransitionComponent}
                PopperProps={PopperProps}
                open={open}
                {...rest}>
                {children}
              </Tooltip>
            </span>
          ) : (
            <Tooltip
              title={title}
              classes={classes}
              TransitionComponent={TransitionComponent}
              PopperProps={PopperProps}
              {...rest}>
              {children}
            </Tooltip>
          )
      }
      </>
  );
};
