# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import re
import json
import uuid
import os

from django.core.files import File
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.models import User

from client.models import LDProject
from client.models import LDUserData

from client.api.decorators import nlcd_api_call

from django.contrib.auth import get_user_model

# User = get_user_model()



@csrf_exempt
@nlcd_api_call
def list(request):

    list_size = int(request.GET.get("size", "10"))
    list_skip = int(request.GET.get("skip", "0"))

    projects = LDProject.objects.filter().order_by("-reputation")[list_skip:(list_skip + list_size)]

    projects_json = [project_to_json(project) for project in projects]

    return projects_json


@csrf_exempt
@nlcd_api_call
def upload(request):

    original_name = request.FILES["file"].name
    ext = original_name.split(".")[-1]
    data = request.FILES["file"].read()
    filename = "webapp/uploads/random/%s.%s" % (uuid.uuid4(), ext)

    with open(filename, "w") as o_fl:
        o_fl.write(data)

    return {
        "newName": filename
    }


@csrf_exempt
@nlcd_api_call
def post(request):

    user_id = request.GET.get("userId")
    title = request.GET.get("title")
    description = request.GET.get("description")
    image = request.GET.get("image")
    user = LDUserData.objects.get(user_id=user_id)
    new_project = LDProject(creator=user, title=title, description=description)
    new_project.save()
    new_project.image.save(os.path.basename(image), File(open(image)))

    return {
        "projectId": new_project.id,
    }


@csrf_exempt
@nlcd_api_call
def view(request):
    project_id = request.GET.get("projectId", "1")
    project = LDProject.objects.get(id=project_id)
    return project_to_json(project)


@csrf_exempt
@nlcd_api_call
def profile(request):
    user = User.objects.get(id=request.GET.get("userId", "1"))
    return user_to_json(user)

def project_to_json(project):
    user = project.creator
    upvoters = project.upvoters.all()
    participants = project.participants.all()
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "reputation": project.reputation,
        "image": "/%s" % project.image.name,
        "creator":  {
            "userId": user.user_id,
            "userName": user.user_name,
            "userScreenName": user.user_screen_name,
            "userPicture":user.user_picture,
            "tagLine": user.tagline,
        },
        "upvoters": [{
                "userId": user.user_id,
                "userName": user.user_name,
                "userScreenName": user.user_screen_name,
                "userPicture":user.user_picture,
                "tagLine": user.tagline,
            } for user in upvoters],

        "participants": [{
                "userId": user.user_id,
                "userName": user.user_name,
                "userScreenName": user.user_screen_name,
                "userPicture":user.user_picture,
                "tagLine": user.tagline,
            } for user in participants],
    }


def user_to_json(user):
    projects = LDProject.objects.filter(creator=user)
    activities = []
    return {
        "userId": user.user_id,
        "userName": user.user_name,
        "userScreenName": user.user_screen_name,
        "userPicture": user.user_picture,
        "tagLine": user.tagline,
        "projects": [project_to_json(p) for p in projects],
    }


@csrf_exempt
@nlcd_api_call
def up_vote(request):
    user_id = request.GET.get("userId")
    project_id = request.GET.get("projectId")
    user = LDUserData.objects.get(user_id=user_id)
    project = LDProject.objects.get(id=project_id)
    project.upvoters.add(user)
    return ""



@csrf_exempt
@nlcd_api_call
def new_user(request):

    user_id = request.GET.get("userId")
    user_name = request.GET.get("userName")
    user_screen_name = request.GET.get("userScreenName")
    user_picture = request.GET.get("userPicture")

    try:
        user = LDUserData.objects.get(user_id=user_id)
        print "BYL", user
    except LDUserData.DoesNotExist:
        user = LDUserData(user_id=user_id,
            user_name=user_name,
            user_screen_name=user_screen_name,
            user_picture=user_picture)
        user.save()
        print "NOVY", user


    return user_to_json(user)