import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaRegEnvelope, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../Assets/img/logo-nuanali.png";

export default function Navbar() {
    const [isFixedNavbar, setFixedNavbar] = useState(false);
    const [openDropdown, setOpenDropdown] = useState({
        profil: false,
        informasi: false,
        desa: false,
        demografis: false,
        media: false,
        publikasi: false
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setFixedNavbar(window.pageYOffset > 35);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseEnter = (dropdown) => {
        setOpenDropdown(prev => ({ ...prev, [dropdown]: true }));
    };

    const handleMouseLeave = (dropdown) => {
        setOpenDropdown(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <div className="hidden md:flex bg-white py-2">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <a href="https://wa.me/68123456789" rel="noreferrer" target="_blank" className="text-tertiary text-sm flex items-center">
                            <FaPhoneAlt className="mr-2" />
                            68123456789
                        </a>
                        <span className="text-gray-500 mx-2">|</span>
                        <a href="mailto:admin@gmail.com" rel="noreferrer" target="_blank" className="text-tertiary text-sm flex items-center">
                            <FaRegEnvelope className="mr-2" />
                            admin@gmail.com
                        </a>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://web.facebook.com/" className="text-tertiary" aria-label="Facebook" rel="noreferrer" target="_blank">
                            <FaFacebook />
                        </a>
                        <a href="https://twitter.com/" className="text-tertiary" aria-label="Twitter" rel="noreferrer" target="_blank">
                            <FaTwitter />
                        </a>
                        <a href="https://www.youtube.com/" className="text-tertiary" aria-label="Youtube" rel="noreferrer" target="_blank">
                            <FaYoutube />
                        </a>
                        <a href="https://www.instagram.com/" className="text-tertiary" aria-label="Instagram" rel="noreferrer" target="_blank">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>
            <nav className={`navbar ${isFixedNavbar ? "fixed top-0 left-0 right-0 bg-white shadow-md" : "bg-white"} border-b border-primary`}>
                <div className="container mx-auto flex items-center justify-between p-4">
                    <a href="http://localhost:3001/" className="flex items-center">
                        <img src={logo} alt="logo desa" className="w-10 h-10" />
                        <div className="ml-2">
                            <h5 className="text-primary font-semibold">Desa Nuniali</h5>
                            <p className="text-sm text-tertiary">Seram Bagian Barat</p>
                        </div>
                    </a>
                   
                    <button className="md:hidden p-2" onClick={handleMobileMenuToggle} aria-label="Toggle navigation">
                        {mobileMenuOpen ? <FaTimes className="text-tertiary" /> : <FaBars className="text-tertiary" />}
                    </button>
                    
                    <div className={`md:flex ${mobileMenuOpen ? "block" : "hidden"} space-y-4 md:space-y-0 md:flex-row md:space-x-4`}>
                        <Link to="#" className="text-tertiary hover:text-primary">Dashboard</Link>
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('profil')}
                            onMouseLeave={() => handleMouseLeave('profil')}
                        >
                            <button className="text-tertiary hover:text-primary">Profil</button>
                            {openDropdown.profil && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <Link to="#" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Bagan Struktur</Link>
                                    <Link to="/admin/struktur" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Struktur Detail</Link>
                                </div>
                            )}
                        </div>
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('informasi')}
                            onMouseLeave={() => handleMouseLeave('informasi')}
                        >
                            <button className="text-tertiary hover:text-primary">Informasi</button>
                            {openDropdown.informasi && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <Link to="/admin/berita" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Berita</Link>
                                    <Link to="/admin/agenda" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Agenda</Link>
                                </div>
                            )}
                        </div>
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('desa')}
                            onMouseLeave={() => handleMouseLeave('desa')}
                        >
                            <button className="text-tertiary hover:text-primary">Desa</button>
                            {openDropdown.desa && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <Link to="/admin/lembaga" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Lembaga</Link>
                                    <Link to="/admin/tempatwisata" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Tempat Wisata</Link>
                                    <Link to="/admin/prestasi" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Prestasi</Link>
                                </div>
                            )}
                        </div>
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('demografis')}
                            onMouseLeave={() => handleMouseLeave('demografis')}
                        >
                            <button className="text-tertiary hover:text-primary">Demografis</button>
                            {openDropdown.demografis && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <Link to="#" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Penduduk</Link>
                                    <Link to="#" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Wilayah</Link>
                                </div>
                            )}
                        </div>
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('media')}
                            onMouseLeave={() => handleMouseLeave('media')}
                        >
                            <button className="text-tertiary hover:text-primary">Media</button>
                            {openDropdown.media && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <Link to="/admin/photo" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Galeri Foto</Link>
                                    <Link to="/admin/videos" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Galeri Video</Link>
                                </div>
                            )}
                        </div>
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('publikasi')}
                            onMouseLeave={() => handleMouseLeave('publikasi')}
                        >
                            <button className="text-tertiary hover:text-primary">Publikasi</button>
                            {openDropdown.publikasi && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <Link to="/admin/pembangunan" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Pembangunan Desa</Link>
                                    <Link to="#" className="block px-4 py-2 text-tertiary hover:bg-gray-100">Dana Desa</Link>
                                </div>
                            )}
                        </div>
                        <Link to="/admin/lapak" className="text-tertiary hover:text-primary">Lapak</Link>
                    </div>
                
                </div>
            </nav>
        </>
    );
}
