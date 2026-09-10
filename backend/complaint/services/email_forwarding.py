from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone


def forward_complaint_to_department(complaint):
    """
    Forwards an approved complaint to the department email
    linked with the complaint's category.
    """

    # 1. Safety checks
    if not complaint.category:
        return False

    department = complaint.category.department
    if not department:
        return False

    if not department.email or not department.is_active:
        return False

    # 2. Avoid sending duplicate emails
    if complaint.is_forwarded:
        return False

    # 3. Prepare email
    subject = f"[Aetherix] New Complaint - {complaint.category.display_name}"

    message = f"""
A new complaint has been verified and assigned to your department.

Complaint ID     : {complaint.reference_id}
Title            : {complaint.title}
Category         : {complaint.category.display_name}
Department       : {department.display_name}
Location         : {complaint.municipality}, Ward {complaint.ward}, {complaint.district}

Description:
{complaint.description}

Please take necessary action.
"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[department.email],
            fail_silently=False,
        )

        # 4. Update complaint
        complaint.is_forwarded = True
        complaint.forwarded_at = timezone.now()
        complaint.forwarded_to = department.email
        complaint.save(update_fields=["is_forwarded", "forwarded_at", "forwarded_to"])

        return True

    except Exception as e:
        return False