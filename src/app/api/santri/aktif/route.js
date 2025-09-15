// File: src/app/api/santri/aktif/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const santriAktif = await prisma.santri.findMany({
      where: { status: 'AKTIF' }, // <-- FILTER UTAMA
      orderBy: { nama: 'asc' },
    });
    return NextResponse.json(santriAktif);
  } catch (error) {
    console.error("Gagal mengambil data santri aktif:", error);
    return NextResponse.json({ message: "Gagal mengambil data." }, { status: 500 });
  }
}