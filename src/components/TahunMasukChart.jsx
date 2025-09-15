// File: src/components/TahunMasukChart.jsx

"use client"; // <-- Wajib untuk komponen interaktif

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Daftarkan komponen-komponen Chart.js yang akan kita gunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TahunMasukChart({ chartData }) {
  // Opsi untuk kustomisasi grafik
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Jumlah Santri & Alumni Berdasarkan Tahun Masuk',
        font: {
          size: 16
        }
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                // Pastikan sumbu Y hanya menampilkan angka bulat
                precision: 0
            }
        }
    }
  };

  // Struktur data yang dibutuhkan oleh Chart.js
  const data = {
    labels: chartData.labels, // Tahun-tahun, misal: ['2020', '2021', '2022']
    datasets: [
      {
        label: 'Jumlah Orang',
        data: chartData.data, // Jumlah orang per tahun, misal: [15, 25, 30]
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Warna biru
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}