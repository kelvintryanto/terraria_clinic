"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers } from "./data";
import Link from "next/link";

const CustomerPage = () => {
  const calculateJoinDuration = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    if (years > 0) {
      return `${years} tahun ${months} bulan`;
    }
    return `${months} bulan`;
  };

  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Customer Page</h1>
        <div className="flex justify-between items-center">
          <div className="relative">
            <input type="text" placeholder="Search customer..." className="pl-10 p-2 border rounded-md" />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Link href={"/cms/customer/add"} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Add Customer
          </Link>
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead className="text-center">Nama Pelanggan</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Nomor Telepon</TableHead>
              <TableHead className="text-center">Alamat</TableHead>
              <TableHead className="text-center">Lama Bergabung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.id} className="hover:cursor-pointer" onClick={() => (window.location.href = "/cms/customer/" + customer.id)}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell className="text-center">{calculateJoinDuration(customer.joinDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerPage;
