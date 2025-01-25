from django import forms
from . import models


class EmotionDataForm(forms.ModelForm):
    class Meta:
        model = models.EmotionData
        fields = [
            "user_id",
        ]
