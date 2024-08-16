import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const UpdateWilayah = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL
    const { token } = useContext(AuthContext);
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        rt: '',
        kk: '',
        male: 0,
        female: 0,
        total: 0,
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        rt: '',
        kk: '',
        male: '',
        female: '',
        total: '',
    });

    useEffect(() => {
        // Fetch existing data based on ID
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://nuniali-51afdf69a4d2.herokuapp.com/wilayahs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFormData(response.data);
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

    const validateForm = () => {
        let valid = true;
        const errors = {
            name: '',
            rt: '',
            kk: '',
            male: '',
            female: '',
            total: '',
        };

        if (!formData.name.trim()) {
            errors.name = 'Nama wilayah harus diisi';
            valid = false;
        }
        if (!formData.rt.trim()) {
            errors.rt = 'RT harus diisi';
            valid = false;
        }
        if (!formData.kk.trim()) {
            errors.kk = 'KK harus diisi';
            valid = false;
        }
        if (formData.male < 0) {
            errors.male = 'Jumlah laki-laki tidak boleh negatif';
            valid = false;
        }
        if (formData.female < 0) {
            errors.female = 'Jumlah perempuan tidak boleh negatif';
            valid = false;
        }
        if (formData.total < 0) {
            errors.total = 'Jumlah total tidak boleh negatif';
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

                await axios.put(`https://nuniali-51afdf69a4d2.herokuapp.com/wilayahs/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/wilayah');
            } catch (error) {
                console.error('Error updating data:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin memperbarui wilayah ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Update Wilayah</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Nama Wilayah
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
                        <label htmlFor="rt" className="block text-lg font-medium text-gray-700 mb-2">
                            RT
                        </label>
                        <input
                            type="number"
                            id="rt"
                            name="rt"
                            value={formData.rt}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.rt ? 'border-red-500' : ''}`}
                        />
                        {formErrors.rt && <p className="text-red-500 text-sm mt-1">{formErrors.rt}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="kk" className="block text-lg font-medium text-gray-700 mb-2">
                            KK
                        </label>
                        <input
                            type="number"
                            id="kk"
                            name="kk"
                            value={formData.kk}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.kk ? 'border-red-500' : ''}`}
                        />
                        {formErrors.kk && <p className="text-red-500 text-sm mt-1">{formErrors.kk}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="male" className="block text-lg font-medium text-gray-700 mb-2">
                            Laki-laki
                        </label>
                        <input
                            type="number"
                            id="male"
                            name="male"
                            value={formData.male}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.male ? 'border-red-500' : ''}`}
                        />
                        {formErrors.male && <p className="text-red-500 text-sm mt-1">{formErrors.male}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="female" className="block text-lg font-medium text-gray-700 mb-2">
                            Perempuan
                        </label>
                        <input
                            type="number"
                            id="female"
                            name="female"
                            value={formData.female}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.female ? 'border-red-500' : ''}`}
                        />
                        {formErrors.female && <p className="text-red-500 text-sm mt-1">{formErrors.female}</p>}
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
                message={



                    modalMessage}
                onClose={() => setModalShow(false)}
                onConfirm={modalAction}
            />
        </>
    );
};

export default UpdateWilayah;
