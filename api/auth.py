# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import jwt
import base64

from feed.models import UserProfile

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from django.contrib.auth.models import User


class Auth0Authentication(authentication.BaseAuthentication):

    def authenticate(self, request):

        auth = request.META.get("HTTP_AUTHORIZATION")
        if not auth:
            return None

        parts = auth.split()

        if parts[0].lower() != 'bearer':
            raise AuthenticationFailed("Authorization header must start with Bearer")
        elif len(parts) == 1:
            raise AuthenticationFailed("Token not found")
        elif len(parts) > 2:
            raise AuthenticationFailed("Authorization header must be Bearer + \s + token")

        token = parts[1]

        try:
            payload = jwt.decode(
                token,
                base64.b64decode("87AGWGD_e8tPTmcKfkLP1QU94DELrP4IubZ9iLnRDf8ks1K0mXZ9TBYE1bbSei7o".replace("_","/").replace("-","+"))
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
            return None
        try:
            user = User.objects.get(username=subject)
        except User.DoesNotExist:
            user = User.objects.create_user(subject)
            profile = UserProfile(user=user,
                                  realm=realm,
                                  realm_id=realm_id)
            profile.save()

        return user, None
