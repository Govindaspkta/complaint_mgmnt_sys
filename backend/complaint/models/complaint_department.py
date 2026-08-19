from django.db import models
from config.models import BaseModel


class Department(BaseModel):
    name = models.CharField(max_length=100, unique=True)   
    email = models.EmailField()
    is_active = models.BooleanField(default=True)
    display_name = models.CharField(
            max_length=100,
            unique=True,
            null=True
        )
    description = models.CharField(
        max_length=200,
        null=True
    )
    class Meta:
        db_table = "departments"

    def __str__(self):
        return self.name