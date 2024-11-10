"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

export default function ContactUsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    if (!data.fullName)
      return toast({ description: "İsim soyisim alanı boş bırakılamaz." });
    if (!data.mail)
      return toast({ description: "E-mail alanı boş bırakılamaz." });
    if (!data.phone)
      return toast({ description: "Telefon alanı boş bırakılamaz." });
    if (!data.subject)
      return toast({ description: "Konu alanı boş bırakılamaz." });
    if (!data.message)
      return toast({ description: "Mesaj alanı boş bırakılamaz." });
    try {
      setLoading(true);
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.mail,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }),
      });
      const resData = await res.json();
      toast({ description: resData.message });
      e.currentTarget.reset();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <div className="bg-gradient-to-br from-stone-100 via-[#cdbfac] to-stone-200 min-h-screen">
      <div className="flex flex-col p-10 w-full gap-5 mb-10" id="form">
        <img
          src="/logo.png"
          alt="logo"
          width={400}
          height={400}
          className="mx-auto"
        />
        <h2 className="w-full text-2xl tracking-widest font-medium text-center py-5">
          İletişim Formu
        </h2>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Input name="fullName" placeholder="Ad Soyad" />
          <Input name="phone" placeholder="Telefon" />
          <Input name="mail" placeholder="E-mail" />
          <Input name="subject" placeholder="Konu" />
          <Textarea name="message" placeholder="Mesaj" />
          <Button
            type="submit"
            className="slide-bg-btn bg-gradient-to-br from-stone-100 via-[#cdbfac] to-stone-200 text-black"
            disabled={loading}
          >
            {loading ? <ImSpinner2 className="animate-spin" /> : "Gönder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
