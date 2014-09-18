# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ldt.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
