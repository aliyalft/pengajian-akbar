import {
  getProvinces,
  getRegenciesByProvince,
} from '@id-region-data/data';

export type CityOption = {
  code: string;
  name: string;
};

export async function getAllCities(): Promise<CityOption[]> {
  const provinces = await getProvinces();

  const results = await Promise.all(
    provinces.map((province) =>
      getRegenciesByProvince(province.code)
    )
  );

  return results
    .flat()
    .sort((a, b) =>
      a.name.localeCompare(
        b.name,
        'id'
      )
    );
}