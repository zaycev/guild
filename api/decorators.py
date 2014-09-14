# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import json
import datetime
import traceback

from django.http import HttpResponse

from api import common


def api_call(request_function):

    def wrapped_api_call(request):

        ts_begin = datetime.datetime.now()

        try:
            response_data_dict = request_function(request)
            error_code = 0
            debug_str = ""
            http_code = 200
        except common.LdtApi400Error:
            response_data_dict = None
            error_code = 1
            debug_str = traceback.format_exc()
            http_code = 400
        except common.LdtApi500Error:
            response_data_dict = None
            error_code = 2
            debug_str = traceback.format_exc()
            http_code = 500
        except common.LdtApi501Error:
            response_data_dict = None
            error_code = 3
            debug_str = traceback.format_exc()
            http_code = 501
        except common.LdtApi503Error:
            response_data_dict = None
            error_code = 4
            debug_str = traceback.format_exc()
            http_code = 503
        except Exception:
            response_data_dict = None
            error_code = 5
            debug_str = traceback.format_exc()
            http_code = 500

        ts_end = datetime.datetime.now()

        response = {
            "errorCode":        error_code,
            "errorStr":         "",
            "debugStr":         debug_str,
            "data":             response_data_dict,
            "beginTime":        common.format_iso_datetime(ts_begin),
            "endTime":          common.format_iso_datetime(ts_end),
            "durationTime":     str(ts_end - ts_begin),
        }

        json_str = json.dumps(response, sort_keys=True)

        return HttpResponse(json_str,
                            content_type="application/json",
                            status=http_code)

    return wrapped_api_call
