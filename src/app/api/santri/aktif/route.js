// File: src/app/api/santri/aktif/route.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const santriAktif = await prisma.santri.findMany({
      where: { status: 'AKTIF' },
      orderBy: { nama: 'asc' },
      select: { id: true, nama: true, tahunMasuk: true, daerah: true }, // aman untuk UI
    });
    // kembalikan ARRAY murni
    return NextResponse.json(santriAktif, { status: 200 });
  } catch (error) {
    console.error('[/api/santri/aktif] gagal:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: error?.message ?? 'Unknown' },
      { status: 500 }
    );
  }
}
