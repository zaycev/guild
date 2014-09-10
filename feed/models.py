# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.db import models
from datetime import datetime
from django.contrib.auth.models import User

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
        db_table = "t_user"

    uid = models.BigIntegerField(primary_key=True, null=False)
    email = models.EmailField(unique=True, null=False, max_length=75)
    created = models.DateTimeField(default=datetime.now, auto_now_add=True, null=True)


class IdeaEntry(models.Model):

    class Meta:
        db_table = "t_idea"

    iid = models.BigIntegerField(primary_key=True, null=False)
    creator = models.ForeignKey(UserProfile, null=False)
    status = models.CharField(max_length=1,
                              default="A",
                              choices=IDEA_STATUS.items(),
                              blank=False,
                              null=False)

    title = models.CharField(max_length=100, null=False, blank=False)
    summary = models.CharField(max_length=1000, null=False, blank=False)
    created = models.DateTimeField(default=datetime.now, auto_now_add=True, null=True)
    updated = models.DateTimeField(default=datetime.now,
                                   auto_now=True,
                                   auto_now_add=True,
                                   null=True)

    pic_id = models.BigIntegerField(null=True)
    geo_id = models.BigIntegerField(null=True)

    votes = models.ManyToManyField(UserProfile, related_name="t_votes")
    members = models.ManyToManyField(UserProfile, related_name="t_members")
    max_members = models.SmallIntegerField(default=-1, null=True)


class Picture(models.Model):

    class Meta:
        db_table = "t_pic_meta"

    pid = models.BigIntegerField(primary_key=True, null=False)
    owner = models.ForeignKey(UserProfile, null=False)


class Comment(models.Model):

    class Meta:
        db_table = "t_comment"

    cid = models.BigIntegerField(primary_key=True, null=False)
    creator = models.ForeignKey(UserProfile, null=False)
    idea = models.ForeignKey(IdeaEntry, null=False)
    status = models.CharField(max_length=1,
                              default="N",
                              choices=COMMENT_STATUS.items(),
                              blank=False,
                              null=False)
    text = models.CharField(max_length=300, null=False, blank=False)
    created = models.DateTimeField(default=datetime.now, null=False)


