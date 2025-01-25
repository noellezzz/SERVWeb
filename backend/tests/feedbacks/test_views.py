import pytest
import test_helpers

from django.urls import reverse


pytestmark = [pytest.mark.django_db]


def tests_Feedback_list_view(client):
    instance1 = test_helpers.create_feedbacks_Feedback()
    instance2 = test_helpers.create_feedbacks_Feedback()
    url = reverse("feedbacks_Feedback_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Feedback_create_view(client):
    url = reverse("feedbacks_Feedback_create")
    data = {
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Feedback_detail_view(client):
    instance = test_helpers.create_feedbacks_Feedback()
    url = reverse("feedbacks_Feedback_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Feedback_update_view(client):
    instance = test_helpers.create_feedbacks_Feedback()
    url = reverse("feedbacks_Feedback_update", args=[instance.pk, ])
    data = {
    }
    response = client.post(url, data)
    assert response.status_code == 302
