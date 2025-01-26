from django.views import generic
from django.urls import reverse_lazy
from . import models
from . import forms


class SentimentResultListView(generic.ListView):
    model = models.SentimentResult
    form_class = forms.SentimentResultForm


class SentimentResultCreateView(generic.CreateView):
    model = models.SentimentResult
    form_class = forms.SentimentResultForm


class SentimentResultDetailView(generic.DetailView):
    model = models.SentimentResult
    form_class = forms.SentimentResultForm


class SentimentResultUpdateView(generic.UpdateView):
    model = models.SentimentResult
    form_class = forms.SentimentResultForm
    pk_url_kwarg = "pk"


class SentimentResultDeleteView(generic.DeleteView):
    model = models.SentimentResult
    success_url = reverse_lazy("sentiment_tests_SentimentResult_list")


class SentimentTestListView(generic.ListView):
    model = models.SentimentTest
    form_class = forms.SentimentTestForm


class SentimentTestCreateView(generic.CreateView):
    model = models.SentimentTest
    form_class = forms.SentimentTestForm


class SentimentTestDetailView(generic.DetailView):
    model = models.SentimentTest
    form_class = forms.SentimentTestForm


class SentimentTestUpdateView(generic.UpdateView):
    model = models.SentimentTest
    form_class = forms.SentimentTestForm
    pk_url_kwarg = "pk"


class SentimentTestDeleteView(generic.DeleteView):
    model = models.SentimentTest
    success_url = reverse_lazy("sentiment_tests_SentimentTest_list")
