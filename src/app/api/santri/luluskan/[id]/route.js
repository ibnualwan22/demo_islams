// File: src/app/api/santri/luluskan/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const { id } = params;
  const { tahunKeluar } = await request.json();

  try {
    // Gunakan transaksi untuk memastikan kedua operasi berhasil atau keduanya gagal
    const result = await prisma.$transaction(async (tx) => {
      // 1. Ambil data santri yang akan diluluskan
      const santri = await tx.santri.findUnique({
        where: { id: id },
      });

      if (!santri) {
        throw new Error('Santri tidak ditemukan.');
      }

      if (santri.status !== 'AKTIF') {
        throw new Error('Santri ini sudah tidak aktif.');
      }

      // 2. Buat entri baru di tabel Alumni
      const newAlumni = await tx.alumni.create({
        data: {
          nama: santri.nama,
          alamatAsli: santri.alamat, // Menggunakan alamat kabupaten dari data santri
          alamatDomisili: santri.alamat, // Default disamakan, bisa diedit nanti
          tahunMasuk: santri.tahunMasuk,
          noHp: santri.noHpOrangTua, // Menggunakan No. HP orang tua sebagai default
          tahunKeluar: tahunKeluar,
        },
      });

      // 3. Update status santri menjadi 'LULUS' (atau 'TIDAK AKTIF')
      const updatedSantri = await tx.santri.update({
        where: { id: id },
        data: { status: 'LULUS' },
      });

      return { newAlumni, updatedSantri };
    });

    return NextResponse.json({ message: 'Proses berhasil', data: result });

  } catch (error) {
    console.error(`Gagal memproses kelulusan untuk ID ${id}:`, error);
    return NextResponse.json({ message: error.message || "Terjadi kesalahan pada server." }, { status: 500 });
  }
}