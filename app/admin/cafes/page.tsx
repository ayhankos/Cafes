import { CafeList } from "@/components/admin/cafe-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CafesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cafes</h1>
        <Link href="/admin/cafes/new">
          <Button>Add New Cafe</Button>
        </Link>
      </div>
      <CafeList />
    </div>
  );
}
