import React, { useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import TextInput from 'components/TextInput';
import lzString from 'lz-string';
import { Player } from 'redux/Player/types';
import {
  LeftSide,
  CanvasWrapper,
  RightSide,
  StyledHeader,
  Spacer,
} from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { StyledForm, StyledButton } from './DrawingToWordStep.style';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/types';
import PlayerChips from 'atoms/PlayerChipList';
import PlayerChip from 'atoms/PlayerChip';

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep, previousPlayer, nextPlayer }) => {
  const [sentence, setSentence] = useState<string>('');
  const remainingPlayers = useSelector((state: RootState) => state.game.remainingPlayers);

  if (!previousPlayer) return null;

  return (
    <>
      <LeftSide>
        <CanvasWrapper>
          <CanvasDraw
            disabled
            hideGrid
            hideInterface
            canvasWidth={538}
            canvasHeight={538}
            saveData={lzString.decompressFromBase64(padStep.drawing)}
          />
        </CanvasWrapper>
      </LeftSide>
      <RightSide>
        <StyledHeader>Devine ce dessin :</StyledHeader>
        <em>(sorti du cerveau malade de {previousPlayer.name})</em>
        {padStep.sentence ? (
          <p>{padStep.sentence}</p>
        ) : (
          <StyledForm
            onSubmit={e => {
              e.preventDefault();
              saveStep({ sentence });
            }}
          >
            <TextInput
              type="text"
              autoFocus
              placeholder="Un mouton ?"
              value={sentence}
              onChange={e => setSentence(e.target.value)}
            />
            <StyledButton type="submit">Valider</StyledButton>
          </StyledForm>
        )}

        <Spacer />
        {nextPlayer && sentence && (
          <p>
            En espérant que {nextPlayer.name} sache mieux dessiner que {previousPlayer.name} ...
          </p>
        )}
        <p>On attend encore:</p>
        <PlayerChips>
          {remainingPlayers.map(player => (
            <PlayerChip key={player.uuid} color={player.color}>
              {player.name}
            </PlayerChip>
          ))}
        </PlayerChips>
      </RightSide>
    </>
  );
};

export default DrawingToWordStep;
