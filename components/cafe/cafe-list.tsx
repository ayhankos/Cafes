"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, MapPin, Coffee, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Cafe {
  id: string;
  name: string;
  city: string;
  district: string;
  images: { url: string }[];
  ratings: { rating: number }[];
}

const TROPHY_COLORS = {
  0: "text-yellow-500",
  1: "text-gray-500",
  2: "text-amber-600",
};

export function CafeList() {
  const searchParams = useSearchParams();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  const city = searchParams.get("city");
  const district = searchParams.get("district");

  useEffect(() => {
    const fetchCafes = async () => {
      setLoading(true);
      try {
        const url =
          "/api/cafes/ranking" +
          (city && district
            ? `?city=${encodeURIComponent(city)}&district=${encodeURIComponent(
                district
              )}`
            : "");
        const response = await fetch(url);
        const data = await response.json();
        setCafes(data.data);
      } catch (error) {
        console.error("Error fetching cafes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, [city, district]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sortedCafes = [...cafes].sort((a, b) => {
    const aRating =
      a.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
      (a.ratings.length || 1);
    const bRating =
      b.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
      (b.ratings.length || 1);
    return bRating - aRating;
  });

  return (
    <div className="space-y-8">
      {/* Top 3 Cafes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20">
        {sortedCafes.slice(0, 3).map((cafe, index) => {
          const averageRating =
            cafe.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            (cafe.ratings.length || 1);

          return (
            <Link
              href={`/cafes/${cafe.id}`}
              key={cafe.id}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <div
                className={cn(
                  "relative bg-white rounded-xl shadow-xl overflow-hidden",
                  "border-1",
                  index === 0
                    ? "border-yellow-400 ring-2 ring-yellow-200"
                    : index === 1
                    ? "border-gray-300 ring-2 ring-gray-100"
                    : "border-amber-600 ring-2 ring-amber-100"
                )}
              >
                {/* Trophy Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <Trophy
                    className={cn(
                      "w-5 h-5",
                      TROPHY_COLORS[index as keyof typeof TROPHY_COLORS]
                    )}
                  />
                  <span className="font-bold">{index + 1}. Sıra</span>
                </div>

                {/* Image Section */}
                <div className="relative h-64">
                  {cafe.images[0] ? (
                    <Image
                      src={cafe.images[0].url}
                      alt={cafe.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Coffee className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 line-clamp-1">
                    {cafe.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">
                      {cafe.district}, {cafe.city}
                    </span>
                  </div>

                  {/* Rating Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-5 h-5",
                              i < Math.round(averageRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {cafe.ratings.length} değerlendirme
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Remaining Cafes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCafes.slice(3).map((cafe) => {
          const averageRating =
            cafe.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            (cafe.ratings.length || 1);

          return (
            <Link
              href={`/kafeler/${cafe.id}`}
              key={cafe.id}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  {cafe.images[0] ? (
                    <Image
                      src={cafe.images[0].url}
                      alt={cafe.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Coffee className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                    {cafe.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">
                      {cafe.district}, {cafe.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {cafe.ratings.length} değerlendirme
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
