import { Player } from 'redux/Player/types';

export interface Room {
  players: Player[];
  admin: Player;
  uuid: string;
  is_in_game: boolean;
}
