// File: src/app/api/alumni/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const alumni = await prisma.alumni.findMany({
      orderBy: {
        createdAt: 'desc', // Tampilkan yang terbaru di atas
      },
    });
    return NextResponse.json(alumni);
  } catch (error) {
    console.error("Gagal mengambil data alumni:", error);
    return NextResponse.json({ message: "Gagal mengambil data." }, { status: 500 });
  }
}
// Fungsi ini akan menangani request POST dari form tambah alumni
export async function POST(request) {
  try {
    // 1. Ambil data yang dikirim dari form
    const data = await request.json();

    // 2. Gunakan Prisma untuk membuat record baru di tabel 'Alumni'
    const newAlumni = await prisma.alumni.create({
      data: data, // Data dari form langsung cocok dengan skema kita
    });

    // 3. Kirim kembali data yang baru dibuat sebagai konfirmasi
    return NextResponse.json(newAlumni, { status: 201 }); // 201 artinya 'Created'

  } catch (error) {
    console.error("Gagal membuat data alumni:", error);
    // Kirim response error jika terjadi masalah
    return NextResponse.json({ message: "Terjadi kesalahan saat menyimpan data." }, { status: 500 });
  }
}