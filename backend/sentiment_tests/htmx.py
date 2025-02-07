from django.views import generic
from django.urls import reverse_lazy
from django.shortcuts import HttpResponse
from django.views import generic
from django.template import Template, RequestContext
from django.template.response import TemplateResponse

from . import models
from . import forms


class HTMXSentimentResultListView(generic.ListView):
    model = models.SentimentResult
    form_class = forms.SentimentResultForm
    
    def get(self, request, *args, **kwargs):
        super().get(request, *args, **kwargs)
        context = {
            "model_id": self.model._meta.verbose_name_raw,
            "objects": self.get_queryset()
        }
        return TemplateResponse(request,'htmx/list.html', context)


class HTMXSentimentResultCreateView(generic.CreateView):
    model = models.SentimentResult
    form_class = forms.SentimentResultForm
    
    def get(self, request, *args, **kwargs):
        super().get(request, *args, **kwargs)
        context = {
            "create_url": self.model.get_htmx_create_url(),
            "form": self.get_form()
        }
        return TemplateResponse(request, 'htmx/form.html', context)

    def form_valid(self, form):
        super().form_valid(form)
        context = {
            "model_id": self.model._meta.verbose_name_raw,
            "object": self.object,
            "form": form
        }
        return TemplateResponse(self.request, 'htmx/create.html', context)

    def form_invalid(self, form):
        super().form_invalid(form)
        context = {
            "create_url": self.model.get_htmx_create_url(),
            "form": self.get_form()
        }
        return TemplateResponse(self.request, 'htmx/form.html', context)


class HTMXSentimentResultDeleteView(generic.DeleteView):
    model = models.SentimentResult
    success_url = reverse_lazy("sentiment_tests_SentimentResult_htmx_list")
    
    def form_valid(self, form):
        super().form_valid(form)
        return HttpResponse()


class HTMXSentimentTestListView(generic.ListView):
    model = models.SentimentTest
    form_class = forms.SentimentTestForm
    
    def get(self, request, *args, **kwargs):
        super().get(request, *args, **kwargs)
        context = {
            "model_id": self.model._meta.verbose_name_raw,
            "objects": self.get_queryset()
        }
        return TemplateResponse(request,'htmx/list.html', context)


class HTMXSentimentTestCreateView(generic.CreateView):
    model = models.SentimentTest
    form_class = forms.SentimentTestForm
    
    def get(self, request, *args, **kwargs):
        super().get(request, *args, **kwargs)
        context = {
            "create_url": self.model.get_htmx_create_url(),
            "form": self.get_form()
        }
        return TemplateResponse(request, 'htmx/form.html', context)

    def form_valid(self, form):
        super().form_valid(form)
        context = {
            "model_id": self.model._meta.verbose_name_raw,
            "object": self.object,
            "form": form
        }
        return TemplateResponse(self.request, 'htmx/create.html', context)

    def form_invalid(self, form):
        super().form_invalid(form)
        context = {
            "create_url": self.model.get_htmx_create_url(),
            "form": self.get_form()
        }
        return TemplateResponse(self.request, 'htmx/form.html', context)


class HTMXSentimentTestDeleteView(generic.DeleteView):
    model = models.SentimentTest
    success_url = reverse_lazy("sentiment_tests_SentimentTest_htmx_list")
    
    def form_valid(self, form):
        super().form_valid(form)
        return HttpResponse()
