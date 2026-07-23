from rest_framework import serializers
import os
from complaint.models import AetherixComplaints, ComplaintCategory, ComplaintStatusChoices
from complaint.serializers import CategorySerializer

# ================= MAIN SERIALIZER (For Create & Update) =================
class ComplaintSerializer(serializers.Serializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field="reference_id"
    )
    
    category = serializers.SlugRelatedField(
        queryset=ComplaintCategory.objects.all(),
        slug_field="reference_id"
    )
    
    title = serializers.CharField(required=True)
    province = serializers.CharField(required=True)
    district = serializers.CharField(required=True)
    municipality = serializers.CharField(required=True)
    ward = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    image = serializers.ImageField(required=False)
    priority = serializers.CharField(required=True)
    
    # Use 'status' to match your model
    status = serializers.ChoiceField(
        choices=ComplaintStatusChoices.choices,
        required=False
    )
    
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    def validate_image(self, value):
        if value:
            max_size = 1 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Image size cannot exceed 1 MB.")
            
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png']:
                raise serializers.ValidationError("Only JPG, JPEG and PNG files are allowed.")
        return value

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return AetherixComplaints.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance


# ================= READ ONLY SERIALIZER (For Admin & List Views) =================
class ComplaintReadOnlySerializer(serializers.Serializer):
    reference_id = serializers.CharField(read_only=True)
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field="reference_id"
    )
    
    category = CategorySerializer(read_only=True)
    
    title = serializers.CharField(read_only=True)
    province = serializers.CharField(read_only=True)
    district = serializers.CharField(read_only=True)
    municipality = serializers.CharField(read_only=True)
    ward = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    image = serializers.ImageField(read_only=True)
    priority = serializers.CharField(read_only=True)
    
    status = serializers.CharField(read_only=True)           # ← Changed from complaint_status
    rejection_reason = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    #upvote fields

    upvotes_count = serializers.IntegerField(read_only=True)
    has_upvoted = serializers.SerializerMethodField()

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(user=request.user)
        return False