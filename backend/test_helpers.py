import random
import string

from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType

from face_recognition import models as face_recognition_models
from feedbacks import models as feedbacks_models
from queues import models as queues_models
from users import models as users_models
from sentiment_tests import models as sentiment_tests_models
from dashboard import models as dashboard_models


def random_string(length=10):
    # Create a random string of length length
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for i in range(length))


def create_User(**kwargs):
    defaults = {
        "username": "%s_username" % random_string(5),
        "email": "%s_username@tempurl.com" % random_string(5),
    }
    defaults.update(**kwargs)
    return User.objects.create(**defaults)


def create_AbstractUser(**kwargs):
    defaults = {
        "username": "%s_username" % random_string(5),
        "email": "%s_username@tempurl.com" % random_string(5),
    }
    defaults.update(**kwargs)
    return AbstractUser.objects.create(**defaults)


def create_AbstractBaseUser(**kwargs):
    defaults = {
        "username": "%s_username" % random_string(5),
        "email": "%s_username@tempurl.com" % random_string(5),
    }
    defaults.update(**kwargs)
    return AbstractBaseUser.objects.create(**defaults)


def create_Group(**kwargs):
    defaults = {
        "name": "%s_group" % random_string(5),
    }
    defaults.update(**kwargs)
    return Group.objects.create(**defaults)


def create_ContentType(**kwargs):
    defaults = {
    }
    defaults.update(**kwargs)
    return ContentType.objects.create(**defaults)


def create_face_recognition_EmotionData(**kwargs):
    defaults = {}
    defaults["user_id"] = ""
    defaults.update(**kwargs)
    return face_recognition_models.EmotionData.objects.create(**defaults)
def create_feedbacks_Feedback(**kwargs):
    defaults = {}
    defaults.update(**kwargs)
    return feedbacks_models.Feedback.objects.create(**defaults)
def create_queues_Queue(**kwargs):
    defaults = {}
    defaults.update(**kwargs)
    return queues_models.Queue.objects.create(**defaults)
def create_users_User(**kwargs):
    defaults = {}
    defaults["first_name"] = ""
    defaults["last_name"] = ""
    defaults["username"] = ""
    defaults["email"] = ""
    defaults["username"] = "username"
    defaults["email"] = "username@tempurl.com"
    defaults.update(**kwargs)
    return users_models.User.objects.create(**defaults)
def create_sentiment_tests_SentimentResult(**kwargs):
    defaults = {}
    defaults.update(**kwargs)
    return sentiment_tests_models.SentimentResult.objects.create(**defaults)
def create_sentiment_tests_SentimentTest(**kwargs):
    defaults = {}
    defaults.update(**kwargs)
    return sentiment_tests_models.SentimentTest.objects.create(**defaults)
