# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import os
import sys

sys.path.append("/usr/local/lib/python2.7/dist-packages")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "farmhouse.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
