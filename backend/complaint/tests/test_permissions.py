import pytest
from django.urls import reverse
from complaint.tests.factories import ComplaintFactory, UserFactory


def test_owner_can_view_own_complaint(auth_client, user, complaint):
    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = auth_client.get(url)
    assert response.status_code == 200


def test_other_user_cannot_view_someone_elses_complaint(api_client, complaint):
    other_user = UserFactory()
    api_client.force_authenticate(user=other_user)

    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = api_client.get(url)
    assert response.status_code == 404  # queryset filters by user, so it's invisible, not "forbidden"


def test_unauthenticated_user_cannot_view_complaint(api_client, complaint):
    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = api_client.get(url)
    assert response.status_code == 401


def test_owner_can_update_own_complaint(auth_client, complaint):
    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = auth_client.put(url, {'title': 'Updated title'})
    assert response.status_code == 200


def test_update_resets_status_to_pending(auth_client, complaint):
    complaint.status = 'RESOLVED'
    complaint.save(update_fields=['status'])

    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = auth_client.put(url, {'title': 'Updated after resolution'})

    complaint.refresh_from_db()
    assert response.status_code == 200
    assert complaint.status == 'PENDING'


def test_other_user_cannot_update_someone_elses_complaint(api_client, complaint):
    other_user = UserFactory()
    api_client.force_authenticate(user=other_user)

    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = api_client.put(url, {'title': 'Hacked title'})
    assert response.status_code == 404


def test_owner_can_delete_own_complaint(auth_client, complaint):
    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = auth_client.delete(url)
    assert response.status_code == 200

    complaint.refresh_from_db()
    assert complaint.is_deleted is True  # soft delete, not actually removed from DB


def test_other_user_cannot_delete_someone_elses_complaint(api_client, complaint):
    other_user = UserFactory()
    api_client.force_authenticate(user=other_user)

    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = api_client.delete(url)
    assert response.status_code == 404

    complaint.refresh_from_db()
    assert complaint.is_deleted is False  # confirm it was NOT deleted


def test_unauthenticated_user_cannot_delete_complaint(api_client, complaint):
    url = reverse('complaints-detail', kwargs={'reference_id': complaint.reference_id})
    response = api_client.delete(url)
    assert response.status_code == 401