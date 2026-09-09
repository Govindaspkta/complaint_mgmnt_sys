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
    Priority Score = (Severity * 2.5) + (Upvotes * 3.0) + (Days Pending * 1.2)
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
# 3. K-MEANS CLUSTERING 
# =====================================================
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder


def find_optimal_k(features, max_k=10):
    """
    Elbow method to find optimal k for KMeans.
    Uses the 'distance from line' trick to auto-detect the knee point.
    """
    n_samples = len(features)
    max_k = min(max_k, n_samples)

    if max_k < 3:
        return max(1, n_samples)

    inertias = []
    k_values = list(range(1, max_k + 1))

    for k in k_values:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(features)
        inertias.append(km.inertia_)

    x1, y1 = k_values[0], inertias[0]
    x2, y2 = k_values[-1], inertias[-1]

    line_vec = np.array([x2 - x1, y2 - y1])
    line_len = np.linalg.norm(line_vec)
    line_unit_vec = line_vec / line_len

    distances = []
    for x, y in zip(k_values, inertias):
        point_vec = np.array([x - x1, y - y1])
        proj_len = np.dot(point_vec, line_unit_vec)
        proj_point = proj_len * line_unit_vec
        distance = np.linalg.norm(point_vec - proj_point)
        distances.append(distance)

    optimal_k = k_values[int(np.argmax(distances))]
    return optimal_k


def cluster_complaints(complaints, n_clusters=None, max_k=10):
    """
    K-Means Clustering using:
    - Province
    - District
    - Municipality
    - Ward
    - Category

    Auto-determines optimal k via elbow method if n_clusters not given.
    Then sorts complaints inside each cluster by priority_score.
    """

    complaint_list = list(complaints)

    if not complaint_list:
        return {}

    # Prepare features
    provinces = [c.province for c in complaint_list]
    districts = [c.district for c in complaint_list]
    municipalities = [c.municipality for c in complaint_list]
    wards = [str(c.ward) for c in complaint_list]
    categories = [str(c.category_id) if c.category_id else "0" for c in complaint_list]

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

    # Auto-pick k if not explicitly passed
    if n_clusters is None:
        n_clusters = find_optimal_k(features, max_k=max_k)

    if len(complaint_list) < n_clusters:
        n_clusters = max(1, len(complaint_list))

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

    for cluster_id in clusters:
        clusters[cluster_id] = sorted(
            clusters[cluster_id],
            key=lambda x: x["priority_score"],
            reverse=True
        )

    return clusters