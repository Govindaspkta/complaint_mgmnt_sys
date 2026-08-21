from groq import Groq
import os
from complaint.models import ComplaintCategory

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def detect_category(title: str, description: str):
    print("\n" + "="*60)
    print("🔍 Starting Category Detection")
    print("="*60)
    print(f"Title       : {title}")
    print(f"Description : {description[:100]}...")

    categories = ComplaintCategory.objects.filter(
        is_active=True, is_deleted=False
    ).select_related("department")

    if not categories.exists():
        print("❌ No active categories found in database")
        return None

    print(f"\n📋 Found {categories.count()} active categories:")
    for cat in categories:
        print(f"   - {cat.name} | {cat.display_name}")

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

    print("\n📤 Sending request to Groq...")

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You only return the category name."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=30
        )

        predicted = response.choices[0].message.content.strip().lower()
        print(f"\n🤖 LLM Raw Response: '{predicted}'")

        # Exact match
        for cat in categories:
            if cat.name.lower() == predicted:
                print(f"✅ Exact match found → {cat.name}")
                return cat

        # Soft match
        for cat in categories:
            if predicted in cat.name.lower() or cat.name.lower() in predicted:
                print(f"✅ Soft match found → {cat.name}")
                return cat

        print("❌ No matching category found")
        return None

    except Exception as e:
        print(f"💥 Groq LLM Error: {e}")
        return None