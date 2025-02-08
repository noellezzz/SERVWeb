from django.contrib import admin
from django import forms

from . import models


class FaceDataAdminForm(forms.ModelForm):

    class Meta:
        model = models.FaceData
        fields = "__all__"


class FaceDataAdmin(admin.ModelAdmin):
    form = FaceDataAdminForm
    list_display = [
        "last_updated",
        "id",
        "user_id",
        "created",
    ]
    readonly_fields = [
        "last_updated",
        "id",
        "user_id",
        "created",
    ]


admin.site.register(models.FaceData, FaceDataAdmin)
