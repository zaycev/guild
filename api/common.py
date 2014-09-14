# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import datetime


class LdtApiError(Exception): pass
class LdtApi400Error(LdtApiError): pass
class LdtApi500Error(LdtApiError): pass
class LdtApi501Error(LdtApiError): pass
class LdtApi503Error(LdtApiError): pass


def format_iso_date(datetime):
    """Formats `datetime` in following format '%Y-%m-%d'"""
    return datetime.strftime("%Y-%m-%d")


def format_iso_time(datetime):
    """Formats `datetime` in following format '%H:%M:%S'"""
    return datetime.strftime("%H:%M:%S")


def format_iso_datetime(datetime):
    """Formats `datetime` in following format '%Y-%m-%dT%H:%M:%S'"""
    return datetime.strftime("%Y-%m-%dT%H:%M:%S")


def parse_iso_date(string):
    """Parses the following date format '%Y-%m-%d'"""
    pass


def parse_iso_time(string):
    """Parses the following time format '%H:%M:%S'"""
    pass


def parse_iso_datetime(string):
    """Parses the following time-stamp format '%Y-%m-%dT%H:%M:%S'"""
    pass
