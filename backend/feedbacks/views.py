from django.views import generic
from django.urls import reverse_lazy
from . import models
from . import forms


class FeedbackListView(generic.ListView):
    model = models.Feedback
    form_class = forms.FeedbackForm


class FeedbackCreateView(generic.CreateView):
    model = models.Feedback
    form_class = forms.FeedbackForm


class FeedbackDetailView(generic.DetailView):
    model = models.Feedback
    form_class = forms.FeedbackForm


class FeedbackUpdateView(generic.UpdateView):
    model = models.Feedback
    form_class = forms.FeedbackForm
    pk_url_kwarg = "pk"


class FeedbackDeleteView(generic.DeleteView):
    model = models.Feedback
    success_url = reverse_lazy("feedbacks_Feedback_list")
