import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "../Assets/img/logo-nuanali.png";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
                        <h4 className="text-lg font-semibold mb-3">Tentang Web</h4>
                        <p className="text-sm">
                            Website Resmi Desa Negeri Nuniali, Kecamatan Taniwel, Seram Bagian Barat, Maluku. Media komunikasi dan transparansi Pemerintah Desa.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-lg font-semibold mb-3">Kontak Desa</h5>
                        <ul className="text-sm space-y-2">
                            <li className="flex items-center">
                                <FaMapMarkerAlt className="mr-2" />
                                Negeri Nuniali, Kecamatan Taniwel, Seram Bagian Barat, Maluku
                            </li>
                            <li className="flex items-center">
                                <FaPhoneAlt className="mr-2" />
                                081 234 567 89
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-2" />
                                admin@web.id
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-lg font-semibold mb-3">Kontak Penting</h5>
                        <ul className="text-sm space-y-2">
                            <li>Puskesmas - (0321) 876208</li>
                            <li>Polsek - (0321) 861184</li>
                            <li>Damkar - (0321) 854928</li>
                            <li>PLN - 123</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-lg font-semibold mb-3">Aplikasi Desa</h5>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className="hover:text-blue-500">Sistem Desa</a></li>
                            <li><a href="#" className="hover:text-blue-500">Pengaduan Online</a></li>
                            <li><a href="#" className="hover:text-blue-500">Pengajuan Surat</a></li>
                            <li><a href="#" className="hover:text-blue-500">Info Kesehatan</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-center md:text-left">
                        Copyright © <a href="#" className="hover:text-blue-500">Desa Nuniali</a>. All rights reserved
                    </p>
                    <div className="flex justify-center mt-4 md:mt-0">
                        <a href="https://web.facebook.com/" className="mx-2 text-gray-300 hover:text-blue-500" aria-label="Facebook" rel="noreferrer" target="_blank">
                            <FaFacebook className="text-xl" />
                        </a>
                        <a href="https://twitter.com/" className="mx-2 text-gray-300 hover:text-blue-500" aria-label="Twitter" rel="noreferrer" target="_blank">
                            <FaTwitter className="text-xl" />
                        </a>
                        <a href="https://www.youtube.com/" className="mx-2 text-gray-300 hover:text-blue-500" aria-label="Youtube" rel="noreferrer" target="_blank">
                            <FaYoutube className="text-xl" />
                        </a>
                        <a href="https://www.instagram.com/" className="mx-2 text-gray-300 hover:text-blue-500" aria-label="Instagram" rel="noreferrer" target="_blank">
                            <FaInstagram className="text-xl" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
