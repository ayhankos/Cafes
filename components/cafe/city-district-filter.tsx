"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import Select from "react-select";

type District = {
  value: number;
  label: string;
};

type City = {
  value: number;
  label: string;
  districts: District[];
};

export function CityDistrictFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  useEffect(() => {
    const cityParam = searchParams.get("city");
    const districtParam = searchParams.get("district");

    const fetchCities = async () => {
      try {
        const response = await fetch("/ililce.json");
        const data = await response.json();

        const formattedCities: City[] = data.map((city: any) => ({
          value: city.value,
          label: city.text,
          districts: city.districts.map((district: any) => ({
            value: district.value,
            label: district.text,
          })),
        }));

        setCities(formattedCities);

        // URL'den seçimleri yükle
        if (cityParam) {
          const foundCity = formattedCities.find(
            (c) => c.label === cityParam.toUpperCase()
          );
          if (foundCity) {
            setSelectedCity(foundCity);

            if (districtParam) {
              const foundDistrict = foundCity.districts.find(
                (d) => d.label === districtParam.toUpperCase()
              );
              if (foundDistrict) {
                setSelectedDistrict(foundDistrict);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [searchParams]);

  useEffect(() => {
    setSelectedDistrict(null);
  }, [selectedCity]);

  const handleSearch = () => {
    if (selectedCity && selectedDistrict) {
      const cityName = encodeURIComponent(selectedCity.label.toUpperCase());
      const districtName = encodeURIComponent(
        selectedDistrict.label.toUpperCase()
      );

      router.push(`/en-iyi-kafeler?city=${cityName}&district=${districtName}`);
    }
  };

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedDistrict(null);
    router.push("/en-iyi-kafeler");
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/30 p-4 rounded-lg shadow">
      <div className="min-w-[200px]">
        <Select
          options={cities}
          value={selectedCity}
          onChange={(value) => setSelectedCity(value)}
          placeholder="İl seçiniz"
          isSearchable
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderColor: "#8B5E34",
              minHeight: "40px",
              boxShadow: "none",
              "&:hover": { borderColor: "#6B4423" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              zIndex: 10,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? "rgba(139, 94, 52, 0.1)"
                : state.isSelected
                ? "rgba(139, 94, 52, 0.2)"
                : "transparent",
              color: "#6B4423",
              "&:hover": {
                backgroundColor: "rgba(139, 94, 52, 0.1)",
              },
            }),
            input: (base) => ({
              ...base,
              color: "#6B4423",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#6B4423",
            }),
          }}
        />
      </div>

      <div className="min-w-[200px]">
        <Select
          options={selectedCity?.districts || []}
          value={selectedDistrict}
          onChange={(value) => setSelectedDistrict(value)}
          placeholder="İlçe seçiniz"
          isSearchable
          isDisabled={!selectedCity}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderColor: "#8B5E34",
              minHeight: "40px",
              boxShadow: "none",
              "&:hover": { borderColor: "#6B4423" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              zIndex: 10,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? "rgba(139, 94, 52, 0.1)"
                : state.isSelected
                ? "rgba(139, 94, 52, 0.2)"
                : "transparent",
              color: "#6B4423",
              "&:hover": {
                backgroundColor: "rgba(139, 94, 52, 0.1)",
              },
            }),
            input: (base) => ({
              ...base,
              color: "#6B4423",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#6B4423",
            }),
          }}
        />
      </div>

      <Button
        onClick={handleSearch}
        disabled={!selectedCity || !selectedDistrict}
        className="bg-[#6B4423] hover:bg-[#8B5E34] transition-colors duration-300 text-white"
      >
        <Search className="w-4 h-4 mr-2" />
        Ara
      </Button>

      {(selectedCity || selectedDistrict) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
