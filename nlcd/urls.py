# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.conf.urls import url
from django.conf.urls import include
from django.conf.urls import patterns

from django.shortcuts import redirect
from django.views.generic.base import RedirectView

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns("client.views",
    url(r"^$",      RedirectView.as_view(url="/app/", permanent=False)),
    url(r"^app/",   include("client.urls")),
    url(r"^api/v1/",include("client.api.v1.urls")),
    url(r'^admin/', include(admin.site.urls)),
)
