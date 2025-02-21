"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="w-full p-3 sm:p-5">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Halaman Kategori</h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Input type="text" placeholder="Cari kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/cms/customer/add">Tambah Kategori</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
