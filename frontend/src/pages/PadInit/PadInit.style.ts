import styled from 'styled-components';
import TextInput from 'atoms/TextInput';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';
import arrowRight from 'assets/arrow-right.svg';
import Button from 'atoms/Button';
import StaticInput from 'atoms/StaticInput';

export const PadInitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
`;

PadInitContainer.displayName = 'PadInitContainer';

export const StyledForm = styled.form`
  width: 400px;
  margin-bottom: 8px;
  display: flex;
`;

StyledForm.displayName = 'StyledForm';

export const StyledTextInput = styled(TextInput)`
  border-color: ${colorPalette.orange};
  flex-grow: 1;
`;

StyledTextInput.displayName = 'StyledTextInput';

export const StyledStaticInput = styled(StaticInput)`
  border-color: ${colorPalette.orange};
  margin-right: 16px;
  flex-grow: 1;
`;

StyledStaticInput.displayName = 'StyledStaticInput';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 8px;
`;

StyledHeader.displayName = 'StyledHeader';

export const InputArrow = styled.img.attrs({ src: arrowRight })`
  cursor: pointer;
`;

InputArrow.displayName = 'InputArrow';

export const StyledButton = styled(Button)`
  align-self: center;
`;

StyledButton.displayName = 'StyledButton';
