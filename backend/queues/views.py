from django.views import generic
from django.urls import reverse_lazy
from . import models
from . import forms


class QueueListView(generic.ListView):
    model = models.Queue
    form_class = forms.QueueForm


class QueueCreateView(generic.CreateView):
    model = models.Queue
    form_class = forms.QueueForm


class QueueDetailView(generic.DetailView):
    model = models.Queue
    form_class = forms.QueueForm


class QueueUpdateView(generic.UpdateView):
    model = models.Queue
    form_class = forms.QueueForm
    pk_url_kwarg = "pk"


class QueueDeleteView(generic.DeleteView):
    model = models.Queue
    success_url = reverse_lazy("queues_Queue_list")
