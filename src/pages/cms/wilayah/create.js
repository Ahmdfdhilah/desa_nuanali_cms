import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';

const CreateWilayah = () => {
    const navigate = useNavigate();
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
        male: '',
        female: '',
        total: 0,
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        rt: '',
        kk: '',
        male: '',
        female: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = { ...prevData, [name]: value };

            // Automatically update the total
            if (name === 'male' || name === 'female') {
                const male = parseInt(newData.male || 0, 10);
                const female = parseInt(newData.female || 0, 10);
                newData.total = male + female;
            }

            return newData;
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
        };

        if (!formData.name.trim()) {
            errors.name = 'Nama harus diisi';
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
        if (!formData.male.trim()) {
            errors.male = 'Jumlah laki-laki harus diisi';
            valid = false;
        }
        if (!formData.female.trim()) {
            errors.female = 'Jumlah perempuan harus diisi';
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

                await axios.post('https://nuniali-51afdf69a4d2.herokuapp.com/wilayahs', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/wilayah');
            } catch (error) {
                console.error('Error creating data:', error);
                setLoading(false);
            }
        });
        setModalTitle('Konfirmasi');
        setModalMessage('Apakah Anda yakin ingin membuat wilayah ini?');
        setModalShow(true);
    };

    return (
        <>
            {loading && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Buat Wilayah Baru</h1>
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

export default CreateWilayah;