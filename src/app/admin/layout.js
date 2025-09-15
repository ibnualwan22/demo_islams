// File: src/app/admin/layout.js

import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar hanya akan tampil di dalam layout admin ini */}
      <Sidebar />

      {/* Area konten utama untuk halaman admin */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}