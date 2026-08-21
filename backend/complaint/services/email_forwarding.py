from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone


def forward_complaint_to_department(complaint):
    """
    Sends the approved complaint to the linked department email.
    """
    if not complaint.category or not complaint.category.department:
        print("❌ No category or department linked")
        return False

    department = complaint.category.department

    if not department.email or not department.is_active:
        print("❌ Department has no email or is inactive")
        return False

    subject = f"[Aetherix] New Complaint - {complaint.category.display_name}"

    message = f"""
A new complaint has been verified and assigned to your department.

Complaint ID     : {complaint.reference_id}
Title            : {complaint.title}
Category         : {complaint.category.display_name}
Department       : {department.display_name}

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
        complaint.save(update_fields=["is_forwarded", "forwarded_at", "forwarded_to"])

        print(f"✅ Email successfully sent to {department.email}")
        return True

    except Exception as e:
        print(f"💥 Email sending failed: {e}")
        return False