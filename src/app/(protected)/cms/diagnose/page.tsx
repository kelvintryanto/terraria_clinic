"use client";

import { Diagnose } from "@/app/models/diagnose";
import AddDiagnose from "@/components/cms/diagnose/AddDiagnose";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TableSkeleton } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { set } from "lodash";
import { Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function DiagnosePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [filteredDiagnoses, setFilteredDiagnoses] = useState<Diagnose[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { toast } = useToast();

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch("/api/diagnoses");
      const data = await response.json();
      setDiagnoses(data);
      setFilteredDiagnoses(
        data.filter((diagnose: Diagnose) =>
          diagnose.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengambil data diagnosa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <TableSkeleton />;

  return (
    <>
      <div className="w-full p-5">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Stethoscope /> Diagnosa
          </h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-fit">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <AddDiagnose />
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nomor Diagnosa</TableHead>
                <TableHead>Tanggal Diagnosa</TableHead>
                <TableHead>Nama Dokter</TableHead>
                <TableHead>Nama Client</TableHead>
                <TableHead>Nama Pet</TableHead>
                <TableHead>Hasil Pemeriksaan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
