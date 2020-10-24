import React from 'react';
import { Pad, StepType, PadStep } from 'redux/Game/types';
import SentenceRecap from 'pages/GameRecap/components/SentenceRecap';
import DrawingRecap from 'pages/GameRecap/components/DrawingRecap';
import RecapRemainingPlayers from 'pages/GameRecap/components/RecapRemainingPlayers';
import { PadRecapRow, ArrowSpacer } from './PadRecap.style';

interface Props {
  pad: Pad;
}

const PadRecap: React.FC<Props> = ({ pad }) => {
  const initialStep: PadStep = {
    uuid: pad.uuid,
    sentence: pad.sentence,
    player: pad.initial_player,
    step_type: StepType.DRAWING_TO_WORD,
    votes: [],
    round_number: -1,
    drawing_url: '',
  };

  return (
    <PadRecapRow>
      <SentenceRecap step={initialStep} />
      {pad.steps.map((step) => (
        <React.Fragment key={step.uuid}>
          <ArrowSpacer />
          {step.step_type === StepType.WORD_TO_DRAWING ? (
            <DrawingRecap step={step} />
          ) : (
            <SentenceRecap step={step} />
          )}
        </React.Fragment>
      ))}
      <RecapRemainingPlayers />
    </PadRecapRow>
  );
};

export default PadRecap;
