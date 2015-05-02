# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import os
import json
import datetime

try:
    from psycopg2cffi import compat
    compat.register()
except ImportError:
    pass


def project_dir(dir_name):
    return os.path.join(os.path.dirname(__file__), "..", dir_name)\
        .replace("\\", "//")

SECRET_KEY      = "h8(e(u3#k)l802(4mfh^f&&jp!@p*s#98tf++l#z-e83(#$x@*"
DEBUG           = True
TEMPLATE_DEBUG  = True
ALLOWED_HOSTS   = ["localhost"]


INSTALLED_APPS = (
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.admin",
    "debug_toolbar",
    "rest_framework",
    "feed",
    "api",
    "app",
)

MIDDLEWARE_CLASSES = (
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
)

ROOT_URLCONF        = "farmhouse.urls"
WSGI_APPLICATION    = "farmhouse.wsgi.application"


DATABASES = {
    "default": {
        "ENGINE"    : "django.db.backends.postgresql_psycopg2",
        "NAME"      : "farmhouse_dev",
        "USER"      : "master",
        "PASSWORD"  : "ixurf9swykOtubNapshaiGrykigujEb#",
        "HOST"      : "localhost",
        "PORT"      : "1111",
    }
}

LANGUAGE_CODE       = "en-us"
TIME_ZONE           = "UTC"
USE_I18N            = True
USE_L10N            = True
USE_TZ              = True

STATIC_ROOT         = "/static/"
STATIC_URL          = "/static/"
STATICFILES_DIRS    = (project_dir("static"),)
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
)
TEMPLATE_LOADERS = (
    "django.template.loaders.filesystem.Loader",
    "django.template.loaders.app_directories.Loader",
)
TEMPLATE_DIRS = ("templates",)

LOGGING = {
    "version": 1,

    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"
        },
        "simple": {
            "format": "%(levelname)s %(message)s"
        },
    },

    "handlers": {

        "django-log-file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "django.txt",
            "formatter": "verbose",
        },

        "farmhouse-log-file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "farmhouse.txt",
            "formatter": "verbose",
        },

        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },

    },

    "loggers": {

        "django": {
            "handlers": ["django-log-file", "console"],
            "level": "ERROR",
            "propagate": True,
        },

        "farmhouse": {
            "handlers": ["farmhouse-log-file", "console"],
            "level": "INFO",
            "propagate": True
        },
    },
}

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly",
    ),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "api.auth.Auth0Authentication",
    ),
}

# 16 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 32 * 1024 * 1024
