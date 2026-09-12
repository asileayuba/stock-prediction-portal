from django.urls import path
from accounts import views as UserViews
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import StockPredictionAPIView, SearchHistoryDetailAPIView
from .config_views import SystemConfigAPIView


urlpatterns = [
    path('register/', UserViews.RegisterView.as_view()),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('protected-view/', UserViews.ProtectedView.as_view()),
    path('profile/', UserViews.UserProfileView.as_view(), name='user_profile'),
    
    # Prediction API
    path('predict/', StockPredictionAPIView.as_view(), name='stock_prediction'),
    path('config/', SystemConfigAPIView.as_view(), name='system_config'),
    path('history/<int:pk>/', SearchHistoryDetailAPIView.as_view(), name='history-detail'),

]
