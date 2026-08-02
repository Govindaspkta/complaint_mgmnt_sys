from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid



class RoleChoices(models.TextChoices):
    USER ="USER", "User",
    ADMIN = "ADMIN", "Admin"

class AetherixUsers(AbstractUser):
   
    roles = models.CharField(
        choices=RoleChoices.choices,
        default= "User",
        max_length=10
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