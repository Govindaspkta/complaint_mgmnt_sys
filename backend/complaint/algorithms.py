from datetime import datetime
from django.utils import timezone


# =====================================================
# 1. PRIORITY SCORING ALGORITHM (Basic)
# =====================================================
def calculate_priority_score(complaint):
    """
    Priority Scoring Algorithm
    
    Formula:
    Priority Score = (Severity × 2.5) + (Upvotes × 3.0) + (Days Pending × 1.2)
    """

    # Severity mapping
    severity_map = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'urgent': 4
    }

    severity = severity_map.get(str(complaint.priority).lower(), 2)
    upvotes = complaint.upvotes_count or 0

    # Calculate days pending
    created = complaint.created_at
    if timezone.is_aware(created):
        days_pending = (timezone.now() - created).days
    else:
        days_pending = (datetime.now() - created).days

    days_pending = max(days_pending, 0)

    # Final Score
    priority_score = (
        (severity * 2.5) +
        (upvotes * 3.0) +
        (days_pending * 1.2)
    )

    return round(priority_score, 2)


# =====================================================
# 2. AI DUPLICATE DETECTION (Coming Soon)
# =====================================================
def detect_duplicate_complaint(title, description, existing_complaints):
    """
    Will be implemented later using AI Embeddings
    """
    pass


# =====================================================
# 3. K-MEANS CLUSTERING (Coming Soon)
# =====================================================
def cluster_complaints(complaints, n_clusters=8):
    """
    Will be implemented later using K-Means
    """
    pass