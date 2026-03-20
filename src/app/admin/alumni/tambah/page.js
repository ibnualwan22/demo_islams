// File: src/app/admin/alumni/tambah/page.js

"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlamatBertingkat from '@/components/AlamatBertingkat';

export default function TambahAlumniPage() {
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState('');
  const [angkatanAmtsilati, setAngkatanAmtsilati] = useState('');
  const [noHp, setNoHp] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [domisiliSama, setDomisiliSama] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [alamatAsli, setAlamatAsli] = useState({ provinsi: '', kabupaten: '', kecamatan: '', desa: '' });
  const [alamatDomisili, setAlamatDomisili] = useState({ provinsi: '', kabupaten: '', kecamatan: '', desa: '' });

  const handleAlamatAsliChange = useCallback((obj) => setAlamatAsli(obj), []);
  const handleAlamatDomisiliChange = useCallback((obj) => setAlamatDomisili(obj), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const domisili = domisiliSama ? alamatAsli : alamatDomisili;

    const dataAlumni = {
      nama,
      gender,
      provinsiAsli: alamatAsli.provinsi || null,
      kabupatenAsli: alamatAsli.kabupaten || null,
      kecamatanAsli: alamatAsli.kecamatan || null,
      desaAsli: alamatAsli.desa || null,
      provinsiDomisili: domisili.provinsi || null,
      kabupatenDomisili: domisili.kabupaten || null,
      kecamatanDomisili: domisili.kecamatan || null,
      desaDomisili: domisili.desa || null,
      detailAlamat: detailAlamat || null,
      tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
      tahunKeluar: tahunKeluar ? parseInt(tahunKeluar) : null,
      angkatanAmtsilati: angkatanAmtsilati ? parseInt(angkatanAmtsilati) : null,
      noHp,
      status: 'APPROVED', // Admin menambah manual, langsung APPROVED
    };

    try {
      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAlumni),
      });

      if (response.ok) {
        alert('Data alumni berhasil disimpan!');
        router.push('/admin/alumni');
      } else {
        const errorData = await response.json();
        alert(`Gagal menyimpan data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saat mengirim form:", error);
      alert('Terjadi kesalahan pada koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Tambah Data Alumni Baru</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select 
                id="gender" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm"
              >
                <option value="" disabled>Pilih Gender</option>
                <option value="PUTRA">PUTRA</option>
                <option value="PUTRI">PUTRI</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="angkatanAmtsilati" className="block text-sm font-medium text-gray-700">Angkatan Amtsilati</label>
            <input type="number" id="angkatanAmtsilati" placeholder="Contoh: 20" value={angkatanAmtsilati} onChange={(e) => setAngkatanAmtsilati(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          <AlamatBertingkat title="Alamat Asli (Sesuai KTP)" onAlamatChange={handleAlamatAsliChange} />

          <div>
            <label htmlFor="detailAlamat" className="block text-sm font-medium text-gray-700">Detail Alamat (RT/RW, Nama Jalan, dll.)</label>
            <textarea id="detailAlamat" rows={2} placeholder="Contoh: RT 02 / RW 05, Jl. Mawar No. 10" value={detailAlamat} onChange={(e) => setDetailAlamat(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          <div className="flex items-center">
            <input id="domisiliSama" type="checkbox" checked={domisiliSama} onChange={(e) => setDomisiliSama(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="domisiliSama" className="ml-2 block text-sm text-gray-900">Alamat domisili sama dengan alamat asli</label>
          </div>

          {!domisiliSama && (
            <AlamatBertingkat title="Alamat Domisili" onAlamatChange={handleAlamatDomisiliChange} />
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
            <Link href="/admin/alumni" className="text-gray-600 hover:text-gray-800">Batal</Link>
            <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
              {isLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}