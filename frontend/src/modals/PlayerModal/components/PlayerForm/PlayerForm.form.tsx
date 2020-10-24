import React, { useState } from 'react';

import { withFormik, FormikErrors } from 'formik';
import { NoProps } from 'services/utils';
import { Player } from 'redux/Player/types';
import { useEditPlayer } from 'redux/Player/hooks';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import InnerForm from './PlayerForm';

export interface OutsideProps {
  player: Player;
  onSubmit: (player: Player) => Promise<void>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}
// Shape of form values
export interface FormValues {
  name: string;
  color: string;
}

const PlayerForm = withFormik<OutsideProps, FormValues>({
  mapPropsToValues: ({ player }) => {
    return {
      name: player.name,
      color: player.color,
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.name) {
      errors.name = 'playerModal.errors.required';
    }
    if (!values.color) {
      errors.color = 'playerModal.errors.required';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    const { onSubmit, player } = props;
    const { user, ...playerWithoutUser } = player;
    const { name, color } = values;
    await onSubmit({ ...playerWithoutUser, name, color });
    setSubmitting(false);
    props.setIsEditing(false);
  },
})(InnerForm);

const OuterPlayerForm: React.FC<NoProps> = () => {
  const player = useSelector(selectPlayer);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const doEditPlayer = useEditPlayer();

  if (!player) return null;

  return (
    <PlayerForm
      player={player}
      onSubmit={doEditPlayer}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default OuterPlayerForm;
