from rest_framework import serializers
from .models import NewsAnalysis


class NewsAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAnalysis
        fields = [
            'id', 'title', 'content', 'result', 'confidence',
            'fake_probability', 'real_probability', 'source_url', 'created_at'
        ]
        read_only_fields = [
            'result', 'confidence', 'fake_probability', 'real_probability', 'created_at'
        ]


class AnalyzeNewsSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    content = serializers.CharField(min_length=20, error_messages={
        'min_length': 'Please provide at least 20 characters of content.'
    })
    source_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)
