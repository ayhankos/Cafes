import { GetAllContactUsMessages, GetContactUsMessagesCount } from "@/utils/commands/contacts";
import React from "react";
import MessagesAdmin from "./components/table";

export default async function ContactMessages() {
  const data = await GetAllContactUsMessages();
  const count = await GetContactUsMessagesCount();
  return (
    <>
      <div className="w-full h-full flex flex-col gap-3 container">
        <h2 className="w-full text-2xl font-medium">{`Bize Ulaşın'dan Gelen Mesajlar`}</h2>
        <p className="w-full border-b pb-2 text-sm">
            Bize ulaşın sayfasından gelen {count} mesaj bulunmaktadır.
        </p>
        <MessagesAdmin data={data} count={count} />
      </div>
    </>
  );
}
