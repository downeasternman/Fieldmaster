from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'technicians', views.TechnicianViewSet)
router.register(r'appointments', views.AppointmentViewSet)
router.register(r'bills', views.BillViewSet)
router.register(r'photos', views.PhotoViewSet)
router.register(r'settings', views.SettingsView)
router.register(r'user-settings', views.UserSettingsView)

urlpatterns = [
    path('', include(router.urls)),
] 