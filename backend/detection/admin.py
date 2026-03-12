from django.contrib import admin
from .models import NewsAnalysis


@admin.register(NewsAnalysis)
class NewsAnalysisAdmin(admin.ModelAdmin):
    list_display = ['user', 'result', 'confidence', 'title_short', 'created_at']
    list_filter = ['result']
    search_fields = ['user__email', 'title', 'content']
    ordering = ['-created_at']

    def title_short(self, obj):
        return (obj.title or obj.content)[:60]
    title_short.short_description = 'Content Preview'
