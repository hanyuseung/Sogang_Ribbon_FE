"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import AdminPlaceForm from "@/components/AdminPlaceForm";

export default function NewPlacePage() {
  return (
    <AdminGuard>
      <div className="min-h-full bg-[#fff8fb]">
        <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
          <Link href="/admin/places" className="text-[#7a5965] p-1 -ml-1">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-bold text-[#2b1b22]">식당 추가</span>
        </header>

        <main className="max-w-screen-sm mx-auto px-5 py-6 pb-16">
          <AdminPlaceForm />
        </main>
      </div>
    </AdminGuard>
  );
}
