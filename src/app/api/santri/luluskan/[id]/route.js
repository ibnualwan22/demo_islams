// File: src/app/api/santri/luluskan/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const { id } = params;
  const dataPayload = await request.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const santri = await tx.santri.findUnique({
        where: { id: id },
      });

      if (!santri) throw new Error('Santri tidak ditemukan.');
      if (santri.status !== 'AKTIF') throw new Error('Santri ini sudah tidak aktif.');

      // Buat entri baru di tabel Alumni dengan data lengkap dari payload dan data santri
      const newAlumni = await tx.alumni.create({
        data: {
          nama: dataPayload.nama || santri.nama,
          gender: santri.gender,
          
          provinsiAsli: santri.provinsi,
          kabupatenAsli: santri.kabupaten,
          kecamatanAsli: santri.kecamatan,
          desaAsli: santri.desa,
          
          provinsiDomisili: santri.provinsi,
          kabupatenDomisili: santri.kabupaten,
          kecamatanDomisili: santri.kecamatan,
          desaDomisili: santri.desa,
          
          detailAlamat: dataPayload.detailAlamat || null,
          
          tahunMasuk: dataPayload.tahunMasuk ? parseInt(dataPayload.tahunMasuk) : santri.tahunMasuk,
          tahunKeluar: dataPayload.tahunKeluar ? parseInt(dataPayload.tahunKeluar) : null,
          angkatanAmtsilati: dataPayload.angkatanAmtsilati ? parseInt(dataPayload.angkatanAmtsilati) : null,
          noHp: dataPayload.noHp || santri.noHpOrangTua,
          
          // Lulusan dari admin selalu diset APPROVED langsung
          status: 'APPROVED',
        },
      });

      // Update status santri menjadi LULUS
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