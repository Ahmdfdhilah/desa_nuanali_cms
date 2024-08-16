import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';
import RichTextEditor from '../../../components/RichTextEditor';

const UpdateLembaga = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { id } = useParams(); // Get the lembaga ID from the URL
    const modalShowRef = useRef(false);
    const modalTitleRef = useRef('');
    const modalMessageRef = useRef('');
    const modalActionRef = useRef(null);
    const loadingRef = useRef(false);

    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        image: null,
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        contact: '',
        image: '',
    });

    const bodyRef = useRef(''); // Use useRef for body content
    const bodyErrorRef = useRef(''); // Use useRef for body error message

    // Fetch the lembaga data when the component mounts
    useEffect(() => {
        const fetchLembaga = async () => {
            try {
                const response = await axios.get(`https://nuniali-51afdf69a4d2.herokuapp.com/lembagas/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const lembaga = response.data;
                setFormData({
                    name: lembaga.name,
                    contact: lembaga.contact,
                    image: null, // Leave this as null for the moment; image will be handled separately
                });
                bodyRef.current = lembaga.description; // Set initial body content
            } catch (error) {
                console.error('Error fetching lembaga data:', error);
            }
        };
        fetchLembaga();
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
            contact: '',
            image: '',
        };

        if (!formData.name.trim()) {
            errors.name = 'Nama lembaga harus diisi';
            valid = false;
        }
        if (!formData.contact.trim()) {
            errors.contact = 'Kontak lembaga harus diisi';
            valid = false;
        }
        if (!bodyRef.current.trim()) {
            bodyErrorRef.current = 'Deskripsi lembaga harus diisi'; // Set error message for body
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        modalActionRef.current = async () => {
            try {
                loadingRef.current = true;
                const formDataToSend = new FormData();
                if (formData.image) {
                    formDataToSend.append('file', formData.image);
                }
                formDataToSend.append('name', formData.name);
                formDataToSend.append('contact', formData.contact);
                formDataToSend.append('description', bodyRef.current); // Use useRef value

                await axios.put(`https://nuniali-51afdf69a4d2.herokuapp.com/lembagas/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/lembaga');
            } catch (error) {
                console.error('Error updating lembaga:', error);
                loadingRef.current = false;
            }
        };
        modalTitleRef.current = 'Konfirmasi';
        modalMessageRef.current = 'Apakah Anda yakin ingin memperbarui lembaga ini?';
        modalShowRef.current = true;
    };

    return (
        <>
            {loadingRef.current && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Update Lembaga</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Nama Lembaga
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
                        <label htmlFor="contact" className="block text-lg font-medium text-gray-700 mb-2">
                            Kontak
                        </label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.contact ? 'border-red-500' : ''}`}
                        />
                        {formErrors.contact && <p className="text-red-500 text-sm mt-1">{formErrors.contact}</p>}
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

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
            <ConfirmationModal
                show={modalShowRef.current}
                title={modalTitleRef.current}
                message={modalMessageRef.current}
                onConfirm={() => {
                    if (modalActionRef.current) {
                        modalActionRef.current();
                    }
                    modalShowRef.current = false;
                }}
                onCancel={() => (modalShowRef.current = false)}
            />
        </>
    );
};

export default UpdateLembaga;
