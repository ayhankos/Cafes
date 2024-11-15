"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
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
  Star,
  LogOut,
  Coffee,
  UserPlus,
  X,
  Menu,
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
import { signIn, signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const Navbar = ({ user }: { user: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Giriş başarısız",
          description: "Email veya şifre hatalı. Lütfen tekrar deneyin.",
        });
      } else {
        toast({ title: "Giriş başarılı", description: "Hoş geldiniz!" });
        setIsLoginDialogOpen(false);
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
        setIsLoginDialogOpen(false);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Burada backend API'nize kayıt isteği gönderilecek
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Kayıt başarılı",
          description: "Hesabınız başarıyla oluşturuldu!",
        });
        setIsRegisterDialogOpen(false);
        // Opsiyonel: Otomatik giriş yapılabilir
        await signIn("credentials", {
          email: registerEmail,
          password: registerPassword,
          redirect: false,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Kayıt başarısız",
          description: data.error || "Bir hata oluştu.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kayıt sırasında bir hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Google ile kayıt başarısız",
          description: "Lütfen tekrar deneyin.",
        });
      } else {
        toast({
          title: "Kayıt başarılı",
          description: "Google hesabınızla başarıyla kayıt oldunuz!",
        });
        setIsRegisterDialogOpen(false);
      }
    } catch (error) {
      console.error("Google registration error:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Google ile kayıt olurken bir hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/20 backdrop-blur-md shadow-md"
          : "bg-transparent shadow-none"
      }`}
    >
      <div className="max-w-8xl mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Cafe Website Logo"
              className="h-20 w-auto"
            />
          </div>

          <div className="hidden md:flex items-center space-x-5">
            {/* Desktop menu items */}
            <a
              href="/"
              className="flex items-center text-[#6B4423] hover:text-[#8B5E34] transition-colors duration-300"
            >
              <Home className="mr-2" size={20} />
              Ana Sayfa
            </a>
            <a
              href="/en-iyi-kafeler"
              className="flex items-center text-[#6B4423] hover:text-[#8B5E34] transition-colors duration-300"
            >
              <Coffee className="mr-2" size={20} />
              En İyi Kafeler
            </a>
            <a
              href="/tartismalar"
              className="flex items-center text-[#6B4423] hover:text-[#8B5E34] transition-colors duration-300"
            >
              <MessageCircle className="mr-2" size={20} />
              En Çok Tartışılanlar
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {/*             <div className="relative">
              <input
                type="text"
                placeholder="Kafe ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-[#8B5E34] rounded-full px-4 py-2 w-64 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E34] placeholder-[#6B4423]/50"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B4423]"
                size={20}
              />
            </div> */}

            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar>
                      <AvatarImage
                        src={user.image || "/path/to/default/avatar.png"}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-[#8B5E34] text-white">
                        {user.name ? user.name[0] : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-[#6B4423]">
                      {user.name}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-white/80 backdrop-blur-md border-[#8B5E34]">
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      className="justify-start text-[#6B4423] hover:text-[#8B5E34] hover:bg-[#8B5E34]/10"
                      onClick={() => console.log("Favorilerim tıklandı")}
                    >
                      <Star className="mr-2" size={20} />
                      Favorilerim
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-[#6B4423] hover:text-[#8B5E34] hover:bg-[#8B5E34]/10"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2" size={20} />
                      Çıkış Yap
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Dialog
                  open={isLoginDialogOpen}
                  onOpenChange={setIsLoginDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#6B4423] hover:bg-[#8B5E34] text-white px-6 py-2 rounded-full transition-colors duration-300">
                      <LogIn className="mr-2" size={20} />
                      Giriş Yap
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl font-semibold text-[#6B4423]">
                        Giriş Yap
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4 py-4">
                      <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <img
                          src="/google.png"
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
                          Giriş Yap
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isRegisterDialogOpen}
                  onOpenChange={setIsRegisterDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#6B4423] text-[#6B4423] hover:bg-[#6B4423] hover:text-white px-6 py-2 rounded-full transition-colors duration-300"
                    >
                      <UserPlus className="mr-2" size={20} />
                      Kayıt Ol
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl font-semibold text-[#6B4423]">
                        Kayıt Ol
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4 py-4">
                      <Button
                        variant="outline"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <img
                          src="/google.png"
                          alt="Google"
                          className="w-5 h-5"
                        />
                        <span>Google ile Kayıt Ol</span>
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Separator className="flex-1" />
                        <span className="text-sm text-gray-500">veya</span>
                        <Separator className="flex-1" />
                      </div>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-name">Ad Soyad</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              id="register-name"
                              type="text"
                              placeholder="Ad Soyad"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="ornek@email.com"
                              value={registerEmail}
                              onChange={(e) => setRegisterEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Şifre</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              id="register-password"
                              type="password"
                              value={registerPassword}
                              onChange={(e) =>
                                setRegisterPassword(e.target.value)
                              }
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
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
                          Kayıt Ol
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#6B4423]" />
              ) : (
                <Menu className="h-6 w-6 text-[#6B4423]" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-md shadow-md p-6 space-y-4">
          <a
            href="/"
            className="flex items-center text-[#6B4423] hover:text-[#8B5E34] transition-colors duration-300"
          >
            <Home className="mr-2" size={20} />
            Ana Sayfa
          </a>
          <a
            href="/en-iyi-kafeler"
            className="flex items-center text-[#6B4423] hover:text-[#8B5E34] transition-colors duration-300"
          >
            <Coffee className="mr-2" size={20} />
            En İyi Kafeler
          </a>
          <a
            href="/tartismalar"
            className="flex items-center text-[#6B4423] hover:text-[#8B5E34] transition-colors duration-300"
          >
            <MessageCircle className="mr-2" size={20} />
            En Çok Tartışılanlar
          </a>
          {user ? (
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start text-[#6B4423] hover:text-[#8B5E34] hover:bg-[#8B5E34]/10"
                onClick={() => console.log("Favorilerim tıklandı")}
              >
                <Star className="mr-2" size={20} />
                Favorilerim
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-[#6B4423] hover:text-[#8B5E34] hover:bg-[#8B5E34]/10"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2" size={20} />
                Çıkış Yap
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button
                className="bg-[#6B4423] hover:bg-[#8B5E34] text-white px-6 py-2 rounded-full transition-colors duration-300"
                onClick={() => setIsLoginDialogOpen(true)}
              >
                <LogIn className="mr-2" size={20} />
                Giriş Yap
              </Button>
              <Button
                variant="outline"
                className="border-[#6B4423] text-[#6B4423] hover:bg-[#6B4423] hover:text-white px-6 py-2 rounded-full transition-colors duration-300"
                onClick={() => setIsRegisterDialogOpen(true)}
              >
                <UserPlus className="mr-2" size={20} />
                Kayıt Ol
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
