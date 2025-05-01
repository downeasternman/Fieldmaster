from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Customer, Technician, Appointment, AppointmentPhoto
from .serializers import (
    CustomerSerializer,
    TechnicianSerializer,
    AppointmentSerializer,
    AppointmentPhotoSerializer
)

# Create your views here.

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class TechnicianViewSet(viewsets.ModelViewSet):
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer
    permission_classes = [IsAuthenticated]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        appointment = self.get_object()
        serializer = AppointmentPhotoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(appointment=appointment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = Appointment.objects.all()
        status = self.request.query_params.get('status', None)
        technician = self.request.query_params.get('technician', None)
        date = self.request.query_params.get('date', None)

        if status:
            queryset = queryset.filter(status=status)
        if technician:
            queryset = queryset.filter(technician_id=technician)
        if date:
            queryset = queryset.filter(appointment_date=date)

        return queryset

class AppointmentPhotoViewSet(viewsets.ModelViewSet):
    queryset = AppointmentPhoto.objects.all()
    serializer_class = AppointmentPhotoSerializer
    permission_classes = [IsAuthenticated]
