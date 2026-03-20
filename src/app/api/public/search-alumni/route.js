// File: src/app/api/public/search-alumni/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nameQuery = searchParams.get('name');

  if (!nameQuery || nameQuery.length < 3) {
    return NextResponse.json(
      { message: 'Query pencarian harus memiliki minimal 3 karakter.' },
      { status: 400 }
    );
  }

  try {
    const alumniFound = await prisma.alumni.findMany({
      where: {
        status: 'APPROVED',
        nama: {
          contains: nameQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        nama: true,
        angkatanAmtsilati: true,
        // Kirim keduanya agar frontend bisa pilih domisili, fallback ke asli
        kabupatenDomisili: true,
        kabupatenAsli: true,
      },
    });

    return NextResponse.json(alumniFound);

  } catch (error) {
    console.error("Error saat mencari alumni:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}