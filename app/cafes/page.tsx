import { Suspense } from "react";
import CafesContent from "./components/CafesContent";
import { Coffee } from "lucide-react";

export default function CafesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <Coffee className="w-16 h-16 text-[#6B4423] mb-4 mx-auto" />
            <p className="text-lg text-[#6B4423]">Kafeler yükleniyor...</p>
          </div>
        </div>
      }
    >
      <CafesContent />
    </Suspense>
  );
}
