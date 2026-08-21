from complaint.services.llm_classifier import detect_category

result = detect_category(
    title="No electricity since last 4 days",
    description="There is complete power cut in our ward. The transformer is damaged and no one is coming to fix it."
)

print("\nFinal Result:", result)