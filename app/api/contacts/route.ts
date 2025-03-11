export const dynamic = "force-dynamic";
import {
  CreateNewContact,
  GetAllContactUsMessages,
} from "@/utils/commands/contacts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, phone, subject, message } = await request.json();
  if (!name)
    return NextResponse.json({
      ok: false,
      message: "İsim soyisim alanı boş bırakılamaz.",
    });
  if (!email)
    return NextResponse.json({
      ok: false,
      message: "Email alanı boş bırakılamaz.",
    });
  if (!phone)
    return NextResponse.json({
      ok: false,
      message: "Telefon alanı boş bırakılamaz.",
    });
  if (!subject)
    return NextResponse.json({
      ok: false,
      message: "Konu alanı boş bırakılamaz.",
    });
  if (!message)
    return NextResponse.json({
      ok: false,
      message: "Mesaj alanı boş bırakılamaz.",
    });
  try {
    const data = await CreateNewContact(name, email, phone, subject, message);
    return NextResponse.json({
      ok: true,
      message: "Mesajınız başarıyla gönderildi.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Bir hata oluştu." });
  }
}

export async function GET(request: NextRequest) {
  // fetch(`/api/contacts?page=${page + 1}`);
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  const data = await GetAllContactUsMessages(page);
  return NextResponse.json({ ok: true, data });
}
