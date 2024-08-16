import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../AuthProvider';
import Toast from '../../../components/Toast';
import Loading from '../../../components/Loading';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const { token } = useContext(AuthContext);
  const [newVideoLink, setNewVideoLink] = useState('');
  const [isVertical, setIsVertical] = useState(false);
  const [query, setQuery] = useState({ page: 1, limit: 8 });

  useEffect(() => {
    fetchVideos();
  }, [query]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/videos', { params: query });
      setVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setToast({ show: true, type: 'error', message: 'Gagal memuat video.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/videos/${toBeDeletedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ show: true, type: 'success', message: 'Video berhasil dihapus!' });
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      setToast({ show: true, type: 'error', message: 'Gagal menghapus video.' });
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

  const handleVideoUpload = async () => {
    if (!newVideoLink) {
      setToast({ show: true, type: 'error', message: 'Harap masukkan tautan YouTube.' });
      return;
    }

    const embedLink = convertToEmbedLink(newVideoLink);

    if (!embedLink) {
      setToast({ show: true, type: 'error', message: 'Tautan YouTube tidak valid.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/videos', { link: embedLink, isVertical }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ show: true, type: 'success', message: 'Video berhasil ditambahkan!' });
      fetchVideos();
      setNewVideoLink('');
      setIsVertical(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      setToast({ show: true, type: 'error', message: 'Gagal menambahkan video.' });
    } finally {
      setLoading(false);
    }
  };

  const convertToEmbedLink = (link) => {
    try {
      const url = new URL(link);
      if (url.hostname === 'www.youtube.com' && url.pathname === '/watch') {
        const videoId = url.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.hostname === 'youtu.be') {
        const videoId = url.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.hostname === 'www.youtube.com' && url.pathname === '/embed') {
        return link;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setQuery({ ...query, page: newPage });
    }
  };

  return (
    <div className="video-gallery my-4 px-4 sm:px-6 lg:px-8">
      {loading && <Loading />}

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Galeri Video</h2>
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
          <input
            type="text"
            value={newVideoLink}
            onChange={(e) => setNewVideoLink(e.target.value)}
            placeholder="Masukkan tautan video YouTube"
            className="border border-gray-300 px-3 py-2 rounded-l w-full sm:w-64 mb-2 sm:mb-0 sm:mr-2"
          />
          <div className="flex items-center mb-2 sm:mb-0 sm:mr-2">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-gray-600">
                {isVertical ? <FaCheckSquare /> : <FaSquare />}
              </span>
              <input
                type="checkbox"
                checked={isVertical}
                onChange={(e) => setIsVertical(e.target.checked)}
                className="sr-only"
              />
              <span className="text-gray-600">Vertikal</span>
            </label>
          </div>
          <button
            onClick={handleVideoUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 w-full sm:w-auto"
          >
            Tambah Video
          </button>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2">
        {videos.map(video => (
          <div key={video.id} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
            <div className="bg-white rounded shadow-md p-2 sm:p-4">
              <iframe
                src={video.link}
                title={video.id}
                className={`w-full ${video.isVertical ? 'h-64 sm:h-80' : 'h-32 sm:h-48'} mb-2 rounded`}
                allowFullScreen
              ></iframe>
              <button
                onClick={() => handleDeleteConfirmation(video.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-end items-center">
        <button
          onClick={() => handlePageChange(query.page - 1)}
          disabled={query.page <= 1}
          className={`px-3 py-1 bg-gray-300 text-gray-600 rounded mr-2 mb-2 sm:mb-0 hover:bg-gray-400 ${query.page <= 1 ? 'cursor-not-allowed' : ''}`}
        >
          Sebelumnya
        </button>
        <button
          onClick={() => handlePageChange(query.page + 1)}
          disabled={videos.length < query.limit}
          className={`px-3 py-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 ${videos.length < query.limit ? 'cursor-not-allowed' : ''}`}
        >
          Berikutnya
        </button>
      </div>

      <ConfirmationModal
        show={modalShow}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
        message="Anda yakin ingin menghapus video ini?"
      />

      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
};

export default VideoGallery;
