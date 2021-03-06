import React from 'react';
import { BaseStyledButton, BaseStyledLink } from './Button.style';

interface Props {
  children: React.ReactNode;
  to?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: React.FC<Props> = ({ to, children, ...otherProps }) => {
  if (to) {
    return (
      <BaseStyledLink to={to} {...otherProps}>
        {children}
      </BaseStyledLink>
    );
  }

  return <BaseStyledButton {...otherProps}>{children}</BaseStyledButton>;
};

export default Button;
