from datetime import datetime
from django.utils import timezone
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
import numpy as np


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
# 3. K-MEANS CLUSTERING (Coming Soon)
# =====================================================
def cluster_complaints(complaints, n_clusters=5):
    """
    K-Means Clustering using:
    - Province
    - District
    - Municipality
    - Ward
    - Category

    Then sorts complaints inside each cluster by priority_score.
    """

    complaint_list = list(complaints)

    if not complaint_list:
        return {}

    if len(complaint_list) < n_clusters:
        n_clusters = max(1, len(complaint_list))

    # Prepare features
    provinces = [c.province for c in complaint_list]
    districts = [c.district for c in complaint_list]
    municipalities = [c.municipality for c in complaint_list]
    wards = [str(c.ward) for c in complaint_list]
    categories = [str(c.category_id) if c.category_id else "0" for c in complaint_list]

    # Encode categorical values
    le_province = LabelEncoder()
    le_district = LabelEncoder()
    le_municipality = LabelEncoder()
    le_ward = LabelEncoder()
    le_category = LabelEncoder()

    features = np.column_stack([
        le_province.fit_transform(provinces),
        le_district.fit_transform(districts),
        le_municipality.fit_transform(municipalities),
        le_ward.fit_transform(wards),
        le_category.fit_transform(categories)
    ])

    # Run K-Means
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(features)

    # Group by cluster
    clusters = {}
    for i, complaint in enumerate(complaint_list):
        cluster_id = int(labels[i])

        item = {
            "reference_id": str(complaint.reference_id),
            "title": complaint.title,
            "description": complaint.description,
            "province": complaint.province,
            "district": complaint.district,
            "municipality": complaint.municipality,
            "ward": complaint.ward,
            "category": complaint.category.display_name if complaint.category else None,
            "priority": complaint.priority,
            "upvotes_count": complaint.upvotes_count,
            "priority_score": complaint.priority_score or calculate_priority_score(complaint),
            "status": complaint.status,
            "created_at": complaint.created_at,
            "cluster_id": cluster_id
        }

        if cluster_id not in clusters:
            clusters[cluster_id] = []
        clusters[cluster_id].append(item)

    # Sort each cluster by priority_score (highest first)
    for cluster_id in clusters:
        clusters[cluster_id] = sorted(
            clusters[cluster_id],
            key=lambda x: x["priority_score"],
            reverse=True
        )

    return clusters








