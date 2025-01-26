import pytest
import test_helpers

from django.urls import reverse


pytestmark = [pytest.mark.django_db]


def tests_SentimentResult_list_view(client):
    instance1 = test_helpers.create_sentiment_tests_SentimentResult()
    instance2 = test_helpers.create_sentiment_tests_SentimentResult()
    url = reverse("sentiment_tests_SentimentResult_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_SentimentResult_create_view(client):
    url = reverse("sentiment_tests_SentimentResult_create")
    data = {
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_SentimentResult_detail_view(client):
    instance = test_helpers.create_sentiment_tests_SentimentResult()
    url = reverse("sentiment_tests_SentimentResult_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_SentimentResult_update_view(client):
    instance = test_helpers.create_sentiment_tests_SentimentResult()
    url = reverse("sentiment_tests_SentimentResult_update", args=[instance.pk, ])
    data = {
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_SentimentTest_list_view(client):
    instance1 = test_helpers.create_sentiment_tests_SentimentTest()
    instance2 = test_helpers.create_sentiment_tests_SentimentTest()
    url = reverse("sentiment_tests_SentimentTest_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_SentimentTest_create_view(client):
    url = reverse("sentiment_tests_SentimentTest_create")
    data = {
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_SentimentTest_detail_view(client):
    instance = test_helpers.create_sentiment_tests_SentimentTest()
    url = reverse("sentiment_tests_SentimentTest_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_SentimentTest_update_view(client):
    instance = test_helpers.create_sentiment_tests_SentimentTest()
    url = reverse("sentiment_tests_SentimentTest_update", args=[instance.pk, ])
    data = {
    }
    response = client.post(url, data)
    assert response.status_code == 302
