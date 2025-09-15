// File: src/app/alumni/page.jsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function getAlumniData() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/alumni'); 
      const data = await response.json();
      setAlumniList(data);
    } catch (error) {
      console.error("Gagal memuat data alumni:", error);
      alert('Gagal memuat data alumni. Coba refresh halaman.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAlumniData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/alumni/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Data berhasil dihapus!');
        getAlumniData(); 
      } else {
        alert('Gagal menghapus data.');
      }
    } catch (error) {
      console.error('Error saat menghapus data:', error);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Data Alumni</h1>
              <p className="text-gray-600 mt-1">Total: {alumniList.length} Alumni</p>
            </div>
            <Link href="/admin/alumni/tambah" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Tambah Alumni
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Nama</th>
                  <th className="py-3 px-4 text-left font-semibold">Thn. Masuk</th>
                  <th className="py-3 px-4 text-left font-semibold">Thn. Keluar</th>
                  <th className="py-3 px-4 text-left font-semibold">Alamat Asli</th>
                  <th className="py-3 px-4 text-left font-semibold">No. HP</th>
                  <th className="py-3 px-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">Memuat data...</td>
                  </tr>
                ) : alumniList.map((alumni) => (
                  <tr key={alumni.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{alumni.nama}</td>
                    <td className="py-3 px-4">{alumni.tahunMasuk || '-'}</td>
                    <td className="py-3 px-4">{alumni.tahunKeluar || '-'}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{alumni.alamatAsli || '-'}</td>
                    <td className="py-3 px-4">{alumni.noHp || '-'}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      {/* TOMBOL EDIT */}
                      <Link 
                        href={`/admin/alumni/edit/${alumni.id}`}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Edit
                      </Link>
                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => handleDelete(alumni.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}