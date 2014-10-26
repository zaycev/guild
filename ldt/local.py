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

SECRET_KEY = "h8(e(u3#k)l802(4mfh^f&&jp!@p*s#98tf++l#z-e83(#$x@*"
DEBUG = True
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = ["localhost"]


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

ROOT_URLCONF = "ldt.urls"
WSGI_APPLICATION = "ldt.wsgi.application"


DATABASES = {
    "default": {
        "ENGINE":   "django.db.backends.postgresql_psycopg2",
        "NAME":     "udun",
        "USER":     "saruman",
        "PASSWORD": "Cefaigfilj#twuc5",
        "HOST":     "127.0.0.1",
        "PORT":     "1111",
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_ROOT = "/webapp/"
STATIC_URL = "/webapp/"
STATICFILES_DIRS = (project_dir("webapp"),)
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
)
TEMPLATE_LOADERS = (
    "django.template.loaders.filesystem.Loader",
    "django.template.loaders.app_directories.Loader",
)

TEMPLATE_DIRS = (
    "webapp/templates",
)

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

        "main-log-file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "logs/app.txt",
            "formatter": "verbose",
        },

        "ldt-log-file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "logs/ldt.txt",
            "formatter": "verbose",
        },

        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },

    },

    "loggers": {

        "django": {
            "handlers": ["main-log-file", "console"],
            "level": "ERROR",
            "propagate": True,
        },

        "ldt": {
            "handlers": ["ldt-log-file", "console"],
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
FILE_UPLOAD_MAX_MEMORY_SIZE = 16 * 1024 * 1024

#
EMAIL_BACKEND       = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_TLS       = True
EMAIL_HOST          = "smtp.gmail.com"
EMAIL_PORT          = 587 #also tried with 465
EMAIL_HOST_USER     = "vladimir.zaytsev.m@gmail.com"
EMAIL_HOST_PASSWORD = "#!Pass39572685"
