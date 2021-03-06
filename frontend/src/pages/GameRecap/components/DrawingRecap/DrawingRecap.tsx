import React from 'react';

import { useDeleteVote, useSaveVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import ReactionOverlay from 'pages/GameRecap/components/ReactionOverlay';
import VotesOverlay from '../VotesOverlay';
import { StyledDrawingRecap, StyledDrawing, DrawingHeader } from './DrawingRecap.style';

interface Props {
  step: PadStep;
  publicMode?: boolean;
}

const DrawingRecap: React.FC<Props> = ({ step, publicMode = false }) => {
  const player = useSelector(selectPlayer);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  if (!publicMode && !player) return null;

  const likeCount = step.votes.filter((vote) => player && vote.player.uuid === player.uuid).length;
  const samePlayer = player && player.uuid === step.player.uuid;

  const canLike = !samePlayer && availableVoteCount > 0;
  const canUnlike = !samePlayer && likeCount > 0;

  const doLike = () => doSaveVote(step.uuid);
  const doUnlike = () => doDeleteVote(step.uuid);

  return (
    <StyledDrawingRecap>
      <DrawingHeader>{step.player.name}</DrawingHeader>
      <StyledDrawing src={step.drawing_url} />
      {publicMode ? (
        <VotesOverlay votes={step.votes} />
      ) : (
        <ReactionOverlay
          canLike={canLike}
          canUnlike={canUnlike}
          onLike={doLike}
          onUnlike={doUnlike}
          likeCount={likeCount}
        />
      )}
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
