import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { FaImage } from 'react-icons/fa';
import Toast from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import Loading from '../components/Loading';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const HomeCMS = () => {
    const { token } = useContext(AuthContext);
    const [bannerData, setBannerData] = useState([]);
    const [newBannerImage, setNewBannerImage] = useState(null);
    const [newBannerPreview, setNewBannerPreview] = useState(null);
    const [baganData, setBaganData] = useState(null);
    const [newBaganImage, setNewBaganImage] = useState(null);
    const [newBaganPreview, setNewBaganPreview] = useState(null);
    const [newBannerText, setNewBannerText] = useState('');
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
        const fetchBanners = async () => {
            try {
                const response = await axios.get('https://nuniali-51afdf69a4d2.herokuapp.com/banners/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBannerData(response.data);
            } catch (error) {
                console.error('Error fetching banner data:', error);
            }
        };
        fetchBanners();
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

    const handleBannerCreate = () => {
        setModalTitle('Konfirmasi Buat');
        setModalMessage('Apakah Anda yakin ingin membuat banner ini?');
        setModalAction(() => async () => {
            const formData = new FormData();
            formData.append('file', newBannerImage);
            formData.append('text', newBannerText); // Tambahkan ini

            setLoading(true);
            try {
                const response = await axios.post(`https://nuniali-51afdf69a4d2.herokuapp.com/banners`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });
                setBannerData([...bannerData, response.data]);
                setNewBannerImage(null);
                setNewBannerPreview(null);
                setNewBannerText(''); // Reset teks setelah berhasil
                setToast({ show: true, type: 'success', message: 'Banner berhasil dibuat!' });
            } catch (error) {
                console.error('Error creating banner:', error);
                setToast({ show: true, type: 'error', message: 'Gagal membuat banner.' });
            }
            finally {
                setLoading(false);
            }
        });
        setModalShow(true);
    };

    const handleBannerDelete = (bannerId) => {
        setModalTitle('Konfirmasi Hapus');
        setModalMessage('Apakah Anda yakin ingin menghapus banner ini?');
        setModalAction(() => async () => {
            setLoading(true);
            try {
                await axios.delete(`https://nuniali-51afdf69a4d2.herokuapp.com/banners/${bannerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBannerData(bannerData.filter((banner) => banner.id !== bannerId));
                setToast({ show: true, type: 'success', message: 'Banner berhasil dihapus!' });
            } catch (error) {
                console.error('Error deleting banner:', error);
                setToast({ show: true, type: 'error', message: 'Gagal menghapus banner.' });
            }
            finally {
                setLoading(false);
            }
        });
        setModalShow(true);
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
    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(bannerData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setBannerData(items);
        setLoading(true);
        try {
            await axios.put('https://nuniali-51afdf69a4d2.herokuapp.com/banners/reorder', { banners: items }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ show: true, type: 'success', message: 'Urutan banner berhasil diubah!' });
        } catch (error) {
            console.error('Error reordering banners:', error);
            setToast({ show: true, type: 'error', message: 'Gagal mengubah urutan banner.' });
        } finally {
            setLoading(false);
        }
    };

    const handleNewBannerImageChange = (e) => {
        const file = e.target.files[0];
        setNewBannerImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

                <div className='bg-white shadow-md rounded-lg p-6'>
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Kelola Banner Halaman Utama</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="mt-8">
                                {newBannerPreview ? (
                                    <div className="flex items-center mb-4">
                                        <img src={newBannerPreview} alt="Prabawan Banner Baru" className="w-24 h-24 object-cover rounded-lg mr-4" />
                                        <span className="text-lg">{newBannerImage?.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center mb-4">
                                        <FaImage className="text-gray-400 mr-2" size={24} />
                                        <span className="text-lg text-gray-400">Belum ada file yang dipilih</span>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <label htmlFor="bannerText" className="block text-lg font-medium text-gray-700">
                                        Teks Banner
                                    </label>
                                    <input
                                        type="text"
                                        id="bannerText"
                                        value={newBannerText}
                                        onChange={(e) => setNewBannerText(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Masukkan teks banner"
                                    />
                                </div>

                                <input
                                    type="file"
                                    onChange={handleNewBannerImageChange}
                                    className="hidden"
                                    id="newBannerImageInput"
                                />
                                <label
                                    htmlFor="newBannerImageInput"
                                    className="inline-flex px-6 py-3 mt-8 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer min-w-64 justify-center"
                                >
                                    Pilih Banner
                                </label>

                                {newBannerImage && (
                                    <button
                                        onClick={handleBannerCreate}
                                        className="inline-flex px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer mt-4 min-w-64 justify-center"
                                    >
                                        Buat Banner
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-medium mb-4">Seret dan Jatuhkan untuk Mengubah Urutan</h3>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="banners">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {bannerData.map((banner, index) => (
                                                <Draggable key={banner.id} draggableId={banner.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            className="bg-gray-100 rounded-lg shadow-md p-3 mt-3 flex items-center justify-between"
                                                        >
                                                            <p className="text-gray-700">{banner.text}</p>
                                                            <img
                                                                src={`https://nuniali-51afdf69a4d2.herokuapp.com${banner.img}`}
                                                                className="w-24 h-16 rounded-lg mr-4"
                                                            />
                                                            <button
                                                                onClick={() => handleBannerDelete(banner.id)}
                                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
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
