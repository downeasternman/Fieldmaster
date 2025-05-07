import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from .factories import CustomerFactory, UserFactory

@pytest.mark.django_db
class TestCustomerAPI:
    def setup_method(self):
        """Set up test client and create test user."""
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.customer_list_url = reverse('customer-list')
        self.customer_detail_url = lambda pk: reverse('customer-detail', kwargs={'pk': pk})

    def test_list_customers(self):
        """Test listing all customers."""
        # Create some test customers
        customers = CustomerFactory.create_batch(3)
        
        # Make request to list customers
        response = self.client.get(self.customer_list_url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3

    def test_create_customer(self):
        """Test creating a new customer."""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'phone': '123-456-7890',
            'address': '123 Main St'
        }
        response = self.client.post(self.customer_list_url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['first_name'] == data['first_name']
        assert response.data['last_name'] == data['last_name']

    def test_retrieve_customer(self):
        """Test retrieving a single customer."""
        customer = CustomerFactory()
        response = self.client.get(self.customer_detail_url(customer.id))
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['first_name'] == customer.first_name
        assert response.data['last_name'] == customer.last_name

    def test_update_customer(self):
        """Test updating a customer."""
        customer = CustomerFactory()
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': customer.email,
            'phone': customer.phone,
            'address': customer.address
        }
        response = self.client.put(self.customer_detail_url(customer.id), data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['first_name'] == 'Jane'
        assert response.data['last_name'] == 'Smith'

    def test_delete_customer(self):
        """Test deleting a customer."""
        customer = CustomerFactory()
        response = self.client.delete(self.customer_detail_url(customer.id))
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Customer.objects.filter(id=customer.id).exists()

    def test_unauthorized_access(self):
        """Test unauthorized access to customer endpoints."""
        self.client.force_authenticate(user=None)
        customer = CustomerFactory()
        
        # Test list endpoint
        response = self.client.get(self.customer_list_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        # Test detail endpoint
        response = self.client.get(self.customer_detail_url(customer.id))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED 