// File: src/app/admin/alumni/page.js

"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MessageCircle, CheckCircle } from 'lucide-react';

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('APPROVED'); // 'APPROVED' | 'PENDING'

  // --- Filter States ---
  const [searchName, setSearchName] = useState('');
  const [filterTahunMasuk, setFilterTahunMasuk] = useState('');
  const [filterAngkatan, setFilterAngkatan] = useState('');
  const [filterGender, setFilterGender] = useState('ALL'); // ALL | PUTRA | PUTRI

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  const handleApprove = async (id) => {
    const confirmed = window.confirm('Setujui pendaftaran alumni ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/alumni/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (response.ok) {
        alert('Alumni berhasil disetujui!');
        getAlumniData();
      } else {
        alert('Gagal menyetujui data.');
      }
    } catch (error) {
      console.error('Error saat approve:', error);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  // --- Frontend Logics (Filter & Tab & Pagination) ---
  const filteredList = useMemo(() => {
    return alumniList.filter(a => {
      // Filter Tab
      if (activeTab === 'APPROVED' && a.status !== 'APPROVED') return false;
      if (activeTab === 'PENDING' && !(a.status === 'PENDING' || !a.status)) return false;

      // Filter Nama
      if (searchName && !a.nama.toLowerCase().includes(searchName.toLowerCase())) return false;
      
      // Filter Tahun Masuk
      if (filterTahunMasuk && a.tahunMasuk?.toString() !== filterTahunMasuk) return false;
      
      // Filter Angkatan
      if (filterAngkatan && a.angkatanAmtsilati?.toString() !== filterAngkatan) return false;

      // Filter Gender
      if (filterGender !== 'ALL' && a.gender !== filterGender) return false;

      return true;
    });
  }, [alumniList, activeTab, searchName, filterTahunMasuk, filterAngkatan, filterGender]);

  // Reset pagination if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchName, filterTahunMasuk, filterAngkatan, filterGender]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pendingCount = alumniList.filter(a => a.status === 'PENDING' || !a.status).length;
  const approvedCount = alumniList.filter(a => a.status === 'APPROVED').length;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Data Alumni</h1>
              <p className="text-gray-600 mt-1">
                Total Status {activeTab}: {filteredList.length} dari {alumniList.length} Alumni
                {pendingCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {pendingCount} Menunggu
                  </span>
                )}
              </p>
            </div>
            <Link href="/admin/alumni/tambah" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors text-sm">
              + Tambah Alumni
            </Link>
          </div>

          {/* Tab Filter */}
          <div className="px-6 border-b flex space-x-1 bg-gray-50 pt-2">
            <button
              onClick={() => setActiveTab('APPROVED')}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                activeTab === 'APPROVED' ? 'bg-white text-blue-600 border-t-2 border-l border-r border-blue-600 border-b-0 -mb-px' : 'bg-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ✅ Aktif / Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors flex items-center gap-2 ${
                activeTab === 'PENDING' ? 'bg-white text-yellow-600 border-t-2 border-l border-r border-yellow-500 border-b-0 -mb-px' : 'bg-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ⏳ Menunggu Persetujuan
              {pendingCount > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  activeTab === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500 text-white'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Area Filter Pencarian */}
          <div className="px-6 py-4 border-b bg-white flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cari Nama</label>
              <input 
                type="text" 
                placeholder="Ketikan nama alumni..." 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Thn Masuk</label>
              <input 
                type="number" 
                placeholder="Contoh: 2018" 
                value={filterTahunMasuk}
                onChange={(e) => setFilterTahunMasuk(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Angkatan</label>
              <input 
                type="number" 
                placeholder="Contoh: 25" 
                value={filterAngkatan}
                onChange={(e) => setFilterAngkatan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
              <select 
                value={filterGender} 
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="ALL">Semua</option>
                <option value="PUTRA">Putra</option>
                <option value="PUTRI">Putri</option>
              </select>
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto min-h-[300px]">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="py-3 px-4 text-center font-semibold w-12 border-r">No</th>
                  <th className="py-3 px-4 text-left font-semibold">Nama Lengkap</th>
                  <th className="py-3 px-4 text-center font-semibold">Gender</th>
                  <th className="py-3 px-4 text-center font-semibold">Angkatan</th>
                  <th className="py-3 px-4 text-center font-semibold">Thn. Masuk</th>
                  <th className="py-3 px-4 text-left font-semibold">Kab./Kota (Domisili)</th>
                  <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10">Memuat data...</td>
                  </tr>
                ) : paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      Tidak ada data alumni yang cocok dengan filter.
                    </td>
                  </tr>
                ) : paginatedList.map((alumni, index) => {
                  const absoluteNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={alumni.id} className="border-b hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-4 text-center text-gray-500 font-mono border-r bg-gray-50/50">{absoluteNumber}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {alumni.nama}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {alumni.gender ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${alumni.gender === 'PUTRA' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                            {alumni.gender}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {alumni.angkatanAmtsilati || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">{alumni.tahunMasuk || '-'}</td>
                      <td className="py-3 px-4 truncate max-w-[150px]">{alumni.kabupatenDomisili || alumni.kabupatenAsli || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap min-w-[140px]">
                          {/* Tombol WhatsApp (Aksi) */}
                          {alumni.noHp && (
                            <a
                              href={`https://wa.me/${alumni.noHp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Hubungi via WA: ${alumni.noHp}`}
                              className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-2.5 rounded text-[11px] shadow-sm transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WA
                            </a>
                          )}
                          
                          {/* Tombol Approve (hanya PENDING) */}
                          {(alumni.status === 'PENDING' || !alumni.status) && (
                            <button
                              onClick={() => handleApprove(alumni.id)}
                              title="Setujui alumni ini"
                              className="inline-flex items-center gap-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-2.5 rounded text-[11px] shadow-sm transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Terima
                            </button>
                          )}
                          
                          <Link
                            href={`/admin/alumni/edit/${alumni.id}`}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-1 px-2.5 rounded text-[11px] shadow-sm transition-colors"
                          >
                            Edit
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(alumni.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1 px-2.5 rounded text-[11px] border border-red-200 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500 order-2 sm:order-1">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredList.length)} dari {filteredList.length} alumni
              </span>
              <div className="flex gap-1 shadow-sm order-1 sm:order-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border rounded-l-md text-sm disabled:opacity-50 disabled:bg-gray-100 hover:bg-gray-50 font-medium"
                >
                  Prev
                </button>
                <div className="px-4 py-1.5 text-sm flex items-center bg-gray-100 border-y font-semibold text-gray-700">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border rounded-r-md text-sm disabled:opacity-50 disabled:bg-gray-100 hover:bg-gray-50 font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}