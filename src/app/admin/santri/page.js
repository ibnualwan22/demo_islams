// File: src/app/admin/santri/page.js

"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import AlamatBertingkat from '@/components/AlamatBertingkat';

export default function SantriPage() {
  const [santriList, setSantriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // --- State Filter & Search ---
  const [searchName, setSearchName] = useState('');
  const [filterGender, setFilterGender] = useState('ALL'); // ALL | PUTRA | PUTRI
  const [filterRole, setFilterRole] = useState('ALL');     // ALL | SANTRI | PENGURUS

  // --- State Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- State Modal Luluskan ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState(null);

  // State Form Modal
  const [nama, setNama] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState(new Date().getFullYear().toString());
  const [angkatanAmtsilati, setAngkatanAmtsilati] = useState('');
  const [noHp, setNoHp] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [domisiliSama, setDomisiliSama] = useState(true);

  // State Alamat Modal
  const [alamatAsli, setAlamatAsli] = useState({ provinsi: '', kabupaten: '', kecamatan: '', desa: '' });
  const [alamatDomisili, setAlamatDomisili] = useState({ provinsi: '', kabupaten: '', kecamatan: '', desa: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAlamatAsliChange = useCallback((obj) => setAlamatAsli(obj), []);
  const handleAlamatDomisiliChange = useCallback((obj) => setAlamatDomisili(obj), []);

  // --- Fetch Data ---
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

  useEffect(() => {
    getSantriAktif();
  }, []);

  // --- Logika Filter & Pagination (Frontend) ---
  const filteredSantri = useMemo(() => {
    return santriList.filter(santri => {
      // 1. Filter Nama
      if (searchName && !santri.nama.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }

      // 2. Filter Gender (PUTRA / PUTRI)
      if (filterGender !== 'ALL') {
        if (santri.gender !== filterGender) return false;
      }

      // 3. Filter Role (SANTRI biasa / PENGURUS)
      if (filterRole === 'SANTRI') {
        // Santri biasa: tidak punya leadershipName
        if (santri.leadershipName) return false;
      } else if (filterRole === 'PENGURUS') {
        // Pengurus: punya leadershipName
        if (!santri.leadershipName) return false;
      }

      return true;
    });
  }, [santriList, searchName, filterGender, filterRole]);

  // Reset page ke 1 kalau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, filterGender, filterRole]);

  const totalPages = Math.ceil(filteredSantri.length / itemsPerPage) || 1;
  const paginatedSantri = filteredSantri.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Buka Modal Luluskan ---
  const openModalLuluskan = (santri) => {
    setSelectedSantri(santri);
    setNama(santri.nama || '');
    setTahunMasuk(santri.tahunMasuk?.toString() || '');
    setTahunKeluar(new Date().getFullYear().toString());
    setAngkatanAmtsilati('');
    setNoHp(santri.noHpOrangTua || '');
    setDetailAlamat('');
    setDomisiliSama(true);

    const prefillAlamat = {
      provinsi: santri.provinsi || '',
      kabupaten: santri.kabupaten || '',
      kecamatan: santri.kecamatan || '',
      desa: santri.desa || ''
    };
    setAlamatAsli(prefillAlamat);
    setAlamatDomisili(prefillAlamat);

    setIsModalOpen(true);
  };

  const closeModalLuluskan = () => {
    setIsModalOpen(false);
    setSelectedSantri(null);
  };

  // --- Submit Luluskan ---
  const handleLuluskanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSantri) return;

    setIsSubmitting(true);
    const payload = {
      nama,
      detailAlamat: detailAlamat || null,
      tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
      tahunKeluar: tahunKeluar ? parseInt(tahunKeluar) : null,
      angkatanAmtsilati: angkatanAmtsilati ? parseInt(angkatanAmtsilati) : null,
      noHp,
    };

    try {
      const response = await fetch(`/api/santri/luluskan/${selectedSantri.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire('Berhasil!', `${nama} berhasil diluluskan dan dimasukkan ke data alumni (APPROVED).`, 'success');
        closeModalLuluskan();
        getSantriAktif(); // Refresh tabel otomatis
      } else {
        const error = await response.json();
        Swal.fire('Gagal!', `Gagal memproses: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error("Error saat meluluskan santri:", error);
      Swal.fire('Error!', 'Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative">
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden relative z-10 border border-slate-100">

          {/* --- Header Data --- */}
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Data Santri Aktif</h1>
              <p className="text-slate-500 mt-1">Total Filter: <span className="font-semibold text-slate-700">{filteredSantri.length}</span> / {santriList.length} Santri</p>
            </div>
          </div>

          {/* --- Area Filter & Search --- */}
          <div className="px-6 py-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Cari Nama</label>
              <input
                type="text"
                placeholder="Ketikan nama santri..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:w-48">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">Semua Gender</option>
                <option value="PUTRA">Putra</option>
                <option value="PUTRI">Putri</option>
              </select>
            </div>

            <div className="sm:w-56">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Peran Pengurus</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">Semua Peran</option>
                <option value="PENGURUS">Hanya Pengurus</option>
                <option value="SANTRI">Hanya Santri Biasa</option>
              </select>
            </div>
          </div>

          {/* --- Area Tabel --- */}
          <div className="overflow-x-auto relative min-h-[400px]">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 border-b">
                <tr>
                  <th className="py-3 px-4 text-center font-semibold w-12">No</th>
                  <th className="py-3 px-6 text-left font-semibold">Nama Santri</th>
                  <th className="py-3 px-4 text-center font-semibold">Gender</th>
                  <th className="py-3 px-6 text-left font-semibold">Alamat</th>
                  <th className="py-3 px-6 text-left font-semibold">Asrama</th>
                  <th className="py-3 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {isLoading ? (
                  <tr><td colSpan="6" className="text-center py-20 text-gray-400">Memuat data santri...</td></tr>
                ) : paginatedSantri.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-20 text-gray-400">Tidak ada santri yang sesuai dengan filter.</td></tr>
                ) : (
                  paginatedSantri.map((santri, index) => {
                    // Penomoran sesuai urutan global (bukan reset per halaman)
                    const absoluteNumber = (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <tr key={santri.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-center text-gray-500">{absoluteNumber}</td>
                        <td className="py-3 px-6">
                          <div className="font-medium text-gray-900">{santri.nama}</div>
                          {santri.leadershipName && (
                            <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                              <span className="font-semibold text-sky-600">{santri.leadershipStatus}</span>
                              <span>&bull;</span>
                              <span>{santri.leadershipName}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {santri.gender ? (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${santri.gender === 'PUTRA' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                              {santri.gender}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-6">
                          {santri.kabupaten || '-'}
                        </td>
                        <td className="py-3 px-6">{santri.asrama || '-'}</td>
                        <td className="py-3 px-6 text-center whitespace-nowrap">
                          {/* <Link
                            href={`/admin/santri/edit/${santri.id}`}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded text-xs mr-2 transition-colors inline-block"
                          >
                            Edit
                          </Link> */}
                          <button
                            onClick={() => openModalLuluskan(santri)}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors inline-block"
                          >
                            Luluskan
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* --- Pagination Controls --- */}
          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSantri.length)} dari {filteredSantri.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sebelumnya
                </button>
                <div className="px-3 py-1 text-sm flex items-center bg-gray-100 rounded font-medium">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL LULUSKAN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModalLuluskan}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">

            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Luluskan Santri: {selectedSantri?.nama}</h2>
              <button onClick={closeModalLuluskan} className="text-gray-400 hover:text-gray-600 font-bold text-xl leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto w-full">
              <form id="luluskanForm" onSubmit={handleLuluskanSubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm mb-4">
                  Pastikan data alumni di bawah ini sudah lengkap dan sesuai. Setelah diluluskan, santri ini akan dipindahkan ke daftar Alumni dengan status <strong>APPROVED</strong>.
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Angkatan Amtsilati</label>
                  <input type="number" placeholder="Contoh: 20" value={angkatanAmtsilati} onChange={(e) => setAngkatanAmtsilati(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Detail Alamat Lengkap (RT/RW, Jalan, Opsi Domisili Sementara, dll.)</label>
                  <textarea rows={3} placeholder="Contoh: RT 02 / RW 05. Alamat data sistem: Magelang. Jika pindah sementara, mohon dicatat di sini." value={detailAlamat} onChange={(e) => setDetailAlamat(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tahun Masuk</label>
                    <input type="number" value={tahunMasuk} onChange={(e) => setTahunMasuk(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tahun Keluar</label>
                    <input type="number" value={tahunKeluar} onChange={(e) => setTahunKeluar(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">No. HP / WA</label>
                    <input type="text" value={noHp} onChange={(e) => setNoHp(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={closeModalLuluskan} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 font-medium transition-colors" disabled={isSubmitting}>
                Batal
              </button>
              <button type="submit" form="luluskanForm" disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md shadow-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors">
                {isSubmitting ? 'Memproses...' : 'Simpan & Luluskan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}