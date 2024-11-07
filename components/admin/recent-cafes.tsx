import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentCafes() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Cafes</CardTitle>
        <CardDescription>Recently added cafes to the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">{/* Add recent cafes list here */}</div>
      </CardContent>
    </Card>
  );
}
