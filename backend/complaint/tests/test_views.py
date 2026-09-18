import pytest
from complaint.tests.factories import ComplaintFactory


from rest_framework.test import APIClient


def test_list_complaints_returns_200(auth_client, complaint):
    response = auth_client.get('/complaints/')  
    assert response.status_code == 200

def test_list_complaints_filters_by_status(auth_client, complaint):
    response = auth_client.get('/complaints/', {'status': 'PENDING'})
    assert response.status_code == 200
    results = response.data['data']['results']  
    assert all(c['status'] == 'PENDING' for c in results)

def test_list_complaints_search_matches_title(auth_client, complaint):
    response = auth_client.get('/complaints/', {'search': 'streetlight'})
    assert len(response.data['data']['results']) == 1

def test_pagination_returns_correct_count(auth_client, user, category):
    ComplaintFactory.create_batch(15, user=user, category=category)  # 15 complaints at once

    response = auth_client.get('/complaints/')
    assert response.status_code == 200
    assert response.data['data']['count'] == 15
    assert len(response.data['data']['results']) == 10  # page_size=10 from BasePagination