import React, { useCallback } from 'react';
import { selectRemainingPlayers } from 'redux/Game/selectors';
import { useSelector } from 'redux/useSelector';
import { selectPlayerIsAdmin } from 'redux/Room/selectors';
import { FormattedMessage, useIntl } from 'react-intl';
import PlayerChip from 'atoms/PlayerChip';
import { useForceState } from 'redux/Game/hooks';
import { EmptyObject } from 'services/utils';
import { StyledPlayerChips, AdminButton, NextStepIcon } from './RemainingPlayers.style';

const RemainingPlayers: React.FC<EmptyObject> = () => {
  const remainingPlayers = useSelector(selectRemainingPlayers);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const [, doForceState] = useForceState();
  const intl = useIntl();

  const forceNextStep = useCallback(() => {
    if (window.confirm(intl.formatMessage({ id: 'remainingPlayers.confirmForceNextStep' }))) {
      doForceState();
    }
  }, [doForceState, intl]);

  return (
    <>
      <em>
        <FormattedMessage id="remainingPlayers.waitingFor" />
      </em>
      <StyledPlayerChips>
        {remainingPlayers.map((player) => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
        {isPlayerAdmin && (
          <AdminButton onClick={forceNextStep}>
            <FormattedMessage id="remainingPlayers.forceNextStep" />
            <NextStepIcon />
          </AdminButton>
        )}
      </StyledPlayerChips>
    </>
  );
};

export default RemainingPlayers;
