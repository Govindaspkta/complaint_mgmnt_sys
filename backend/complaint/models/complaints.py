from django.db import models
from config.models import BaseModel
from authx.models import AetherixUsers
from complaint.models import ComplaintCategory

class ComplaintCategory(BaseModel):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("reviewing","Reviewing"),
        ("in_progress","In Progress"),
        ("resolved","Resolved"),
        ("rejected","Rejected")
    )
    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium","Medium"),
        ("high", "High"),
        ("urgent", "Urgent")
    )
    user = models.ForeignKKey(
        'authx.AetherixUsers',
        on_delete = models.Protect,
        related_name = "complaints"

    )
    category = models.ForeignKey(
        'complaint.ComplaintCategory',
        on_delete=models.PROTECT,
        related_name="complaints",
    )

    title = models.CharField(
        max_length=100,
    )
    display_name = models.CharField(
        max_length=100,
    )
    province = models.CharField(
        max_lenght=150
    )
    district = models.CharField(
        max_lenght=150
    )
    municipalilty = models.CharField(
        max_lenght=150
    )
    ward = models.CharField(
        max_lenght=150
    )

    description = models.TextField()
    is_verified = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to="complaints/",
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="medium"
    )

    class Meta:
        db_table = "aetherix_complaints"

    def __str__(self):
        return self.title