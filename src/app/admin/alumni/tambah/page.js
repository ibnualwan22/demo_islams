// File: src/app/admin/alumni/tambah/page.js

"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
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
        Swal.fire('Berhasil!', 'Data alumni berhasil disimpan.', 'success');
        router.push('/admin/alumni');
      } else {
        const errorData = await response.json();
        Swal.fire('Gagal!', `Gagal menyimpan data: ${errorData.message}`, 'error');
      }
    } catch (error) {
      console.error("Error saat mengirim form:", error);
      Swal.fire('Error!', 'Terjadi kesalahan pada koneksi. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-100 bg-white">
          <h1 className="text-2xl font-bold text-slate-800">Tambah Data Alumni Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Lengkapi form di bawah ini untuk menambahkan alumni ke dalam sistem.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100 mt-6">
            <Link href="/admin/alumni" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">Batal</Link>
            <button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-sky-600/30 disabled:opacity-50 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}