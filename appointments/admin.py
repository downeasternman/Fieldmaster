from django.contrib import admin
from .models import Customer, Technician, Appointment, AppointmentPhoto

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    list_filter = ('created_at',)

@admin.register(Technician)
class TechnicianAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'is_available')
    search_fields = ('user__first_name', 'user__last_name', 'phone')
    list_filter = ('is_available',)

class AppointmentPhotoInline(admin.TabularInline):
    model = AppointmentPhoto
    extra = 1

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('customer', 'technician', 'appointment_date', 'start_time', 'status', 'priority')
    list_filter = ('status', 'priority', 'appointment_date')
    search_fields = ('customer__first_name', 'customer__last_name', 'technician__user__first_name')
    inlines = [AppointmentPhotoInline]

@admin.register(AppointmentPhoto)
class AppointmentPhotoAdmin(admin.ModelAdmin):
    list_display = ('appointment', 'uploaded_at')
    list_filter = ('uploaded_at',)
