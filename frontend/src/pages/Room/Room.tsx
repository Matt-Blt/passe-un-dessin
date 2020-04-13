import React, { useEffect, lazy, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Switch, Route, useRouteMatch, useHistory } from 'react-router';

import { useSelector } from 'redux/useSelector';
import { addPlayerToRoom, removePlayerFromRoom, nameNewAdmin } from 'redux/Room';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { useFetchRoom, useLeaveRoom } from 'redux/Room/hooks';
import { Player } from 'redux/Player/types';

import { SERVER_EVENT_TYPES, useServerSentEvent } from 'services/networking/server-events';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { selectGame } from 'redux/Game/selectors';
import { GamePhase } from 'redux/Game/types';
import Header2 from 'atoms/Header2';
import AdminModal from 'components/AdminModal';

import cogIcon from 'assets/cog.svg';
import { AdminModalButton } from './Room.style';
import { selectPlayer } from 'redux/Player/selectors';

const Game = lazy(() => import('../../pages/Game'));
const RoomLobby = lazy(() => import('../../pages/RoomLobby'));

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams();
  const doFetchRoom = useFetchRoom();
  const doLeaveRoom = useLeaveRoom();
  const [playerWhoLeft, setPlayerWhoLeft] = useState<Player | null>(null);
  const [isAdminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);

  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (roomId) {
      doFetchRoom(roomId);
    }
  }, [doFetchRoom, roomId]);

  const onRoomEvent = useCallback(
    ({ message_type: messageType, player: messagePlayer, game }) => {
      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_CONNECTED:
          return dispatch(addPlayerToRoom(messagePlayer));
        case SERVER_EVENT_TYPES.PLAYER_LEFT:
          if (player && messagePlayer.uuid === player.uuid) {
            return history.push('/');
          }
          setPlayerWhoLeft(messagePlayer);
          return dispatch(removePlayerFromRoom(messagePlayer));
        case SERVER_EVENT_TYPES.NEW_ADMIN:
          return dispatch(nameNewAdmin(messagePlayer));

        case SERVER_EVENT_TYPES.GAME_STARTS:
          return history.push(`/room/${room?.uuid}/game/${game.uuid}`);
      }
    },
    [dispatch, history, player, room],
  );

  const channelName = room ? `room-${room.uuid}` : null;

  useServerSentEvent(channelName, onRoomEvent);

  const roomLeaveListener = useCallback(() => {
    if (room) {
      doLeaveRoom(room);
    }
  }, [doLeaveRoom, room]);

  useEffect(() => {
    window.addEventListener('unload', roomLeaveListener);

    return () => {
      window.removeEventListener('unload', roomLeaveListener);
    };
  }, [roomLeaveListener]);

  useEffect(() => setPlayerWhoLeft(null), [game]);

  if (!room) return null;

  return (
    <>
      {isPlayerAdmin && (
        <AdminModalButton src={cogIcon} alt="Settings" onClick={() => setAdminModalOpen(true)} />
      )}
      <Switch>
        <Route path={`${path}/game/:gameId`} component={Game} />
        <Route path={`${path}`} exact component={RoomLobby} />
      </Switch>
      {playerWhoLeft && game && game?.phase !== GamePhase.DEBRIEF && (
        <Modal isOpen>
          <Header2>On a perdu quelqu'un !</Header2>
          <p>{playerWhoLeft?.name} semble avoir quitté la partie :/</p>
          <p>On est obligés d'en recommencer une.</p>
          {isPlayerAdmin ? (
            <Button onClick={() => setAdminModalOpen(true)}>Ouvrir les réglages</Button>
          ) : (
            <p>C'est {room.admin.name} qui décide.</p>
          )}
        </Modal>
      )}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
};

export default Room;
