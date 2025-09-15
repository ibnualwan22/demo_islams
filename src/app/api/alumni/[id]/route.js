// File: src/app/api/alumni/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const alumni = await prisma.alumni.findUnique({
      where: { id: id },
    });
    if (!alumni) {
      return NextResponse.json({ message: "Data tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(alumni);
  } catch (error) {
    console.error(`Gagal mengambil data dengan ID ${id}:`, error);
    return NextResponse.json({ message: "Gagal mengambil data." }, { status: 500 });
  }
}


// FUNGSI BARU: PUT untuk memperbarui data
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updatedAlumni = await prisma.alumni.update({
      where: { id: id },
      data: data,
    });
    return NextResponse.json(updatedAlumni);
  } catch (error) {
    console.error(`Gagal update data dengan ID ${id}:`, error);
    if (error.code === 'P2025') {
       return NextResponse.json({ message: "Data tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ message: "Gagal memperbarui data." }, { status: 500 });
  }
}

// Fungsi DELETE untuk menghapus data berdasarkan ID
export async function DELETE(request, { params }) {
  const { id } = params; // Ambil ID dari URL

  try {
    await prisma.alumni.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Data berhasil dihapus." }, { status: 200 });
  } catch (error) {
    console.error(`Gagal menghapus data dengan ID ${id}:`, error);
    // Handle kasus jika ID tidak ditemukan
    if (error.code === 'P2025') {
       return NextResponse.json({ message: "Data tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ message: "Gagal menghapus data." }, { status: 500 });
  }
}