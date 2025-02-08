from django import forms
from . import models


class FaceDataForm(forms.ModelForm):
    class Meta:
        model = models.FaceData
        fields = [
            "user_id",
        ]
