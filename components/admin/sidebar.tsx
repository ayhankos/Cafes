"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Coffee, LayoutDashboard, Users } from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    pattern: /^\/admin$/,
  },
  {
    label: "Cafes",
    icon: Coffee,
    href: "/admin/cafes",
    pattern: /^\/admin\/cafes/,
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    pattern: /^\/admin\/users/,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={route.pattern.test(pathname) ? "secondary" : "ghost"}
                className={cn("w-full justify-start", {
                  "bg-white/10": route.pattern.test(pathname),
                })}
              >
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
