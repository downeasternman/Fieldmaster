import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Image, Spinner } from 'react-bootstrap';
import axios from 'axios';

const PhotoUpload = ({ objectType, objectId, onPhotoAdded }) => {
  const [show, setShow] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      fetchPhotos();
    }
  }, [show, objectId]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/photos/by_object/?content_type=${objectType}&object_id=${objectId}`);
      setPhotos(response.data);
    } catch (err) {
      setError('Failed to fetch photos');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        setSelectedFile(null);
      } else if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setError('');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('content_type', objectType);
      formData.append('object_id', objectId);
      formData.append('description', description);

      await axios.post('/api/photos/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDescription('');
      setSelectedFile(null);
      setError('');
      fetchPhotos();
      if (onPhotoAdded) {
        onPhotoAdded();
      }
    } catch (err) {
      setError('Failed to upload photo');
      console.error('Error uploading photo:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await axios.delete(`/api/photos/${photoId}/`);
        fetchPhotos();
      } catch (err) {
        setError('Failed to delete photo');
        console.error('Error deleting photo:', err);
      }
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={() => setShow(true)}>
        Photos
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Upload New Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter photo description"
              />
            </Form.Group>
            {error && <div className="text-danger mb-3">{error}</div>}
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </Form>

          <hr />

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="row">
              {photos.map((photo) => (
                <div key={photo.id} className="col-md-4 mb-3">
                  <div className="card">
                    <Image
                      src={photo.photo}
                      alt={photo.description || 'Photo'}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <p className="card-text">{photo.description}</p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(photo.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-12 text-center">
                  <p>No photos uploaded yet</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PhotoUpload; 