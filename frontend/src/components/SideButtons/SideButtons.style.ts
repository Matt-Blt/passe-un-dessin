import styled from 'styled-components';

import cogIcon from 'assets/cog.svg';
import refreshIcon from 'assets/refresh.svg';

export const SideButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 20;
`;

export const AdminModalButton = styled.img.attrs({ src: cogIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

AdminModalButton.displayName = 'AdminModalButton';

export const RefreshButton = styled.img.attrs({ src: refreshIcon })`
  cursor: pointer;
`;

RefreshButton.displayName = 'RefreshButton';
