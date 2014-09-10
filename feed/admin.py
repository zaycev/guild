# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

from django.contrib import admin

from feed.models import Comment
from feed.models import Picture
from feed.models import IdeaEntry
from feed.models import UserProfile

class PictureAdmin(admin.ModelAdmin): pass
class CommentAdmin(admin.ModelAdmin): pass
class IdeaEntryAdmin(admin.ModelAdmin): pass
class UserProfileAdmin(admin.ModelAdmin): pass

admin.site.register(Picture, PictureAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(IdeaEntry, IdeaEntryAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
