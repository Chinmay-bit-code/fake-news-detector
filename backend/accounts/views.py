from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model

from .serializers import UserRegistrationSerializer, UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    import traceback
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        try:
            refresh = RefreshToken.for_user(user)
            access_token  = str(refresh.access_token)
            refresh_token = str(refresh)
        except Exception as token_err:
            # Token generation failed — return success without tokens so user sees a proper error
            return Response(
                {'error': f'Account created but token error: {token_err}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'user': UserSerializer(user).data,
            'access': access_token,
            'refresh': refresh_token,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e), 'detail': traceback.format_exc()},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response(
        {'error': 'Invalid email or password.'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # Token blacklist disabled for local dev — client just deletes tokens
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response(UserSerializer(request.user).data)
