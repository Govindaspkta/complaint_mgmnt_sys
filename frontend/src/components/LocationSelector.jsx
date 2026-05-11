import { useState, useEffect } from 'react';
import provincesData from '../data/provinces.json';
import districtsData from '../data/districts.json';
import localLevelsData from '../data/local_levels.json';

export default function LocationSelector({ onLocationChange }) {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [ward, setWard] = useState('');

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);

  // Province Change
  useEffect(() => {
    if (province) {
      const dists = districtsData.filter(d => d.province_id === parseInt(province));
      setFilteredDistricts(dists);
    } else {
      setFilteredDistricts([]);
    }
    setDistrict('');
    setMunicipality('');
    setWard('');
  }, [province]);

  // District Change
  useEffect(() => {
    if (district) {
      const munis = localLevelsData.filter(m => m.district_id === parseInt(district));
      setFilteredMunicipalities(munis);
    } else {
      setFilteredMunicipalities([]);
    }
    setMunicipality('');
    setWard('');
  }, [district]);

  // Send complete location data to parent
  useEffect(() => {
    if (province && district && municipality && ward) {
      const selProvince = provincesData.find(p => p.province_id === parseInt(province));
      const selDistrict = districtsData.find(d => d.district_id === parseInt(district));
      const selMuni = localLevelsData.find(m => m.municipality_id === parseInt(municipality));

      onLocationChange({
        province_id: parseInt(province),
        province_name: selProvince?.name || '',
        province_nepali: selProvince?.nepali_name || '',

        district_id: parseInt(district),
        district_name: selDistrict?.name || '',
        district_nepali: selDistrict?.nepali_name || '',

        municipality_id: parseInt(municipality),
        municipality_name: selMuni?.name || '',
        municipality_nepali: selMuni?.nepali_name || '',

        ward: parseInt(ward),
      });
    }
  }, [province, district, municipality, ward]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Province / प्रदेश
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select Province</option>
          {provincesData.map(p => (
            <option key={p.province_id} value={p.province_id}>
              {p.name} - {p.nepali_name}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          District / जिल्ला
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!province}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="">Select District</option>
          {filteredDistricts.map(d => (
            <option key={d.district_id} value={d.district_id}>
              {d.name} - {d.nepali_name}
            </option>
          ))}
        </select>
      </div>

      {/* Municipality */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Municipality / गाउँपालिका / नगरपालिका
        </label>
        <select
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          disabled={!district}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="">Select Municipality</option>
          {filteredMunicipalities.map(m => (
            <option key={m.municipality_id} value={m.municipality_id}>
              {m.name} - {m.nepali_name}
            </option>
          ))}
        </select>
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ward Number / वडा नम्बर
        </label>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          disabled={!municipality}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="">Select Ward</option>
          {Array.from({ length: 33 }, (_, i) => i + 1).map(w => (
            <option key={w} value={w}>Ward {w}</option>
          ))}
        </select>
      </div>
    </div>
  );
}