import factory
from authx.models import AetherixUsers
from complaint.models import AetherixComplaints, ComplaintCategory


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AetherixUsers
        django_get_or_create = ("username",)

    username = factory.Sequence(lambda n: f"testuser{n}")
    email = factory.Sequence(lambda n: f"testuser{n}@example.com")
    password = factory.PostGenerationMethodCall("set_password", "testpass123")


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ComplaintCategory
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"category_{n}")
    display_name = factory.Sequence(lambda n: f"Category {n}")
    description = factory.Faker("sentence")


class ComplaintFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AetherixComplaints

    user = factory.SubFactory(UserFactory)
    category = factory.SubFactory(CategoryFactory)
    title = factory.Sequence(lambda n: f"Complaint {n}")
    description = factory.Faker("paragraph")
    province = "Bagmati"
    district = "Kathmandu"
    municipality = "KMC"
    ward = "5"