from django.urls import path

from core.views import auth, game, general, room_management

urlpatterns = [
    path("auth/social-login", auth.social_login, name="social_login"),
    path("auth/create-account", auth.create_account, name="create_account"),
    path("auth/login", auth.check_login, name="login"),
    path("auth/logout", auth.do_logout, name="logout"),
    path("suggestions", general.get_suggestions, name="get_suggestions"),
    path("leaderboard", general.get_leaderboard, name="get_leaderboard"),
    path("room", room_management.RoomCreationView.as_view(), name="room_creation"),
    path("player", room_management.PlayerView.as_view(), name="player"),
    path("player/me", auth.get_me, name="me"),
    path("player/<str:uuid>", auth.PlayerAPIView.as_view(), name="player"),
    path(
        "player/<str:uuid>/total-score",
        auth.get_total_score,
        name="player_total_score",
    ),
    path("room/<str:room_id>/join", room_management.join_room, name="join_room"),
    path("room/<str:room_id>/leave", room_management.leave_room, name="leave_room"),
    path("room/<str:room_id>/kick", room_management.kick_player, name="kick_player"),
    path("room/<str:room_id>/start", room_management.start_game, name="start_game"),
    path(
        "room/<str:uuid>",
        room_management.RoomRetrieveAPIView.as_view(),
        name="get_room",
    ),
    path("game/<str:uuid>", game.GameRetrieveAPIView.as_view(), name="get_game"),
    path("pad/<str:uuid>", game.PadRetrieveAPIView.as_view(), name="get_pad"),
    path("pad/<str:uuid>/save", game.save_pad, name="save_pad"),
    path("pad/<str:uuid>/review", game.review_pad, name="review_pad"),
    path(
        "pad-step/<str:uuid>",
        game.PadStepRetrieveAPIView.as_view(),
        name="get_pad_step",
    ),
    path("pad-step/<str:uuid>/save", game.save_step, name="save_step"),
    path("step/<str:pad_step_id>/vote", game.submit_vote, name="submit_vote"),
    path(
        "game/<str:game_id>/vote-results",
        game.get_vote_results,
        name="get_vote_results",
    ),
    path(
        "room/<str:room_id>/ranking", room_management.get_ranking, name="get_ranking",
    ),
    path(
        "game/<str:game_id>/is-player-in-game",
        game.check_is_player_in_game,
        name="is_player_in_game",
    ),
    path(
        "game/<str:game_id>/force-state", game.force_state, name="force_game_state",
    ),
]
