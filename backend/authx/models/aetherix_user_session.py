from django.db import models
from authx.models import AetherixUsers


class UserSession(models.Model):
    user = models.ForeignKey(AetherixUsers, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)