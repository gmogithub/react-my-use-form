import React, { Children, FC, useMemo } from "react";
import { SFButton } from "./SFButton";
import { ButtonProps, Menu } from "@mui/material";

interface SFButtonMenuProps extends ButtonProps {
  label: string
}

export const SFButtonMenu: FC<SFButtonMenuProps> = ({ label, children, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const items = useMemo(() => {
    return Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          onClick: () => {
            if (child.props.onClick) {
              child.props.onClick();
            }
            handleClose();
          },
        });
      }
      return null;
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <SFButton {...props} onClick={handleClick} variant={"text"}>
        {label}
      </SFButton>
      <Menu anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
      >
        {items}
      </Menu>
    </>)
};
