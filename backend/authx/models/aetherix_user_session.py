from django.db import models
from authx.models import AetherixUsers


class UserSession(models.Model):
    user = models.ForeignKey(AetherixUsers, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    is_active = models.BooleanField(default=True,   db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True,blank=True)