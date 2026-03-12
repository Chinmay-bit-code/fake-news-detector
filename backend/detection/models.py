from django.db import models
from django.conf import settings


class NewsAnalysis(models.Model):
    RESULT_CHOICES = [
        ('FAKE', 'Fake News'),
        ('REAL', 'Real News'),
        ('UNCERTAIN', 'Uncertain'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='analyses'
    )
    title = models.CharField(max_length=500, blank=True)
    content = models.TextField()
    result = models.CharField(max_length=20, choices=RESULT_CHOICES)
    confidence = models.FloatField()
    fake_probability = models.FloatField(default=0)
    real_probability = models.FloatField(default=0)
    source_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.result}] {self.title[:50] or self.content[:50]} — {self.user.email}"
