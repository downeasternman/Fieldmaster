import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CustomerDetail from '../CustomerDetail';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the API calls
jest.mock('../../services/api', () => ({
  getCustomer: jest.fn(),
  getPhotos: jest.fn(),
  updateCustomer: jest.fn(),
}));

describe('CustomerDetail Page', () => {
  const mockCustomer = {
    id: 1,
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john@example.com',
    address: '123 Test St',
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders customer details', async () => {
    const { getCustomer } = require('../../services/api');
    getCustomer.mockResolvedValueOnce({ data: mockCustomer });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/customers/1']}>
          <Routes>
            <Route path="/customers/:id" element={<CustomerDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Wait for the customer data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check if all customer details are displayed
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/customers/1']}>
          <Routes>
            <Route path="/customers/:id" element={<CustomerDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when customer fetch fails', async () => {
    const { getCustomer } = require('../../services/api');
    getCustomer.mockRejectedValueOnce(new Error('Failed to fetch customer'));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/customers/1']}>
          <Routes>
            <Route path="/customers/:id" element={<CustomerDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading customer')).toBeInTheDocument();
    });
  });

  it('handles customer update', async () => {
    const { getCustomer, updateCustomer } = require('../../services/api');
    getCustomer.mockResolvedValueOnce({ data: mockCustomer });
    updateCustomer.mockResolvedValueOnce({ data: { ...mockCustomer, name: 'Updated Name' } });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/customers/1']}>
          <Routes>
            <Route path="/customers/:id" element={<CustomerDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Wait for the customer data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('Edit');
    editButton.click();

    // Update customer name
    const nameInput = screen.getByLabelText('Name');
    nameInput.value = 'Updated Name';

    // Save changes
    const saveButton = screen.getByText('Save');
    saveButton.click();

    // Verify update was called
    await waitFor(() => {
      expect(updateCustomer).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });
}); 