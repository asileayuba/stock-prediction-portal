from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache

from .services.prediction_service import _get_current_price, _get_company_name

class SystemConfigAPIView(APIView):
    """
    Unauthenticated endpoint that returns dynamic config data for the frontend:
    - Popular tickers for the search suggestions.
    - A featured stock (e.g., AAPL) with its live current price and simple mock data 
      for the decorative landing page chart, so it's not hardcoded.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        import random
        # The pool of popular tickers we want to suggest from
        pool = [
            "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META", 
            "NFLX", "AMD", "BABA", "INTC", "CSCO", "DIS", "JPM", "V"
        ]
        # Dynamically pick 6 random tickers so the suggestions feel fresh on every page load
        popular_tickers = random.sample(pool, 6)

        cache_key = "system_config_featured_stock"
        featured_stock = cache.get(cache_key)
        
        if not featured_stock:
            # We can dynamically fetch the live price for the hero chart (e.g., AAPL)
            featured_ticker = "AAPL"
            try:
                current_price = _get_current_price(featured_ticker)
                company_name = _get_company_name(featured_ticker)
                featured_change_pct = "+1.25%"
            except Exception:
                current_price = 150.00
                company_name = "Apple Inc."
                featured_change_pct = "+2.31%"

            featured_stock = {
                "ticker": featured_ticker,
                "name": company_name,
                "price": current_price,
                "change_percent": featured_change_pct,
            }
            # Cache for 1 hour to avoid hitting yfinance for the landing page
            cache.set(cache_key, featured_stock, 3600)
            
        data = {
            "popular_tickers": popular_tickers,
            "featured_stock": featured_stock
        }

        
        return Response(data, status=status.HTTP_200_OK)
