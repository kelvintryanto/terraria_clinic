"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="w-full md:p-5 md:pb-0 p-3 flex flex-col md:flex-row gap-3">
        {/* Biodata Client dan Pet */}
        <div className="w-full md:w-2/5">
          <h1 className="text-2xl font-bold mb-4">Halaman Billing</h1>
          <div className="w-full mt-5 flex flex-col md:flex-row gap-2 p-3 border shadow-md rounded-md">
            {/* Client */}
            <div className="space-y-2 w-full md:w-1/2">
              <h1 className="text-xl font-bold">Info Client</h1>
              <Input type="text" placeholder="Nama Client" />
              <Input type="text" placeholder="No. HP" />
              <Input type="text" placeholder="Email" disabled />
              <Input type="text" placeholder="Alamat" disabled />
            </div>

            {/* Pet */}
            <div className="space-y-2 flex-1">
              <h1 className="text-xl font-bold">Info Pet</h1>
              <Input type="text" placeholder="Nama Pet" />
              <Input type="text" placeholder="Umur" />
              <Input type="text" placeholder="Berat" />
              <Input type="text" placeholder="Breed" disabled />
              <Input type="text" placeholder="Color" disabled />
            </div>
          </div>
        </div>

        {/* Cari Produk */}
        <div className="w-full md:flex-1 border rounded-md p-3 shadow-md space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Cari Produk</h1>

            <div className="relative w-64">
              <Input type="text" placeholder="Cari produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {/* search input */}

          {/* table result */}
          <div className="overflow-y-auto h-60">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center">Kode</TableHead>
                  <TableHead className="text-center">Kategori</TableHead>
                  <TableHead className="text-center">Deskripsi</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input type="number" className="w-[20px] border text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input className="w-[20px] border" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input className="w-[20px] border" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input className="w-[20px] border" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input className="w-[20px] border" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input className="w-[20px] border" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">V001</TableCell>
                  <TableCell className="text-center">Vaksinasi</TableCell>
                  <TableCell className="text-center">Vaksin Rabies</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-1 align-middle justify-center h-full">
                      <button>-</button>
                      <input className="w-[20px] border" />
                      <button>+</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button>Add</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="w-full p-3 md:p-5 flex flex-col md:flex-row gap-3">
        <div className="shadow-md border rounded-md flex-1 p-3">
          <div className="flex items-baseline gap-3 justify-between">
            <h1 className="text-xl font-bold">Invoice</h1>
            <Button className="">Save Invoice</Button>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center">Deskripsi</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-center">Harga</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell>Produk 1</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">Rp. 100.000</TableCell>
                  <TableCell className="text-center">Rp. 100.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell>Produk 2</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">Rp. 200.000</TableCell>
                  <TableCell className="text-center">Rp. 400.000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Subtotal, Discount, Tax, dan Total */}
          <div className="flex justify-end mt-5">
            <div className="w-full md:w-1/3 border-t pt-3">
              <div className="flex justify-between text-base">
                <span>Subtotal:</span>
                <span>Rp. 500.000</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Discount (10%):</span>
                <span>- Rp. 50.000</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Tax (11%):</span>
                <span>Rp. 49.500</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-2 border-t pt-2">
                <span>Total:</span>
                <span>Rp. 499.500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
