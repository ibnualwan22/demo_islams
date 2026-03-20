// File: src/app/api/public/stats/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getDashboardStats() {
  try {
    const regions = ['Magelang', 'Wonosobo', 'Temanggung', 'Banjarnegara'];
    const queries = [
      prisma.santri.count({ where: { status: 'AKTIF' } }),
      prisma.alumni.count({ where: { status: 'APPROVED' } }),
    ];
    regions.forEach(region => {
      const sWhere = region === 'Magelang'
        ? { status: 'AKTIF', OR: [{ kabupaten: 'Kab. Magelang' }, { kabupaten: 'Kota Magelang' }] }
        : { status: 'AKTIF', kabupaten: { contains: region, mode: 'insensitive' } };
      // Cek kabupatenDomisili (utama) atau kabupatenAsli (fallback)
      const aWhere = {
        status: 'APPROVED',
        OR: [
          { kabupatenDomisili: { contains: region, mode: 'insensitive' } },
          { kabupatenAsli: { contains: region, mode: 'insensitive' } },
        ]
      };
      queries.push(prisma.santri.count({ where: sWhere }));
      queries.push(prisma.alumni.count({ where: aWhere }));
    });
    const results = await prisma.$transaction(queries);
    return {
      totalSantri: results[0], totalAlumni: results[1],
      santriMagelang: results[2], alumniMagelang: results[3],
      santriWonosobo: results[4], alumniWonosobo: results[5],
      santriTemanggung: results[6], alumniTemanggung: results[7],
      santriBanjarnegara: results[8], alumniBanjarnegara: results[9],
    };
  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
    return {};
  }
}

export async function GET() {
  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}