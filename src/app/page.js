// File: src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, MapPin, Search, Menu, X, Home, Info, Code, Settings } from 'lucide-react';
import TahunMasukChart from "@/components/TahunMasukChart";
import TahunKeluarChart from "@/components/TahunKeluarChart";

// Komponen Sidebar
const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Tentang", icon: Info, href: "#", comingSoon: true },
    { label: "Program", icon: Code, href: "#", comingSoon: true },
    { label: "Kontak", icon: Settings, href: "#", comingSoon: true },
  ];

  return (
    <>
      {/* Overlay untuk blur background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">ISLAMS</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors
                    ${item.comingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}
                  `}
                  onClick={(e) => {
                    if (item.comingSoon) {
                      e.preventDefault();
                    } else {
                      onClose();
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full ml-auto">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Ittihad Santri Amtsilati
            <br />
            Magelang, Temanggung, Wonosobo, Banjarnegara
          </p>
        </div>
      </div>
    </>
  );
};

// Komponen Card Statistik (masih sama)
const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function PublicHomePage() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- LOGIKA PENCARIAN BARU ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  // ------------------------------

  // Ambil data statistik dan grafik
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statsRes, chartsRes] = await Promise.all([
          fetch('/api/public/stats'),
          fetch('/api/public/charts')
        ]);
        const statsData = await statsRes.json();
        const chartsData = await chartsRes.json();
        setStats(statsData);
        setCharts(chartsData);
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // --- FUNGSI PENCARIAN BARU ---
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 3) {
      setSearchMessage('Masukkan minimal 3 huruf untuk mencari.');
      return;
    }
    setIsSearching(true);
    setSearchMessage('');
    setSearchResults([]);

    try {
      const response = await fetch(`/api/public/search-alumni?name=${searchQuery}`);
      const data = await response.json();
      if (data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchMessage('Data tidak ditemukan. Apakah Anda ingin mendaftar sebagai alumni?');
      }
    } catch (error) {
      setSearchMessage('Terjadi kesalahan saat mencari. Coba lagi nanti.');
    } finally {
      setIsSearching(false);
    }
  };
  // -----------------------------

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header dengan tombol toggle */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold lg:hidden">ISLAMS</h1>
          <div className="w-10 lg:hidden"></div> {/* Spacer untuk mobile */}
        </div>

        {/* BAGIAN 1: HEADER (Hero Section) */}
        <div 
          className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white text-center bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg-isat.jpg')" }}
        >
          {/* Overlay gelap untuk membuat teks lebih mudah dibaca */}
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
          <div className="relative z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">ISLAMS</h1>
            <p className="text-xl md:text-2xl opacity-90">
              Ittihad Santri Amtsilati Magelang, Temanggung, Wonosobo, Banjarnegara
            </p>
          </div>
        </div>
        
        {/* Wrapper Konten */}
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 -mt-20 relative z-20 space-y-12">
          
          {/* BAGIAN PENCARIAN (Sudah Fungsional) */}
          <Card>
            <CardHeader>
              <CardTitle>Cek Data Alumni</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Silakan cari nama Anda untuk mengecek apakah sudah terdaftar.</p>
              <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Masukkan nama lengkap Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? 'Mencari...' : <Search className="h-4 w-4 mr-2" />}
                  {isSearching ? '' : 'Cari'}
                </Button>
              </form>
              
              {/* Area Hasil Pencarian */}
              <div className="mt-6 space-y-4">
                {searchResults.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Data Ditemukan:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      {searchResults.map(alumni => (
                        <li key={alumni.id} className="p-2 border rounded-md">
                          <span className="font-bold">{alumni.nama}</span>
                          <p className="text-sm text-muted-foreground">Boyong: {alumni.tahunKeluar || '-'} | Domisili: {alumni.alamatDomisili || alumni.alamatAsli || '-'}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {searchMessage && (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="mb-4">{searchMessage}</p>
                    {/* Jika tidak ditemukan, tampilkan tombol daftar */}
                    {searchMessage.startsWith('Data tidak ditemukan') && (
                      <Button asChild>
                        <Link href="/register-alumni">Daftar Sebagai Alumni Baru</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* BAGIAN STATISTIK DAN GRAFIK (masih sama) */}
          {isLoading ? (
            <div className="text-center p-12">Memuat data statistik...</div>
          ) : stats && charts ? (
            <div className="space-y-8">
              {/* Statistik ... */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-center">Statistik Korda</h2>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                   <StatCard title="Santri Aktif" value={stats.totalSantri} icon={Users} description="Total santri berstatus aktif" />
                   <StatCard title="Alumni" value={stats.totalAlumni} icon={UserCheck} description="Total alumni yang terdata" />
                 </div>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                   <StatCard title="Santri Magelang" value={stats.santriMagelang} icon={MapPin} description="Kota & Kab. Magelang" />
                   <StatCard title="Alumni Magelang" value={stats.alumniMagelang} icon={MapPin} description="Kota & Kab. Magelang" />
                   <StatCard title="Santri Wonosobo" value={stats.santriWonosobo} icon={MapPin} description="Kab. Wonosobo" />
                   <StatCard title="Alumni Wonosobo" value={stats.alumniWonosobo} icon={MapPin} description="Kab. Wonosobo" />
                   <StatCard title="Santri Temanggung" value={stats.santriTemanggung} icon={MapPin} description="Kab. Temanggung" />
                   <StatCard title="Alumni Temanggung" value={stats.alumniTemanggung} icon={MapPin} description="Kab. Temanggung" />
                   <StatCard title="Santri Banjarnegara" value={stats.santriBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" />
                   <StatCard title="Alumni Banjarnegara" value={stats.alumniBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" />
                 </div>
              </div>
              {/* Grafik ... */}
              <div className="grid gap-8 lg:grid-cols-2">
                <Card><CardContent className="p-6"><TahunMasukChart chartData={charts.dataTahunMasuk} /></CardContent></Card>
                <Card><CardContent className="p-6"><TahunKeluarChart chartData={charts.dataTahunKeluar} /></CardContent></Card>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}