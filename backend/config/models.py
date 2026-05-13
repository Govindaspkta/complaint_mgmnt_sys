from django.db import models
from django.conf import settings
import uuid

class BaseModel(models.Model):
    
    id = models.BigAutoField(
        primary_key=True, 
        null=False, 
        unique=True
    )
    reference_id = models.UUIDField(
        unique=True, 
        null=False, 
        default=uuid.uuid4
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        db_column="created_by",
        related_name="+",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        db_column="updated_by",
        related_name="+",
        null=True,
    )
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True, 
        help_text="Status to check if the entity is active"
    )
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(
        null=True, 
        blank=True
    )
    remarks = models.CharField(
        max_length=300, 
        blank=True, 
        null=True
    )
    class Meta:
        abstract = True



    