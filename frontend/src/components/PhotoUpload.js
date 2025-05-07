import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const PhotoUpload = ({ objectType, objectId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/photos/?content_type=${objectType}&object_id=${objectId}`);
      console.log('Photos response:', response.data);
      setPhotos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch photos');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  }, [objectType, objectId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('content_type', objectType);
      formData.append('object_id', objectId);

      const response = await api.post('/photos/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      });
      console.log('Upload response:', response.data);
      setPhotos([...photos, response.data]);
      setError(null);
    } catch (err) {
      setError('Failed to upload photo');
      console.error('Error uploading photo:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await api.delete(`/photos/${photoId}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setPhotos(photos.filter(photo => photo.id !== photoId));
      setError(null);
    } catch (err) {
      setError('Failed to delete photo');
      console.error('Error deleting photo:', err);
    }
  };

  if (!objectType || !objectId) {
    return <div style={{ color: 'red', fontWeight: 'bold' }}>PhotoUpload not rendered: objectType or objectId missing ({String(objectType)}, {String(objectId)})</div>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="photo-upload"
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <label htmlFor="photo-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<PhotoCamera />}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </label>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {photos.map((photo) => (
          <Box
            key={photo.id}
            sx={{
              position: 'relative',
              width: 150,
              height: 150,
              '&:hover .delete-button': {
                opacity: 1,
              },
            }}
          >
            {console.log('DEBUG: Rendering photo with src:', photo.photo)}
            <img
              src={photo.photo}
              alt="Uploaded"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
            <Button
              className="delete-button"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                opacity: 0,
                transition: 'opacity 0.2s',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
              onClick={() => handleDelete(photo.id)}
            >
              <Delete sx={{ color: 'white' }} />
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PhotoUpload; 