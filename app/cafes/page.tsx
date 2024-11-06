"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Coffee } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Image = {
  id: string;
  url: string;
};

type Rating = {
  id: string;
  rating: number;
  cafeId: string;
};

type Cafe = {
  id: string;
  name: string;
  city: string;
  district: string;
  images: Image[];
  ratings: Rating[];
};

type ApiResponse = {
  data: Cafe[];
  error?: string;
};

export default function CafesPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const district = searchParams.get("district");
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch(
          `/api/cafes?city=${encodeURIComponent(
            city || ""
          )}&district=${encodeURIComponent(district || "")}`
        );
        const result: ApiResponse = await response.json();

        if (result.error) {
          setError(result.error);
          setCafes([]);
        } else {
          setCafes(result.data);
        }
      } catch (error) {
        console.error("Error fetching cafes:", error);
        setError("Kafeler yüklenirken bir hata oluştu");
        setCafes([]);
      } finally {
        setLoading(false);
      }
    };

    if (city && district) {
      fetchCafes();
    }
  }, [city, district]);

  const calculateAverageRating = (ratings: Rating[]) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Coffee className="w-16 h-16 text-[#6B4423] mb-4" />
        <h2 className="text-2xl font-semibold text-[#6B4423] mb-2 text-center">
          Bir Hata Oluştu
        </h2>
        <p className="text-lg text-[#8B5E34] text-center">{error}</p>
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Coffee className="w-16 h-16 text-[#6B4423] mb-4" />
        <h2 className="text-2xl font-semibold text-[#6B4423] mb-2 text-center">
          Henüz Kafe Bulunmuyor
        </h2>
        <p className="text-lg text-[#8B5E34] text-center">
          {decodeURIComponent(city || "")} -{" "}
          {decodeURIComponent(district || "")} bölgesinde henüz kayıtlı kafe
          bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#6B4423] mb-2">
          {decodeURIComponent(city || "")} -{" "}
          {decodeURIComponent(district || "")} Kafeleri
        </h1>
        <p className="text-[#8B5E34]">
          <MapPin className="inline-block mr-1" size={16} />
          {cafes.length} kafe bulundu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <Card
            key={cafe.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => (window.location.href = `/cafes/${cafe.id}`)}
          >
            <div className="relative h-64">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-full"
              >
                {cafe.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <img
                      src={image.url}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-[#6B4423] mb-2">
                {cafe.name}
              </h2>
              <div className="flex items-center text-[#8B5E34]">
                <Star className="w-5 h-5 fill-current text-yellow-500 mr-1" />
                <span className="font-medium">
                  {calculateAverageRating(cafe.ratings)}
                </span>
                <span className="text-sm ml-1">
                  ({cafe.ratings.length} değerlendirme)
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
