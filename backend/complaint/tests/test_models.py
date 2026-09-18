# import pytest
# from complaint.models import (
#     AetherixComplaints,
#     ComplaintStatusChoices,
#     ComplaintPriorityChoices,
# )
# from authx.models import AetherixUsers


# # @pytest.fixture
# # def user(db):
# #     """Creates one real user, hashed password, via Django's built-in create_user."""
# #     return AetherixUsers.objects.create_user(
# #         username="testuser",
# #         email="testuser@example.com",
# #         password="testpass123",
# #     )


# # @pytest.fixture
# # def category(db):
# #     return ComplaintCategory.objects.create(
# #         name="road_damage",
# #         display_name="Road Damage",
# #         description="Potholes, broken roads, etc.",
# #     )


# # @pytest.fixture
# # def complaint(db, user, category):
# #     """A ready-made complaint, built from the two fixtures above."""
# #     return AetherixComplaints.objects.create(
# #         user=user,
# #         category=category,
# #         title="Broken streetlight",
# #         province="Bagmati",
# #         district="Kathmandu",
# #         municipality="KMC",
# #         ward="5",
# #         description="Streetlight has been broken for weeks",
# #     )


# def test_complaint_str_returns_title(complaint):
#     assert str(complaint) == "Broken streetlight"


# def test_default_status_is_pending(complaint):
#     assert complaint.status == ComplaintStatusChoices.PENDING


# def test_default_priority_is_medium(complaint):
#     assert complaint.priority == ComplaintPriorityChoices.MEDIUM


# def test_default_priority_score_is_zero(complaint):
#     assert complaint.priority_score == 0.0


# def test_is_verified_defaults_false(complaint):
#     assert complaint.is_verified is False


# def test_upvotes_count_defaults_zero(complaint):
#     assert complaint.upvotes_count == 0


# def test_complaint_linked_to_correct_user(complaint, user):
#     assert complaint.user == user


# def test_complaint_linked_to_correct_category(complaint, category):
#     assert complaint.category == category


# def test_deleting_user_is_protected(complaint, user):
#     """user FK uses on_delete=PROTECT — deleting the user should raise, not cascade."""
#     from django.db.models import ProtectedError
#     with pytest.raises(ProtectedError):
#         user.delete()