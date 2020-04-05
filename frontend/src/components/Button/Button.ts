import styled, { css } from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';

const Button = styled.button`
  height: 56px;
  padding: 18px 32px;
  background: linear-gradient(90deg, #ff9314 0%, #ff0080 100%);
  font-size: ${fontSize.medium};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
    `}

  border: none;
  border-radius: 28px;
  color: ${colorPalette.white};
  background-color: ${props => (props.disabled ? colorPalette.black : colorPalette.red)};
  outline: none;
`;

export default Button;
