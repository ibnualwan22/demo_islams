// File: src/app/register-alumni/page.jsx

"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlamatBertingkat from '@/components/AlamatBertingkat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterAlumniPage() {
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState('');
  const [tahunKeluar, setTahunKeluar] = useState('');
  const [angkatanAmtsilati, setAngkatanAmtsilati] = useState('');
  const [noHp, setNoHp] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [domisiliSama, setDomisiliSama] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // State alamat terstruktur
  const [alamatAsli, setAlamatAsli] = useState({ provinsi: '', kabupaten: '', kecamatan: '', desa: '' });
  const [alamatDomisili, setAlamatDomisili] = useState({ provinsi: '', kabupaten: '', kecamatan: '', desa: '' });

  const handleAlamatAsliChange = useCallback((obj) => setAlamatAsli(obj), []);
  const handleAlamatDomisiliChange = useCallback((obj) => setAlamatDomisili(obj), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const domisili = domisiliSama ? alamatAsli : alamatDomisili;

    const dataAlumni = {
      nama,
      gender,
      // Alamat Asli
      provinsiAsli: alamatAsli.provinsi || null,
      kabupatenAsli: alamatAsli.kabupaten || null,
      kecamatanAsli: alamatAsli.kecamatan || null,
      desaAsli: alamatAsli.desa || null,
      // Alamat Domisili
      provinsiDomisili: domisili.provinsi || null,
      kabupatenDomisili: domisili.kabupaten || null,
      kecamatanDomisili: domisili.kecamatan || null,
      desaDomisili: domisili.desa || null,
      // Detail & lainnya
      detailAlamat: detailAlamat || null,
      tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
      tahunKeluar: tahunKeluar ? parseInt(tahunKeluar) : null,
      angkatanAmtsilati: angkatanAmtsilati ? parseInt(angkatanAmtsilati) : null,
      noHp,
      status: 'PENDING',
    };

    try {
      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAlumni),
      });

      if (response.ok) {
        alert('Pendaftaran berhasil! Data Anda telah dikirim dan sedang menunggu verifikasi admin.');
        router.push('/');
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Gagal mengirim data.');
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Form Pendaftaran Alumni Baru</h1>
          <p className="text-sm text-muted-foreground">
            Silakan isi data Anda dengan lengkap. Data akan diverifikasi admin sebelum ditampilkan.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Pilih Gender</option>
                <option value="PUTRA">PUTRA</option>
                <option value="PUTRI">PUTRI</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="angkatanAmtsilati">Angkatan Amtsilati</Label>
            <Input
              type="number" id="angkatanAmtsilati" placeholder="Contoh: 20"
              value={angkatanAmtsilati} onChange={(e) => setAngkatanAmtsilati(e.target.value)}
            />
          </div>

          <AlamatBertingkat title="Alamat Asli (Sesuai KTP)" onAlamatChange={handleAlamatAsliChange} />

          <div>
            <Label htmlFor="detailAlamat">Detail Alamat (RT/RW, Nama Jalan, dll.)</Label>
            <textarea
              id="detailAlamat" rows={3}
              placeholder="Contoh: RT 02 / RW 05, Jl. Mawar No. 10"
              value={detailAlamat}
              onChange={(e) => setDetailAlamat(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="domisiliSama" type="checkbox" checked={domisiliSama}
              onChange={(e) => setDomisiliSama(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <Label htmlFor="domisiliSama" className="text-sm font-normal">Alamat domisili sama dengan alamat asli</Label>
          </div>

          {!domisiliSama && (
            <AlamatBertingkat title="Alamat Domisili" onAlamatChange={handleAlamatDomisiliChange} />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tahunMasuk">Tahun Masuk</Label>
              <Input type="number" id="tahunMasuk" value={tahunMasuk} onChange={(e) => setTahunMasuk(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tahunKeluar">Tahun Keluar (Boyong)</Label>
              <Input type="number" id="tahunKeluar" value={tahunKeluar} onChange={(e) => setTahunKeluar(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="noHp">No. HP / WhatsApp</Label>
            <Input type="text" id="noHp" placeholder="Contoh: 08123456789" value={noHp} onChange={(e) => setNoHp(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Format 08... akan otomatis diubah ke 628...</p>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button variant="ghost" asChild><Link href="/">Batal</Link></Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}