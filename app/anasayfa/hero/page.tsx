"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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

const HeroSection = () => {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSelectedDistrict(null);
  }, [selectedCity]);

  useEffect(() => {
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
      const x = (window.innerWidth / 2 - e.clientX) / 30;
      const y = (window.innerHeight / 2 - e.clientY) / 30;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSearch = () => {
    if (selectedCity && selectedDistrict) {
      const cityName = encodeURIComponent(selectedCity.label.toUpperCase());
      const districtName = encodeURIComponent(
        selectedDistrict.label.toUpperCase()
      );

      router.push(`/cafes?city=${cityName}&district=${districtName}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-gradient-to-br from-[#A67B5B] via-[#DABE99] to-[#F3E5D8]">
      <div
        className="absolute w-full h-full pointer-events-none flex items-center justify-center"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <img
          src="/3dcoffee.png"
          alt="Coffee Cup Background"
          className="w-[800px] h-[800px] object-contain opacity-25"
          style={{
            transform: `translate(${mousePosition.x * 2}px, ${
              mousePosition.y * 2
            }px)`,
            transition: "transform 0.2s ease-out",
          }}
        />
      </div>

      <Card className="w-full max-w-3xl bg-white/10 backdrop-blur-md shadow-xl relative z-10 p-6 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[#4A3728] to-[#8B5E34] bg-clip-text text-transparent">
            Kafe Keşfinin Tadını Çıkarın
          </CardTitle>
          <p className="text-xl text-[#6B4423]">
            Size en yakın kahve mekanlarını keşfedin
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#6B4423]">
                Şehir Seçin
              </label>
              <Select
                options={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="İl seçiniz"
                isSearchable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    borderColor: "#8B5E34",
                    minHeight: "48px",
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

            <div className="flex-1">
              <label className="text-sm font-medium text-[#6B4423]">
                İlçe Seçin
              </label>
              <Select
                options={selectedCity?.districts || []}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
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
                    minHeight: "48px",
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
              className="h-12 px-8 bg-[#6B4423] hover:bg-[#8B5E34] transition-colors duration-300 rounded-lg text-white"
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
