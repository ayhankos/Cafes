"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function MessagesAdmin({
  data,
  count,
}: {
  data: any;
  count: number;
}) {
  const [dataState, setDataState] = useState(data);
  const [page, setPage] = useState(1);
  const handleGetMore = async () => {
    const res = await fetch(`/api/contacts?page=${page + 1}`);
    const resData = await res.json();
    console.log(resData);
    setDataState([...dataState, ...resData.data]);
    setPage(page + 1);
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        {dataState.map((message: any) => (
          <div
            key={message.id}
            className="grid grid-cols-2 md:grid-cols-4 gap-1 p-3 rounded-lg shadow border"
          >
            <div className="flex gap-2 items-center text-sm">
              <p className="font-semibold">İsim Soyisim:</p>
              <p>{message.name}</p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <p className="font-semibold">E-mail:</p>
              <p>{message.email}</p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <p className="font-semibold">Telefon:</p>
              <p>{message.phone}</p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <p className="font-semibold">Konu:</p>
              <p>{message.subject}</p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <p className="font-semibold">Mesaj:</p>
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleGetMore} disabled={dataState.length >= count}>
        Daha Fazla Yükle
      </Button>
    </>
  );
}
