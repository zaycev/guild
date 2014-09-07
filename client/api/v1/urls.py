# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.conf.urls import url
from django.conf.urls import include
from django.conf.urls import patterns

from django.shortcuts import redirect
from django.views.generic.base import RedirectView


urlpatterns = patterns("client.api.v1.views",
    url(r"list/$", "list", name="list"),
    url(r"view/$", "view", name="view"),
    url(r"upload/$", "upload", name="upload"),
    url(r"post/$", "post", name="post"),
    url(r"profile/$", "profile", name="profile"),
    url(r"up_vote/$", "up_vote", name="up_vote"),
    url(r"new_user/$", "new_user", name="new_user"),
    url(r"save/$", "save_profile", name="save_profile"),

)
