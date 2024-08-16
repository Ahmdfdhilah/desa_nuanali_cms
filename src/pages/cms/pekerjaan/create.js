import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const CreatePekerjaan = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const options = [
        "Belum/ Tidak Bekerja",
        "Mengurus Rumah Tangga",
        "Pelajar/ Mahasiswa",
        "Pensiunan",
        "Pegawai Negeri Sipil",
        "Tentara Nasional Indonesia",
        "Kepolisian RI",
        "Perdagangan",
        "Petani/ Pekebun",
        "Peternak",
        "Nelayan/ Perikanan",
        "Industri",
        "Konstruksi",
        "Transportasi",
        "Karyawan Swasta",
        "Karyawan BUMN",
        "Karyawan BUMD",
        "Karyawan Honorer",
        "Buruh Harian Lepas",
        "Buruh Tani/ Perkebunan",
        "Buruh Nelayan/ Perikanan",
        "Buruh Peternakan",
        "Pembantu Rumah Tangga",
        "Tukang Cukur",
        "Tukang Listrik",
        "Tukang Batu",
        "Tukang Kayu",
        "Tukang Sol Sepatu",
        "Tukang Las/ Pandai Besi",
        "Tukang Jahit",
        "Tukang Gigi",
        "Penata Rias",
        "Penata Busana",
        "Penata Rambut",
        "Mekanik",
        "Seniman",
        "Tabib",
        "Paraji",
        "Perancang Busana",
        "Penerjemah",
        "Imam Masjid",
        "Pendeta",
        "Pastor",
        "Wartawan",
        "Ustadz/ Mubaligh",
        "Juru Masak",
        "Promotor Acara",
        "Anggota DPR-RI",
        "Anggota DPD",
        "Anggota BPK",
        "Presiden",
        "Wakil Presiden",
        "Anggota Mahkamah Konstitusi",
        "Anggota Kabinet/ Kementerian",
        "Duta Besar",
        "Gubernur",
        "Wakil Gubernur",
        "Bupati",
        "Wakil Bupati",
        "Walikota",
        "Wakil Walikota",
        "Anggota DPRD Provinsi",
        "Anggota DPRD Kabupaten/ Kota",
        "Dosen",
        "Guru",
        "Pilot",
        "Pengacara",
        "Notaris",
        "Arsitek",
        "Akuntan",
        "Konsultan",
        "Dokter",
        "Bidan",
        "Perawat",
        "Apoteker",
        "Psikiater/ Psikolog",
        "Penyiar Televisi",
        "Penyiar Radio",
        "Pelaut",
        "Peneliti",
        "Sopir",
        "Pialang",
        "Paranormal",
        "Pedagang",
        "Perangkat Desa",
        "Kepala Desa",
        "Biarawati",
        "Wiraswasta"
    ];

    const [formData, setFormData] = useState({
        name: '',
        total: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        total: ''
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
            name: '',
            total: ''
        };

        if (!formData.name.trim()) {
            errors.name = 'Nama pekerjaan harus dipilih';
            valid = false;
        }

        if (!formData.total.trim() || isNaN(formData.total)) {
            errors.total = 'Total harus diisi dan berupa angka';
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

                await axios.post('https://nuniali-51afdf69a4d2.herokuapp.com/pekerjaans', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                navigate('/admin/pekerjaan');
            } catch (error) {
                console.error('Error creating pekerjaan:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin membuat pekerjaan ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Buat Pekerjaan Baru</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Nama Pekerjaan
                        </label>
                        <select
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.name ? 'border-red-500' : ''}`}
                        >
                            <option value="">Pilih nama pekerjaan</option>
                            {options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="total" className="block text-lg font-medium text-gray-700 mb-2">
                            Total
                        </label>
                        <input
                            type="number"
                            id="total"
                            name="total"
                            value={formData.total}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.total ? 'border-red-500' : ''}`}
                        />
                        {formErrors.total && <p className="text-red-500 text-sm mt-1">{formErrors.total}</p>}
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

export default CreatePekerjaan;