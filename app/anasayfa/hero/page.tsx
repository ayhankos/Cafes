"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    const handleMouseMove = (e: MouseEvent) => {
      // Daha yumuşak hareket için değerleri küçülttük
      const x = (window.innerWidth / 2 - e.clientX) / 30;
      const y = (window.innerHeight / 2 - e.clientY) / 30;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#A67B5B] via-[#DABE99] to-[#F3E5D8] flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-md">
          <CardHeader>
            <Skeleton className="h-12 w-[300px] mx-auto mb-4" />
            <Skeleton className="h-6 w-[400px] mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-[120px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#A67B5B] via-[#DABE99] to-[#F3E5D8] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Kahve bardağı parallax efekti - Büyütülmüş ve ortada */}
      <div
        className="absolute w-full h-full pointer-events-none flex items-center justify-center"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
          transition: "transform 0.2s ease-out", // Geçişi biraz yavaşlattık
        }}
      >
        <img
          src="/3dcoffee.png"
          alt="Coffee Cup Background"
          className="w-[800px] h-[800px] object-contain opacity-25" // Boyutu ve opaklığı artırdık
          style={{
            transform: `translate(${mousePosition.x * 2}px, ${
              mousePosition.y * 2
            }px)`,
            transition: "transform 0.2s ease-out", // Hareket geçişini yumuşattık
          }}
        />
      </div>

      {/* Mevcut arkaplan */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/1920/1080')] opacity-10 bg-cover bg-center" />

      <Card className="w-full max-w-3xl bg-white/40 backdrop-blur-md shadow-xl relative z-10">
        <CardHeader className="space-y-6">
          <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-[#4A3728] to-[#8B5E34] bg-clip-text text-transparent">
            Kahve Keşfinin Tadını Çıkarın
          </CardTitle>
          <p className="text-xl text-center text-[#6B4423]">
            Size en yakın ve en iyi kahve mekanlarını keşfedin
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-[#6B4423]">
                Şehir Seçin
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 bg-white/50 border-[#8B5E34] focus:ring-[#8B5E34]">
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

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-[#6B4423]">
                İlçe Seçin
              </label>
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
                disabled={!selectedCity}
              >
                <SelectTrigger className="h-12 bg-white/50 border-[#8B5E34] focus:ring-[#8B5E34]">
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
              className="h-12 px-8 bg-[#6B4423] hover:bg-[#8B5E34] transition-colors duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Keşfet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSection;
