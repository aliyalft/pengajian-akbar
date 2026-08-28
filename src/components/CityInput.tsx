'use client';

import { useEffect, useState } from 'react';
import { getAllCities } from '@/lib/indonesia-regions';

type City = {
  code: string;
  name: string;
};

type CityInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CityInput({
  value,
  onChange,
}: CityInputProps) {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    getAllCities().then(setCities);
  }, []);

  return (
    <>
      <input
        id="city"
        type="text"
        className="form-input"
        placeholder="Ketik nama kota / kabupaten..."
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        list="indonesia-cities"
        required
      />

      <datalist id="indonesia-cities">
        {cities.map((city) => (
          <option
            key={city.code}
            value={city.name}
          />
        ))}
      </datalist>
    </>
  );
}