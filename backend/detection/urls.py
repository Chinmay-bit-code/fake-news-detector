from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.analyze_news, name='analyze_news'),
    path('history/', views.get_history, name='get_history'),
    path('history/<int:pk>/', views.delete_analysis, name='delete_analysis'),
    path('stats/', views.get_stats, name='get_stats'),
]
