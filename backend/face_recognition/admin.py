from django.contrib import admin
from django import forms

from . import models


class EmotionDataAdminForm(forms.ModelForm):

    class Meta:
        model = models.EmotionData
        fields = "__all__"


class EmotionDataAdmin(admin.ModelAdmin):
    form = EmotionDataAdminForm
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


admin.site.register(models.EmotionData, EmotionDataAdmin)
