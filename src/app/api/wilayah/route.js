// File: src/app/api/wilayah/route.js

import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(request) {
  // Ambil parameter 'name' dari URL request yang masuk
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Parameter "name" diperlukan' }, { status: 400 });
  }

  try {
    // Teruskan request ke API eksternal
    const apiResponse = await fetch(`https://backapp.amtsilatipusat.com/api/regencies?name=${name}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`Gagal mengambil data dari API eksternal: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error di proxy API wilayah:", error);
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 });
  }
}