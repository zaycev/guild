from django.db import models
from django.contrib.auth.models import User



class LDUserData(models.Model):

    class Meta:
        db_table = "t_LdUserData"

    user_id = models.CharField(primary_key=True, null=False, blank=False, max_length=100)
    user_name = models.CharField(null=False, blank=False, max_length=100)
    user_screen_name = models.CharField(null=False, blank=False, max_length=100)
    user_picture =  models.TextField(null=True, blank=True)

    tagline = models.CharField(null=True, blank=True, max_length=100)


class LDProject(models.Model):

    class Meta:
        db_table = "t_LdProject"

    creator = models.ForeignKey(LDUserData, blank=True, null=True)
    upvoters = models.ManyToManyField(LDUserData, related_name="LDProject.upvoters", blank=True, null=True)
    participants = models.ManyToManyField(LDUserData, related_name="LDProject.participants", blank=True, null=True)

    title = models.CharField(null=True, blank=True, max_length=100)
    reputation = models.IntegerField(default=0)
    description = models.TextField(null=True, blank=True)

    image = models.ImageField(upload_to="webapp/uploads/")

