# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.shortcuts import render_to_response


def debug_page(_):
    return render_to_response("index.html")
