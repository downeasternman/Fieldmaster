from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'technicians', views.TechnicianViewSet)
router.register(r'appointments', views.AppointmentViewSet)
router.register(r'bills', views.BillViewSet)
router.register(r'settings', views.SettingsViewSet)
router.register(r'user-settings', views.UserSettingsViewSet)
router.register(r'photos', views.PhotoViewSet)
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', obtain_auth_token, name='api_token_auth'),
    path('auth/user/', views.UserViewSet.as_view({'get': 'current'}), name='api_user_current'),
] 