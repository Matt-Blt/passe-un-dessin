import styled, { css } from 'styled-components';

import userIcon from 'assets/person-filled.svg';
import playerIcon from 'assets/person.svg';
import cogIcon from 'assets/cog.svg';
import rankingIcon from 'assets/ranking.svg';
import refreshIcon from 'assets/refresh.svg';
import playerAddIcon from 'assets/person-add.svg';
import leaveIcon from 'assets/leave.svg';

export const SideButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 24px;
  top: 24px;
  z-index: 35;
  align-items: center;
`;

export const PlayerModalButton = styled.img.attrs({ src: playerIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

PlayerModalButton.displayName = 'PlayerModalButton';

export const UserModalButton = styled.img.attrs({ src: userIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

UserModalButton.displayName = 'UserModalButton';

export const AdminModalButton = styled.img.attrs({ src: cogIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

AdminModalButton.displayName = 'AdminModalButton';

export const PlayerAddButton = styled.img.attrs({ src: playerAddIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

PlayerAddButton.displayName = 'PlayerAddButton';

export const LeaveButton = styled.img.attrs({ src: leaveIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

LeaveButton.displayName = 'LeaveButton';

export const RankingModalButton = styled.img.attrs({ src: rankingIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

RankingModalButton.displayName = 'RankingModalButton';

export const RefreshButton = styled.img.attrs({ src: refreshIcon })<{ isLoading: boolean }>`
  cursor: pointer;
  margin-bottom: 24px;
  ${(props) =>
    props.isLoading &&
    css`
      @keyframes spin {
        100% {
          transform: rotate(-360deg);
        }
      }
      animation: spin 1s linear infinite;
    `}
`;

RefreshButton.displayName = 'RefreshButton';
