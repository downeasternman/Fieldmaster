import factory
from django.contrib.auth import get_user_model
from appointments.models import Customer, Technician, Appointment, Bill, BillLineItem, Settings

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')

class CustomerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Customer

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    phone = factory.Sequence(lambda n: f'123456789{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.first_name.lower()}.{obj.last_name.lower()}@example.com')
    address = factory.Sequence(lambda n: f'{n} Test Street')

class TechnicianFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Technician

    user = factory.SubFactory(UserFactory)
    phone = factory.Sequence(lambda n: f'987654321{n}')
    is_available = True
    labor_rate = 85.00

class AppointmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Appointment

    customer = factory.SubFactory(CustomerFactory)
    technician = factory.SubFactory(TechnicianFactory)
    appointment_date = factory.Faker('date_this_month')
    start_time = factory.Faker('time')
    end_time = factory.Faker('time')
    description = factory.Faker('text', max_nb_chars=200)
    status = 'scheduled'
    priority = 'medium'
    notes = factory.Faker('text', max_nb_chars=200)

class BillFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Bill

    appointment = factory.SubFactory(AppointmentFactory)
    customer = factory.SelfAttribute('appointment.customer')
    type = 'bill'
    status = 'draft'
    description = factory.Faker('text', max_nb_chars=200)
    notes = factory.Faker('text', max_nb_chars=200)
    employee_name = factory.Faker('name')

class BillLineItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BillLineItem

    bill = factory.SubFactory(BillFactory)
    description = factory.Faker('sentence')
    quantity = factory.Faker('pyint', min_value=1, max_value=10)
    unit_price = factory.Faker('pydecimal', left_digits=4, right_digits=2, positive=True)
    is_labor = False
    is_taxable = True

class SettingsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Settings

    sales_tax_rate = 0.055
    theme = 'light' 