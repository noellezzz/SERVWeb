from django.contrib import admin
from django import forms

from . import models


class FeedbackAdminForm(forms.ModelForm):

    class Meta:
        model = models.Feedback
        fields = "__all__"


class FeedbackAdmin(admin.ModelAdmin):
    form = FeedbackAdminForm
    list_display = [
        "created",
        "last_updated",
        "id",
    ]
    readonly_fields = [
        "created",
        "last_updated",
        "id",
    ]


admin.site.register(models.Feedback, FeedbackAdmin)
