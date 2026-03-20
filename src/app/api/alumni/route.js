// File: src/app/api/alumni/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Normalisasi nomor HP ke format internasional 62...
 * 08xxx → 628xxx | 628xxx → tetap | lainnya → tetap
 */
function normalizePhoneNumber(noHp) {
  if (!noHp) return noHp;
  const cleaned = noHp.trim().replace(/\s+/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  return cleaned;
}

export async function GET() {
  try {
    const alumni = await prisma.alumni.findMany({
      orderBy: {
        createdAt: 'desc',
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
    const data = await request.json();

    // Normalisasi nomor HP
    if (data.noHp) {
      data.noHp = normalizePhoneNumber(data.noHp);
    }

    // Pastikan status selalu PENDING untuk registrasi baru dari publik
    data.status = data.status || 'PENDING';

    const newAlumni = await prisma.alumni.create({
      data: data,
    });

    return NextResponse.json(newAlumni, { status: 201 });

  } catch (error) {
    console.error("Gagal membuat data alumni:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat menyimpan data." }, { status: 500 });
  }
}