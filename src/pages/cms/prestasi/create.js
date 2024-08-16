import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const CreatePrestasi = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        file: null,
    });

    const [formErrors, setFormErrors] = useState({
        title: '',
        file: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors({
            ...formErrors,
            [name]: '',
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0],
        });
        setFormErrors({
            ...formErrors,
            file: '',
        });
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            title: '',
            file: '',
        };

        if (!formData.title.trim()) {
            errors.title = 'Judul harus diisi';
            valid = false;
        }
        if (!formData.file) {
            errors.file = 'Foto harus diunggah';
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
                formDataToSend.append('file', formData.file);
                formDataToSend.append('title', formData.title);

                await axios.post('https://nuniali-51afdf69a4d2.herokuapp.com/prestasi', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/prestasi');
            } catch (error) {
                console.error('Error creating data:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin membuat prestasi ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Buat Prestasi Baru</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                            Judul
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

                    <div className="mb-6">
                        <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                            Foto
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.file ? 'border-red-500' : ''}`}
                        />
                        {formErrors.file && <p className="text-red-500 text-sm mt-1">{formErrors.file}</p>}
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

export default CreatePrestasi;