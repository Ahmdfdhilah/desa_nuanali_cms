import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const CreateDanaDesa = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nama: '',
        anggaran: '',
        realisasi: '',
        tipe: '',
    });

    const [formErrors, setFormErrors] = useState({
        nama: '',
        anggaran: '',
        realisasi: '',
        tipe: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors({
            ...formErrors,
            [name]: '',
        });
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            nama: '',
            anggaran: '',
            realisasi: '',
            tipe: '',
        };

        if (!formData.nama.trim()) {
            errors.nama = 'Nama harus diisi';
            valid = false;
        }
        if (!formData.anggaran.trim()) {
            errors.anggaran = 'Anggaran harus diisi';
            valid = false;
        }
        if (!formData.realisasi.trim()) {
            errors.realisasi = 'Realisasi harus diisi';
            valid = false;
        }
        if (!formData.tipe.trim()) {
            errors.tipe = 'Tipe harus diisi';
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

                await axios.post('http://localhost:3000/dana-desas', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                navigate('/admin/dana-desa');
            } catch (error) {
                console.error('Error creating data:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin membuat dana desa ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Buat Dana Desa Baru</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="nama" className="block text-lg font-medium text-gray-700 mb-2">
                            Nama
                        </label>
                        <input
                            type="text"
                            id="nama"
                            name="nama"
                            value={formData.nama}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.nama ? 'border-red-500' : ''}`}
                        />
                        {formErrors.nama && <p className="text-red-500 text-sm mt-1">{formErrors.nama}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="anggaran" className="block text-lg font-medium text-gray-700 mb-2">
                            Anggaran
                        </label>
                        <input
                            type="number"
                            id="anggaran"
                            name="anggaran"
                            value={formData.anggaran}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.anggaran ? 'border-red-500' : ''}`}
                        />
                        {formErrors.anggaran && <p className="text-red-500 text-sm mt-1">{formErrors.anggaran}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="realisasi" className="block text-lg font-medium text-gray-700 mb-2">
                            Realisasi
                        </label>
                        <input
                            type="number"
                            id="realisasi"
                            name="realisasi"
                            value={formData.realisasi}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.realisasi ? 'border-red-500' : ''}`}
                        />
                        {formErrors.realisasi && <p className="text-red-500 text-sm mt-1">{formErrors.realisasi}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tipe" className="block text-lg font-medium text-gray-700 mb-2">
                            Tipe
                        </label>
                        <select
                            id="tipe"
                            name="tipe"
                            value={formData.tipe}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.tipe ? 'border-red-500' : ''}`}
                        >
                            <option value="">Pilih Tipe</option>
                            <option value="Belanja">Belanja</option>
                            <option value="Pendapatan">Pendapatan</option>
                            <option value="Pembiayaan">Pembiayaan</option>
                        </select>
                        {formErrors.tipe && <p className="text-red-500 text-sm mt-1">{formErrors.tipe}</p>}
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

export default CreateDanaDesa;
