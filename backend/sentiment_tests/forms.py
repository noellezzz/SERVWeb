from django import forms
from . import models


class SentimentResultForm(forms.ModelForm):
    class Meta:
        model = models.SentimentResult
        fields = []



class SentimentTestForm(forms.ModelForm):
    class Meta:
        model = models.SentimentTest
        fields = []

