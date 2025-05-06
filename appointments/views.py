from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Customer, Technician, Appointment, AppointmentPhoto, Bill, BillLineItem
from .serializers import (
    CustomerSerializer,
    TechnicianSerializer,
    AppointmentSerializer,
    AppointmentPhotoSerializer,
    BillSerializer,
    BillLineItemSerializer
)

# Create your views here.

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.AllowAny]

class TechnicianViewSet(viewsets.ModelViewSet):
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer
    permission_classes = [permissions.AllowAny]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.AllowAny]

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
        customer = self.request.query_params.get('customer', None)
        technician = self.request.query_params.get('technician', None)
        status = self.request.query_params.get('status', None)
        
        if customer:
            queryset = queryset.filter(customer_id=customer)
        if technician:
            queryset = queryset.filter(technician_id=technician)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

class AppointmentPhotoViewSet(viewsets.ModelViewSet):
    queryset = AppointmentPhoto.objects.all()
    serializer_class = AppointmentPhotoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = AppointmentPhoto.objects.all()
        appointment = self.request.query_params.get('appointment', None)
        if appointment:
            queryset = queryset.filter(appointment_id=appointment)
        return queryset

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Bill.objects.all()
        customer = self.request.query_params.get('customer', None)
        appointment = self.request.query_params.get('appointment', None)
        bill_type = self.request.query_params.get('type', None)
        status = self.request.query_params.get('status', None)
        
        if customer:
            queryset = queryset.filter(customer_id=customer)
        if appointment:
            queryset = queryset.filter(appointment_id=appointment)
        if bill_type:
            queryset = queryset.filter(type=bill_type)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

    def create(self, request, *args, **kwargs):
        line_items_data = request.data.pop('line_items', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Add line items to context
        serializer.context['line_items'] = line_items_data
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        line_items_data = request.data.pop('line_items', [])
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Add line items to context
        serializer.context['line_items'] = line_items_data
        
        self.perform_update(serializer)
        return Response(serializer.data)

class BillLineItemViewSet(viewsets.ModelViewSet):
    queryset = BillLineItem.objects.all()
    serializer_class = BillLineItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BillLineItem.objects.all()
        bill = self.request.query_params.get('bill', None)
        if bill:
            queryset = queryset.filter(bill_id=bill)
        return queryset
