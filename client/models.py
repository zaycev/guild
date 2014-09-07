from django.db import models
from django.contrib.auth.models import User


class LDProject(models.Model):

    class Meta:
        db_table = "t_LdProject"

    creator = models.ForeignKey(User, blank=True, null=True)

    title = models.CharField(null=True, blank=True, max_length=100)
    reputation = models.IntegerField(default=0)
    description = models.TextField(null=True, blank=True)

    image = models.ImageField(upload_to="webapp/uploads/")


class LDUserData(models.Model):

    class Meta:
        db_table = "t_LdUserData"

    holder = models.ForeignKey(User, blank=False, null=False)
    twitter = models.CharField(null=True, blank=True, max_length=100)
    tagline = models.CharField(null=True, blank=True, max_length=100)

    image = models.ImageField(upload_to="webapp/uploads/")

    activity = models.ManyToManyField(LDProject, blank=True, null=True)
