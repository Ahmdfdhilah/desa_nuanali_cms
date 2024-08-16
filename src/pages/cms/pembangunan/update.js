import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';
import RichTextEditor from '../../../components/RichTextEditor';

const UpdatePembangunan = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { id } = useParams(); // Get the pembangunan ID from the URL
    const modalShowRef = useRef(false);
    const modalTitleRef = useRef('');
    const modalMessageRef = useRef('');
    const modalActionRef = useRef(null);
    const loadingRef = useRef(false);

    const [formData, setFormData] = useState({
        judul: '',
        files: [],
        lokasi: '',
        anggaran: '',
        tahun: '',
        progres: ''
    });

    const [formErrors, setFormErrors] = useState({
        judul: '',
        files: '',
        lokasi: '',
        anggaran: '',
        tahun: '',
        progres: ''
    });

    const bodyRef = useRef(''); // Use useRef for body content
    const bodyErrorRef = useRef(''); // Use useRef for body error message

    // Fetch the pembangunan data when the component mounts
    useEffect(() => {
        const fetchPembangunan = async () => {
            try {
                const response = await axios.get(`https://nuniali-51afdf69a4d2.herokuapp.com/pembangunan/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const pembangunan = response.data;
                setFormData({
                    judul: pembangunan.judul,
                    files: [], 
                    lokasi: pembangunan.lokasi,
                    anggaran: pembangunan.anggaran,
                    tahun: pembangunan.tahun,
                    progres: pembangunan.progres
                });
                bodyRef.current = pembangunan.deskripsi; // Set initial body content
            } catch (error) {
                console.error('Error fetching pembangunan data:', error);
            }
        };
        fetchPembangunan();
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

    const handleEditorChange = (html) => {
        bodyRef.current = html; // Update useRef value
        bodyErrorRef.current = ''; // Clear body error when content changes
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            judul: '',
            foto: '',
            lokasi: '',
            anggaran: '',
            tahun: '',
            progres: ''
        };

        if (!formData.judul.trim()) {
            errors.judul = 'Judul pembangunan harus diisi';
            valid = false;
        }
        
        if (!bodyRef.current.trim()) {
            bodyErrorRef.current = 'Deskripsi pembangunan harus diisi'; // Set error message for body
            valid = false;
        }
        if (!formData.lokasi.trim()) {
            errors.lokasi = 'Lokasi harus diisi';
            valid = false;
        }
        if (isNaN(formData.anggaran)) {
            errors.anggaran = 'Anggaran harus diisi dan berupa angka';
            valid = false;
        }
        if (isNaN(formData.tahun)) {
            errors.tahun = 'Tahun harus diisi dan berupa angka';
            valid = false;
        }
        if (isNaN(formData.progres)) {
            errors.progres = 'Progres harus diisi dan berupa angka';
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
        console.log("ok");
        
        modalActionRef.current = async () => {
            try {
                loadingRef.current = true;
                const formDataToSend = new FormData();
                console.log(formData);
                
                formData.files.forEach((file) => {
                    formDataToSend.append('files', file); 
                });
                formDataToSend.append('judul', formData.judul);
                formDataToSend.append('deskripsi', bodyRef.current); // Use useRef value
                formDataToSend.append('lokasi', formData.lokasi);
                formDataToSend.append('anggaran', formData.anggaran);
                formDataToSend.append('tahun', formData.tahun);
                formDataToSend.append('progres', formData.progres);

                await axios.put(`https://nuniali-51afdf69a4d2.herokuapp.com/pembangunan/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/pembangunan');
            } catch (error) {
                console.error('Error updating pembangunan:', error);
                loadingRef.current = false;
            }
        };
        modalTitleRef.current = 'Konfirmasi';
        modalMessageRef.current = 'Apakah Anda yakin ingin memperbarui pembangunan ini?';
        modalShowRef.current = true;
    };

    return (
        <>
            {loadingRef.current && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Update Pembangunan</h1>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-6">
                        <label htmlFor="judul" className="block text-lg font-medium text-gray-700 mb-2">
                            Judul Pembangunan
                        </label>
                        <input
                            type="text"
                            id="judul"
                            name="judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.judul ? 'border-red-500' : ''}`}
                        />
                        {formErrors.judul && <p className="text-red-500 text-sm mt-1">{formErrors.judul}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="foto" className="block text-lg font-medium text-gray-700 mb-2">
                            Gambar
                        </label>
                        <input
                            type="file"
                            id="foto"
                            name="foto"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.files ? 'border-red-500' : ''}`}
                        />
                        {formErrors.files && <p className="text-red-500 text-sm mt-1">{formErrors.files}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="lokasi" className="block text-lg font-medium text-gray-700 mb-2">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            id="lokasi"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.lokasi ? 'border-red-500' : ''}`}
                        />
                        {formErrors.lokasi && <p className="text-red-500 text-sm mt-1">{formErrors.lokasi}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="anggaran" className="block text-lg font-medium text-gray-700 mb-2">
                            Anggaran
                        </label>
                        <input
                            type="text"
                            id="anggaran"
                            name="anggaran"
                            value={formData.anggaran}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.anggaran ? 'border-red-500' : ''}`}
                        />
                        {formErrors.anggaran && <p className="text-red-500 text-sm mt-1">{formErrors.anggaran}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tahun" className="block text-lg font-medium text-gray-700 mb-2">
                            Tahun
                        </label>
                        <input
                            type="text"
                            id="tahun"
                            name="tahun"
                            value={formData.tahun}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.tahun ? 'border-red-500' : ''}`}
                        />
                        {formErrors.tahun && <p className="text-red-500 text-sm mt-1">{formErrors.tahun}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="progres" className="block text-lg font-medium text-gray-700 mb-2">
                            Progres
                        </label>
                        <input
                            type="text"
                            id="progres"
                            name="progres"
                            value={formData.progres}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.progres ? 'border-red-500' : ''}`}
                        />
                        {formErrors.progres && <p className="text-red-500 text-sm mt-1">{formErrors.progres}</p>}
                    </div>

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
            <ConfirmationModal
                show={modalShowRef.current}
                title={modalTitleRef.current}
                message={modalMessageRef.current}
                onConfirm={() => {
                    if (modalActionRef.current) {
                        modalActionRef.current();
                    }
                    modalShowRef.current = false;
                }}
                onCancel={() => (modalShowRef.current = false)}
            />
        </>
    );
};

export default UpdatePembangunan;
