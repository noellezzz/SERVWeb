import pytest
import test_helpers

from django.urls import reverse


pytestmark = [pytest.mark.django_db]


def tests_User_list_view(client):
    instance1 = test_helpers.create_users_User()
    instance2 = test_helpers.create_users_User()
    url = reverse("users_User_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_User_create_view(client):
    url = reverse("users_User_create")
    data = {
        "first_name": "text",
        "last_name": "text",
        "username": "text",
        "email": "user@tempurl.com",
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_User_detail_view(client):
    instance = test_helpers.create_users_User()
    url = reverse("users_User_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_User_update_view(client):
    instance = test_helpers.create_users_User()
    url = reverse("users_User_update", args=[instance.pk, ])
    data = {
        "first_name": "text",
        "last_name": "text",
        "username": "text",
        "email": "user@tempurl.com",
    }
    response = client.post(url, data)
    assert response.status_code == 302
