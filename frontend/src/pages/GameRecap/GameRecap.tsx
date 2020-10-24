/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { Pad } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useReviewPad } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import NewGameModal from 'modals/NewGameModal';
import DoneModal from 'modals/DoneModal';
import { ThumbUpButton } from './components/ReactionOverlay/ReactionOverlay.style';
import PadTab from './components/PadTab';
import {
  OuterRecapContainer,
  GameRecapContainer,
  TopRow,
  PadTabs,
  VoteReminder,
} from './GameRecap.style';
import PadRecap from './components/PadRecap';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const availableVoteCount = useSelector(selectAvailableVoteCount);

  const [displayedPadId, setDisplayedPadId] = useState<string | null>(null);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doReviewPad = useReviewPad();

  const displayedPad = game?.pads.find((pad) => pad.uuid === displayedPadId);

  useEffect(() => {
    if (!game || displayedPad) return;
    setDisplayedPadId(game.pads[0].uuid);
  }, [game, displayedPad]);

  if (!room || !game) return null;

  const selectPad = (pad: Pad) => {
    doReviewPad(pad);
    setDisplayedPadId(pad.uuid);
  };

  return (
    <>
      <OuterRecapContainer>
        <TopRow>
          <PadTabs>
            {game.pads.map((pad) => (
              <PadTab
                key={pad.uuid}
                isActive={displayedPadId === pad.uuid}
                onClick={() => selectPad(pad)}
                pad={pad}
              />
            ))}
          </PadTabs>
        </TopRow>
        <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
      </OuterRecapContainer>
      <VoteReminder>
        {availableVoteCount ? (
          <>
            <FormattedMessage id="recap.availableVotes" />
            {Array(availableVoteCount)
              .fill('')
              .map((_, index) => (
                <ThumbUpButton key={index} />
              ))}
          </>
        ) : (
          <FormattedMessage id="recap.noMoreVotes" />
        )}
      </VoteReminder>
      {doneModalIsOpen && <DoneModal onClose={() => setDoneModalIsOpen(false)} />}
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </>
  );
};

export default GameRecap;
