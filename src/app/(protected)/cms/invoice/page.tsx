import Link from "next/link";

export default function InvoicePage() {
  return (
    <>
      <div className="w-full p-5">
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold mb-4">Halaman Invoice</h1>
            <Link href={"/cms/invoice/add"} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Tambah Invoice
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
