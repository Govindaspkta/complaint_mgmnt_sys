from django.db import models
from config.models import BaseModel
from authx.models import AetherixUsers

class ComplaintCategory(BaseModel):
    user = models.ForeignKKey(
        'authx.AetherixUsers',
        on_delete = models.Protect,
        related_name = "complaints"

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

    class Meta:
        db_table = "aetherix_complaints"

    def __str__(self):
        return self.title