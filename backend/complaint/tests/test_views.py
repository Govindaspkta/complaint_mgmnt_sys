import pytest
from complaint.views import (
    CategoryListCreateApiViews,
    ComplaintListCreateApiViews,
    ComplaintsDetailApiView,
    CategooryDetailApiView
)
from complaint.models import AetherixUsers
from rest_framework.test import APIClient

@pytest.fixture
def user(db):
    """Creates one real user, hashed password, via Django's built-in create_user."""
    return AetherixUsers.objects.create_user(
        username="testuser",
        email="testuser@example.com",
        password="testpass123",
    )

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


def test_list_complaints_returns_200(auth_client, complaint):
    response = auth_client.get('/api/complaints/')  # use your actual url
    assert response.status_code == 200

def test_list_complaints_filters_by_status(auth_client, complaint):
    response = auth_client.get('/api/complaints/', {'status': 'PENDING'})
    assert response.status_code == 200
    results = response.data['data']['results']  # match your paginated_response shape
    assert all(c['status'] == 'PENDING' for c in results)

def test_list_complaints_search_matches_title(auth_client, complaint):
    response = auth_client.get('/api/complaints/', {'search': 'streetlight'})
    assert len(response.data['data']['results']) == 1