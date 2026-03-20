// File: src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, UserCheck, MapPin, Search, X, ChevronRight, GraduationCap } from 'lucide-react';
import TahunMasukChart from "@/components/TahunMasukChart";
import TahunKeluarChart from "@/components/TahunKeluarChart";

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, description, accent }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border border-white/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
    <div className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-4 translate-x-4 ${accent}`} />
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-xl ${accent} bg-opacity-15`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
    </div>
    <p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p>
    <p className="text-xs text-gray-400 mt-1">{description}</p>
  </div>
);

// ── Region Card ────────────────────────────────────────────────────────────────
const RegionCard = ({ region, santri, alumni }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
    <div className="flex items-center gap-2 mb-3">
      <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
      <h4 className="font-semibold text-gray-800 text-sm">{region}</h4>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-blue-50 rounded-xl p-2.5 text-center">
        <p className="text-xl font-bold text-blue-600">{santri ?? 0}</p>
        <p className="text-[10px] text-blue-400 font-medium uppercase tracking-wide">Santri</p>
      </div>
      <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
        <p className="text-xl font-bold text-emerald-600">{alumni ?? 0}</p>
        <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wide">Alumni</p>
      </div>
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function PublicHomePage() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          fetch('/api/public/stats'),
          fetch('/api/public/charts')
        ]);
        setStats(await statsRes.json());
        setCharts(await chartsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 3) {
      setSearchMessage('Masukkan minimal 3 huruf.');
      setHasSearched(true);
      return;
    }
    setIsSearching(true);
    setSearchMessage('');
    setSearchResults([]);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/public/search-alumni?name=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchMessage('Data tidak ditemukan. Apakah Anda ingin mendaftar sebagai alumni?');
      }
    } catch {
      setSearchMessage('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchMessage('');
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <div
        className="relative min-h-[55vh] sm:min-h-[65vh] flex flex-col items-center justify-center text-white text-center px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-isat.jpg')" }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        {/* Nav bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 py-4 z-20">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-islams.png"
              alt="ISLAMS Logo"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-white/30 object-cover"
            />
            <span className="font-bold text-sm sm:text-base text-white drop-shadow">ISLAMS</span>
          </div>
          <Link
            href="/register-alumni"
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-all duration-200"
          >
            Daftar Alumni
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center gap-4 px-4 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150" />
            <Image
              src="/images/logo-islams.png"
              alt="ISLAMS Connection Logo"
              width={96}
              height={96}
              className="relative rounded-full ring-4 ring-white/40 shadow-2xl object-cover w-20 h-20 sm:w-24 sm:h-24"
              priority
            />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
              ISLAMS{' '}
              <span className="text-emerald-300">Connection</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-white/80 font-light">
              Ittihad Santri Amtsilati
            </p>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              Magelang · Temanggung · Wonosobo · Banjarnegara
            </p>
          </div>
        </div>
      </div>

      {/* ── SEARCH CARD ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 space-y-6 pb-16 sm:pb-20">

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base sm:text-lg">Cek Data Alumni</h2>
                <p className="text-white/70 text-xs sm:text-sm">Cari nama Anda untuk mengecek status pendaftaran</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Search input */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors duration-200 flex items-center gap-2 flex-shrink-0"
              >
                {isSearching ? (
                  <span className="animate-pulse">Mencari...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Cari</span>
                  </>
                )}
              </button>
            </form>

            {/* Search Results */}
            {hasSearched && (
              <div className="mt-5">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700 text-sm">
                        {searchResults.length} data ditemukan
                      </h3>
                      <button onClick={clearSearch} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Bersihkan
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {searchResults.map(alumni => (
                        <li
                          key={alumni.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100"
                        >
                          <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm">
                            {alumni.nama?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{alumni.nama}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                              <span className="text-xs text-emerald-600 flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {alumni.angkatanAmtsilati ? `Angkatan ${alumni.angkatanAmtsilati}` : 'Angkatan —'}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alumni.kabupatenDomisili || alumni.kabupatenAsli || '—'}
                              </span>
                            </div>
                          </div>
                          <span className="flex-shrink-0 text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded-full">
                            Terdaftar
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : searchMessage ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-amber-400" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{searchMessage}</p>
                    {searchMessage.startsWith('Data tidak ditemukan') && (
                      <Link
                        href="/register-alumni"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
                      >
                        Daftar Sebagai Alumni Baru
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* ── STATISTIK ─────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Memuat data statistik...</p>
          </div>
        ) : stats && charts ? (
          <div className="space-y-6">

            {/* Section Title */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Statistik Korda</h2>
              <p className="text-sm text-gray-500 mt-1">Data santri aktif & alumni terverifikasi</p>
            </div>

            {/* Total Counts */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard
                title="Santri Aktif"
                value={stats.totalSantri}
                icon={Users}
                description="Berstatus aktif"
                accent="bg-blue-500"
              />
              <StatCard
                title="Alumni"
                value={stats.totalAlumni}
                icon={UserCheck}
                description="Terverifikasi"
                accent="bg-emerald-500"
              />
            </div>

            {/* Per Region */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Rincian per Wilayah</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <RegionCard region="Magelang" santri={stats.santriMagelang} alumni={stats.alumniMagelang} />
                <RegionCard region="Wonosobo" santri={stats.santriWonosobo} alumni={stats.alumniWonosobo} />
                <RegionCard region="Temanggung" santri={stats.santriTemanggung} alumni={stats.alumniTemanggung} />
                <RegionCard region="Banjarnegara" santri={stats.santriBanjarnegara} alumni={stats.alumniBanjarnegara} />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <TahunMasukChart chartData={charts.dataTahunMasuk} />
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <TahunKeluarChart chartData={charts.dataTahunKeluar} />
              </div>
            </div>
          </div>
        ) : null}

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer className="text-center pt-6 pb-2">
          <Image
            src="/images/logo-islams.png"
            alt="ISLAMS"
            width={36}
            height={36}
            className="mx-auto rounded-full mb-2 opacity-60 object-cover"
          />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ISLAMS Connection
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Ittihad Santri Amtsilati · Magelang, Temanggung, Wonosobo, Banjarnegara
          </p>
        </footer>
      </div>
    </div>
  );
}