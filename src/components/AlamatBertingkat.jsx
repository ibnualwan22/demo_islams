// File: src/components/AlamatBertingkat.jsx
// Versi baru: mendukung onAlamatChange dengan objek terstruktur
// Props:
//   title         - Judul blok
//   onAlamatChange(obj) - Callback dipanggil dengan { provinsi, kabupaten, kecamatan, desa }
//   initialData   - Object { provinsi, kabupaten, kecamatan, desa } untuk mode edit (hanya teks, tidak pre-select dropdown)

"use client";

import { useState, useEffect, useCallback } from 'react';

export default function AlamatBertingkat({ title, onAlamatChange, initialData }) {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegency, setSelectedRegency] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  const [isRegenciesLoading, setIsRegenciesLoading] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);
  const [isVillagesLoading, setIsVillagesLoading] = useState(false);

  // Ambil data provinsi saat mount
  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  // Ambil kabupaten saat provinsi berubah
  useEffect(() => {
    if (selectedProvince) {
      setIsRegenciesLoading(true);
      setRegencies([]); setSelectedRegency('');
      setDistricts([]); setSelectedDistrict('');
      setVillages([]); setSelectedVillage('');
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
        .then(res => res.json())
        .then(data => setRegencies(data))
        .finally(() => setIsRegenciesLoading(false));
    }
  }, [selectedProvince]);

  // Ambil kecamatan saat kabupaten berubah
  useEffect(() => {
    if (selectedRegency) {
      setIsDistrictsLoading(true);
      setDistricts([]); setSelectedDistrict('');
      setVillages([]); setSelectedVillage('');
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data))
        .finally(() => setIsDistrictsLoading(false));
    }
  }, [selectedRegency]);

  // Ambil desa saat kecamatan berubah
  useEffect(() => {
    if (selectedDistrict) {
      setIsVillagesLoading(true);
      setVillages([]); setSelectedVillage('');
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict}.json`)
        .then(res => res.json())
        .then(data => setVillages(data))
        .finally(() => setIsVillagesLoading(false));
    }
  }, [selectedDistrict]);

  // Laporkan data terstruktur ke parent setiap kali pilihan berubah
  const reportChange = useCallback(() => {
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
    const regencyName = regencies.find(r => r.id === selectedRegency)?.name || '';
    const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
    const villageName = villages.find(v => v.id === selectedVillage)?.name || '';

    // Kirim objek terstruktur ke parent
    onAlamatChange({
      provinsi: provinceName,
      kabupaten: regencyName,
      kecamatan: districtName,
      desa: villageName,
    });
  }, [selectedProvince, selectedRegency, selectedDistrict, selectedVillage, provinces, regencies, districts, villages, onAlamatChange]);

  useEffect(() => {
    reportChange();
  }, [reportChange]);

  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-md">
      <h3 className="font-semibold text-gray-800">{title}</h3>

      {/* Tampilkan data tersimpan saat ada initialData (mode edit) */}
      {initialData && (initialData.kabupaten || initialData.provinsi) && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2 border">
          <span className="font-medium">Tersimpan:</span>{' '}
          {[initialData.desa, initialData.kecamatan, initialData.kabupaten, initialData.provinsi]
            .filter(Boolean)
            .join(', ') || '—'}
          <span className="ml-2 text-blue-500">(Pilih di bawah untuk mengubah)</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Provinsi</label>
        <select
          value={selectedProvince}
          onChange={e => setSelectedProvince(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Pilih Provinsi</option>
          {provinces.map(prov => <option key={prov.id} value={prov.id}>{prov.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kabupaten/Kota</label>
        <select
          value={selectedRegency}
          onChange={e => setSelectedRegency(e.target.value)}
          disabled={!selectedProvince || isRegenciesLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
        >
          <option value="">{isRegenciesLoading ? 'Memuat...' : 'Pilih Kabupaten/Kota'}</option>
          {regencies.map(reg => <option key={reg.id} value={reg.id}>{reg.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          disabled={!selectedRegency || isDistrictsLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
        >
          <option value="">{isDistrictsLoading ? 'Memuat...' : 'Pilih Kecamatan'}</option>
          {districts.map(dist => <option key={dist.id} value={dist.id}>{dist.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Desa/Kelurahan</label>
        <select
          value={selectedVillage}
          onChange={e => setSelectedVillage(e.target.value)}
          disabled={!selectedDistrict || isVillagesLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
        >
          <option value="">{isVillagesLoading ? 'Memuat...' : 'Pilih Desa/Kelurahan'}</option>
          {villages.map(vill => <option key={vill.id} value={vill.id}>{vill.name}</option>)}
        </select>
      </div>
    </div>
  );
}