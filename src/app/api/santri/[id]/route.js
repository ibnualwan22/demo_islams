// File: src/app/api/santri/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fungsi untuk MENGAMBIL satu santri berdasarkan ID
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const santri = await prisma.santri.findUnique({
      where: { id: id },
    });
    if (!santri) {
      return NextResponse.json({ message: "Data tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(santri);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data." }, { status: 500 });
  }
}

// Fungsi untuk MEMPERBARUI data santri
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updatedSantri = await prisma.santri.update({
      where: { id: id },
      data: data,
    });
    return NextResponse.json(updatedSantri);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui data." }, { status: 500 });
  }
}