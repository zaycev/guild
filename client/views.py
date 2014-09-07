# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.http import HttpResponse
from django.shortcuts import render_to_response
from client.models import LDProject

def app_html(_):
    return render_to_response("app.html")