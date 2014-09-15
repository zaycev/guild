# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.db.models import F
from django.db import connection
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.decorators import authentication_classes

from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.auth import Auth0Authentication

from feed.models import Comment
from feed.models import Picture
from feed.models import IdeaEntry
from feed.models import UserProfile
from feed.models import IDEA_STATUS
from feed.models import COMMENT_STATUS


PAGE_SIZE = 50


# ########################
# IDEA API
#########################


@api_view(["GET"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def idea_get(request):
    idea_iid = request.GET.get("iid")
    if idea_iid is not None:
        try:
            idea = IdeaEntry.objects.select_related("creator").get(iid=idea_iid)
        except ObjectDoesNotExist:
            idea = None
    else:
        idea = None
    if idea is not None:
        idea = idea.json(creator=True, comments=True, votes=True, members=True, pic=True)
        return Response(idea)

    return Response({
        "iid": None,
        "details": "Idea not found.",
    }, status=status.HTTP_404_NOT_FOUND)



@api_view(["GET"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def idea_list(request):

    skip_size = request.GET.get("skipSize", None)
    text_query = request.GET.get("textQuery", None)

    if skip_size is not None and len(skip_size) > 0:
        skip_size = int(skip_size)
    else:
        skip_size = 0

    if text_query is not None and len(text_query) > 0:
        ideas = IdeaEntry.objects.select_related("creator").search(text_query)[skip_size:(skip_size + PAGE_SIZE)]
    else:
        ideas = IdeaEntry.objects.select_related("creator").all()[skip_size:(skip_size + PAGE_SIZE)]

    ideas = [idea.json(creator=True) for idea in ideas]

    return Response(ideas)


@api_view(["POST"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticated])
def idea_vote(request):
    profile = UserProfile.objects.get(user=request.user)
    iid = request.GET.get("iid")
    try:
        idea = IdeaEntry.objects.get(iid=iid)
    except ObjectDoesNotExist:
        idea = None

    if idea is not None:
        idea.add_vote(profile)
        return Response({
            "iid": iid,
            "uid": profile.user_id,
        })

    return Response({
        "iid": None,
        "details": "Idea not found",
    }, status=status.HTTP_404_NOT_FOUND)


def idea_part(request):
    pass


@api_view(["POST"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticated])
def idea_create(request):
    user = request.user
    profile = UserProfile.objects.get(user=user)
    idea_title = request.GET.get("title")
    idea_summary = request.GET.get("summary")
    idea_picture_id = request.GET.get("pictureId")
    idea = IdeaEntry(creator=profile,
                     title=idea_title,
                     summary=idea_summary,
                     pic_id=None if idea_picture_id is None else int(idea_picture_id))
    idea.save()
    return Response({
        "iid": idea.iid,
    })


def idea_update(request):
    pass


def idea_remove(request):
    pass


#########################
# PIC API
#########################


@api_view(["POST"])
@authentication_classes([Auth0Authentication])
@permission_classes([AllowAny])
def pic_upload(request):

    data = request.FILES["file"].read()
    upload_path = Picture.upload(data)
    pic_id, _ = Picture.store(upload_path, resize=(960, 960))

    return Response({
        "pid": pic_id
    })



def pic_remove(request):
    pass


#########################
# PROFILE API
#########################


@api_view(["GET"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def profile_get(request):
    user_id = request.GET.get("uid")
    if user_id is None:
        if request.user.is_authenticated():
            try:
                profile = UserProfile.objects.get(user=request.user)
            except ObjectDoesNotExist:
                profile = None
        else:
            profile = None
    else:
        try:
            profile = UserProfile.objects.get(user_id=user_id)
        except ObjectDoesNotExist:
            profile = None
    if profile is not None:

        profile = profile.json(max_ideas=7,
                               ideas=True,
                               activity=True,
                               comments=False,
                               username=request.user.is_authenticated())

        return Response(profile)

    return Response({
        "uid": None,
        "details": "User not found",
    }, status=status.HTTP_404_NOT_FOUND)


# @permission_classes([IsAuthenticated])
@api_view(["GET"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def profile_create(request):
    profile = UserProfile.objects.get(user=request.user)
    profile.nickname = request.GET.get("nickname")
    profile.email = request.GET.get("email")
    profile.email_verified = request.GET.get("email_verified", False)
    if request.GET.get("picture") is not None:
        pic_url = request.GET.get("picture")
        download_path = Picture.download(pic_url)
        dir_name, pic_name = profile.gen_pic_path()
        pic_id, _ = Picture.store(download_path, profile, save_to=(dir_name, pic_name), resize=(256, 256))
        profile.pic_id = pic_id
    profile.save()
    return Response(profile.json(max_ideas=0, ideas=False, activity=False, comments=False))


@api_view(["POST"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticated])
def profile_update(request):
    profile = UserProfile.objects.get(user=request.user)
    tagline = request.GET.get("tagline")
    profile.tagline = tagline
    profile.save()
    profile = profile.json()
    return Response(profile)


#########################
# COMMENT API
#########################


def comment_get(request):
    pass


@api_view(["POST"])
@authentication_classes([Auth0Authentication])
@permission_classes([IsAuthenticated])
def comment_create(request):
    profile = UserProfile.objects.get(user=request.user)
    iid = request.GET.get("iid")
    text = request.GET.get("text")
    try:
        idea = IdeaEntry.objects.get(iid=iid)
    except ObjectDoesNotExist:
        idea = None

    if idea is not None:
        comment = idea.add_comment(profile, text)
        return Response(comment.json())

    return Response({
        "iid": None,
        "details": "Idea not found",
    }, status=status.HTTP_404_NOT_FOUND)


def comment_remove(request):
    pass
