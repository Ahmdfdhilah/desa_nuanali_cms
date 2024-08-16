import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../AuthProvider';
import Toast from '../../../components/Toast';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const PhotoGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [toBeDeletedId, setToBeDeletedId] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const { token } = useContext(AuthContext);
    const [newPhotos, setNewPhotos] = useState([]);
    const [query, setQuery] = useState({ page: 1, limit: 8 });

    useEffect(() => {
        fetchPhotos();
    }, [query]);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://nuniali-51afdf69a4d2.herokuapp.com/photos', { params: query });
            setPhotos(response.data.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
            setToast({ show: true, type: 'error', message: 'Failed to fetch photos.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`https://nuniali-51afdf69a4d2.herokuapp.com/photos/${toBeDeletedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ show: true, type: 'success', message: 'Photo deleted successfully!' });
            fetchPhotos();
        } catch (error) {
            console.error('Error deleting photo:', error);
            setToast({ show: true, type: 'error', message: 'Failed to delete photo.' });
        } finally {
            setLoading(false);
            setModalShow(false);
        }
    };

    const handleDeleteConfirmation = (id) => {
        setToBeDeletedId(id);
        setModalShow(true);
    };

    const handleCancelDelete = () => {
        setModalShow(false);
    };

    const handlePhotoUpload = (event) => {
        setNewPhotos([...newPhotos, ...event.target.files]);
    };

    const handleRemoveNewPhoto = (index) => {
        setNewPhotos(newPhotos.filter((_, i) => i !== index));
    };

    const handleUploadPhotos = async () => {
        setLoading(true);
        const formData = new FormData();
        newPhotos.forEach(photo => formData.append('files', photo));

        try {
            await axios.post('https://nuniali-51afdf69a4d2.herokuapp.com/photos', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ show: true, type: 'success', message: 'Photos uploaded successfully!' });
            fetchPhotos();
            setNewPhotos([]);
        } catch (error) {
            console.error('Error uploading photos:', error);
            setToast({ show: true, type: 'error', message: 'Failed to upload photos.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setQuery({ ...query, page: newPage });
    };

    return (
        <div className="photo-gallery py-6 px-4 sm:px-6 lg:px-8">
            {loading && <Loading />}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map(photo => (
                    <div key={photo.id} className="bg-white rounded shadow-md p-4 flex flex-col justify-between">
                        <img
                            src={`https://nuniali-51afdf69a4d2.herokuapp.com${photo.src}`}
                            alt={photo.title}
                            className="rounded mb-2 object-cover w-full h-48"
                        />
                        <button
                            onClick={() => handleDeleteConfirmation(photo.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div className="my-6 flex flex-col items-start">
                <input
                    type="file"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                />
                <label htmlFor="photo-upload" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                    Add Photos
                </label>
            </div>

            {newPhotos.length > 0 && (
                <div className="my-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Photo yang akan di Upload</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newPhotos.map((photo, index) => (
                            <div key={index} className="bg-white rounded shadow-md p-4 flex flex-col justify-between">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="New Upload"
                                    className="rounded mb-2 object-cover w-full h-48"
                                />
                                <button
                                    onClick={() => handleRemoveNewPhoto(index)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleUploadPhotos}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                    >
                        Upload Photos
                    </button>
                </div>
            )}

            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => handlePageChange(query.page - 1)}
                    disabled={query.page <= 1}
                    className={`px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 ${query.page <= 1 ? 'cursor-not-allowed' : ''}`}
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(query.page + 1)}
                    disabled={photos.length < query.limit}
                    className={`px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 ${photos.length < query.limit ? 'cursor-not-allowed' : ''}`}
                >
                    Next
                </button>
            </div>

            <ConfirmationModal
                show={modalShow}
                onConfirm={handleDelete}
                onCancel={handleCancelDelete}
                message="Are you sure you want to delete this photo?"
            />

            {toast.show && (
                <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            )}
        </div>
    );
};

export default PhotoGallery;
