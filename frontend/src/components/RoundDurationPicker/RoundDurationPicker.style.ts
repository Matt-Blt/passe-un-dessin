import styled, { css } from 'styled-components';

export const DurationOption = styled.span<{ selected?: boolean }>`
  ${props =>
    props.selected
      ? css`
          font-weight: bold;
        `
      : css`
          cursor: pointer;
        `}
`;

DurationOption.displayName = 'DurationOption';

export const RoundDurationPickerContainer = styled.div`
  width: 100%;
  margin-bottom: 8px;
`;

RoundDurationPickerContainer.displayName = 'RoundDurationPickerContainer';
