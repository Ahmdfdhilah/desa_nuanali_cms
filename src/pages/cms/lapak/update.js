import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';
import RichTextEditor from '../../../components/RichTextEditor';

const UpdateLapak = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [showModal, setShowModal] = useState(false); // Added state for modal visibility
    const modalTitleRef = useRef('');
    const modalMessageRef = useRef('');
    const modalActionRef = useRef(null);
    const loadingRef = useRef(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: null,
        phone: '',
        seller: '',
        location: '',
        contactPerson: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        price: '',
        image: '',
        phone: '',
        seller: '',
        location: '',
        contactPerson: '',
    });

    const bodyRef = useRef(''); // Use useRef for body content
    const bodyErrorRef = useRef(''); // Use useRef for body error message

    useEffect(() => {
        const fetchLapakData = async () => {
            try {
                const response = await axios.get(`https://nuniali-51afdf69a4d2.herokuapp.com/lapak/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const lapakData = response.data;

                setFormData({
                    name: lapakData.name,
                    price: lapakData.price,
                    image: null, // Handle image separately if needed
                    phone: lapakData.phone,
                    seller: lapakData.seller,
                    location: lapakData.location,
                    contactPerson: lapakData.contactPerson,
                });
                bodyRef.current = lapakData.description; // Set initial description

            } catch (error) {
                console.error('Error fetching lapak data:', error);
            }
        };

        fetchLapakData();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            image: '',
        }));
    };

    const handleEditorChange = (html) => {
        bodyRef.current = html; // Update useRef value
        bodyErrorRef.current = ''; // Clear body error when content changes
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            name: '',
            price: '',
            image: '',
            phone: '',
            seller: '',
            location: '',
            contactPerson: '',
        };

        if (!formData.name.trim()) {
            errors.name = 'Nama harus diisi';
            valid = false;
        }
        if (!formData.price.trim()) {
            errors.price = 'Harga harus diisi';
            valid = false;
        }
        if (!bodyRef.current.trim()) {
            bodyErrorRef.current = 'Deskripsi harus diisi'; // Set error message for body
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("okeeee");
        
        if (!validateForm()) {
            return;
        }
        modalActionRef.current = async () => {
            try {
                loadingRef.current = true;
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('price', formData.price);
                if (formData.image) {
                    formDataToSend.append('file', formData.image);
                }
                formDataToSend.append('phone', formData.phone);
                formDataToSend.append('seller', formData.seller);
                formDataToSend.append('location', formData.location);
                formDataToSend.append('contactPerson', formData.contactPerson);
                formDataToSend.append('description', bodyRef.current); 

                await axios.put(`https://nuniali-51afdf69a4d2.herokuapp.com/lapak/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/lapak');
            } catch (error) {
                console.error('Error updating lapak:', error);
                loadingRef.current = false;
            }
        };

        modalTitleRef.current = 'Konfirmasi';
        modalMessageRef.current = 'Apakah Anda yakin ingin memperbarui lapak ini?';
        setShowModal(true); 
    };

    return (
        <>
            {loadingRef.current && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Update Lapak</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    {/* Form Fields */}
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Nama
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.name ? 'border-red-500' : ''}`}
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2">
                            Harga
                        </label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.price ? 'border-red-500' : ''}`}
                        />
                        {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-2">
                            Gambar
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.image ? 'border-red-500' : ''}`}
                        />
                        {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <RichTextEditor
                            value={bodyRef.current}
                            onChange={handleEditorChange}
                        />
                        {bodyErrorRef.current && <p className="text-red-500 text-sm mt-1">{bodyErrorRef.current}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                            Telepon
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.phone ? 'border-red-500' : ''}`}
                        />
                        {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="seller" className="block text-lg font-medium text-gray-700 mb-2">
                            Penjual
                        </label>
                        <input
                            type="text"
                            id="seller"
                            name="seller"
                            value={formData.seller}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.seller ? 'border-red-500' : ''}`}
                        />
                        {formErrors.seller && <p className="text-red-500 text-sm mt-1">{formErrors.seller}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.location ? 'border-red-500' : ''}`}
                        />
                        {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="contactPerson" className="block text-lg font-medium text-gray-700 mb-2">
                            Kontak Person
                        </label>
                        <input
                            type="text"
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.contactPerson ? 'border-red-500' : ''}`}
                        />
                        {formErrors.contactPerson && <p className="text-red-500 text-sm mt-1">{formErrors.contactPerson}</p>}
                    </div>

                    <div className="mt-6">
                        <button onClick={onSubmit}
                            type="button"
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
            {showModal && (
                <ConfirmationModal
                    show={showModal}
                    title={modalTitleRef.current}
                    message={modalMessageRef.current}
                    onConfirm={() => {
                        if (modalActionRef.current) {
                            modalActionRef.current();
                        }
                        setShowModal(false); // Hide the modal
                    }}
                    onCancel={() => setShowModal(false)} // Hide the modal
                />
            )}
        </>
    );
};

export default UpdateLapak;
