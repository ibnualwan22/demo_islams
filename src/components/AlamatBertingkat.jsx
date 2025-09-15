// File: src/components/AlamatBertingkat.jsx

"use client";

import { useState, useEffect } from 'react';

export default function AlamatBertingkat({ title, onAlamatChange }) {
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

  // Mengambil data provinsi saat komponen dimuat
  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  // Mengambil data kabupaten saat provinsi berubah
  useEffect(() => {
    if (selectedProvince) {
      setIsRegenciesLoading(true);
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
        .then(res => res.json())
        .then(data => setRegencies(data))
        .finally(() => setIsRegenciesLoading(false));
    }
  }, [selectedProvince]);

  // Mengambil data kecamatan saat kabupaten berubah
  useEffect(() => {
    if (selectedRegency) {
      setIsDistrictsLoading(true);
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data))
        .finally(() => setIsDistrictsLoading(false));
    }
  }, [selectedRegency]);

  // Mengambil data desa saat kecamatan berubah
  useEffect(() => {
    if (selectedDistrict) {
      setIsVillagesLoading(true);
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict}.json`)
        .then(res => res.json())
        .then(data => setVillages(data))
        .finally(() => setIsVillagesLoading(false));
    }
  }, [selectedDistrict]);

  // Melaporkan alamat lengkap kembali ke form utama setiap kali pilihan desa berubah
  useEffect(() => {
    if (selectedProvince && selectedRegency && selectedDistrict && selectedVillage) {
      const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
      const regencyName = regencies.find(r => r.id === selectedRegency)?.name || '';
      const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
      const villageName = villages.find(v => v.id === selectedVillage)?.name || '';
      const alamatLengkap = `${villageName}, ${districtName}, ${regencyName}, ${provinceName}`;
      onAlamatChange(alamatLengkap);
    } else {
      onAlamatChange(''); // Kirim string kosong jika belum lengkap
    }
  }, [selectedVillage, selectedDistrict, selectedRegency, selectedProvince, provinces, regencies, districts, villages, onAlamatChange]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setRegencies([]); setSelectedRegency('');
    setDistricts([]); setSelectedDistrict('');
    setVillages([]); setSelectedVillage('');
  };

  const handleRegencyChange = (e) => {
    setSelectedRegency(e.target.value);
    setDistricts([]); setSelectedDistrict('');
    setVillages([]); setSelectedVillage('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setVillages([]); setSelectedVillage('');
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-md">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Provinsi</label>
        <select value={selectedProvince} onChange={handleProvinceChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
          <option value="">Pilih Provinsi</option>
          {provinces.map(prov => <option key={prov.id} value={prov.id}>{prov.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kabupaten/Kota</label>
        <select value={selectedRegency} onChange={handleRegencyChange} disabled={!selectedProvince || isRegenciesLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" required>
          <option value="">{isRegenciesLoading ? 'Memuat...' : 'Pilih Kabupaten/Kota'}</option>
          {regencies.map(reg => <option key={reg.id} value={reg.id}>{reg.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
        <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedRegency || isDistrictsLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" required>
          <option value="">{isDistrictsLoading ? 'Memuat...' : 'Pilih Kecamatan'}</option>
          {districts.map(dist => <option key={dist.id} value={dist.id}>{dist.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Desa/Kelurahan</label>
        <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} disabled={!selectedDistrict || isVillagesLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" required>
          <option value="">{isVillagesLoading ? 'Memuat...' : 'Pilih Desa/Kelurahan'}</option>
          {villages.map(vill => <option key={vill.id} value={vill.id}>{vill.name}</option>)}
        </select>
      </div>
    </div>
  );
}