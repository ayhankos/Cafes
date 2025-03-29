import { Suspense } from "react";
import { CafeList } from "@/components/cafe/cafe-list";
import { CityDistrictFilter } from "@/components/cafe/city-district-filter";
import { Metadata } from "next";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "En İyi Kafeler | CafeHub",
  description: "Türkiye'nin en iyi kafelerini keşfedin",
};

export default function BestCafesPage() {
  return (
    <div className="bg-gradient-to-br from-stone-100 via-[#cdbfac] to-stone-200 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-row items-center">
          <Link href="/" className="flex flex-row items-center">
            <ArrowBigLeft
              className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
              color="#6B4423"
            />
            <p className="text-[#6B4423] font-bold ml-2 leading-none">
              Ana Sayfa
            </p>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8">En İyi Kafeler</h1>

        <div className="mb-8">
          <Suspense fallback={<div>Filtreler yükleniyor...</div>}>
            <CityDistrictFilter />
          </Suspense>
        </div>

        <Suspense fallback={<div>Kafeler yükleniyor...</div>}>
          <CafeList />
        </Suspense>
      </div>
    </div>
  );
}
