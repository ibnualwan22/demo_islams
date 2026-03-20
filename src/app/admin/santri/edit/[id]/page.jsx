// File: src/app/santri/edit/[id]/page.jsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function EditSantriPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // State untuk data form
  const [santriData, setSantriData] = useState(null);
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mengambil data santri yang akan diedit
  useEffect(() => {
    if (id) {
      fetch(`/api/santri/${id}`)
        .then(res => res.json())
        .then(data => {
          setSantriData(data);
          setAlamatLengkap(data.alamat || ''); // Set alamat awal
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSantriData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToUpdate = {
      ...santriData,
      alamat: alamatLengkap, // Gunakan alamat dari komponen bertingkat
      tahunMasuk: santriData.tahunMasuk ? parseInt(santriData.tahunMasuk) : null,
    };

    try {
      const response = await fetch(`/api/santri/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      if (response.ok) {
        Swal.fire('Berhasil!', 'Data santri berhasil diperbarui.', 'success');
        router.push('/admin/santri');
      } else {
        Swal.fire('Gagal!', 'Gagal memperbarui data.', 'error');
      }
    } catch (error) {
      console.error("Error saat update:", error);
      Swal.fire('Error!', 'Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!santriData) {
    return <div className="text-center py-20">Memuat data santri...</div>
  }

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-100 bg-white">
          <h1 className="text-2xl font-bold text-slate-800">Edit Data Santri</h1>
          <p className="text-slate-500 text-sm mt-1">Tinjau dan perbarui informasi utama santri aktif.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input type="text" name="nama" value={santriData.nama} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIS</label>
            <input type="text" name="nis" value={santriData.nis} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alamat (Otomatis dari API)</label>
            <input
              type="text"
              value={`${santriData.desa || ''}, ${santriData.kecamatan || ''}, ${santriData.kabupaten || ''}`}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tahun Masuk (Manual)</label>
              <input type="number" name="tahunMasuk" value={santriData.tahunMasuk || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100 mt-6">
            <Link href="/admin/santri" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">Batal</Link>
            <button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-sky-600/30 disabled:opacity-50 transition-colors">
              {isLoading ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}