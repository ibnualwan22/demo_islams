// File: src/app/api/public/search-alumni/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  // Ambil parameter 'name' dari URL, contoh: /api/public/search-alumni?name=fulan
  const { searchParams } = new URL(request.url);
  const nameQuery = searchParams.get('name');

  if (!nameQuery || nameQuery.length < 3) {
    return NextResponse.json(
      { message: 'Query pencarian harus memiliki minimal 3 karakter.' },
      { status: 400 }
    );
  }

  try {
    // Cari alumni yang namanya "mengandung" query, tidak case-sensitive
    const alumniFound = await prisma.alumni.findMany({
      where: {
        nama: {
          contains: nameQuery,
          mode: 'insensitive', // Tidak peduli huruf besar/kecil
        },
      },
      // Kita hanya kirim data yang aman untuk ditampilkan publik
      select: {
        id: true,
        nama: true,
        tahunKeluar: true,
        alamatDomisili: true,
        alamatAsli: true,
      },
    });

    return NextResponse.json(alumniFound);

  } catch (error) {
    console.error("Error saat mencari alumni:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}