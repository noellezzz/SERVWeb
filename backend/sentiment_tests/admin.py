from django.contrib import admin
from django import forms

from . import models


class SentimentResultAdminForm(forms.ModelForm):

    class Meta:
        model = models.SentimentResult
        fields = "__all__"


class SentimentResultAdmin(admin.ModelAdmin):
    form = SentimentResultAdminForm
    list_display = [
        "created",
        "id",
        "last_updated",
    ]
    readonly_fields = [
        "created",
        "id",
        "last_updated",
    ]


class SentimentTestAdminForm(forms.ModelForm):

    class Meta:
        model = models.SentimentTest
        fields = "__all__"


class SentimentTestAdmin(admin.ModelAdmin):
    form = SentimentTestAdminForm
    list_display = [
        "created",
        "id",
        "last_updated",
    ]
    readonly_fields = [
        "created",
        "id",
        "last_updated",
    ]


admin.site.register(models.SentimentResult, SentimentResultAdmin)
admin.site.register(models.SentimentTest, SentimentTestAdmin)
