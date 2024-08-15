import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';
import RichTextEditor from '../../../components/RichTextEditor';

const UpdateBerita = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from URL params
    const { token } = useContext(AuthContext);
    const modalShowRef = useRef(false);
    const modalTitleRef = useRef('');
    const modalMessageRef = useRef('');
    const modalActionRef = useRef(null);
    const loadingRef = useRef(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        date: '',
        category: '',
        excerpt: '',
        image: null,
    });

    const [formErrors, setFormErrors] = useState({
        title: '',
        author: '',
        date: '',
        category: '',
        excerpt: '',
        image: '',
    });

    const bodyRef = useRef(''); // Use useRef for body content
    const bodyErrorRef = useRef(''); // Use useRef for body error message

    useEffect(() => {
        // Fetch the existing berita data when the component mounts
        const fetchBerita = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/beritas/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const berita = response.data;
                setFormData({
                    title: berita.title,
                    author: berita.author,
                    date: berita.date,
                    category: berita.category,
                    excerpt: berita.excerpt,
                    image: null, // Image will be handled separately
                });
                bodyRef.current = berita.body; // Set the initial body content
            } catch (error) {
                console.error('Error fetching berita:', error);
            }
        };

        fetchBerita();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            image: '',
        }));
    };

    const handleEditorChange = (html) => {
        bodyRef.current = html; // Update useRef value
        bodyErrorRef.current = ''; // Clear body error when content changes
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            title: '',
            author: '',
            date: '',
            category: '',
            excerpt: '',
            image: '',
        };

        if (!formData.title.trim()) {
            errors.title = 'Judul harus diisi';
            valid = false;
        }
        if (!formData.author.trim()) {
            errors.author = 'Penulis harus diisi';
            valid = false;
        }
        if (!formData.date.trim()) {
            errors.date = 'Tanggal harus diisi';
            valid = false;
        }
        // if (!formData.category.trim()) {
        //     errors.category = 'Kategori harus diisi';
        //     valid = false;
        // }
        // if (!formData.excerpt.trim()) {
        //     errors.excerpt = 'Ringkasan harus diisi';
        //     valid = false;
        // }
        if (formData.image && !formData.image.type.startsWith('image/')) {
            errors.image = 'File harus berupa gambar';
            valid = false;
        }
        if (!bodyRef.current.trim()) {
            bodyErrorRef.current = 'Isi harus diisi'; // Set error message for body
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
        modalActionRef.current = async () => {
            try {
                loadingRef.current = true;
                const formDataToSend = new FormData();
                if (formData.image) {
                    formDataToSend.append('file', formData.image);
                }
                formDataToSend.append('title', formData.title);
                formDataToSend.append('author', formData.author);
                formDataToSend.append('date', formData.date);
                formDataToSend.append('category', formData.category);
                formDataToSend.append('excerpt', formData.excerpt);
                formDataToSend.append('body', bodyRef.current); // Use useRef value

                await axios.put(`http://localhost:3000/beritas/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                navigate('/admin/berita');
            } catch (error) {
                console.error('Error updating berita:', error);
                loadingRef.current = false;
            }
        };
        modalTitleRef.current = 'Konfirmasi';
        modalMessageRef.current = 'Apakah Anda yakin ingin memperbarui berita ini?';
        modalShowRef.current = true;
    };

    return (
        <>
            {loadingRef.current && <Loading />}
            <div className="container mx-auto py-10 mt-32">
                <h1 className="text-4xl font-bold mb-8 text-center">Update Berita</h1>
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
                        <label htmlFor="author" className="block text-lg font-medium text-gray-700 mb-2">
                            Penulis
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.author ? 'border-red-500' : ''}`}
                        />
                        {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-2">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.date ? 'border-red-500' : ''}`}
                        />
                        {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
                    </div>

                    {/* <div className="mb-6">
                        <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">
                            Kategori
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.category ? 'border-red-500' : ''}`}
                        />
                        {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="excerpt" className="block text-lg font-medium text-gray-700 mb-2">
                            Ringkasan
                        </label>
                        <input
                            type="text"
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.excerpt ? 'border-red-500' : ''}`}
                        />
                        {formErrors.excerpt && <p className="text-red-500 text-sm mt-1">{formErrors.excerpt}</p>}
                    </div> */}

                    <div className="mb-6">
                        <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-2">
                            Gambar
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.image ? 'border-red-500' : ''}`}
                        />
                        {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="body" className="block text-lg font-medium text-gray-700 mb-2">
                            Isi
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

export default UpdateBerita;