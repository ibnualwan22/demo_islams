// File: src/app/admin/layout.js

import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      {/* Area konten utama */}
      <div className="flex-1 flex flex-col h-screen md:h-auto overflow-hidden relative">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 pt-16 md:pt-0">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}