// File: src/components/AutocompleteAlamat.jsx

"use client";

import { useState, useEffect, useCallback } from 'react';

// Ini adalah custom hook untuk debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function AutocompleteAlamat({ label, value, onSelect }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const debouncedQuery = useDebounce(query, 500); // Tunggu 500ms setelah user berhenti mengetik

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsLoading(true);
      fetch(`/api/wilayah?name=${debouncedQuery}`)        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching regencies:", error);
          setIsLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (result) => {
    setQuery(result.label);
    onSelect(result.label);
    setShowResults(false);
    setResults([]);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowResults(true);
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowResults(false), 200)} // Sembunyikan saat klik di luar
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {showResults && (query.length > 2) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading && <li className="px-4 py-2 text-gray-500">Mencari...</li>}
          {!isLoading && results.length === 0 && debouncedQuery.length > 2 && (
            <li className="px-4 py-2 text-gray-500">Tidak ditemukan.</li>
          )}
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-50"
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}