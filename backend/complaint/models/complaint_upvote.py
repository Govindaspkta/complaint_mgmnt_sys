from django.db import models
from config.models import BaseModel
from django.conf import settings

class ComplaintUpvote(BaseModel):

    complaint = models.ForeignKey(
        'complaint.AetherixComplaints',
        on_delete=models.CASCADE,
        related_name='upvotes'
    )
    user = models.ForeignKey(
        'authx.AetherixUsers',
        on_delete = models.PROTECT,
        related_name = "upvoted_complaints"
    )

    class Meta:
        unique_together =('complaint', 'user')
        verbose_name = "Complaint Upvote"
        verbose_name_plural = "Complaint Upvotes"

    def __str__(self):
        return f"{self.user.username} upvoted {self.complaint.title[:50]}"