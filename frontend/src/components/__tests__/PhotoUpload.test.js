import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoUpload from '../PhotoUpload';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the API calls
jest.mock('../../services/api', () => ({
  uploadPhoto: jest.fn(),
  getPhotos: jest.fn(),
}));

describe('PhotoUpload Component', () => {
  const mockProps = {
    contentType: 'appointment',
    objectId: 1,
    onPhotoUploaded: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders upload button', () => {
    render(
      <AuthProvider>
        <PhotoUpload {...mockProps} />
      </AuthProvider>
    );
    
    expect(screen.getByText('Upload Photo')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(
      <AuthProvider>
        <PhotoUpload {...mockProps} />
      </AuthProvider>
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Photo');

    await userEvent.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  it('shows error message for invalid file type', async () => {
    render(
      <AuthProvider>
        <PhotoUpload {...mockProps} />
      </AuthProvider>
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Photo');

    await userEvent.upload(input, file);

    expect(screen.getByText('Please select an image file (JPEG, PNG, GIF)')).toBeInTheDocument();
  });

  it('shows error message for file too large', async () => {
    render(
      <AuthProvider>
        <PhotoUpload {...mockProps} />
      </AuthProvider>
    );

    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Photo');

    await userEvent.upload(input, largeFile);

    expect(screen.getByText('File size must be less than 5MB')).toBeInTheDocument();
  });

  it('calls onPhotoUploaded after successful upload', async () => {
    const { uploadPhoto } = require('../../services/api');
    uploadPhoto.mockResolvedValueOnce({ data: { id: 1, url: 'test.jpg' } });

    render(
      <AuthProvider>
        <PhotoUpload {...mockProps} />
      </AuthProvider>
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Photo');

    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(mockProps.onPhotoUploaded).toHaveBeenCalled();
    });
  });
}); 