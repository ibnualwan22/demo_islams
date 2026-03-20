// File: src/app/admin/alumni/edit/[id]/page.jsx

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import AlamatBertingkat from '@/components/AlamatBertingkat';

export default function EditAlumniPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // State umum
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState('');
  const [angkatanAmtsilati, setAngkatanAmtsilati] = useState('');
  const [noHp, setNoHp] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [domisiliSama, setDomisiliSama] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Data alamat tersimpan (untuk ditampilkan)
  const [savedAlamatAsli, setSavedAlamatAsli] = useState({});
  const [savedAlamatDomisili, setSavedAlamatDomisili] = useState({});

  // Perubahan alamat dari komponen (null = tidak diubah)
  const [newAlamatAsli, setNewAlamatAsli] = useState(null);
  const [newAlamatDomisili, setNewAlamatDomisili] = useState(null);

  useEffect(() => {
    if (id) {
      setIsFetching(true);
      fetch(`/api/alumni/${id}`)
        .then(res => res.json())
        .then(data => {
          setNama(data.nama || '');
          setGender(data.gender || '');
          setTahunMasuk(data.tahunMasuk?.toString() || '');
          setTahunKeluar(data.tahunKeluar?.toString() || '');
          setAngkatanAmtsilati(data.angkatanAmtsilati?.toString() || '');
          setNoHp(data.noHp || '');
          setDetailAlamat(data.detailAlamat || '');

          // Simpan data alamat tersimpan
          const asli = {
            provinsi: data.provinsiAsli || '',
            kabupaten: data.kabupatenAsli || '',
            kecamatan: data.kecamatanAsli || '',
            desa: data.desaAsli || '',
          };
          const domi = {
            provinsi: data.provinsiDomisili || '',
            kabupaten: data.kabupatenDomisili || '',
            kecamatan: data.kecamatanDomisili || '',
            desa: data.desaDomisili || '',
          };
          setSavedAlamatAsli(asli);
          setSavedAlamatDomisili(domi);

          // Cek apakah domisili sama dengan asli
          const asliStr = JSON.stringify(asli);
          const domiStr = JSON.stringify(domi);
          setDomisiliSama(asliStr === domiStr || !domi.kabupaten);

          setIsFetching(false);
        });
    }
  }, [id]);

  const handleAlamatAsliChange = useCallback((obj) => {
    // Hanya set jika ada pilihan (bukan kosong semua)
    if (obj.provinsi || obj.kabupaten || obj.kecamatan || obj.desa) {
      setNewAlamatAsli(obj);
    }
  }, []);

  const handleAlamatDomisiliChange = useCallback((obj) => {
    if (obj.provinsi || obj.kabupaten || obj.kecamatan || obj.desa) {
      setNewAlamatDomisili(obj);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Gunakan alamat baru jika diubah, jika tidak pakai yang tersimpan
    const alamatAsliSave = newAlamatAsli || savedAlamatAsli;
    const alamatDomisiliSave = domisiliSama
      ? alamatAsliSave
      : (newAlamatDomisili || savedAlamatDomisili);

    const dataAlumni = {
      nama,
      gender,
      provinsiAsli: alamatAsliSave.provinsi || null,
      kabupatenAsli: alamatAsliSave.kabupaten || null,
      kecamatanAsli: alamatAsliSave.kecamatan || null,
      desaAsli: alamatAsliSave.desa || null,
      provinsiDomisili: alamatDomisiliSave.provinsi || null,
      kabupatenDomisili: alamatDomisiliSave.kabupaten || null,
      kecamatanDomisili: alamatDomisiliSave.kecamatan || null,
      desaDomisili: alamatDomisiliSave.desa || null,
      detailAlamat: detailAlamat || null,
      tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
      tahunKeluar: tahunKeluar ? parseInt(tahunKeluar) : null,
      angkatanAmtsilati: angkatanAmtsilati ? parseInt(angkatanAmtsilati) : null,
      noHp,
    };

    try {
      const response = await fetch(`/api/alumni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAlumni),
      });

      if (response.ok) {
        Swal.fire('Berhasil!', 'Data alumni berhasil diperbarui.', 'success');
        router.push('/admin/alumni');
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

  if (isFetching) {
    return <div className="text-center py-20">Memuat data alumni...</div>;
  }

  // Alamat asli tersimpan dalam format teks
  const alamatAsliTeks = [savedAlamatAsli.desa, savedAlamatAsli.kecamatan, savedAlamatAsli.kabupaten, savedAlamatAsli.provinsi].filter(Boolean).join(', ');
  const alamatDomisiliTeks = [savedAlamatDomisili.desa, savedAlamatDomisili.kecamatan, savedAlamatDomisili.kabupaten, savedAlamatDomisili.provinsi].filter(Boolean).join(', ');

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-100 bg-white">
          <h1 className="text-2xl font-bold text-slate-800">Edit Data Alumni</h1>
          <p className="text-sm text-slate-500 mt-1">Perbarui data alumni yang sudah ada. Alamat tidak perlu diubah ulang jika masih sama.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* NAMA & GENDER */}
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

          {/* ANGKATAN */}
          <div>
            <label htmlFor="angkatan" className="block text-sm font-medium text-gray-700">Angkatan Amtsilati</label>
            <input type="number" id="angkatan" placeholder="Contoh: 20" value={angkatanAmtsilati} onChange={(e) => setAngkatanAmtsilati(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* ALAMAT ASLI */}
          <div className="space-y-2">
            {alamatAsliTeks ? (
              <div className="flex items-start justify-between p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <div>
                  <span className="font-semibold text-blue-700">Alamat Asli Tersimpan:</span>
                  <p className="text-gray-700 mt-0.5">{alamatAsliTeks}</p>
                </div>
              </div>
            ) : null}
            <AlamatBertingkat
              title={alamatAsliTeks ? "Ubah Alamat Asli (opsional)" : "Alamat Asli (Sesuai KTP)"}
              onAlamatChange={handleAlamatAsliChange}
              initialData={savedAlamatAsli}
            />
          </div>

          {/* DETAIL ALAMAT */}
          <div>
            <label htmlFor="detailAlamat" className="block text-sm font-medium text-gray-700">Detail Alamat (RT/RW, Nama Jalan, dll.)</label>
            <textarea id="detailAlamat" rows={2} placeholder="Contoh: RT 02 / RW 05, Jl. Mawar No. 10" value={detailAlamat} onChange={(e) => setDetailAlamat(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* CHECKBOX DOMISILI */}
          <div className="flex items-center">
            <input id="domisiliSama" type="checkbox" checked={domisiliSama} onChange={(e) => setDomisiliSama(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="domisiliSama" className="ml-2 block text-sm text-gray-900">Alamat domisili sama dengan alamat asli</label>
          </div>

          {/* ALAMAT DOMISILI */}
          {!domisiliSama && (
            <div className="space-y-2">
              {alamatDomisiliTeks ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                  <span className="font-semibold text-green-700">Alamat Domisili Tersimpan:</span>
                  <p className="text-gray-700 mt-0.5">{alamatDomisiliTeks}</p>
                </div>
              ) : null}
              <AlamatBertingkat
                title={alamatDomisiliTeks ? "Ubah Alamat Domisili (opsional)" : "Alamat Domisili"}
                onAlamatChange={handleAlamatDomisiliChange}
                initialData={savedAlamatDomisili}
              />
            </div>
          )}

          {/* TAHUN */}
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

          {/* NO HP */}
          <div>
            <label htmlFor="noHp" className="block text-sm font-medium text-gray-700">No. HP / WhatsApp</label>
            <input type="text" id="noHp" value={noHp} onChange={(e) => setNoHp(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* TOMBOL */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100 mt-6">
            <Link href="/admin/alumni" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">Batal</Link>
            <button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-sky-600/30 disabled:opacity-50 transition-colors">
              {isLoading ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}