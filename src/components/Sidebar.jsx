// File: src/components/Sidebar.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, Menu, X, LogOut } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Data Santri', href: '/admin/santri', icon: Users },
  { name: 'Data Alumni', href: '/admin/alumni', icon: UserCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Tutup sidebar otomatis di mobile saat rute berpindah
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Tombol Hamburger (Hanya Mobile) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 text-white z-50 flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white">I</div>
          <span>ISLAMS Admin</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Gelap untuk Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Kontainer */}
      <div 
        className={`fixed md:sticky top-0 left-0 h-screen bg-slate-900 text-slate-300 w-64 md:w-64 lg:w-72 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out border-r border-slate-800
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header Logo */}
        <div className="h-16 hidden md:flex items-center justify-center gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">I</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Islams DB</h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 mt-16 md:mt-0">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Menu Utama</div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors group">
            <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            Ke Beranda Publik
          </Link>
        </div>
      </div>
    </>
  );
}