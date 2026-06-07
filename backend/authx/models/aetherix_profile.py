from django.db import models
from config.models import BaseModel

class AetherixProfile(BaseModel):

    user = models.OneToOneField(
        'authx.AetherixUsers',
        on_delete=models.PROTECT,
        related_name="profile"
    )
    citizenship_number = models.CharField(
        max_length=100,
        unique=True
    )
    address = models.CharField(max_length=255)

    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        null=False,
        blank=False,
    )
    citizenship_front = models.ImageField(
        upload_to="citizenship/",
        null=False,
        blank=False
    )
    citizenship_back = models.ImageField(
        upload_to="citizenship/",
        null=False,
        blank=False
    )
    is_verified = models.BooleanField(default=False)
    dob = models.DateField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "aetherix_profiles"