import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function RecentCafes({ recentCafes }: { recentCafes: any }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Cafes</CardTitle>
        <CardDescription>
          {recentCafes.length} recently added cafes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {recentCafes.map((cafe: any) => (
            <Link key={cafe.id} href={`/cafes/${cafe.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center p-4">
                  {cafe.images.length > 0 && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                      <Image
                        src={cafe.images[0].url}
                        alt={cafe.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{cafe.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {cafe.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
