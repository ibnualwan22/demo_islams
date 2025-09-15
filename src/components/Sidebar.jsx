// File: src/components/Sidebar.jsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Daftar menu
const navLinks = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Data Santri', href: '/admin/santri' },
  { name: 'Data Alumni', href: '/admin/alumni' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold">Demo Islams</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`block px-4 py-2 my-1 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}