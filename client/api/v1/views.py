# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import re
import json

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
def post(request):

    user_id = request.GET.get("userId")
    graph_id = request.GET.get("userId")
    graph_id = request.GET.get("userId")
    graph_id = request.GET.get("userId")

    with open("webapp/json/%s.json" % graph_id, "rb") as i_fl:
        graph = json.load(i_fl)

    return graph


@csrf_exempt
@nlcd_api_call
def view(request):
    project_id = request.GET.get("userId")
    with open("webapp/json/%s.json" % graph_id, "rb") as i_fl:
        graph = json.load(i_fl)
    return graph


@csrf_exempt
@nlcd_api_call
def profile(request):
    user = User.objects.get(id=1)
    return user_to_json(user)

def project_to_json(project):
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "reputation": project.reputation,
        "image": "/%s" % project.image.name,
        "creator": {
            "userName": project.creator.username,
            "firstName": project.creator.first_name,
            "lastName": project.creator.last_name,
        }
    }


def user_to_json(user):
    data = LDUserData.objects.get(id=user.id)
    activity = data.activity.all()
    projects = LDProject.objects.filter(creator=user)
    return {
        "firstName": user.first_name,
        "lastName": user.last_name,
        "userName": user.username,
        "activity": [project_to_json(p) for p in activity],
        "projects": [project_to_json(p) for p in projects],
        "tagLine": data.tagline,
        "twitter": data.twitter,
        "image": "/%s" % data.image.name,
    }