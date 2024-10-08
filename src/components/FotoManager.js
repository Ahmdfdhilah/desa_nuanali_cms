import React, { useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import ConfirmationModal from './ConfirmationModal';

const FotoManager = ({ id, gambarUrls, onUpdate, name }) => {
    const { token } = React.useContext(AuthContext);
    const [modalShow, setModalShow] = useState(false);
    const [toBeDeletedUrl, setToBeDeletedUrl] = useState(null);

    const handleDeleteConfirmation = (url) => {
        setToBeDeletedUrl(url);
        setModalShow(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://nuniali-51afdf69a4d2.herokuapp.com/${name}/${id}/foto`, {
                params: { fotoUrl: toBeDeletedUrl },
                headers: { Authorization: `Bearer ${token}` }
            });
            onUpdate(); 
            setModalShow(false);
        } catch (error) {
            console.error('Error deleting gambar:', error);
        }
    };

    const handleCancelDelete = () => {
        setModalShow(false);
    };

    return (
        <div>
            <div className="flex flex-wrap">
                {gambarUrls.map((url, index) => (
                    <div key={index} className="relative inline-block m-2">
                        <img
                            src={`https://nuniali-51afdf69a4d2.herokuapp.com${url}`}
                            alt={`gambar-${index}`}
                            className="h-24 w-24 rounded-full object-cover cursor-pointer"
                            onClick={() => handleDeleteConfirmation(url)}
                        />
                        <button
                            onClick={() => handleDeleteConfirmation(url)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            <ConfirmationModal
                show={modalShow}
                title="Hapus Gambar"
                message="Apakah Anda yakin ingin menghapus gambar ini?"
                onConfirm={handleDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default FotoManager;
