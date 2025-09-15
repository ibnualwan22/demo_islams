// File: src/components/TahunKeluarChart.jsx

"use client";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TahunKeluarChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Jumlah Alumni Berdasarkan Tahun Keluar', // <-- Judul diubah
        font: {
          size: 16
        }
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0
            }
        }
    }
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Jumlah Alumni',
        data: chartData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // <-- Warna diubah (hijau)
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}