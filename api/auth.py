# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import jwt
import base64
import logging

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from feed.models import UserProfile

logger = logging.getLogger("ldt")


class Auth0Authentication(authentication.BaseAuthentication):

    def authenticate(self, request):

        auth = request.META.get("HTTP_AUTHORIZATION")
        if not auth:
            logger.error("Not credentials provided.")
            return None

        parts = auth.split()

        if parts[0].lower() != "bearer":
            raise AuthenticationFailed("Authorization header must start with Bearer")
        elif len(parts) == 1:
            raise AuthenticationFailed("Token not found")
        elif len(parts) > 2:
            raise AuthenticationFailed("Authorization header must be Bearer + \s + token")

        token = parts[1]

        try:
            payload = jwt.decode(
                token,
                base64.b64decode("87AGWGD_e8tPTmcKfkLP1QU94DELrP4IubZ9iLnRDf8ks1K0mXZ9TBYE1bbSei7o".replace("_", "/").replace("-", "+"))
            )
        except jwt.ExpiredSignature:
            raise AuthenticationFailed("token is expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("token signature is invalid")

        if payload["aud"] != "x9fQt7BU6A5HjucW01o69AS64OJiv8fI":
            raise AuthenticationFailed("the audience does not match")

        try:
            subject = payload["sub"]
            realm, realm_id = subject.split("|")
        except KeyError:
            raise AuthenticationFailed("subject not found")
        except ValueError:
            raise AuthenticationFailed("subject is invalid")

        if subject is None:
            logger.warn("Subject not found")
            return None

        try:
            user = User.objects.get(username=subject)
            try:
                profile = UserProfile.objects.get(user=user)
            except ObjectDoesNotExist:
                logger.info("User [%s] found, but profile does not exist." % user.username)
                logger.info("Creating profile for [%s]." % user.username)
                profile = UserProfile(user=user,
                                      realm=realm,
                                      realm_id=realm_id)
                profile.save()
                logger.warn("Profile [%s] was created." % user.username)

        except User.DoesNotExist:
            logger.warn("User [%s] not found, creating." % subject)
            user = User.objects.create_user(subject)
            profile = UserProfile(user=user,
                                  realm=realm,
                                  realm_id=realm_id)
            user.save()
            profile.save()
            logger.warn("User and profile for '%s' were created." % subject)

        return user, None
