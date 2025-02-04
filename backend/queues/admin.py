from django.contrib import admin
from django import forms

from . import models


class QueueAdminForm(forms.ModelForm):

    class Meta:
        model = models.Queue
        fields = "__all__"


class QueueAdmin(admin.ModelAdmin):
    form = QueueAdminForm
    list_display = [
        "id",
        "created",
        "last_updated",
    ]
    readonly_fields = [
        "id",
        "created",
        "last_updated",
    ]


admin.site.register(models.Queue, QueueAdmin)
