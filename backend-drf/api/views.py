from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle

from .serializers import StockPredictionSerializer
from .services.prediction_service import run_prediction

import logging

logger = logging.getLogger(__name__)


class PredictionThrottle(UserRateThrottle):
    """Allow max 10 predictions per user per minute (computationally expensive)."""
    rate = "10/min"


class StockPredictionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [PredictionThrottle]

    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": {"code": "VALIDATION_ERROR", "message": serializer.errors}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ticker = serializer.validated_data["ticker"]

        try:
            result = run_prediction(ticker)
            
            # Log the search history
            from .models import SearchHistory
            SearchHistory.objects.create(user=request.user, ticker=ticker, prediction_data=result)
            
            # Eviction policy: Keep only the 10 most recent searches per user
            user_searches = SearchHistory.objects.filter(user=request.user).order_by('-searched_at')
            if user_searches.count() > 10:
                # Get the IDs of the 10 most recent to keep
                ids_to_keep = list(user_searches.values_list('id', flat=True)[:10])
                # Delete the rest
                SearchHistory.objects.filter(user=request.user).exclude(id__in=ids_to_keep).delete()

            return Response(result, status=status.HTTP_200_OK)

        except ValueError as exc:
            logger.warning("Prediction validation error for '%s': %s", ticker, exc)
            return Response(
                {
                    "error": {
                        "code": "INVALID_SYMBOL",
                        "message": str(exc) or "We couldn't find market data for this stock. Please check the ticker symbol and try again.",
                    }
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except FileNotFoundError as exc:
            logger.error("ML model not found: %s", exc)
            return Response(
                {
                    "error": {
                        "code": "MODEL_UNAVAILABLE",
                        "message": "The prediction model is temporarily unavailable. Please try again later.",
                    }
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except Exception as exc:
            logger.exception("Unexpected prediction error for '%s': %s", ticker, exc)
            return Response(
                {
                    "error": {
                        "code": "PREDICTION_FAILED",
                        "message": "We couldn't generate a prediction right now. Please try again.",
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class SearchHistoryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        from .models import SearchHistory
        
        try:
            history = SearchHistory.objects.get(pk=pk, user=request.user)
        except SearchHistory.DoesNotExist:
            return Response(
                {"error": "This prediction snapshot could not be found or has expired."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not history.prediction_data:
            return Response(
                {"error": "This history item does not have snapshot data. Please run a new prediction."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        return Response(history.prediction_data, status=status.HTTP_200_OK)
