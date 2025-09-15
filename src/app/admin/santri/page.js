// File: src/app/santri/page.jsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- TAMBAHKAN BARIS INI


export default function SantriPage() {
  const [santriList, setSantriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fungsi untuk mengambil data santri AKTIF
  async function getSantriAktif() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/santri/aktif');
      const data = await response.json();
      setSantriList(data);
    } catch (error) {
      console.error("Gagal memuat data santri:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Ambil data saat halaman dimuat
  useEffect(() => {
    getSantriAktif();
  }, []);

  const handleLuluskan = async (santri) => {
    const tahunKeluar = window.prompt(`Masukkan tahun keluar untuk ${santri.nama}:`, new Date().getFullYear().toString());

    if (!tahunKeluar || isNaN(tahunKeluar) || tahunKeluar.length !== 4) {
      alert('Tahun keluar tidak valid. Mohon masukkan 4 digit angka tahun.');
      return;
    }

    const confirmed = window.confirm(`Anda akan meluluskan ${santri.nama} dengan tahun keluar ${tahunKeluar} dan membuat entri alumni baru. Lanjutkan?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/santri/luluskan/${santri.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tahunKeluar: parseInt(tahunKeluar) }),
      });

      if (response.ok) {
        alert(`${santri.nama} berhasil dijadikan alumni.`);
        getSantriAktif(); // Refresh data di halaman
      } else {
        const error = await response.json();
        alert(`Gagal memproses: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saat meluluskan santri:", error);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Data Santri Aktif</h1>
            <p className="text-gray-600 mt-1">Total: {santriList.length} Santri</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold">Nama Santri</th>
                  <th className="py-3 px-6 text-left font-semibold">Alamat</th>
                  <th className="py-3 px-6 text-left font-semibold">Asrama</th>
                  <th className="py-3 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-10">Memuat data...</td></tr>
                ) : santriList.map((santri) => (
                  <tr key={santri.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium">{santri.nama}</td>
                    <td className="py-3 px-4">{santri.kabupaten || '-'}</td>
                    <td className="py-3 px-6">{santri.asrama || '-'}</td>
                    <td className="py-3 px-6 text-center">
                      {/* <Link
    href={`/admin/santri/detail/${santri.id}`}
    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-xs"
  >
    Detail
  </Link> */}
                      <Link
    href={`/admin/santri/edit/${santri.id}`}
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs"
  >
    Edit
  </Link>
                      <button 
                        onClick={() => handleLuluskan(santri)}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Luluskan
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