from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import NewsAnalysis
from .serializers import NewsAnalysisSerializer, AnalyzeNewsSerializer
from .ml.model import detector


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_news(request):
    serializer = AnalyzeNewsSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    text = f"{data.get('title', '')} {data['content']}".strip()

    prediction = detector.predict(text)

    source_url = data.get('source_url') or None
    analysis = NewsAnalysis.objects.create(
        user=request.user,
        title=data.get('title', ''),
        content=data['content'],
        result=prediction['label'],
        confidence=prediction['confidence'],
        fake_probability=prediction['fake_probability'],
        real_probability=prediction['real_probability'],
        source_url=source_url,
    )

    label = prediction['label']
    confidence = prediction['confidence']

    if label == 'FAKE':
        message = f"⚠️ This article is likely FAKE NEWS ({confidence:.1f}% confidence). Be cautious!"
    elif label == 'REAL':
        message = f"✅ This article appears to be REAL NEWS ({confidence:.1f}% confidence)."
    else:
        message = f"🤔 The authenticity of this article is UNCERTAIN ({confidence:.1f}% confidence). Verify from multiple sources."

    return Response({
        'id': analysis.id,
        'result': label,
        'confidence': confidence,
        'fake_probability': prediction['fake_probability'],
        'real_probability': prediction['real_probability'],
        'message': message,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    analyses = NewsAnalysis.objects.filter(user=request.user)
    page = paginator.paginate_queryset(analyses, request)
    serializer = NewsAnalysisSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_analysis(request, pk):
    try:
        analysis = NewsAnalysis.objects.get(pk=pk, user=request.user)
        analysis.delete()
        return Response({'message': 'Analysis deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except NewsAnalysis.DoesNotExist:
        return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    analyses = NewsAnalysis.objects.filter(user=request.user)
    total = analyses.count()
    fake_count = analyses.filter(result='FAKE').count()
    real_count = analyses.filter(result='REAL').count()
    uncertain_count = analyses.filter(result='UNCERTAIN').count()

    return Response({
        'total': total,
        'fake': fake_count,
        'real': real_count,
        'uncertain': uncertain_count,
        'fake_percentage': round((fake_count / total * 100) if total > 0 else 0, 1),
        'real_percentage': round((real_count / total * 100) if total > 0 else 0, 1),
    })
