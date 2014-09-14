# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import os
import uuid
import shutil
import imghdr
import string
import requests


from datetime import datetime
from django.db import models
from api.common import format_iso_datetime
from django.contrib.auth.models import User

from PIL import Image


ALPHABET = string.letters + string.digits
PIC_PATH_SIZE = 8


IDEA_STATUS = {
    "A": "Active",
    "D": "Deleted",
    "C": "Closed",
}

COMMENT_STATUS = {
    "N": "Normal",
    "I": "Important",
    "D": "Deleted",
}


class UserProfile(models.Model):

    class Meta:
        db_table = "t_profile"

    user = models.ForeignKey(User, primary_key=True, null=False)
    nickname = models.CharField(max_length=30, null=False, blank=False)
    email = models.EmailField(unique=True, null=True, max_length=50)
    email_verified = models.BooleanField(default=False, null=False)
    tagline = models.CharField(max_length=100, null=True, blank=True)
    realm_id = models.CharField(max_length=32, null=False, blank=False)
    realm = models.CharField(max_length=16, null=False, blank=False)
    created = models.DateTimeField(default=datetime.now, auto_now_add=True, null=True)
    pic_id = models.IntegerField(null=True)

    def gen_pic_path(self):
        dir_name = "%02x" % (self.user_id % 255)
        pic_name = "u__%08x.jpg" % self.user_id
        return dir_name, pic_name

    def json(self, max_ideas=10, ideas=True, activity=True, comments=True):

        if ideas:
            ideas = IdeaEntry.objects.filter(creator=self)[:max_ideas]
            ideas = [idea.json(creator=True, comments=False, votes=False, members=False) for idea in ideas]
        else:
            ideas = IdeaEntry.objects.filter(creator=self).count()

        return {
            "uid": self.user_id,
            "username": self.user.username,
            "nickname": self.nickname,
            "email": self.email,
            "tagline": self.tagline,
            "created": format_iso_datetime(self.created),
            "picture": None if self.pic_id is None else "/webapp/usercontent/%s/%s" % self.gen_pic_path(),
            "ideas": ideas,
            "activity": [],
        }


class IdeaEntry(models.Model):

    class Meta:
        db_table = "t_idea"
        ordering = ("-updated",)

    iid = models.AutoField(primary_key=True, null=False)
    creator = models.ForeignKey(UserProfile, null=False)
    status = models.CharField(max_length=1,
                              default="A",
                              choices=IDEA_STATUS.items(),
                              blank=False,
                              null=False)

    title = models.CharField(max_length=100, null=False, blank=False)
    summary = models.CharField(max_length=1000, null=False, blank=False)
    created = models.DateTimeField(default=datetime.now, auto_now_add=True, null=True)
    voted = models.DateTimeField(default=datetime.now, auto_now_add=True, null=True)
    updated = models.DateTimeField(default=datetime.now,
                                   auto_now=True,
                                   auto_now_add=True,
                                   null=True)

    pic_id = models.IntegerField(null=True)
    geo_id = models.IntegerField(null=True)

    votes = models.ManyToManyField(UserProfile, related_name="t_votes")
    members = models.ManyToManyField(UserProfile, related_name="t_members")
    max_members = models.SmallIntegerField(default=-1, null=True)

    def json(self, creator=False, comments=False, votes=False, members=False):

        if creator:
            creator = self.creator.json(ideas=False, activity=False, comments=False)
        else:
            creator = self.creator_id

        if comments:
            comments = [comment.json() for comment in Comment.objects.filter(idea=self)[:25]]
            comments_num = Comment.objects.filter(idea=self).count()
        else:
            comments = Comment.objects.filter(idea=self).count()
            comments_num = None

        if votes:
            votes = [user.json(ideas=False,
                               votes=False,
                               membership=False,
                               comments=False) for user in self.votes.all()[:10]]
            votes_num = self.votes.all().count()
        else:
            votes = self.votes.count()
            votes_num = None

        if members:
            members = [user.json(ideas=False,
                                 votes=False,
                                 membership=False,
                                 comments=False) for user in self.members.all()[:10]]
            members_num = self.members.all().count()
        else:
            members = self.members.count()
            members_num = None

        return {
            "iid": self.iid,
            "title": self.title,
            "summary": self.summary,
            "created": format_iso_datetime(self.created),
            "creator": creator,
            "comments": comments,
            "comments_num": comments_num,
            "votes": votes,
            "votes_num": votes_num,
            "members": members,
            "members_num": members_num,
        }


class Picture(models.Model):

    UPLOADS = "webapp/uploads"
    DOWNLOADS = "webapp/downloads"
    USERCONTENT = "webapp/usercontent"

    class Meta:
        db_table = "t_pic_meta"

    pid = models.AutoField(primary_key=True, null=False)
    path = models.CharField(max_length=64, null=False, blank=False)
    owner = models.ForeignKey(UserProfile, null=False)

    @staticmethod
    def download(pic_url):
        download_path = os.path.join(Picture.DOWNLOADS, uuid.uuid4().hex)
        response = requests.get(pic_url, stream=True)
        with open(download_path, "wb") as pic_file:
            shutil.copyfileobj(response.raw, pic_file)
        return download_path

    @staticmethod
    def store(origin, owner, save_to=None, remove_origin=True, resize=False):

        if save_to is None:
            u = uuid.uuid4().hex
            pic_dir = u[:2]
            pic_name = "%s.jpg" % u
        else:
            pic_dir, pic_name = save_to

        path = os.path.join(pic_dir, pic_name)
        pic_meta = Picture(owner=owner, path=path)
        pic_meta.save()

        save_dir = os.path.join(Picture.USERCONTENT, pic_dir)
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        save_path = os.path.join(save_dir, pic_name)

        pic_format = imghdr.what(origin)
        if pic_format == "jpeg" or pic_format == "png" or pic_format == "gif":
            im = Image.open(origin)
            if resize:
                im.thumbnail(resize, Image.ANTIALIAS)
            im.convert("RGB").save(save_path, "JPEG", quality=85)
            if remove_origin:
                os.remove(origin)
            return pic_meta.pid, path

        else:
            return None, None


class Comment(models.Model):

    class Meta:
        db_table = "t_comment"
        ordering = ("-created",)

    cid = models.AutoField(primary_key=True, null=False)
    creator = models.ForeignKey(UserProfile, null=False)
    idea = models.ForeignKey(IdeaEntry, null=False)
    status = models.CharField(max_length=1,
                              default="N",
                              choices=COMMENT_STATUS.items(),
                              blank=False,
                              null=False)
    text = models.CharField(max_length=300, null=False, blank=False)
    created = models.DateTimeField(default=datetime.now, null=False)

    def json(self):
        return {
            "cid": self.cid,
            "text": self.text,
            "status": self.status,
            "creator": self.creator.json(max_ideas=0, ideas=False, activity=False, comments=False),
            "created": format_iso_datetime(self.created),
        }