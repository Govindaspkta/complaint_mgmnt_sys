from groq import Groq
import os
import json
from complaint.models import AetherixComplaints

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def detect_duplicate_with_groq(new_data, threshold_candidates=10):
    """
    new_data = {
        "title": str,
        "description": str,
        "category": category_obj,
        "province": str,
        "district": str,
        "municipality": str,
        "ward": str,
    }
    """

    # 1. First filter by same category + full location
    candidates = AetherixComplaints.objects.filter(
        is_active=True,
        is_deleted=False,
        category=new_data["category"],
        province__iexact=new_data["province"],
        district__iexact=new_data["district"],
        municipality__iexact=new_data["municipality"],
        ward__iexact=str(new_data["ward"]),
    ).order_by("-created_at")[:threshold_candidates]

    if not candidates.exists():
        return []

    # 2. Prepare candidate list for LLM
    candidate_text = ""
    for i, c in enumerate(candidates, start=1):
        candidate_text += f"""
Complaint {i}:
Reference ID: {c.reference_id}
Title: {c.title}
Description: {c.description}
"""

    prompt = f"""
You are a duplicate complaint detection system.

New Complaint:
Title: {new_data["title"]}
Description: {new_data["description"]}
Location: {new_data["province"]}, {new_data["district"]}, {new_data["municipality"]}, Ward {new_data["ward"]}

Existing complaints in the same location and category:
{candidate_text}

Task:
Find if the new complaint is a duplicate of any existing complaint.
Two complaints are duplicates only if they describe the same real-world problem.

Return ONLY valid JSON in this format:
{{
  "is_duplicate": true,
  "matched_reference_ids": ["id1", "id2"],
  "reason": "short reason"
}}

If no duplicate:
{{
  "is_duplicate": false,
  "matched_reference_ids": [],
  "reason": "no similar issue found"
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict JSON-only duplicate detector."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=200
        )

        raw = response.choices[0].message.content.strip()

        # Clean markdown if model returns ```json
        raw = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw)

        if not result.get("is_duplicate"):
            return []

        matched_ids = result.get("matched_reference_ids", [])
        duplicates = []

        for c in candidates:
            if str(c.reference_id) in matched_ids:
                duplicates.append({
                    "reference_id": str(c.reference_id),
                    "title": c.title,
                    "status": c.status,
                    "created_at": c.created_at,
                    "reason": result.get("reason", "")
                })

        return duplicates

    except Exception as e:
        print(f"Groq Duplicate Detection Error: {e}")
        return []