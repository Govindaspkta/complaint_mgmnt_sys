import logging
from rest_framework.permissions import BasePermission

logger = logging.getLogger("django")

class IsSuperUser(BasePermission):
    def has_permission(self, request, view ):
        try:
            user=request.user
            return bool(user and user.is_active and user.is_superuser)
        
        except Exception as exe:
            logger.error(str(exe), exc_info=True)
            return False

class isAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class isUserRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "USER"