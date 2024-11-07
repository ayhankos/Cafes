"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

type Cafe = {
  id: string;
  name: string;
  city: string;
  district: string;
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CafeList() {
  const { data, error, isLoading, mutate } = useSWR<{ data: Cafe[] }>(
    "/api/cafes/allCafes",
    fetcher
  );

  if (error) {
    return <div>Failed to load cafes</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const cafes = data?.data || [];

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cafes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cafe");
      }

      // Yeniden veri çek
      mutate();
    } catch (error) {
      console.error("Error deleting cafe:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>District</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cafes.map((cafe) => (
          <TableRow key={cafe.id}>
            <TableCell>{cafe.name}</TableCell>
            <TableCell>{cafe.city}</TableCell>
            <TableCell>{cafe.district}</TableCell>
            <TableCell>
              {new Date(cafe.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Link href={`/admin/cafes/${cafe.id}/edit`}>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(cafe.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
