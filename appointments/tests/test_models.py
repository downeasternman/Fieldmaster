import pytest
from django.core.exceptions import ValidationError
from appointments.models import Customer
from .factories import CustomerFactory

@pytest.mark.django_db
class TestCustomerModel:
    def test_create_customer(self):
        """Test creating a customer with valid data."""
        customer = CustomerFactory()
        assert customer.first_name is not None
        assert customer.last_name is not None
        assert customer.phone is not None
        assert customer.email is not None
        assert customer.address is not None

    def test_customer_str_representation(self):
        """Test the string representation of a customer."""
        customer = CustomerFactory(first_name="John", last_name="Doe")
        assert str(customer) == "John Doe"

    def test_customer_phone_validation(self):
        """Test that phone numbers can be in any format."""
        # Test various phone number formats
        valid_phones = [
            "1234567890",
            "(123) 456-7890",
            "123-456-7890",
            "+1 123-456-7890",
            "123.456.7890"
        ]
        
        for phone in valid_phones:
            customer = CustomerFactory(phone=phone)
            assert customer.phone == phone

    def test_customer_email_validation(self):
        """Test email validation."""
        # Test valid email
        customer = CustomerFactory(email="test@example.com")
        assert customer.email == "test@example.com"

        # Test invalid email
        with pytest.raises(ValidationError):
            CustomerFactory(email="invalid-email")

    def test_customer_required_fields(self):
        """Test that required fields are enforced."""
        with pytest.raises(ValidationError):
            Customer.objects.create(
                first_name="Test",
                last_name="Customer",
                # phone and email are required
            ) 