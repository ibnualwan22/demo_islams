// File: src/app/api/public/charts/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fungsi-fungsi ini kita ambil dari dashboard admin
async function getDataTahunMasuk() {
  // ... (Logika lengkap fungsi getDataTahunMasuk dari admin/page.jsx) ...
  // (Salin-tempel seluruh fungsi yang sudah ada ke sini)
  try {
    const santriData = await prisma.santri.groupBy({ by: ['tahunMasuk'], _count: { tahunMasuk: true }, where: { tahunMasuk: { not: null } } });
    const alumniData = await prisma.alumni.groupBy({ by: ['tahunMasuk'], _count: { tahunMasuk: true }, where: { tahunMasuk: { not: null } } });
    const combinedData = {};
    [...santriData, ...alumniData].forEach(group => {
      const year = group.tahunMasuk;
      const count = group._count.tahunMasuk;
      combinedData[year] = (combinedData[year] || 0) + count;
    });
    const sortedYears = Object.keys(combinedData).sort((a, b) => a - b);
    return { labels: sortedYears, data: sortedYears.map(year => combinedData[year]) };
  } catch (error) { return { labels: [], data: [] }; }
}

async function getDataTahunKeluar() {
  // ... (Logika lengkap fungsi getDataTahunKeluar dari admin/page.jsx) ...
  // (Salin-tempel seluruh fungsi yang sudah ada ke sini)
   try {
     const alumniData = await prisma.alumni.groupBy({ by: ['tahunKeluar'], _count: { tahunKeluar: true }, where: { tahunKeluar: { not: null } }, orderBy: { tahunKeluar: 'asc' } });
     return { labels: alumniData.map(group => group.tahunKeluar.toString()), data: alumniData.map(group => group._count.tahunKeluar) };
   } catch (error) { return { labels: [], data: [] }; }
}

export async function GET() {
  const [dataTahunMasuk, dataTahunKeluar] = await Promise.all([
    getDataTahunMasuk(),
    getDataTahunKeluar()
  ]);
  return NextResponse.json({ dataTahunMasuk, dataTahunKeluar });
}