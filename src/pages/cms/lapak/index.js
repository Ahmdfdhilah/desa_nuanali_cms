import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Toast from '../../../components/Toast';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const LapakTable = () => {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [toBeDeletedId, setToBeDeletedId] = useState(null);
    const { token } = useContext(AuthContext);
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [query]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://nuniali-51afdf69a4d2.herokuapp.com/lapak', { params: query });
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setToast({ show: true, type: 'error', message: 'Gagal mengambil data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`https://nuniali-51afdf69a4d2.herokuapp.com/lapak/${toBeDeletedId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setToast({ show: true, type: 'success', message: 'Item berhasil dihapus!' });
            fetchData();
            setSelectedItem(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            setToast({ show: true, type: 'error', message: 'Gagal menghapus item.' });
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

    const handleRowClick = (item) => {
        setSelectedItem(item);
    };

    const handleCloseDetail = () => {
        setSelectedItem(null);
    };

    const handleCreateNew = () => {
        navigate('/admin/lapak/create');
    };

    const handleEdit = (id) => {
        navigate(`/admin/lapak/update/${id}`);
    };

    const handleSearchChange = (event) => {
        setQuery({ ...query, search: event.target.value });
    };

    const handleSortChange = (event) => {
        setQuery({ ...query, sort: event.target.value });
    };

    const handleOrderChange = (event) => {
        setQuery({ ...query, order: event.target.value });
    };

    const handlePageChange = (newPage) => {
        setQuery({ ...query, page: newPage });
    };

    const getNumber = (index) => {
        return (query.page - 1) * query.limit + index + 1;
    };

    return (
        <>
            {loading && <Loading />}
            <div className="overflow-x-auto my-32 px-6">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Lapak</h2>
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none"
                    >
                        Buat Baru
                    </button>
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={query.search || ''}
                        onChange={handleSearchChange}
                        className="px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <select
                        value={query.sort || ''}
                        onChange={handleSortChange}
                        className="px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Urutkan Berdasarkan...</option>
                        <option value="name">Nama</option>
                        <option value="createdAt">Dibuat Pada</option>
                    </select>
                    <select
                        value={query.order || ''}
                        onChange={handleOrderChange}
                        className="px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Urutan...</option>
                        <option value="ASC">ASC</option>
                        <option value="DESC">DESC</option>
                    </select>
                </div>
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Gambar</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nama</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Kontak</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Dibuat Pada</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {data.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <tr
                                    className={`hover:bg-gray-100 border-b border-gray-200 py-4 cursor-pointer ${selectedItem && selectedItem.id === item.id ? 'bg-gray-200' : ''}`}
                                    onClick={() => handleRowClick(item)}
                                >
                                    <td className='py-3 px-4'>{getNumber(index)}</td>
                                    <td className="py-3 px-4">
                                        {item.image ? (
                                            <img
                                                src={`https://nuniali-51afdf69a4d2.herokuapp.com${item.image}`}
                                                alt={item.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{item.name}</td>
                                    <td className="py-3 px-4">{item.phone}</td>
                                    <td className="py-3 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleDeleteConfirmation(item.id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 focus:outline-none"
                                        >
                                            Hapus
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="bg-yellow-500 text-white px-4 py-1 ml-2 rounded hover:bg-yellow-600 focus:outline-none"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                                {selectedItem && selectedItem.id === item.id && (
                                    <tr className="bg-gray-200">
                                        <td colSpan="7" className="py-4 px-6">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">Detail</h3>
                                                    <p><span className="font-semibold">Nama:</span> {item.name}</p>
                                                    <p><span className="font-semibold">Kontak:</span> {item.phone}</p>
                                                    <p><span className="font-semibold">Dibuat Pada:</span> {new Date(item.createdAt).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={handleCloseDetail}
                                                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                                >
                                                    Tutup
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => handlePageChange(query.page - 1)}
                        disabled={query.page <= 1}
                        className={`px-3 py-1 bg-gray-300 text-gray-600 rounded mr-2 hover:bg-gray-400 ${query.page <= 1 ? 'cursor-not-allowed' : ''}`}
                    >
                        Sebelumnya
                    </button>
                    <button
                        onClick={() => handlePageChange(query.page + 1)}
                        disabled={data.length < query.limit}
                        className={`px-3 py-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 ${data.length < query.limit ? 'cursor-not-allowed' : ''}`}
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
            <ConfirmationModal
                show={modalShow}
                title="Hapus Lapak"
                message="Apakah Anda yakin ingin menghapus lapak ini?"
                onConfirm={() => handleDelete(toBeDeletedId)}
                onCancel={handleCancelDelete}
            />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ show: false, type: '', message: '' })}
            />
        </>
    );
};

export default LapakTable;