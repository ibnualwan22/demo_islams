// File: src/app/register-alumni/page.jsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlamatBertingkat from '@/components/AlamatBertingkat'; // Kita gunakan komponen yang sama!
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterAlumniPage() {
  const [nama, setNama] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamatAsli, setAlamatAsli] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');
  const [domisiliSama, setDomisiliSama] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataAlumni = {
      nama,
      alamatAsli,
      alamatDomisili: domisiliSama ? alamatAsli : alamatDomisili,
      tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
      tahunKeluar: tahunKeluar ? parseInt(tahunKeluar) : null,
      noHp,
    };
    
    try {
      // Kita kirim ke API yang sama dengan yang digunakan admin
      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAlumni),
      });

      if (response.ok) {
        alert('Pendaftaran berhasil! Data Anda telah dikirim.');
        router.push('/'); // Redirect kembali ke halaman utama
      } else {
        throw new Error('Gagal mengirim data.');
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Form Pendaftaran Alumni Baru</h1>
          <p className="text-sm text-muted-foreground">Silakan isi data Anda dengan lengkap dan benar.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>

          <AlamatBertingkat 
            title="Alamat Asli (Sesuai KTP)"
            onAlamatChange={setAlamatAsli} 
          />
          
          <div className="flex items-center space-x-2">
              <input
                  id="domisiliSama"
                  type="checkbox"
                  checked={domisiliSama}
                  onChange={(e) => setDomisiliSama(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <Label htmlFor="domisiliSama" className="text-sm font-normal">Alamat domisili sama dengan alamat asli</Label>
          </div>

          {!domisiliSama && (
            <AlamatBertingkat 
              title="Alamat Domisili"
              onAlamatChange={setAlamatDomisili} 
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
              <Label htmlFor="tahunMasuk">Tahun Masuk</Label>
              <Input type="number" id="tahunMasuk" value={tahunMasuk} onChange={(e) => setTahunMasuk(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tahunKeluar">Tahun Keluar</Label>
              <Input type="number" id="tahunKeluar" value={tahunKeluar} onChange={(e) => setTahunKeluar(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="noHp">No. HP / WhatsApp</Label>
            <Input type="text" id="noHp" value={noHp} onChange={(e) => setNoHp(e.target.value)} />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button variant="ghost" asChild>
              <Link href="/">Batal</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}