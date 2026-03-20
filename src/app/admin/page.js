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

async function getDashboardStats() {
  try {
    const regions = ['Magelang', 'Wonosobo', 'Temanggung', 'Banjarnegara'];
    const queries = [
      prisma.santri.count({ where: { status: 'AKTIF' } }),
      prisma.alumni.count({ where: { status: 'APPROVED' } }),
    ];

    regions.forEach(region => {
      const santriWhereClause = region === 'Magelang'
        ? { status: 'AKTIF', OR: [{ kabupaten: 'Kab. Magelang' }, { kabupaten: 'Kota Magelang' }] }
        : { status: 'AKTIF', kabupaten: { contains: region, mode: 'insensitive' } };

      // Filter berdasarkan kabupatenDomisili (utama) atau kabupatenAsli (fallback)
      const alumniWhereClause = {
        status: 'APPROVED',
        OR: [
          { kabupatenDomisili: { contains: region, mode: 'insensitive' } },
          { kabupatenAsli: { contains: region, mode: 'insensitive' } },
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
    // Hanya alumni APPROVED
    const alumniData = await prisma.alumni.groupBy({ by: ['tahunMasuk'], _count: { tahunMasuk: true }, where: { tahunMasuk: { not: null }, status: 'APPROVED' } });
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
    // Hanya alumni APPROVED
    const alumniData = await prisma.alumni.groupBy({ by: ['tahunKeluar'], _count: { tahunKeluar: true }, where: { tahunKeluar: { not: null }, status: 'APPROVED' }, orderBy: { tahunKeluar: 'asc' } });
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
const StatCard = ({ title, value, icon: Icon, description, colorClass = "from-sky-500 to-blue-600" }) => (
  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 group relative">
    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorClass}`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white z-10 relative">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} text-white shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent className="bg-white z-10 relative pt-2">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Admin</h1>
        <p className="text-slate-500">Ringkasan statistik data Santri dan Alumni ISLAMS.</p>
      </div>

      {/* Total Keseluruhan */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
          <div className="w-1.5 h-5 bg-sky-500 rounded-full"></div>
          Total Keseluruhan
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Santri Aktif" value={stats.totalSantri} icon={Users} description="Total santri berstatus aktif" colorClass="from-emerald-400 to-teal-500" />
          <StatCard title="Alumni" value={stats.totalAlumni} icon={UserCheck} description="Total alumni yang terdata (Approved)" colorClass="from-blue-400 to-indigo-500" />
        </div>
      </div>

      {/* Rincian per Kabupaten */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
          <div className="w-1.5 h-5 bg-sky-500 rounded-full"></div>
          Rincian per Wilayah
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Santri Magelang" value={stats.santriMagelang} icon={MapPin} description="Kota & Kab. Magelang" colorClass="from-amber-400 to-orange-500" />
          <StatCard title="Alumni Magelang" value={stats.alumniMagelang} icon={MapPin} description="Kota & Kab. Magelang" colorClass="from-slate-400 to-slate-600" />
          <StatCard title="Santri Wonosobo" value={stats.santriWonosobo} icon={MapPin} description="Kab. Wonosobo" colorClass="from-amber-400 to-orange-500" />
          <StatCard title="Alumni Wonosobo" value={stats.alumniWonosobo} icon={MapPin} description="Kab. Wonosobo" colorClass="from-slate-400 to-slate-600" />
          <StatCard title="Santri Temanggung" value={stats.santriTemanggung} icon={MapPin} description="Kab. Temanggung" colorClass="from-amber-400 to-orange-500" />
          <StatCard title="Alumni Temanggung" value={stats.alumniTemanggung} icon={MapPin} description="Kab. Temanggung" colorClass="from-slate-400 to-slate-600" />
          <StatCard title="Santri Banjarnegara" value={stats.santriBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" colorClass="from-amber-400 to-orange-500" />
          <StatCard title="Alumni Banjarnegara" value={stats.alumniBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" colorClass="from-slate-400 to-slate-600" />
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