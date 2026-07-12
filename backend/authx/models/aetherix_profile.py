from django.db import models
from config.models import BaseModel

class ProfileVerificationStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved",
    REJECTED = "REJECTED", "Rejected"
    
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
    verification_status = models.CharField(
        choices=ProfileVerificationStatus.choices,
        default=ProfileVerificationStatus.PENDING
    )
    rejection_reason = models.CharField(
        max_length=255,
        blank=True
    )

    class Meta:
        db_table = "aetherix_profiles"