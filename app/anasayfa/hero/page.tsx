"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Types for our city data
type District = {
  value: number;
  text: string;
};

type City = {
  value: number;
  text: string;
  districts: District[];
};

const HeroSection = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/ililce.json");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error loading cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    setSelectedDistrict("");
  }, [selectedCity]);

  const currentCity = cities.find(
    (city) => city.value.toString() === selectedCity
  );

  const handleSearch = () => {
    if (selectedCity && selectedDistrict) {
      console.log(
        `Searching for cafes in ${currentCity?.text}, ${selectedDistrict}`
      );
      // Burada search fonksiyonunuzu çağırabilirsiniz
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[400px] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-[250px] mx-auto mb-4" />
            <Skeleton className="h-4 w-[300px] mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Cafe Keşfet</CardTitle>
          <CardDescription className="text-center">
            Şehir ve ilçe seçerek yakınınızdaki cafeleri keşfedin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="İl seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value.toString()}>
                      {city.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
                disabled={!selectedCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="İlçe seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {currentCity?.districts.map((district) => (
                    <SelectItem key={district.value} value={district.text}>
                      {district.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!selectedCity || !selectedDistrict}
              className="w-full md:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Ara
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSection;
