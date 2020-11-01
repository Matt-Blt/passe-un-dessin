import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Count, Prefetch
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
    JsonResponse,
)
from django.shortcuts import get_object_or_404
from django.views.decorators.http import (
    require_GET,
    require_http_methods,
    require_POST,
)
from rest_framework.generics import RetrieveUpdateAPIView

from core.constants import COLORS
from core.decorators import requires_player
from core.models import Game, GamePhase, Player, PlayerGameParticipation, User, Vote
from core.serializers import (
    PlayerSerializer,
    PlayerWithHistorySerializer,
    PlayerWithUserSerializer,
    UserSerializer,
)
from core.service.auth_service import (
    SocialAuthInvalidTokenException,
    do_user_player_coherence,
    verify_user,
)

logger = logging.getLogger(__name__)


def get_player_response(user, player):
    if user.is_authenticated:
        return JsonResponse(PlayerWithUserSerializer(player).data)

    return JsonResponse(PlayerSerializer(player).data)


@require_GET
@requires_player
def get_me(request, player):
    return get_player_response(request.user, player)


class PlayerAPIView(RetrieveUpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def retrieve(self, request, uuid):
        queryset = (
            self.get_queryset()
            .prefetch_related(
                Prefetch(
                    "participations",
                    queryset=PlayerGameParticipation.objects.order_by("-created_at"),
                ),
                Prefetch(
                    "participations__game",
                    queryset=Game.objects.exclude(phase=GamePhase.INIT.value),
                ),
                "participations__game",
                "participations__game__participants",
                "participations__game__participants__player",
            )
            .get(uuid=uuid)
        )
        serializer = PlayerWithHistorySerializer(queryset)
        return JsonResponse(serializer.data)


@require_POST
def social_login(request):
    json_body = json.loads(request.body)

    try:
        auth_token = json_body["token"]
        provider = json_body["provider"]
    except KeyError:
        return HttpResponseBadRequest("Missing args")

    try:
        email = verify_user(auth_token=auth_token, provider=provider)
    except SocialAuthInvalidTokenException as e:
        logger.warning("Invalid social auth token provided", exc_info=e)

        return HttpResponseForbidden()

    try:
        user = User.objects.get(email=email)
        created = False
    except User.DoesNotExist:
        user = User.objects.create_user(email)
        created = True

    # If there is already a player in the session, set it on the user
    do_user_player_coherence(request, user)

    login(request, user)

    resp = UserSerializer(user).data
    resp["_created"] = created
    return JsonResponse(resp)


@require_POST
def create_account(request):
    json_body = json.loads(request.body)

    try:
        email = json_body["email"]
        password = json_body["password"]
    except KeyError:
        return HttpResponseBadRequest("Missing email or password")

    try:
        user = User.objects.create_user(email, password)
        login(request, user)
        do_user_player_coherence(request, user)

        return JsonResponse(UserSerializer(user).data)
    except IntegrityError:
        return HttpResponseBadRequest("Email already in use")


@require_POST
def check_login(request):
    json_body = json.loads(request.body)

    try:
        email = json_body["email"]
        password = json_body["password"]
    except KeyError:
        return HttpResponseBadRequest("Missing email or password")

    user = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)
        do_user_player_coherence(request, user)

        return JsonResponse(UserSerializer(user).data)
    else:
        return HttpResponseForbidden("Invalid email or password")


@require_POST
@login_required
def do_logout(request):
    logout(request)

    return HttpResponse("Logout successful")


@require_GET
def get_total_score(request, uuid):
    player = get_object_or_404(Player, pk=uuid)
    total_score = Vote.objects.filter(pad_step__player=player).count()
    full_ranking = (
        Player.objects.annotate(vote_count=Count("steps__votes"))
        .filter(vote_count__gt=0)
        .order_by("-vote_count")
    )

    try:
        my_ranking = [
            index + 1
            for index in range(len(full_ranking))
            if full_ranking[index].name == player.name
        ][0]
    except IndexError:  # Player is not in ranking
        my_ranking = None
    return JsonResponse({"score": total_score, "ranking": my_ranking})


@require_http_methods(["PATCH"])
@requires_player
def update_player(request, player):
    json_body = json.loads(request.body)

    if "avatar" in json_body:
        player.avatar = json_body["avatar"]

    if "color" in json_body:
        color = json_body["color"]
        if color not in COLORS:
            return HttpResponseBadRequest(
                "color must be in the following list : {}".format(COLORS)
            )
        player.color = color

    return get_player_response(request.user, player)
