import logging
from math import sqrt
from random import sample
from typing import List

from django_eventstream import send_event

from core.messages import (
    DebriefStartsMessage,
    RoundStartsMessage,
    VoteResultsStartsMessage,
)
from core.models import (
    Game,
    GamePhase,
    Pad,
    PadStep,
    Player,
    PlayerGameParticipation,
    Room,
    StepType,
)

logger = logging.getLogger(__name__)


def get_round_count(game: Game):
    player_count = game.participants.count()
    # There should always be an even number of steps - the first player will play a step on their pad
    # or won't depending on that
    return 2 * ((player_count + int(game.draw_own_word) - 1) // 2)


def order_players(players: List[Player], requested_players_order: List[str]):
    if requested_players_order is None:
        return sample(players, len(players))

    def sort_fn(player: Player):
        try:
            return requested_players_order.index(player.uuid.hex)
        except ValueError:
            return -1

    return sorted(players, key=sort_fn)


def get_available_vote_count(game: Game):
    round_count = get_round_count(game)
    choice_count = round_count * (game.participants.count() - 1)
    return max(1, round(sqrt(0.6 * choice_count - 1)))


def initialize_game(
    room: Room,
    requested_players_order: List[str],
    round_duration: int,
    draw_own_word: bool,
):
    logger.debug("Initializing game for room %s" % room.uuid)

    players = list(room.players.all())
    player_count = len(players)
    even_players = player_count % 2 == 0

    game = Game.objects.create(
        room=room,
        round_duration=round_duration,
        draw_own_word=(player_count == 2 or (even_players and draw_own_word)),
    )

    ordered_players = order_players(players, requested_players_order)

    for index, player in enumerate(ordered_players):
        PlayerGameParticipation.objects.create(game=game, player=player, order=index)

    for index in range(len(ordered_players)):
        initialize_pad(game, index, ordered_players)

    return game


def initialize_pad(game: Game, index: int, players: List[Player]):
    logger.debug(
        "Initializing pad for player %s (index %d)" % (players[index].name, index)
    )
    pad = Pad.objects.create(game=game, initial_player=players[index], order=index)
    player_count = len(players)

    step_count = get_round_count(game)

    for round_number in range(step_count):
        step_player = (
            players[(index + round_number) % player_count]
            if game.draw_own_word
            else players[(index + round_number + 1) % player_count]
        )
        step_type = (
            StepType.WORD_TO_DRAWING
            if round_number % 2 == 0
            else StepType.DRAWING_TO_WORD
        )
        logger.debug(
            "Initializing pad step for pad %s, round %d, with player %s and mode %s"
            % (pad.uuid.hex[:8], round_number, step_player.name, step_type.value)
        )

        PadStep.objects.create(
            pad=pad,
            player=step_player,
            round_number=round_number,
            step_type=step_type.value,
        )


def switch_to_rounds(game: Game):
    game.phase = GamePhase.ROUNDS.value
    game.current_round = 0
    game.pads_done = 0
    game.save()
    for pad in game.pads.all():
        step = pad.steps.get(round_number=game.current_round)
        step.sentence = pad.sentence
        step.save()

    send_event(
        "game-%s" % game.uuid.hex, "message", RoundStartsMessage(game, 0).serialize(),
    )


def start_next_round(game: Game, new_round: int):
    round_count = get_round_count(game)
    if new_round >= round_count:
        return start_debrief(game)
    game.current_round = new_round
    game.pads_done = 0
    game.save()
    for pad in game.pads.all():
        previous_step = pad.steps.get(round_number=new_round - 1)
        step = pad.steps.get(round_number=new_round)
        if new_round % 2 == 0:
            step.sentence = previous_step.sentence
        else:
            step.drawing = previous_step.drawing
        step.save()

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        RoundStartsMessage(game, round_number=new_round).serialize(),
    )


def switch_to_vote_results(game: Game):
    game.phase = GamePhase.VOTE_RESULTS.value
    game.save()
    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        VoteResultsStartsMessage(game).serialize(),
    )


def start_debrief(game: Game):
    game.phase = GamePhase.DEBRIEF.value
    game.current_round = None
    game.pads_done = 0
    game.save()
    send_event(
        "game-%s" % game.uuid.hex, "message", DebriefStartsMessage(game).serialize(),
    )


class GamePhaseAssertionException(Exception):
    def __init__(self, expected, actual):
        message = "Expected game to be at phase %s, actual phase %s" % (
            expected,
            actual,
        )
        super(Exception, self).__init__(message)
        self.expected = expected
        self.actual = actual


class GameRoundAssertionException(Exception):
    def __init__(self, expected, actual):
        message = "Expected game to be at round %d, actual round %d" % (
            expected,
            actual,
        )
        super(Exception, self).__init__(message)
        self.expected = expected
        self.actual = actual


def assert_phase(game: Game, expected_phase: GamePhase):
    if game.phase != expected_phase.value:
        raise GamePhaseAssertionException(expected_phase.value, game.phase)


def assert_round(game: Game, expected_round: int):
    if game.current_round != expected_round:
        raise GameRoundAssertionException(expected_round, game.current_round)


def is_player_in_game(game: Game, player: Player):
    return player in [participant.player for participant in game.participants.all()]
