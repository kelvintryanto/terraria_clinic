import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { products } from "./data";

const ProductsPage = () => {
  return (
    <>
      <div className="w-full p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Products Page</h1>
          <div className="flex justify-between items-center">
            <div className="relative">
              <input type="text" placeholder="Search product..." className="pl-10 p-2 border rounded-md" />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link href={"/cms/products/add"} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Add Products
            </Link>
          </div>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead className="text-center">Kode</TableHead>
                <TableHead className="text-center">Layanan</TableHead>
                <TableHead className="text-center">Deskripsi</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-center">Harga</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{product.kode}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.jumlah}</TableCell>
                  <TableCell>{product.harga}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
