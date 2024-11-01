"use client";

import React, { useState } from "react";
import {
  Home,
  Car,
  MessageCircle,
  BarChart,
  User,
  Search,
  LogIn,
  Mail,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const Navbar = ({ user }: { user: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Giriş başarısız",
          description: "Email veya şifre hatalı. Lütfen tekrar deneyin.",
        });
      } else {
        toast({
          title: "Giriş başarılı",
          description: "Hoş geldiniz!",
        });
        setIsDialogOpen(false);
        // Başarılı girişten sonra sayfayı yenile veya state'i güncelle
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Google ile giriş başarısız",
          description: "Lütfen tekrar deneyin.",
        });
      } else {
        toast({
          title: "Giriş başarılı",
          description: "Google hesabınızla başarıyla giriş yaptınız!",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Google ile giriş yapılırken bir hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/api/placeholder/100/40"
            alt="Car Website Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className="flex items-center hover:text-blue-600 transition"
          >
            <Home className="mr-2" size={20} />
            Ana Sayfa
          </a>
          <a
            href="/cars"
            className="flex items-center hover:text-blue-600 transition"
          >
            <Car className="mr-2" size={20} />
            Arabalar
          </a>
          <a
            href="/discussions"
            className="flex items-center hover:text-blue-600 transition"
          >
            <MessageCircle className="mr-2" size={20} />
            Tartışmalar
          </a>
          <a
            href="/comparisons"
            className="flex items-center hover:text-blue-600 transition"
          >
            <BarChart className="mr-2" size={20} />
            Karşılaştırmalar
          </a>
        </div>

        {/* Search and User Section */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Araba ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          {/* User Section - Conditional Rendering */}
          {user ? (
            <div className="flex items-center space-x-2">
              <User className="text-blue-600" size={24} />
              <span className="font-semibold">{user.name}</span>
            </div>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
                  <LogIn className="mr-2" size={20} />
                  Giriş Yap
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-semibold">
                    Giriş Yap
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                  {/* Google Login Button */}
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <img
                      src="/api/placeholder/20/20"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Google ile Giriş Yap</span>
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Separator className="flex-1" />
                    <span className="text-sm text-gray-500">veya</span>
                    <Separator className="flex-1" />
                  </div>

                  {/* Email/Password Login Form */}
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="ornek@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Şifre</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </Button>
                  </form>

                  <div className="text-center text-sm">
                    <a
                      href="/forgot-password"
                      className="text-blue-500 hover:underline"
                    >
                      Şifremi Unuttum
                    </a>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
