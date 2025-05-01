from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet,
    TechnicianViewSet,
    AppointmentViewSet,
    AppointmentPhotoViewSet
)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'technicians', TechnicianViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'photos', AppointmentPhotoViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 