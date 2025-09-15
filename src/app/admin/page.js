// File: src/app/page.js

import { PrismaClient } from '@prisma/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, MapPin } from 'lucide-react'; // Menggunakan ikon dari lucide-react (bawaan shadcn)

const prisma = new PrismaClient();

// Fungsi untuk mengambil semua data statistik yang kita butuhkan
async function getDashboardStats() {
  try {
    // Daftar kabupaten untuk dihitung
    const regions = ['Magelang', 'Wonosobo', 'Temanggung', 'Banjarnegara'];

    // Menyiapkan semua query count dalam sebuah array
    const queries = [
      prisma.santri.count({ where: { status: 'AKTIF' } }),
      prisma.alumni.count(),
    ];

    // Menambahkan query count untuk setiap kabupaten
    regions.forEach(region => {
      // Khusus Magelang, kita hitung "Kota" dan "Kab."
      const santriWhereClause = region === 'Magelang'
        ? { status: 'AKTIF', OR: [{ kabupaten: 'Kab. Magelang' }, { kabupaten: 'Kota Magelang' }] }
        : { status: 'AKTIF', kabupaten: { contains: region, mode: 'insensitive' } };

      const alumniWhereClause = {
        alamatAsli: { contains: region, mode: 'insensitive' }
      };

      queries.push(prisma.santri.count({ where: santriWhereClause }));
      queries.push(prisma.alumni.count({ where: alumniWhereClause }));
    });

    // Menjalankan semua query sekaligus dengan $transaction
    const results = await prisma.$transaction(queries);

    // Memetakan hasil kembali ke objek yang mudah dibaca
    const stats = {
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

    return stats;
  } catch (error) {
    console.error("Gagal mengambil statistik dashboard:", error);
    // Mengembalikan nilai default jika terjadi error
    return {
      totalSantri: 0, totalAlumni: 0, santriMagelang: 0, alumniMagelang: 0,
      santriWonosobo: 0, alumniWonosobo: 0, santriTemanggung: 0, alumniTemanggung: 0,
      santriBanjarnegara: 0, alumniBanjarnegara: 0
    };
  }
}

// Komponen kecil untuk kartu statistik agar tidak mengulang kode
const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
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
};


export default async function DashboardPage() {
  // Panggil fungsi untuk mendapatkan data
  const stats = await getDashboardStats();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Total Keseluruhan */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Total Keseluruhan</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Santri Aktif" value={stats.totalSantri} icon={Users} description="Total santri berstatus aktif" />
        <StatCard title="Alumni" value={stats.totalAlumni} icon={UserCheck} description="Total alumni yang terdata" />
      </div>

      {/* Rincian per Kabupaten */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Rincian per Wilayah</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Magelang */}
        <StatCard title="Santri Magelang" value={stats.santriMagelang} icon={MapPin} description="Kota & Kab. Magelang" />
        <StatCard title="Alumni Magelang" value={stats.alumniMagelang} icon={MapPin} description="Kota & Kab. Magelang" />

        {/* Wonosobo */}
        <StatCard title="Santri Wonosobo" value={stats.santriWonosobo} icon={MapPin} description="Kab. Wonosobo" />
        <StatCard title="Alumni Wonosobo" value={stats.alumniWonosobo} icon={MapPin} description="Kab. Wonosobo" />

        {/* Temanggung */}
        <StatCard title="Santri Temanggung" value={stats.santriTemanggung} icon={MapPin} description="Kab. Temanggung" />
        <StatCard title="Alumni Temanggung" value={stats.alumniTemanggung} icon={MapPin} description="Kab. Temanggung" />

        {/* Banjarnegara */}
        <StatCard title="Santri Banjarnegara" value={stats.santriBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" />
        <StatCard title="Alumni Banjarnegara" value={stats.alumniBanjarnegara} icon={MapPin} description="Kab. Banjarnegara" />
      </div>

    </div>
  );
}