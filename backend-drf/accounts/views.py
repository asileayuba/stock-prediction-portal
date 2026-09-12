from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ProtectedView(APIView):
    """
    A simple endpoint to verify that a JWT token is valid.
    Requires an authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {"message": f"Hello {request.user.username}, you are authenticated!"},
            status=status.HTTP_200_OK
        )


class UserProfileView(APIView):
    """
    Returns the authenticated user's profile details and their recent search history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # We fetch from api.models since SearchHistory is there
        from api.models import SearchHistory
        history = SearchHistory.objects.filter(user=user).order_by('-searched_at')
        
        history_data = [
            {
                "id": item.id,
                "ticker": item.ticker,
                "searched_at": item.searched_at.isoformat()
            }
            for item in history
        ]
        
        data = {
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined.isoformat(),
            "search_history": history_data
        }
        
        return Response(data, status=status.HTTP_200_OK)
