import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LoginDialog({
  onLoginSuccess,
}: {
  onLoginSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Giriş başarılı",
          description: "Hoş geldiniz!",
        });
        onLoginSuccess?.();
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
        onLoginSuccess?.();
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
          <img src="/google.png" alt="Google" className="w-5 h-5" />
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
  );
}
