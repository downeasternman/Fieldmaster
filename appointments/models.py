from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator

class Settings(models.Model):
    sales_tax_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4,
        default=0.055,
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    theme = models.CharField(
        max_length=10,
        choices=[('light', 'Light'), ('dark', 'Dark')],
        default='light'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Settings"

    def __str__(self):
        return f"Settings (Last updated: {self.updated_at})"

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone = models.CharField(validators=[phone_regex], max_length=17)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Technician(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    is_available = models.BooleanField(default=True)
    labor_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=85.00,
        validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('emergency', 'Emergency'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True)
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment #{self.id} [{self.description}]"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            # Create a bill template when a new appointment is created
            Bill.objects.create(
                customer=self.customer,
                appointment=self,
                type='bill',
                status='draft',
                description=self.description,
                notes=self.notes
            )
        else:
            # Update existing bill if it exists
            try:
                bill = Bill.objects.get(appointment=self)
                bill.description = self.description
                bill.notes = self.notes
                bill.save()
            except Bill.DoesNotExist:
                pass

class AppointmentPhoto(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='appointment_photos/')
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.appointment}"

class Bill(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=20, choices=[('bill', 'Bill'), ('estimate', 'Estimate')])
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('sent', 'Sent'),
            ('paid', 'Paid'),
            ('overdue', 'Overdue'),
            ('cancelled', 'Cancelled'),
        ],
        default='draft'
    )
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    employee_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type.title()} #{self.id}"

    @property
    def total_amount(self):
        return sum(item.amount for item in self.line_items.all())

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            # Add default labor line item
            BillLineItem.objects.create(
                bill=self,
                description="Labor",
                quantity=0,
                unit_price=0,
                is_labor=True,
                is_taxable=False
            )

class BillLineItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='line_items')
    description = models.CharField(max_length=200)
    part_number = models.CharField(max_length=50, blank=True)
    employee_number = models.CharField(max_length=50, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    is_labor = models.BooleanField(default=False)
    is_taxable = models.BooleanField(default=True)
    technician = models.ForeignKey('Technician', on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def amount(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.description} - ${self.amount}"

FONT_CHOICES = [
    ('Roboto', 'Roboto'),
    ('Arial', 'Arial'),
    ('Lato', 'Lato'),
    ('Open Sans', 'Open Sans'),
    ('Montserrat', 'Montserrat'),
    ('Source Sans Pro', 'Source Sans Pro'),
    ('Nunito', 'Nunito'),
    ('Raleway', 'Raleway'),
    ('Ubuntu', 'Ubuntu'),
    ('Merriweather', 'Merriweather'),
    ('Inter', 'Inter'),
    ('Georgia', 'Georgia'),
]

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    theme = models.CharField(max_length=10, choices=[('light', 'Light'), ('dark', 'Dark')], default='light')
    font = models.CharField(max_length=32, choices=FONT_CHOICES, default='Roboto')

    def __str__(self):
        return f"Settings for {self.user.username}"

class Photo(models.Model):
    PHOTO_TYPES = [
        ('customer', 'Customer'),
        ('appointment', 'Appointment'),
        ('bill', 'Bill'),
    ]

    photo = models.ImageField(upload_to='photos/')
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # Generic foreign key fields
    content_type = models.CharField(max_length=20, choices=PHOTO_TYPES)
    object_id = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.content_type.title()} Photo #{self.id}"

    class Meta:
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
