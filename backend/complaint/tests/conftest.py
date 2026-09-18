import pytest
from django.core.cache import cache
from rest_framework.test import APIClient
from complaint.tests.factories import UserFactory, CategoryFactory, ComplaintFactory


@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def user(db):
    return UserFactory()


@pytest.fixture
def category(db):
    return CategoryFactory()


@pytest.fixture
def complaint(db, user, category):
    return ComplaintFactory(user=user, category=category)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client