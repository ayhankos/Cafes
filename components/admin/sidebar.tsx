"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Coffee, Contact, LayoutDashboard, Users } from "lucide-react";
import { useState } from "react";

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
  {
    label: "Contacts",
    icon: Contact,
    href: "/admin/contacts",
    pattern: /^\/admin\/contacts/,
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative z-50 md:flex md:flex-col md:h-screen md:w-1/5 bg-stone-300">
      <button
        className="fixed top-4 right-4 z-50 md:hidden p-2 bg-gray-700 text-white rounded-full"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out md:flex md:flex-col h-full w-64 md:w-full bg-stone-300 p-4 space-y-4",
          {
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="px-3 py-2">
          <Link href="/admin" className="flex items-center pl-3 mb-8">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={handleLinkClick}
              >
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
        {isOpen && (
          <button
            className="absolute top-4 right-4 md:hidden"
            onClick={toggleSidebar}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
