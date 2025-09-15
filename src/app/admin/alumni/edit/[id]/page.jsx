// File: src/app/alumni/edit/[id]/page.jsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AlamatBertingkat from '@/components/AlamatBertingkat';

export default function EditAlumniPage() {
  const router = useRouter();
  const params = useParams(); // Hook untuk mengambil ID dari URL
  const { id } = params;

  // State untuk form
  const [nama, setNama] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamatAsli, setAlamatAsli] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');
  const [domisiliSama, setDomisiliSama] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // useEffect untuk mengambil data alumni saat halaman dimuat
  useEffect(() => {
    if (id) {
      setIsFetching(true);
      fetch(`/api/alumni/${id}`)
        .then(res => res.json())
        .then(data => {
          // Isi form dengan data yang ada
          setNama(data.nama);
          setTahunMasuk(data.tahunMasuk?.toString() || '');
          setTahunKeluar(data.tahunKeluar?.toString() || '');
          setNoHp(data.noHp || '');
          setAlamatAsli(data.alamatAsli || '');
          setAlamatDomisili(data.alamatDomisili || '');
          // Cek apakah domisili sama dengan alamat asli
          if (data.alamatAsli === data.alamatDomisili) {
            setDomisiliSama(true);
          } else {
            setDomisiliSama(false);
          }
          setIsFetching(false);
        });
    }
  }, [id]);

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
      // Kirim data ke API dengan method PUT
      const response = await fetch(`/api/alumni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAlumni),
      });

      if (response.ok) {
        alert('Data alumni berhasil diperbarui!');
        router.push('/alumni');
      } else {
        alert('Gagal memperbarui data.');
      }
    } catch (error) {
      console.error("Error saat update:", error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center py-20">Memuat data alumni...</div>
  }

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Edit Data Alumni</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* NAMA */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>

          {/* ALAMAT ASLI */}
          <div className="p-4 border rounded-md">
            <p className="text-sm text-gray-600 mb-2">Alamat Tersimpan: <strong>{alamatAsli || 'Belum diisi'}</strong></p>
            <p className="text-xs text-gray-500 mb-4">Pilih alamat baru di bawah ini jika ingin mengubahnya.</p>
            <AlamatBertingkat title="Ubah Alamat Asli" onAlamatChange={setAlamatAsli} />
          </div>

          {/* CHECKBOX DOMISILI */}
          <div className="flex items-center">
            <input id="domisiliSama" type="checkbox" checked={domisiliSama} onChange={(e) => setDomisiliSama(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="domisiliSama" className="ml-2 block text-sm text-gray-900">Alamat domisili sama dengan alamat asli</label>
          </div>

          {/* ALAMAT DOMISILI (JIKA BEDA) */}
          {!domisiliSama && (
            <div className="p-4 border rounded-md">
              <p className="text-sm text-gray-600 mb-2">Alamat Tersimpan: <strong>{alamatDomisili || 'Belum diisi'}</strong></p>
              <p className="text-xs text-gray-500 mb-4">Pilih alamat baru di bawah ini jika ingin mengubahnya.</p>
              <AlamatBertingkat title="Ubah Alamat Domisili" onAlamatChange={setAlamatDomisili} />
            </div>
          )}

          {/* TAHUN & NO HP */}
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

          {/* TOMBOL AKSI */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link href="/alumni" className="text-gray-600 hover:text-gray-800">Batal</Link>
            <button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
              {isLoading ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}