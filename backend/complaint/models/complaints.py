from django.db import models
from config.models import BaseModel

class ComplaintStatusChoices(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        INPROGRESS = "INPROGRESS", "Inprogress"
        RESOLVEED = "RESOLVED", "Resolved"
        REJECTED = "REJECTED", "Rejected"
    
class ComplaintPriorityChoices(models.TextChoices):
        LOW = "LOW", "LOW"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        URGENT = "URGENT", "Urgent"

class AetherixComplaints(BaseModel):

    user = models.ForeignKey(
        'authx.AetherixUsers',
        on_delete = models.PROTECT,
        related_name = "complaints"
    )
    upvotes_count = models.PositiveIntegerField(default=0)

    category = models.ForeignKey(
        'complaint.ComplaintCategory',
        on_delete=models.PROTECT,
        related_name="complaints",
    )
    title = models.CharField(
        max_length=100,
    )
    province = models.CharField(
        max_length=150
    )
    district = models.CharField(
        max_length=150
    )
    municipality = models.CharField(
        max_length=150
    )
    ward = models.CharField(
        max_length=150
    )
    description = models.TextField(max_length=500)
    is_verified = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to="complaints/",
        blank=True,
        null=True
    )
    rejection_reason = models.TextField(blank=False, null=False, default="no rejection")
    status = models.CharField(
        max_length=20,
        choices=ComplaintStatusChoices.choices,
        default="PENDING"
    )
    priority = models.CharField(
        max_length=20,
        choices=ComplaintPriorityChoices.choices,
        default="MEDIUM"
    )
    priority_score = models.FloatField(
    default=0.0,
    help_text="Calculated priority score based on severity, upvotes and days pending"
    )

    is_forwarded = models.BooleanField(default=False)
    forwarded_at = models.DateTimeField(null=True, blank=True)
    forwarded_to = models.EmailField(null=True, blank=True)

    class Meta:
        db_table = "aetherix_complaints"

    def __str__(self):
        return self.title