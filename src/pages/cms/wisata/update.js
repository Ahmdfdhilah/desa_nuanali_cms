import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';
import RichTextEditor from '../../../components/RichTextEditor';

const UpdateWisata = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        files: [], // Handle multiple files
    });

    const [formErrors, setFormErrors] = useState({
        title: '',
        files: '',
    });

    const bodyRef = useRef(''); // Use useRef for body content
    const bodyErrorRef = useRef(''); // Use useRef for body error message

    useEffect(() => {
        const fetchWisata = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/wisata/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const wisata = response.data;
                setFormData({
                    title: wisata.title,
                    files: [], 
                });
                bodyRef.current = wisata.body; // Set initial body content
                setLoadingData(false);
            } catch (error) {
                console.error('Error fetching wisata data:', error);
                setLoadingData(false);
            }
        };

        fetchWisata();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevData => ({
            ...prevData,
            files: files,
        }));
        setFormErrors(prevErrors => ({
            ...prevErrors,
            files: '',
        }));
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...formData.files];
        updatedFiles.splice(index, 1);
        setFormData(prevData => ({
            ...prevData,
            files: updatedFiles,
        }));
    };

    const handleEditorChange = (html) => {
        bodyRef.current = html; // Update useRef value
        bodyErrorRef.current = ''; // Clear body error when content changes
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            title: '',
            files: '',
        };

        if (!formData.title.trim()) {
            errors.title = 'Judul wisata harus diisi';
            valid = false;
        }
        if (!bodyRef.current.trim()) {
            bodyErrorRef.current = 'Deskripsi wisata harus diisi'; // Set error message for body
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

        setModalAction(() => async () => {
            try {
                setLoading(true);
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('body', bodyRef.current); // Use useRef value

                formData.files.forEach(file => {
                    formDataToSend.append('files', file); // Append each file
                });

                await axios.put(`http://localhost:3000/wisata/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                navigate('/admin/wisata');
            } catch (error) {
                console.error('Error updating wisata:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin memperbarui wisata ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            {loadingData ? (
                <Loading />
            ) : (
                <div className="container mx-auto py-10 mt-32">
                    <h1 className="text-4xl font-bold mb-8 text-center">Update Wisata</h1>
                    <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md" encType="multipart/form-data">
                        {/* Title */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                                Judul Wisata
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.title ? 'border-red-500' : ''}`}
                            />
                            {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                        </div>

                        {/* Files */}
                        <div className="mb-6">
                            <label htmlFor="files" className="block text-lg font-medium text-gray-700 mb-2">
                                Gambar
                            </label>
                            <input
                                type="file"
                                id="files"
                                name="files"
                                accept="image/*"
                                onChange={handleFileChange}
                                multiple
                                className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.files ? 'border-red-500' : ''}`}
                            />
                            {formErrors.files && <p className="text-red-500 text-sm mt-1">{formErrors.files}</p>}
                        </div>

                        {/* File List */}
                        {formData.files.length > 0 && (
                            <div className="mb-6">
                                <p className="text-lg font-medium text-gray-700 mb-2">Files yang akan diunggah:</p>
                                <ul className="list-disc list-inside">
                                    {formData.files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between mt-1">
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                className="ml-2 text-sm text-red-500"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                Hapus
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
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
            )}
            <ConfirmationModal
                show={modalShow}
                title={modalTitle}
                message={modalMessage}
                onConfirm={() => {
                    if (modalAction) {
                        modalAction();
                    }
                    setModalShow(false);
                }}
                onCancel={() => setModalShow(false)}
            />
        </>
    );
};

export default UpdateWisata;
