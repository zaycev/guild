from django.contrib import admin

from client.models import LDProject
from client.models import LDUserData

class LDProjectAdmin(admin.ModelAdmin): pass
class LDUserDataAdmin(admin.ModelAdmin): pass

admin.site.register(LDProject, LDProjectAdmin)
admin.site.register(LDUserData, LDUserDataAdmin)