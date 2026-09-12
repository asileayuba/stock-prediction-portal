import re
from rest_framework import serializers


class StockPredictionSerializer(serializers.Serializer):
    ticker = serializers.CharField(
        max_length=10,
        min_length=1,
        trim_whitespace=True,
    )

    def validate_ticker(self, value: str) -> str:
        value = value.strip().upper()
        # Allow letters, dots, hyphens (e.g. BRK.A, BRK-B)
        if not re.match(r"^[A-Z][A-Z0-9.\-]{0,9}$", value):
            raise serializers.ValidationError(
                "Invalid ticker format. Use standard stock symbols like AAPL, BRK.B, or TSLA."
            )
        return value