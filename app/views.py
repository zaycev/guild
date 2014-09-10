# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.http import HttpResponse
from django.shortcuts import render_to_response

def app(_):
    return render_to_response("app.html")

def debug(_):
    return render_to_response("debug.html")