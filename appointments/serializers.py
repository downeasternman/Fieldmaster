from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Technician, Appointment, AppointmentPhoto, Bill
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class TechnicianSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Technician
        fields = '__all__'
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        technician = Technician.objects.create(user=user, **validated_data)
        return technician

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

    def create(self, validated_data):
        print("Validated data:", validated_data)  # Debug print
        try:
            # Handle the customer and technician relationships
            customer = validated_data.pop('customer')
            technician = validated_data.pop('technician', None)
            
            # Create the appointment
            appointment = Appointment.objects.create(
                customer=customer,
                technician=technician,
                **validated_data
            )
            return appointment
        except Exception as e:
            print("Error creating appointment:", str(e))  # Debug print
            raise

    def validate(self, data):
        print("Validation data:", data)  # Debug print
        return data

    def to_internal_value(self, data):
        # Convert date and time strings to proper format
        if 'appointment_date' in data:
            try:
                date_obj = datetime.strptime(data['appointment_date'], '%Y-%m-%d')
                data['appointment_date'] = date_obj.date()
            except (ValueError, TypeError):
                pass

        if 'start_time' in data:
            try:
                time_obj = datetime.strptime(data['start_time'], '%H:%M:%S')
                data['start_time'] = time_obj.time()
            except (ValueError, TypeError):
                pass

        if 'end_time' in data:
            try:
                time_obj = datetime.strptime(data['end_time'], '%H:%M:%S')
                data['end_time'] = time_obj.time()
            except (ValueError, TypeError):
                pass

        return super().to_internal_value(data)

class BillSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True
    )
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(),
        source='appointment',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def to_internal_value(self, data):
        if 'due_date' in data:
            try:
                date_obj = datetime.strptime(data['due_date'], '%Y-%m-%d')
                data['due_date'] = date_obj.date()
            except (ValueError, TypeError):
                pass
        return super().to_internal_value(data) 