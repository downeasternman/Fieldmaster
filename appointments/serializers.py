from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Technician, Appointment, AppointmentPhoto, Bill, BillLineItem, Settings, UserSettings, Photo
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class CustomerSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = '__all__'
    
    def get_photos(self, obj):
        photos = Photo.objects.filter(content_type='customer', object_id=obj.id)
        return PhotoSerializer(photos, many=True, context={'request': self.context.get('request')}).data

class TechnicianSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    
    class Meta:
        model = Technician
        fields = ['id', 'user', 'username', 'password', 'first_name', 'last_name', 'email', 'phone', 'is_available', 'labor_rate', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        # Extract user data
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'email': validated_data.pop('email')
        }
        
        # Create user
        user = User.objects.create_user(**user_data)
        
        # Create technician
        technician = Technician.objects.create(user=user, **validated_data)
        return technician

    def update(self, instance, validated_data):
        # Update the technician instance
        instance.phone = validated_data.get('phone', instance.phone)
        instance.is_available = validated_data.get('is_available', instance.is_available)
        instance.labor_rate = validated_data.get('labor_rate', instance.labor_rate)
        instance.save()
        return instance

class AppointmentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentPhoto
        fields = '__all__'

class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    photo = serializers.SerializerMethodField()
    
    class Meta:
        model = Photo
        fields = ['id', 'photo', 'description', 'uploaded_at', 'uploaded_by', 'content_type', 'object_id']
        read_only_fields = ['uploaded_at', 'uploaded_by']
        extra_kwargs = {
            'photo': {'required': True},
            'content_type': {'required': True},
            'object_id': {'required': True}
        }
    
    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url'):
            url = request.build_absolute_uri(obj.photo.url) if request is not None else obj.photo.url
            print(f"DEBUG: Returning photo URL: {url}")
            return url
        print("DEBUG: No photo or photo.url for object", obj)
        return None

class AppointmentSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    technician = TechnicianSerializer(read_only=True)
    photos = serializers.SerializerMethodField()
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
    
    def get_photos(self, obj):
        photos = Photo.objects.filter(content_type='appointment', object_id=obj.id)
        return PhotoSerializer(photos, many=True, context={'request': self.context.get('request')}).data

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

class BillLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillLineItem
        fields = '__all__'
        read_only_fields = ('amount', 'created_at', 'updated_at')

class BillSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        required=False,
        allow_null=True
    )
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(),
        source='appointment',
        required=False,
        allow_null=True
    )
    line_items = BillLineItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    photos = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = [
            'id', 'customer', 'customer_id', 'appointment', 'appointment_id',
            'type', 'status', 'description', 'notes', 'due_date',
            'employee_name', 'line_items', 'total_amount', 'photos',
            'created_at', 'updated_at'
        ]
    
    def get_photos(self, obj):
        photos = Photo.objects.filter(content_type='bill', object_id=obj.id)
        return PhotoSerializer(photos, many=True, context={'request': self.context.get('request')}).data

    def to_internal_value(self, data):
        if 'due_date' in data:
            try:
                date_obj = datetime.strptime(data['due_date'], '%Y-%m-%d')
                data['due_date'] = date_obj.date()
            except (ValueError, TypeError):
                pass
        return super().to_internal_value(data)

    def create(self, validated_data):
        line_items_data = self.context.get('line_items', [])
        bill = Bill.objects.create(**validated_data)
        
        for item_data in line_items_data:
            BillLineItem.objects.create(bill=bill, **item_data)
        
        return bill

    def update(self, instance, validated_data):
        line_items_data = self.context.get('line_items', [])
        
        # Update bill fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update line items
        if line_items_data:
            # Remove existing line items
            instance.line_items.all().delete()
            # Create new line items
            for item_data in line_items_data:
                BillLineItem.objects.create(bill=instance, **item_data)
        
        return instance

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'sales_tax_rate', 'theme', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['theme', 'font'] 