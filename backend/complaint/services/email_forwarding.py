from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

from complaint.models import AetherixComplaints


@shared_task
def forward_complaint_to_department(complaint_id):

    complaint = AetherixComplaints.objects.select_related(
        "category__department"
    ).get(id=complaint_id)

    # 1. Safety checks
    if not complaint.category:
        return False

    department = complaint.category.department

    if not department:
        return False

    if not department.email or not department.is_active:
        return False

    # 2. Avoid duplicate emails
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

        complaint.is_forwarded = True
        complaint.forwarded_at = timezone.now()
        complaint.forwarded_to = department.email

        complaint.save(
            update_fields=[
                "is_forwarded",
                "forwarded_at",
                "forwarded_to",
            ]
        )

        return True

    except Exception:
        return False