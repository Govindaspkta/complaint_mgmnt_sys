from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class AetherixUsers(AbstractUser):
    ROLE_CHOICES = (
        ("USER", "User"),
        ("ADMIN", "admin")
    )
    roles = models.CharField(
        choices=ROLE_CHOICES,
        default= "User"
    )

    reference_id = models.UUIDField(
        unique=True,
        default=uuid.uuid4
    )
    mobile_number = models.CharField(
        max_length=10,
        unique=True,
        blank=True,
        null=True
    )
   
    address = models.CharField(max_length=128, null=True)
    created_at = models.DateField(auto_now_add=True)    
    updated_at = models.DateField(auto_now=True)

    class Meta:
        db_table = "aetherix_users" 