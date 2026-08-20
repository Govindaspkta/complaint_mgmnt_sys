from groq import Groq

import os
from complaint.models import ComplaintCategory

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def detect_category(title: str, description: str):
    categories = ComplaintCategory.objects.filter(
        is_active=True, is_deleted=False
    ).select_related("department")

    if not categories.exists():
        return None

    category_list = "\n".join(
        [f"- {cat.name} | {cat.display_name}" for cat in categories]
    )

    prompt = f"""
You are a precise complaint classification system.

Available categories:
{category_list}

Complaint Title: {title}
Complaint Description: {description}

Return ONLY the exact system "name" of the most suitable category.
Do not explain. Do not add any extra text.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",   # or "llama-3.1-8b-instant"
            messages=[
                {"role": "system", "content": "You only return the category name."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=30
        )

        predicted = response.choices[0].message.content.strip().lower()

        for cat in categories:
            if cat.name.lower() == predicted:
                return cat

        for cat in categories:
            if predicted in cat.name.lower() or cat.name.lower() in predicted:
                return cat

        return None

    except Exception as e:
        print("Groq LLM Error:", e)
        return None