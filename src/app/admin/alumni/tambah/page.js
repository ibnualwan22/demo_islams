// File: src/app/alumni/tambah/page.jsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlamatBertingkat from '@/components/AlamatBertingkat'; // Impor komponen baru kita

export default function TambahAlumniPage() {
  const [nama, setNama] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState('');
  const [noHp, setNoHp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // State untuk menampung hasil akhir alamat
  const [alamatAsli, setAlamatAsli] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');

  // State untuk checkbox "Domisili sama dengan alamat asli"
  const [domisiliSama, setDomisiliSama] = useState(true);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const dataAlumni = {
    nama,
    alamatAsli,
    alamatDomisili: domisiliSama ? alamatAsli : alamatDomisili,
    tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
    tahunKeluar: tahunKeluar ? parseInt(tahunKeluar) : null,
    noHp,
  };

  try {
    // Kirim data ke API backend kita
    const response = await fetch('/api/alumni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataAlumni),
    });

    if (response.ok) {
      // Jika berhasil, beri notifikasi dan arahkan kembali ke halaman daftar
      alert('Data alumni berhasil disimpan!');
      router.push('/alumni'); // Redirect ke halaman daftar alumni
    } else {
      // Jika gagal, tampilkan pesan error
      const errorData = await response.json();
      alert(`Gagal menyimpan data: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error saat mengirim form:", error);
    alert('Terjadi kesalahan pada koneksi. Silakan coba lagi.');
  } finally {
    setIsLoading(false); // Hentikan loading, baik sukses maupun gagal
  }
};

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Tambah Data Alumni Baru</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>

          {/* Gunakan komponen AlamatBertingkat untuk Alamat Asli */}
          <AlamatBertingkat 
            title="Alamat Asli (Sesuai KTP)"
            onAlamatChange={setAlamatAsli} 
          />

          {/* Checkbox untuk alamat domisili */}
          <div className="flex items-center">
              <input
                  id="domisiliSama"
                  type="checkbox"
                  checked={domisiliSama}
                  onChange={(e) => setDomisiliSama(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="domisiliSama" className="ml-2 block text-sm text-gray-900">
                  Alamat domisili sama dengan alamat asli
              </label>
          </div>

          {/* Tampilkan komponen AlamatBertingkat untuk Domisili HANYA JIKA checkbox tidak dicentang */}
          {!domisiliSama && (
            <AlamatBertingkat 
              title="Alamat Domisili"
              onAlamatChange={setAlamatDomisili} 
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
              <label htmlFor="tahunMasuk" className="block text-sm font-medium text-gray-700">Tahun Masuk</label>
              <input type="number" id="tahunMasuk" value={tahunMasuk} onChange={(e) => setTahunMasuk(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="tahunKeluar" className="block text-sm font-medium text-gray-700">Tahun Keluar</label>
              <input type="number" id="tahunKeluar" value={tahunKeluar} onChange={(e) => setTahunKeluar(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="noHp" className="block text-sm font-medium text-gray-700">No. HP / WhatsApp</label>
            <input type="text" id="noHp" value={noHp} onChange={(e) => setNoHp(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link href="/alumni" className="text-gray-600 hover:text-gray-800">Batal</Link>
            <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
              {isLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}