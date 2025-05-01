from rest_framework import serializers
from .models import Customer, Technician, Appointment, AppointmentPhoto

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class TechnicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technician
        fields = '__all__'

class AppointmentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentPhoto
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    technician = TechnicianSerializer(read_only=True)
    photos = AppointmentPhotoSerializer(many=True, read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True
    )
    technician_id = serializers.PrimaryKeyRelatedField(
        queryset=Technician.objects.all(),
        source='technician',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at') 