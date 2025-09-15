// File: src/app/santri/detail/[id]/page.jsx

import { PrismaClient } from '@prisma/client';
import Link from 'next/link'; // Pastikan Link diimpor

const prisma = new PrismaClient();

// Fungsi untuk mengambil data detail santri dari database
async function getSantriDetail(id) {
  try {
    const santri = await prisma.santri.findUnique({
      where: { id: id },
    });
    return santri;
  } catch (error) {
    console.error("Gagal mengambil detail santri:", error);
    return null;
  }
}

// Ini adalah Server Component, jadi bisa 'async'
export default async function SantriDetailPage({ params }) {
  const { id } = await params; // Ini adalah cara yang benar
  const santri = await getSantriDetail(id);

  if (!santri) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Data Santri Tidak Ditemukan</h1>
        <Link href="/admin/santri" className="text-blue-500 hover:underline mt-4 inline-block">
          Kembali ke Daftar Santri
        </Link>
      </div>
    );
  }

  // Komponen kecil untuk menampilkan baris data agar tidak berulang
  const DetailRow = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail Data Santri</h1>
            <p className="text-gray-600 mt-1">{santri.nama}</p>
          </div>
          <Link href="/admin/santri" className="text-sm text-blue-500 hover:underline">
            ← Kembali ke Daftar
          </Link>
        </div>
        
        <div className="px-6 py-4">
          <dl className="divide-y divide-gray-200">
            <DetailRow label="Nama Lengkap" value={santri.nama} />
            <DetailRow label="NIS" value={santri.nis} />
            <DetailRow label="Status" value={santri.status} />
            <DetailRow label="Asrama" value={santri.asrama} />
            <DetailRow label="Tempat, Tanggal Lahir" value={santri.ttl} />
            <DetailRow label="Tahun Masuk" value={santri.tahunMasuk} />
            <DetailRow label="Nama Ayah" value={santri.namaAyah} />
            <DetailRow label="Nama Ibu" value={santri.namaIbu} />
            <DetailRow label="No. HP Orang Tua" value={santri.noHpOrangTua} />
            <DetailRow label="Kelas Formal" value={santri.kelasFormal} />
            <DetailRow label="Kelas Ngaji" value={santri.kelasNgaji} />
            <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Alamat Lengkap</h3>
            <DetailRow label="Desa/Kelurahan" value={santri.desa} />
            <DetailRow label="Kecamatan" value={santri.kecamatan} />
            <DetailRow label="Kabupaten/Kota" value={santri.kabupaten} />
            <DetailRow label="Provinsi" value={santri.provinsi} />
          </dl>
        </div>
      </div>
    </div>
  );
}