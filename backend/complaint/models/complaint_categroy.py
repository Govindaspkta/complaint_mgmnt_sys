from django.db import models
from config.models import BaseModel

class ComplaintCategory(BaseModel):

    name = models.CharField(
        max_length=100,
        unique=True
    )
    display_name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField()

    class Meta:
        db_table = "complaint_categories"

    def __str__(self):
        return self.name