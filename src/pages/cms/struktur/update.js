import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const UpdateStruktur = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Mendapatkan ID dari URL
    const { token } = useContext(AuthContext);
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        alamat: '',
        jabatan: '',
        file: null,
        currentFile: '' // Menyimpan URL file yang sudah ada
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        alamat: '',
        jabatan: '',
        file: '',
    });

    useEffect(() => {
        // Mengambil data yang ada berdasarkan ID
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/strukturs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFormData({
                    name: response.data.name,
                    alamat: response.data.alamat,
                    jabatan: response.data.jabatan,
                    currentFile: response.data.foto // Menyimpan URL foto
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

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
            name: '',
            alamat: '',
            jabatan: '',
            file: '',
        };

        if (!formData.name.trim()) {
            errors.name = 'Nama harus diisi';
            valid = false;
        }
        if (!formData.alamat.trim()) {
            errors.alamat = 'Alamat harus diisi';
            valid = false;
        }
        if (!formData.jabatan.trim()) {
            errors.jabatan = 'Jabatan harus diisi';
            valid = false;
        }
        if (!formData.file && !formData.currentFile) {
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
                if (formData.file) {
                    formDataToSend.append('file', formData.file);
                }
                formDataToSend.append('name', formData.name);
                formDataToSend.append('alamat', formData.alamat);
                formDataToSend.append('jabatan', formData.jabatan);

                await axios.put(`http://localhost:3000/strukturs/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/struktur');
            } catch (error) {
                console.error('Error updating data:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin memperbarui struktur ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Update Struktur</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
                        <label htmlFor="alamat" className="block text-lg font-medium text-gray-700 mb-2">
                            Alamat
                        </label>
                        <input
                            type="text"
                            id="alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.alamat ? 'border-red-500' : ''}`}
                        />
                        {formErrors.alamat && <p className="text-red-500 text-sm mt-1">{formErrors.alamat}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="jabatan" className="block text-lg font-medium text-gray-700 mb-2">
                            Jabatan
                        </label>
                        <input
                            type="text"
                            id="jabatan"
                            name="jabatan"
                            value={formData.jabatan}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.jabatan ? 'border-red-500' : ''}`}
                        />
                        {formErrors.jabatan && <p className="text-red-500 text-sm mt-1">{formErrors.jabatan}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                            Foto
                        </label>
                        {formData.currentFile && (
                            <img src={`http://localhost:3000${formData.currentFile}`} alt="Current" className="mb-4 max-w-xs rounded-full" width={100} />
                        )}
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

export default UpdateStruktur;
