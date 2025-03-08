"use client";

import { InvoiceCard } from "@/components/cards/InvoiceCard";
import { createPDFTemplate } from "@/components/pdfgenerator";
import { InvoiceTable } from "@/components/tables/InvoiceTable";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton-table";
import { InvoiceData } from "@/data/types";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<(InvoiceData & { _id?: string })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      setInvoices(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleView = (id: string) => {
    router.push(`/cms/invoice/${id}`);
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invoice data");
      }

      const invoiceData = await response.json();
      const pdf = await createPDFTemplate(invoiceData);
      pdf.save(`${invoiceData.invoiceNo}.pdf`);

      toast({
        title: "Success",
        description: "PDF berhasil diunduh",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Gagal mengunduh PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Halaman Invoice</h1>
          <Button asChild>
            <Link href="/cms/invoice/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Buat Invoice
            </Link>
          </Button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <svg
            className="h-12 w-12 text-muted-foreground mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="font-semibold text-lg mb-1">Belum ada invoice</h3>
          <p className="text-muted-foreground mb-4">
            Mulai dengan membuat invoice baru
          </p>
          <Button asChild>
            <Link href="/cms/invoice/add">Buat Invoice</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <div className="w-full rounded-md border">
              <InvoiceTable
                invoices={invoices}
                onView={handleView}
                onDownload={handleDownload}
              />
            </div>
          </div>

          {/* Mobile View - Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {invoices.map((invoice, index) => (
              <InvoiceCard
                key={invoice._id}
                invoice={invoice}
                index={index}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
