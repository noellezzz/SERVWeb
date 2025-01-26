import pytest
import test_helpers

from django.urls import reverse


pytestmark = [pytest.mark.django_db]


def tests_EmotionData_list_view(client):
    instance1 = test_helpers.create_face_recognition_EmotionData()
    instance2 = test_helpers.create_face_recognition_EmotionData()
    url = reverse("face_recognition_EmotionData_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_EmotionData_create_view(client):
    url = reverse("face_recognition_EmotionData_create")
    data = {
        "user_id": "b297a243-b621-4907-8581-e9b3ac146a07",
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_EmotionData_detail_view(client):
    instance = test_helpers.create_face_recognition_EmotionData()
    url = reverse("face_recognition_EmotionData_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_EmotionData_update_view(client):
    instance = test_helpers.create_face_recognition_EmotionData()
    url = reverse("face_recognition_EmotionData_update", args=[instance.pk, ])
    data = {
        "user_id": "b297a243-b621-4907-8581-e9b3ac146a07",
    }
    response = client.post(url, data)
    assert response.status_code == 302
