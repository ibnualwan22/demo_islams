// File: src/app/api/sync-santri/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daftar kabupaten yang datanya ingin kita ambil
const TARGET_KABUPATEN = [
    "Kab. Magelang",
    "Kota Magelang",
    "Kab. Temanggung",
    "Kab. Wonosobo",
    "Kab. Banjarnegara"
];

// Next.js secara default membuat fungsi ini di-cache.
// Kita beritahu untuk tidak melakukan cache agar selalu mengambil data terbaru.
export const revalidate = 0;

export async function GET() {
    console.log("Memulai proses sinkronisasi data santri...");
    try {
        // 1. Ambil data dari API eksternal
        // Kita set limit=2000 untuk mengambil lebih banyak data sekaligus
        const response = await fetch('https://sigap.amtsilatipusat.com/api/student?limit=2000', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            }
        });        
        // Cek jika request ke API gagal
        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari API sigap: ${response.statusText}`);
        }

        const data = await response.json();

        // Cek jika format data dari API tidak sesuai harapan
        if (!data.success || !Array.isArray(data.data)) {
            throw new Error("Format data dari API tidak valid.");
        }

        // 2. Filter santri berdasarkan kabupaten target
        const santriDariKorda = data.data.filter(santri => 
            TARGET_KABUPATEN.includes(santri.regency)
        );

        console.log(`Ditemukan ${santriDariKorda.length} santri dari area korda.`);

        if (santriDariKorda.length === 0) {
            return NextResponse.json({ message: "Tidak ada santri dari area korda yang ditemukan di API." });
        }
        
        // 3. Proses dan simpan setiap data santri ke database kita
        for (const santri of santriDariKorda) {
            
            // Logika otomatis untuk menentukan tahun masuk dari NIS
            let tahunMasukOtomatis = null;
            const nis = santri.nis;
            // Cek jika NIS diawali 'A' ATAU 'B'
            if (nis && (nis.startsWith('A') || nis.startsWith('B')) && nis.length > 3) {
                const yearDigits = nis.substring(1, 3);
                if (!isNaN(yearDigits)) {
                    tahunMasukOtomatis = parseInt(`20${yearDigits}`);
                }
            }
            
            // Gunakan `upsert`:
            // - Jika santri (berdasarkan apiId) sudah ada, `update` datanya.
            // - Jika belum ada, `create` data baru.
            await prisma.santri.upsert({
                where: { nis: santri.nis }, // Kunci unik untuk cek data
                update: {
                    // Data yang di-update jika sudah ada
                    nama: santri.name,
                    asrama: santri.activeDormitory,
                    provinsi: santri.provinnce || santri.province, // Menangani typo 'provinnce' dari API
                    kabupaten: santri.regency,
                    kecamatan: santri.district,
                    desa: santri.village,
                    namaAyah: santri.fatherName,
                    namaIbu: santri.motherName,
                    noHpOrangTua: santri.parrentPhone,
                    kelasFormal: santri.formalClass,
                    kelasNgaji: santri.activeClass,
                    ttl: santri.ttl,
                    tahunMasuk: tahunMasukOtomatis, // <-- TAMBAHKAN BARIS INI
                    // PENTING: Kita tidak meng-update `tahunMasuk` di sini.
                    // Ini agar data yang sudah diubah manual oleh admin tidak tertimpa.
                },
                create: {
                    // Data yang dibuat jika belum ada
                    nis: santri.nis,
                    nama: santri.name,
                    asrama: santri.activeDormitory,
                    provinsi: santri.provinnce || santri.province, // Menangani typo 'provinnce' dari API
                    kabupaten: santri.regency,
                    kecamatan: santri.district,
                    desa: santri.village,
                    namaAyah: santri.fatherName,
                    namaIbu: santri.motherName,
                    noHpOrangTua: santri.parrentPhone,
                    kelasFormal: santri.formalClass,
                    kelasNgaji: santri.activeClass,
                    ttl: santri.ttl,
                    tahunMasuk: tahunMasukOtomatis, // `tahunMasuk` hanya diisi saat pembuatan pertama.
                }
            });
        }
        
        console.log("Sinkronisasi berhasil diselesaikan.");
        return NextResponse.json({ 
            message: 'Sinkronisasi berhasil!', 
            totalDataDiApi: data.data.length,
            dataDisimpan: santriDariKorda.length 
        });

    } catch (error) {
        console.error("Terjadi error saat sinkronisasi:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat sinkronisasi.', details: error.message }, { status: 500 });
    } finally {
        // Pastikan koneksi prisma ditutup setelah selesai
        await prisma.$disconnect();
    }
}