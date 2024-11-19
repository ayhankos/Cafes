"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface City {
  value: number;
  text: string;
  districts: {
    value: number;
    text: string;
  }[];
}

export function CityDistrictFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(
    searchParams.get("city")
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    searchParams.get("district")
  );

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/ililce.json");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const selectedCityData = cities.find((city) => city.text === selectedCity);

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict(null);
    updateURL(value, null);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    updateURL(selectedCity, value);
  };

  const updateURL = (city: string | null, district: string | null) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (district) params.set("district", district);
    router.push(
      `/en-iyi-kafeler${params.toString() ? "?" + params.toString() : ""}`
    );
  };

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedDistrict(null);
    router.push("/en-iyi-kafeler");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/30 p-4 rounded-lg shadow">
      <Select value={selectedCity || ""} onValueChange={handleCityChange}>
        <SelectTrigger className="w-[200px] border-stone-400">
          <SelectValue placeholder="İl seçin" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.value} value={city.text}>
              {city.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedDistrict || ""}
        onValueChange={handleDistrictChange}
        disabled={!selectedCity}
      >
        <SelectTrigger className="w-[200px] border-stone-400">
          <SelectValue placeholder="İlçe seçin" />
        </SelectTrigger>
        <SelectContent>
          {selectedCityData?.districts.map((district) => (
            <SelectItem key={district.value} value={district.text}>
              {district.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
