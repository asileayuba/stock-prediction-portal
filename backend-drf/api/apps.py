import os
import sys
from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Preload the ML model into memory on server start to avoid a 15-second delay 
        # on the very first prediction request.
        # We skip this if Django is running a management command like migrate or makemigrations.
        if 'runserver' in sys.argv or 'gunicorn' in sys.modules:
            try:
                logger.info("Pre-loading Keras model in the background...")
                from api.services.prediction_service import _get_model
                import threading
                threading.Thread(target=_get_model, daemon=True).start()
            except Exception as e:
                logger.error(f"Failed to preload model: {e}")
