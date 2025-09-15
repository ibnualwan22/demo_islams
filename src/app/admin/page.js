// File: src/app/admin/page.jsx

import { PrismaClient } from '@prisma/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, MapPin } from 'lucide-react';
import TahunMasukChart from "@/components/TahunMasukChart";
import TahunKeluarChart from "@/components/TahunKeluarChart";

const prisma = new PrismaClient();

// 1. FUNGSI UNTUK STATISTIK WILAYAH (dari kode Anda)
async function getDashboardStats() {
  try {
    const regions = ['Magelang', 'Wonosobo', 'Temanggung', 'Banjarnegara'];
    const queries = [
      prisma.santri.count({ where: { status: 'AKTIF' } }),
      prisma.alumni.count(),
    ];

    regions.forEach(region => {
      const santriWhereClause = region === 'Magelang'
        ? { status: 'AKTIF', OR: [{ kabupaten: 'Kab. Magelang' }, { kabupaten: 'Kota Magelang' }] }
        : { status: 'AKTIF', kabupaten: { contains: region, mode: 'insensitive' } };
      
      const alumniWhereClause = { 
        OR: [
          { alamatAsli: { contains: region, mode: 'insensitive' } },
          { alamatDomisili: { contains: region, mode: 'insensitive' } }
        ]
      };

      queries.push(prisma.santri.count({ where: santriWhereClause }));
      queries.push(prisma.alumni.count({ where: alumniWhereClause }));
    });

    const results = await prisma.$transaction(queries);

    return {
      totalSantri: results[0],
      totalAlumni: results[1],
      santriMagelang: results[2],
      alumniMagelang: results[3],
      santriWonosobo: results[4],
      alumniWonosobo: results[5],
      santriTemanggung: results[6],
      alumniTemanggung: results[7],
      santriBanjarnegara: results[8],
      alumniBanjarnegara: results[9],
    };
  } catch (error) {
    console.error("Gagal mengambil statistik dashboard:", error);
    return {
      totalSantri: 0, totalAlumni: 0, santriMagelang: 0, alumniMagelang: 0,
      santriWonosobo: 0, alumniWonosobo: 0, santriTemanggung: 0, alumniTemanggung: 0,
      santriBanjarnegara: 0, alumniBanjarnegara: 0
    };
  }
}

// 2. FUNGSI UNTUK GRAFIK TAHUN MASUK
async function getDataTahunMasuk() {
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
    return {
      labels: sortedYears,
      data: sortedYears.map(year => combinedData[year]),
    };
  } catch (error) {
    console.error("Gagal mengambil data tahun masuk:", error);
    return { labels: [], data: [] };
  }
}

// 3. FUNGSI UNTUK GRAFIK TAHUN KELUAR
async function getDataTahunKeluar() {
  try {
    const alumniData = await prisma.alumni.groupBy({ by: ['tahunKeluar'], _count: { tahunKeluar: true }, where: { tahunKeluar: { not: null } }, orderBy: { tahunKeluar: 'asc' } });
    return {
      labels: alumniData.map(group => group.tahunKeluar.toString()),
      data: alumniData.map(group => group._count.tahunKeluar),
    };
  } catch (error) {
    console.error("Gagal mengambil data tahun keluar:", error);
    return { labels: [], data: [] };
  }
}

// Komponen Card Statistik (dari kode Anda)
const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Halaman Dashboard Utama
export default async function DashboardPage() {
  // Panggil semua fungsi untuk mendapatkan data
  const stats = await getDashboardStats();
  const dataTahunMasuk = await getDataTahunMasuk();
  const dataTahunKeluar = await getDataTahunKeluar();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      {/* Total Keseluruhan */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Total Keseluruhan</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Santri Aktif" value={stats.totalSantri} icon={Users} description="Total santri berstatus aktif" />
          <StatCard title="Alumni" value={stats.totalAlumni} icon={UserCheck} description="Total alumni yang terdata" />
        </div>
      </div>

      {/* Rincian per Kabupaten */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Rincian per Wilayah</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Santri Magelang" value={stats.santriMagelang} icon={MapPin} description="Kota & Kab. Magelang" />
          <StatCard title="Alumni Magelang" value={stats.alumniMagelang} icon={MapPin} description="Kota & Kab. Magelang" />
          <StatCard title="Santri Wonosobo" value={stats.santriWonosobo} icon={MapPin} description="Kab. Wonosobo" />
          <StatCard title="Alumni Wonosobo" value={stats.alumniWonosobo} icon={MapPin} description="Kab. Wonosobo" />
          <StatCard title="Santri Temanggung" value={stats.santriTemanggung} icon={MapPin} description="Kab. Temanggung" />
          <StatCard title="Alumni Temanggung" value={stats.alumniTemanggung} icon={MapPin} description="Kab. Temanggung" />
          <StatCard title="Santri Banjarnegara" value={stats.santriBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" />
          <StatCard title="Alumni Banjarnegara" value={stats.alumniBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" />
        </div>
      </div>

      {/* Bagian Grafik */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <TahunMasukChart chartData={dataTahunMasuk} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <TahunKeluarChart chartData={dataTahunKeluar} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}