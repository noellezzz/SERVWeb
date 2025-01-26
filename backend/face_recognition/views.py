from django.views import generic
from django.urls import reverse_lazy
from . import models
from . import forms


class EmotionDataListView(generic.ListView):
    model = models.EmotionData
    form_class = forms.EmotionDataForm


class EmotionDataCreateView(generic.CreateView):
    model = models.EmotionData
    form_class = forms.EmotionDataForm


class EmotionDataDetailView(generic.DetailView):
    model = models.EmotionData
    form_class = forms.EmotionDataForm


class EmotionDataUpdateView(generic.UpdateView):
    model = models.EmotionData
    form_class = forms.EmotionDataForm
    pk_url_kwarg = "pk"


class EmotionDataDeleteView(generic.DeleteView):
    model = models.EmotionData
    success_url = reverse_lazy("face_recognition_EmotionData_list")
