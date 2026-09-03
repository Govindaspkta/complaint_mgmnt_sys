from groq import Groq
import os
import json
from complaint.models import AetherixComplaints

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def detect_duplicate_with_groq(new_data, threshold_candidates=20):
    print("\n===== DUPLICATE CHECK START =====")
    print("New data:", {
        "title": new_data.get("title"),
        "category": getattr(new_data.get("category"), "name", new_data.get("category")),
        "province": new_data.get("province"),
        "district": new_data.get("district"),
        "municipality": new_data.get("municipality"),
        "ward": new_data.get("ward"),
    })

    candidates = AetherixComplaints.objects.filter(
        is_active=True,
        is_deleted=False,
        category=new_data["category"],
        province__iexact=str(new_data["province"]).strip(),
        district__iexact=str(new_data["district"]).strip(),
        municipality__iexact=str(new_data["municipality"]).strip(),
        ward__iexact=str(new_data["ward"]).strip(),
    ).order_by("-created_at")[:threshold_candidates]

    print("Candidates found:", candidates.count())

    if not candidates.exists():
        print("No candidates in same location/category")
        print("===== DUPLICATE CHECK END =====\n")
        return []

    candidate_text = ""
    for i, c in enumerate(candidates, start=1):
        candidate_text += f"""
Complaint {i}:
Reference ID: {c.reference_id}
Title: {c.title}
Description: {c.description}
"""

    prompt = f"""
You are a duplicate complaint detector.

New Complaint:
Title: {new_data["title"]}
Description: {new_data["description"]}

Existing complaints in same location and category:
{candidate_text}

Two complaints are duplicates if they describe the same real-world problem.

Return ONLY JSON:
{{
  "is_duplicate": true,
  "matched_reference_ids": ["uuid-here"],
  "reason": "short reason"
}}
or
{{
  "is_duplicate": false,
  "matched_reference_ids": [],
  "reason": "different issue"
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Return strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=300,
        )

        raw = response.choices[0].message.content.strip()
        print("LLM raw response:", raw)

        raw = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw)

        if not result.get("is_duplicate"):
            print("LLM says not duplicate")
            print("===== DUPLICATE CHECK END =====\n")
            return []

        matched_ids = [str(x) for x in result.get("matched_reference_ids", [])]
        duplicates = []

        for c in candidates:
            if str(c.reference_id) in matched_ids:
                duplicates.append({
                    "reference_id": str(c.reference_id),
                    "title": c.title,
                    "status": c.status,
                    "created_at": c.created_at,
                    "reason": result.get("reason", ""),
                })

        print("Matched duplicates:", duplicates)
        print("===== DUPLICATE CHECK END =====\n")
        return duplicates

    except Exception as e:
        print("Groq Duplicate Detection Error:", str(e))
        print("===== DUPLICATE CHECK END =====\n")
        return []