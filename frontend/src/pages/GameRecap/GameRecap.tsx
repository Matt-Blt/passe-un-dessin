import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  InnerDoneModal,
  PadTabsRow,
  PadTab,
  TopRightButton,
  StyledHeader,
  TopRightButtons,
} from './GameRecap.style';
import { Pad } from 'redux/Game/types';
import Modal from 'components/Modal';
import { useHistory } from 'react-router';
import Button from 'components/Button';
import { HelpParagraph } from '../Home/Home.style';
import { useLeaveRoom } from 'redux/Room/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const history = useHistory();

  const [displayedPad, setDisplayedPad] = useState<Pad | null>(null);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);

  const doLeaveRoom = useLeaveRoom();

  useEffect(() => {
    if (!game) return;
    setDisplayedPad(game.pads[0]);
  }, [setDisplayedPad, game]);

  if (!room || !game) return null;

  const leaveGame = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  return (
    <>
      <OuterRecapContainer>
        <PadTabsRow>
          {game.pads.map(pad => (
            <PadTab
              key={pad.uuid}
              isActive={displayedPad === pad}
              onClick={() => setDisplayedPad(pad)}
            >
              {pad.initial_player.name}
            </PadTab>
          ))}
        </PadTabsRow>
        <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
      </OuterRecapContainer>
      <Modal isOpen={doneModalIsOpen} onClose={() => setDoneModalIsOpen(false)}>
        <InnerDoneModal>
          <StyledHeader>C'est fini !</StyledHeader>
          <HelpParagraph>
            Vous pouvez désormais voir l'ensemble des carnets pour comprendre tous les dessins que
            vous avez eus à deviner.
          </HelpParagraph>
          <HelpParagraph>Naviguez d'un carnet à l'autre avec les onglets en haut.</HelpParagraph>
          <Button onClick={() => setDoneModalIsOpen(false)}>Voir les résultats</Button>
        </InnerDoneModal>
      </Modal>
      <TopRightButtons>
        <TopRightButton onClick={leaveGame}>Quitter l'équipe</TopRightButton>
        {isPlayerAdmin && (
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            Nouvelle partie ?
          </TopRightButton>
        )}
      </TopRightButtons>
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </>
  );
};

export default GameRecap;
