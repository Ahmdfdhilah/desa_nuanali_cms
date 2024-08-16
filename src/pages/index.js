import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { FaImage } from 'react-icons/fa';
import Toast from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import Loading from '../components/Loading';

const HomeCMS = () => {
    const { token } = useContext(AuthContext);
    const [baganData, setBaganData] = useState(null);
    const [newBaganImage, setNewBaganImage] = useState(null);
    const [newBaganPreview, setNewBaganPreview] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBagan = async () => {
            try {
                const response = await axios.get('https://nuniali-51afdf69a4d2.herokuapp.com/bagan', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBaganData(response.data);
            } catch (error) {
                console.error('Error fetching bagan data:', error);
            }
        };

        fetchBagan();
        setLoading(false);
    }, [token]);

    const showConfirmationModal = (title, message, action) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalAction(() => action);
        setModalShow(true);
    };

    const handleBaganCreate = () => {
        showConfirmationModal(
            'Konfirmasi Buat',
            'Apakah Anda yakin ingin membuat bagan ini?',
            async () => {
                const formData = new FormData();
                formData.append('file', newBaganImage);
                setLoading(true);
                try {
                    const response = await axios.post('https://nuniali-51afdf69a4d2.herokuapp.com/bagan', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                    });
                    setBaganData(response.data);
                    setNewBaganImage(null);
                    setNewBaganPreview(null);
                    setToast({ show: true, type: 'success', message: 'Bagan berhasil dibuat!' });
                } catch (error) {
                    console.error('Error creating bagan:', error);
                    setToast({ show: true, type: 'error', message: 'Gagal membuat bagan.' });
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    const handleBaganDelete = () => {
        showConfirmationModal(
            'Konfirmasi Hapus',
            'Apakah Anda yakin ingin menghapus bagan ini?',
            async () => {
                setLoading(true);
                try {
                    await axios.delete(`https://nuniali-51afdf69a4d2.herokuapp.com/bagan/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setBaganData(null); // Assuming you want to clear the bagan data
                    setToast({ show: true, type: 'success', message: 'Bagan berhasil dihapus!' });
                } catch (error) {
                    console.error('Error deleting bagan:', error);
                    setToast({ show: true, type: 'error', message: 'Gagal menghapus bagan.' });
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    const handleNewBaganImageChange = (e) => {
        const file = e.target.files[0];
        setNewBaganImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewBaganPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Dasbor Admin</h1>

                {/* Galeri Bagan */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Edit Bagan Struktur</h2>
                    <div className="mb-6">
                        {baganData ? (
                            <>
                                <img
                                    src={`https://nuniali-51afdf69a4d2.herokuapp.com${baganData.img}`}
                                    className="w-full h-auto object-cover rounded-lg mb-4"
                                    alt={`Bagan ${baganData.id}`}
                                />
                                <button
                                    onClick={handleBaganDelete}
                                    className="inline-flex px-6 py-3 mt-8 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer min-w-64"
                                >
                                    Hapus Bagan Struktur
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600">Tidak ada bagan yang tersedia.</p>

                                <div className="flex items-center mb-4">
                                    {newBaganPreview ? (
                                        <div className="flex items-center mb-4">
                                            <img src={newBaganPreview} alt="Preview Bagan Baru" className="w-24 h-24 object-cover rounded-lg mr-4" />
                                            <span className="text-lg">{newBaganImage?.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center mb-4">
                                            <FaImage className="text-gray-400 mr-2" size={24} />
                                            <span className="text-lg text-gray-400">Belum ada file yang dipilih</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleNewBaganImageChange}
                                        className="hidden"
                                        id="newBaganImageInput"
                                    />
                                    <label
                                        htmlFor="newBaganImageInput"
                                        className="inline-flex px-6 py-3 mt-8 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer min-w-64"
                                    >
                                        Pilih Gambar
                                    </label>
                                    {newBaganImage && (
                                        <button
                                            onClick={handleBaganCreate}
                                            className="inline-flex px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer mt-4 min-w-64"
                                        >
                                            Buat Bagan
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Modal & Toast */}
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
                <Toast
                    show={toast.show}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ show: false, type: '', message: '' })}
                />
            </div>
        </>
    );
};

export default HomeCMS;
