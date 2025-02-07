from django import forms
from . import models


class QueueForm(forms.ModelForm):
    class Meta:
        model = models.Queue
        fields = []

