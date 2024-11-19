"use client";
import Link from "next/link";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function SSS() {
  const questions = [
    {
      question: "Kafemi nasıl ekleyebilirim?",
      answer:
        "Kafenizi eklememiz için bizimle iletişime geçmeniz gerekmektedir..",
    },
  ];

  return (
    <div className="w-full py-8 flex flex-col items-center">
      <h1 className="text-4xl text-[#6B4423] mb-5 font-bold">
        Sıkça Sorulan Sorular
      </h1>

      <Accordion
        type="single"
        collapsible
        className="w-full mt-5 max-w-4xl px-5"
      >
        {questions.map((question, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="relative mb-4 rounded-3xl border px-6 py-6 text-left shadow bg-white/10 backdrop-blur-lg"
          >
            <AccordionTrigger className="text-[#6B4423] text-lg font-semibold hover:text-[#9d7d54] transition-colors">
              {question.question}
            </AccordionTrigger>
            <AccordionContent className="mt-4 text-[#4b3d30] text-sm">
              {question.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 z-30">
        <Badge variant="outline" className="bg-[#eae0d5] text-[#6B4423]">
          Daha fazla soru için bizimle&nbsp;
          <Link
            href="/contact"
            className="underline cursor-pointer"
            target="__blank"
          >
            bu sayfa üzerinden
          </Link>
          &nbsp; iletişime geçebilirsiniz.
        </Badge>
      </div>
    </div>
  );
}
